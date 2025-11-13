import pytest
from db_sync.storage.utils import normalize_timestamp, json_dump
from datetime import datetime, timezone


def test_normalize_timestamp_none():
    assert normalize_timestamp(None) is None

def test_normalize_timestamp_datetime():
    now = datetime.now(timezone.utc)
    assert normalize_timestamp(now) == now

def test_normalize_timestamp_numeric_seconds():
    ts = 1_700_000_000
    dt = normalize_timestamp(ts)
    assert isinstance(dt, datetime)
    # normalize_timestamp uses utcfromtimestamp and returns a naive UTC datetime
    from datetime import datetime as _dt
    assert dt == _dt.utcfromtimestamp(ts)

def test_normalize_timestamp_iso():
    s = "2024-01-31T10:20:30"
    dt = normalize_timestamp(s)
    assert isinstance(dt, datetime)
    assert dt.year == 2024 and dt.month == 1 and dt.day == 31

def test_normalize_timestamp_iso_z():
    s = "2024-01-31T10:20:30Z"
    dt = normalize_timestamp(s)
    assert isinstance(dt, datetime)

def test_json_dump_none():
    assert json_dump(None) is None

def test_json_dump_obj():
    obj = {"a": 1}
    out = json_dump(obj)
    assert out == "{\"a\": 1}"
