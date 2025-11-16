from __future__ import annotations
import json
from typing import Any, Dict, List
from aiokafka import AIOKafkaConsumer
from ..services.indexing_service import index_from_kafka_service
from ..utils.logging_config import get_logger
from .config import CLASSIFIED_TOPIC, BOOTSTRAP_SERVERS

logger = get_logger(__name__)

async def consume_lawsuits() -> None:
    consumer = AIOKafkaConsumer(
        CLASSIFIED_TOPIC,
        bootstrap_servers=BOOTSTRAP_SERVERS,
        group_id="indexer-group",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        enable_auto_commit=True,
        auto_offset_reset="earliest",
    )

    await consumer.start()
    logger.info(f"Indexer started. Consuming from topic '{CLASSIFIED_TOPIC}'")

    try:
        async for msg in consumer:
            value = msg.value
            records: List[Dict[str, Any]] = value if isinstance(value, list) else [value]
            
            for rec in records:
                try:
                    # Index each record to Elasticsearch
                    result = index_from_kafka_service(rec)
                    if result.get("skipped"):
                        logger.warning(
                            "Skipped indexing record number=%s reason=%s",
                            rec.get("number"),
                            result.get("reason"),
                        )
                    else:
                        logger.info(
                            "Indexed record number=%s id=%s",
                            rec.get("number"),
                            result.get("id"),
                        )
                except Exception as e:
                    logger.error(
                        "Failed to index record number=%s error=%s",
                        rec.get("number"),
                        str(e),
                        exc_info=True,
                    )
    finally:
        await consumer.stop()
        logger.info("Indexer stopped")

