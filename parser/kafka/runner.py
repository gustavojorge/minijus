import asyncio
import json
from typing import Any, Dict, List
from transformers.lawsuit_transformer import transform
from utils.logger import default_logger as logger
from .consumer import create_consumer
from .producer import create_producer
from .config import STRUCTURED_TOPIC, RAW_TOPIC
from aiokafka.errors import KafkaConnectionError

async def run() -> None:
    max_retries = 20
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            consumer = await create_consumer()
            producer = await create_producer()

            logger.info(f"Parser started. Consuming from '{RAW_TOPIC}' -> Producing to '{STRUCTURED_TOPIC}'")

            try:
                async for msg in consumer:
                    try:
                        value = msg.value
                        records: List[Dict[str, Any]] = value if isinstance(value, list) else [value]

                        for rec in records:
                            transformed = transform(rec)
                            if transformed is None:
                                logger.warning(f"Record discarded (existe=false): {rec.get('numero_do_processo', 'unknown')}")
                                continue
                            await producer.send_and_wait(STRUCTURED_TOPIC, transformed)
                            logger.info(f"Transformed and forwarded case CNJ={rec.get('numero_do_processo')}")
                    except Exception as inner:
                        logger.error(f"Error processing message: {inner}")
            finally:
                logger.info("Stopping consumer and producer")
                await consumer.stop()
                await producer.stop()
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
