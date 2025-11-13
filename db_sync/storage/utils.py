import json
from datetime import datetime
from typing import Any, Optional


def normalize_timestamp(value: Any) -> Optional[datetime]:

    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, (int, float)):
        try:
            return datetime.utcfromtimestamp(value)
        except Exception:
            return None
    if isinstance(value, str):
        v = value.strip()
        if not v:
            return None
        try:
            if v.endswith("Z"):
                v = v[:-1]
            return datetime.fromisoformat(v)
        except Exception:
            try:
                return datetime.utcfromtimestamp(float(v))
            except Exception:
                return None
    return None


def json_dump(obj: Any) -> Optional[str]:
    return json.dumps(obj) if obj is not None else None
