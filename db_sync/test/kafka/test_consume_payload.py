import pytest
from unittest.mock import AsyncMock

from db_sync.kafka.consume import consume_lawsuits

@pytest.mark.asyncio
async def test_consumer_calls_upsert(monkeypatch):
    class DummyMsg:
        def __init__(self, value):
            self.value = value

    class DummyConsumer:
        def __init__(self, *args, **kwargs):
            pass
        async def start(self):
            pass
        async def stop(self):
            pass
        def __aiter__(self):
            async def gen():
                yield DummyMsg(value=[{"number": "1"}])
            return gen()

    monkeypatch.setattr("db_sync.kafka.consume.AIOKafkaConsumer", DummyConsumer)

    class DummyPool:
        class _Ctx:
            def __init__(self, parent):
                self._parent = parent
            async def __aenter__(self):
                return self._parent
            async def __aexit__(self, exc_type, exc, tb):
                return False
        def acquire(self):
            return DummyPool._Ctx(self)
        async def close(self):
            return None

    async def fake_create_pool(*args, **kwargs):
        return DummyPool()

    monkeypatch.setattr("db_sync.kafka.consume.create_pool", fake_create_pool)
    called = {"count": 0}
    async def fake_upsert(conn, rec):
        called["count"] += 1

    monkeypatch.setattr("db_sync.kafka.consume.upsert_lawsuit", fake_upsert)

    await consume_lawsuits()
    assert called["count"] == 1
