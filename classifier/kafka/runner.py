import asyncio
import json
from typing import Any, Dict, List
from classifiers.sensitive_subject_classifier import sensitive_kind
from utils.logger import get_logger
from .config import STRUCTURED_TOPIC, CLASSIFIED_TOPIC
from .consumer import create_consumer
from .producer import create_producer
from aiokafka.errors import KafkaConnectionError

logger = get_logger()

async def run() -> None:
    max_retries = 20
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
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
            break  # Success, exit retry loop
        except KafkaConnectionError as e:
            if attempt < max_retries - 1:
                logger.warning(f"Kafka connection failed (attempt {attempt + 1}/{max_retries}): {e}. Retrying in {retry_delay}s...")
                await asyncio.sleep(retry_delay)
            else:
                logger.error(f"Failed to connect to Kafka after {max_retries} attempts: {e}")
                raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise
