import json
import pytest
from db_sync.storage.repository import upsert_lawsuit

class FakeConn:
    def __init__(self):
        self.last_sql = None
        self.last_args = None
    async def execute(self, sql, *args):
        self.last_sql = sql
        self.last_args = args
        return "OK"

@pytest.mark.asyncio
async def test_upsert_lawsuit_builds_payload_correctly():
    record = {
        "number": "000123",
        "court": {"rawValue": "Some Court"},
        "nature": "Civil",
        "kind": "Action",
        "subject": "Subject X",
        "sensitiveKind": "None",
        "distributionDate": "2024-09-01T10:00:00Z",
        "judgeName": "Judge Dredd",
        "value": 1000,
        "justiceSecret": False,
        "courtInstance": 1,
        "relatedPeople": [{"name": "Alice"}],
        "representedPersonLawyers": [{"name": "Bob"}],
        "activities": [{"event": "created"}]
    }

    conn = FakeConn()
    await upsert_lawsuit(conn, record)

    assert "INSERT INTO lawsuits" in conn.last_sql
    assert isinstance(conn.last_args[-1], str)
    parsed = json.loads(conn.last_args[-1])
    assert parsed["number"] == "000123"
