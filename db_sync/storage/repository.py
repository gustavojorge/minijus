from __future__ import annotations
import json
from typing import Any, Dict
import asyncpg
from utils.logger import get_logger
from storage.queries import UPSERT_LAWSUIT_SQL
from storage.utils import normalize_timestamp, json_dump
from model import PersistLawsuit, CourtInfo

logger = get_logger()

async def upsert_lawsuit(conn: asyncpg.Connection, record: Dict[str, Any]) -> None:
    try:
        model = PersistLawsuit(
            number=record.get("number", ""),
            court=CourtInfo(rawValue=(record.get("court") or {}).get("rawValue")) if isinstance(record.get("court"), dict) else CourtInfo(rawValue=record.get("court")),
            nature=record.get("nature"),
            kind=record.get("kind"),
            subject=record.get("subject"),
            sensitiveKind=record.get("sensitiveKind"),
            distributionDate=record.get("distributionDate"),
            judgeName=record.get("judgeName"),
            value=record.get("value"),
            justiceSecret=record.get("justiceSecret"),
            courtInstance=record.get("courtInstance"),
            relatedPeople=record.get("relatedPeople", []) or [],
            representedPersonLawyers=record.get("representedPersonLawyers", []) or [],
            activities=record.get("activities", []) or [],
            documento_json=record,
        )
    except Exception as e:
        logger.warning("Validation failed for record number=%s error=%s", record.get("number"), e)
        return

    payload = [
        model.number,
        model.court.rawValue if model.court else None,
        model.nature,
        model.kind,
        model.subject,
        model.sensitiveKind,
        normalize_timestamp(model.distributionDate),
        model.judgeName,
        model.value,
        model.justiceSecret,
        model.courtInstance,
        json_dump(model.relatedPeople),
        json_dump(model.representedPersonLawyers),
        json_dump(model.activities),
        json.dumps(record),
    ]

    await conn.execute(UPSERT_LAWSUIT_SQL, *payload)
    logger.info(
        "Upserted lawsuit number=%s sensitive_kind=%s",
        model.number,
        model.sensitiveKind,
    )
