import json
import asyncio
from typing import Any, Dict, List
from aiokafka import AIOKafkaConsumer
from storage.repository import upsert_lawsuit
from model import PersistLawsuit, CourtInfo
from storage.db import create_pool
from utils.logger import get_logger
from .config import (
    CLASSIFIED_TOPIC,
    BOOTSTRAP_SERVERS,
    PG_HOST,
    PG_PORT,
    PG_USER,
    PG_PASSWORD,
    PG_DATABASE,
)

logger = get_logger()

async def consume_lawsuits() -> None:
    consumer = AIOKafkaConsumer(
        CLASSIFIED_TOPIC,
        bootstrap_servers=BOOTSTRAP_SERVERS,
        group_id="db-sync-group",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        enable_auto_commit=True,
        auto_offset_reset="earliest",
    )

    await consumer.start()
    logger.info(f"DB Sync started. Consuming from topic '{CLASSIFIED_TOPIC}'")

    pool = await create_pool(PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE)

    try:
        async for msg in consumer:
            value = msg.value
            records: List[Dict[str, Any]] = value if isinstance(value, list) else [value]
            async with pool.acquire() as conn:
                for rec in records:
                    try:
                        PersistLawsuit(
                            number=rec.get("number", ""),
                            court=CourtInfo(rawValue=(rec.get("court") or {}).get("rawValue")) if isinstance(rec.get("court"), dict) else CourtInfo(rawValue=rec.get("court")),
                            subject=rec.get("subject"),
                        )
                    except Exception as e:
                        logger.warning("Skipping invalid record number=%s error=%s", rec.get("number"), e)
                        continue
                    try:
                        await upsert_lawsuit(conn, rec)
                    except Exception as e:
                        logger.error(
                            "Failed to persist record number=%s error=%s",
                            rec.get("number"),
                            e,
                        )
    finally:
        await consumer.stop()
        await pool.close()
        logger.info("DB Sync stopped")
