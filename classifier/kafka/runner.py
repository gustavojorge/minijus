import json
from typing import Any, Dict, List
from classifiers.sensitive_subject_classifier import sensitive_kind
from utils.logger import get_logger
from .config import STRUCTURED_TOPIC, CLASSIFIED_TOPIC
from .consumer import create_consumer
from .producer import create_producer

logger = get_logger()

async def run() -> None:
    consumer = await create_consumer()
    producer = await create_producer()

    logger.info(f"Classifier started. Consuming from '{STRUCTURED_TOPIC}' -> Producing to '{CLASSIFIED_TOPIC}'")

    try:
        async for msg in consumer:
            value = msg.value
            records: List[Dict[str, Any]] = value if isinstance(value, list) else [value]

            for rec in records:
                try:
                    classified_case = sensitive_kind(rec)
                    await producer.send_and_wait(CLASSIFIED_TOPIC, classified_case)
                    logger.info(
                        "Classified case number=%s sensitiveKind=%s",
                        classified_case.get("number"),
                        classified_case.get("sensitiveKind"),
                    )
                except Exception as inner:
                    logger.warning("Failed to classify record: %s", inner)
    finally:
        await consumer.stop()
        await producer.stop()
        logger.info("Classifier stopped")
