import asyncio
from contextlib import ExitStack
from unittest.mock import patch

from conftest import DummyConsumer, DummyProducer, Msg, module_aliases_for


def test_initial_payload_to_parser_to_classifier(monkeypatch):
    async def _run():
        # Step 1: initial payload
        payload = {
            "existe": True,
            "numero_do_processo": "0001",
            "tribunal": "TJX",
            "classe": "Ação",
            "area": "Cível",
            "assunto": "Racismo",
            "data_de_distribuicao": "2024-01-01",
        }

        # Step 2: parser consumes raw and produces structured
        parser_out = []
        raw_msgs = [Msg(payload)]
        with ExitStack() as stack:
            stack.enter_context(module_aliases_for("parser"))
            stack.enter_context(patch("parser.kafka.runner.create_consumer", return_value=DummyConsumer(raw_msgs)))
            stack.enter_context(patch("parser.kafka.runner.create_producer", return_value=DummyProducer(parser_out)))
            stack.enter_context(patch("parser.kafka.runner.RAW_TOPIC", "lawsuit_raw_test"))
            stack.enter_context(patch("parser.kafka.runner.STRUCTURED_TOPIC", "lawsuit_structured_test"))
            from parser.kafka.runner import run as parser_run
            try:
                await asyncio.wait_for(parser_run(), timeout=1)
            except asyncio.TimeoutError:
                pass

        assert len(parser_out) == 1
        structured_topic, structured_payload = parser_out[0]
        assert structured_topic == "lawsuit_structured_test"
        assert structured_payload.get("number") == "0001"

        # Step 3: classifier consumes structured and produces classified
        classifier_out = []
        cls_msgs = [Msg(structured_payload)]
        with ExitStack() as stack:
            stack.enter_context(module_aliases_for("classifier"))
            stack.enter_context(patch("classifier.kafka.runner.create_consumer", return_value=DummyConsumer(cls_msgs)))
            stack.enter_context(patch("classifier.kafka.runner.create_producer", return_value=DummyProducer(classifier_out)))
            stack.enter_context(patch("classifier.kafka.runner.STRUCTURED_TOPIC", "lawsuit_structured_test"))
            stack.enter_context(patch("classifier.kafka.runner.CLASSIFIED_TOPIC", "lawsuit_classified_test"))
            from classifier.kafka.runner import run as classifier_run
            try:
                await asyncio.wait_for(classifier_run(), timeout=1)
            except asyncio.TimeoutError:
                pass

        assert len(classifier_out) == 1
        classified_topic, classified_payload = classifier_out[0]
        assert classified_topic == "lawsuit_classified_test"
        assert classified_payload.get("number") == "0001"
        assert classified_payload.get("sensitiveKind") == "CRIME_ODIO"

    asyncio.run(_run())
