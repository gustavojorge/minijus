import asyncio
from unittest.mock import AsyncMock, patch


class DummyMessage:
    def __init__(self, value):
        self.value = value


def test_classifier_runner_processes_and_produces(monkeypatch):
    async def _run():
        consumer = AsyncMock()
        consumer.__aiter__.return_value = [
            DummyMessage({"number": "1", "subject": "Racismo"}),
            DummyMessage({"number": "2", "subject": "Assunto qualquer"}),
        ]
        consumer.stop = AsyncMock()

        sent = []

        class DummyProducer:
            async def send_and_wait(self, topic, value):
                sent.append((topic, value))

            async def stop(self):
                pass

        with patch("kafka.runner.create_consumer", return_value=consumer), \
             patch("kafka.runner.create_producer", return_value=DummyProducer()), \
             patch("kafka.runner.STRUCTURED_TOPIC", "lawsuit_structured_test"), \
             patch("kafka.runner.CLASSIFIED_TOPIC", "lawsuit_classified_test"):
            from kafka.runner import run
            await asyncio.wait_for(run(), timeout=1)

        # Should have produced 2 messages
        assert len(sent) == 2
        topics = [t for t, _ in sent]
        assert topics == ["lawsuit_classified_test", "lawsuit_classified_test"]
        # First should be classified as CRIME_ODIO
        assert sent[0][1].get("sensitiveKind") == "CRIME_ODIO"

    asyncio.run(_run())
