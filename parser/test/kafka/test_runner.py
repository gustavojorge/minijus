import asyncio
from unittest.mock import AsyncMock, patch

class DummyMessage:
    def __init__(self, value):
        self.value = value

def test_runner_processes_and_forwards_messages(monkeypatch):
    async def _run():
        consumer = AsyncMock()
        consumer.__aiter__.return_value = [
            DummyMessage({"existe": True, "numero_do_processo": "1"}),
            DummyMessage({"existe": False, "numero_do_processo": "2"}),
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
             patch("kafka.runner.STRUCTURED_TOPIC", "lawsuit_structured_test"):
            from kafka.runner import run

            try:
                await asyncio.wait_for(run(), timeout=1)
            except asyncio.TimeoutError:
                pass

        assert len(sent) == 1
        topic, payload = sent[0]
        assert topic == "lawsuit_structured_test"
        assert payload.get("number") == "1"

    asyncio.run(_run())
