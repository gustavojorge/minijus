import json
from typing import Any, Dict, List
from transformers.lawsuit_transformer import transform
from utils.logger import default_logger as logger
from .consumer import create_consumer
from .producer import create_producer
from .config import STRUCTURED_TOPIC, RAW_TOPIC

async def run() -> None:
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
