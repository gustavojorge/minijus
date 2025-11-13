import asyncio
from contextlib import ExitStack
from unittest.mock import AsyncMock, patch

from conftest import DummyConsumer, DummyProducer, Msg, module_aliases_for


def test_full_pipeline_parser_classifier_db_sync(monkeypatch):
    async def _run():
        # 1) Produce initial raw payload
        payload = {
            "existe": True,
            "numero_do_processo": "0002",
            "tribunal": "TJX",
            "classe": "Ação",
            "area": "Cível",
            "assunto": "Violência Doméstica contra a mulher",
            "data_de_distribuicao": "2024-01-02",
        }

        # 2) Parser
        parser_out = []
        with ExitStack() as stack:
            stack.enter_context(module_aliases_for("parser"))
            stack.enter_context(patch("parser.kafka.runner.create_consumer", return_value=DummyConsumer([Msg(payload)])))
            stack.enter_context(patch("parser.kafka.runner.create_producer", return_value=DummyProducer(parser_out)))
            stack.enter_context(patch("parser.kafka.runner.RAW_TOPIC", "lawsuit_raw_test"))
            stack.enter_context(patch("parser.kafka.runner.STRUCTURED_TOPIC", "lawsuit_structured_test"))
            from parser.kafka.runner import run as parser_run
            try:
                await asyncio.wait_for(parser_run(), timeout=1)
            except asyncio.TimeoutError:
                pass

        assert parser_out, "Parser should have produced a structured message"
        _, structured = parser_out[0]

        # 3) Classifier
        classifier_out = []
        with ExitStack() as stack:
            stack.enter_context(module_aliases_for("classifier"))
            stack.enter_context(patch("classifier.kafka.runner.create_consumer", return_value=DummyConsumer([Msg(structured)])))
            stack.enter_context(patch("classifier.kafka.runner.create_producer", return_value=DummyProducer(classifier_out)))
            stack.enter_context(patch("classifier.kafka.runner.STRUCTURED_TOPIC", "lawsuit_structured_test"))
            stack.enter_context(patch("classifier.kafka.runner.CLASSIFIED_TOPIC", "lawsuit_classified_test"))
            from classifier.kafka.runner import run as classifier_run
            try:
                await asyncio.wait_for(classifier_run(), timeout=1)
            except asyncio.TimeoutError:
                pass

        assert classifier_out, "Classifier should have produced a classified message"
        _, classified = classifier_out[0]
        assert classified.get("sensitiveKind") is not None

        # 4) DB Sync: patch repository.upsert_lawsuit and pool.acquire to avoid real DB
        upserts = []

        async def fake_upsert(conn, rec):
            upserts.append(rec)

        class FakeConn:
            async def execute(self, *_args, **_kwargs):
                return None

        class FakeAcquire:
            async def __aenter__(self):
                return FakeConn()

            async def __aexit__(self, exc_type, exc, tb):
                return False

        class FakePool:
            def acquire(self):
                return FakeAcquire()

            async def close(self):
                pass

        with ExitStack() as stack:
            stack.enter_context(module_aliases_for("db_sync"))
            stack.enter_context(patch("db_sync.kafka.consume.AIOKafkaConsumer", return_value=DummyConsumer([Msg(classified)])))
            stack.enter_context(patch("db_sync.kafka.consume.create_pool", return_value=FakePool()))
            stack.enter_context(patch("db_sync.kafka.consume.upsert_lawsuit", side_effect=fake_upsert))
            stack.enter_context(patch("db_sync.kafka.config.CLASSIFIED_TOPIC", "lawsuit_classified_test"))
            from db_sync.kafka.runner import run as dbsync_run
            try:
                await asyncio.wait_for(dbsync_run(), timeout=1)
            except asyncio.TimeoutError:
                pass

        assert upserts, "DB Sync should have attempted an upsert"
        assert upserts[0].get("number") == "0002"

    asyncio.run(_run())
