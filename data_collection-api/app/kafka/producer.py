import json
import asyncio
from typing import Dict, Any
from aiokafka import AIOKafkaProducer
from aiokafka.errors import KafkaConnectionError
from app.kafka.config import RAW_TOPIC, BOOTSTRAP_SERVERS
from app.utils.logging_config import get_logger

logger = get_logger(__name__)

_producer: AIOKafkaProducer | None = None
_producer_lock = asyncio.Lock()

async def get_producer() -> AIOKafkaProducer:
    """Get or create Kafka producer singleton with retry logic"""
    global _producer
    async with _producer_lock:
        if _producer is None:
            max_retries = 10
            retry_delay = 5
            
            for attempt in range(max_retries):
                try:
                    _producer = AIOKafkaProducer(
                        bootstrap_servers=BOOTSTRAP_SERVERS,
                        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                    )
                    await _producer.start()
                    logger.info(f"Kafka producer started. Will publish to topic '{RAW_TOPIC}'")
                    break
                except KafkaConnectionError as e:
                    if attempt < max_retries - 1:
                        logger.warning(f"Kafka connection failed (attempt {attempt + 1}/{max_retries}): {e}. Retrying in {retry_delay}s...")
                        await asyncio.sleep(retry_delay)
                        _producer = None
                    else:
                        logger.error(f"Failed to connect to Kafka after {max_retries} attempts: {e}")
                        raise
        return _producer

async def publish_lawsuit(case_dict: Dict[str, Any]) -> None:
    """Publish a collected lawsuit to Kafka raw topic"""
    try:
        producer = await get_producer()
        await producer.send_and_wait(RAW_TOPIC, case_dict)
        logger.info(f"Published lawsuit {case_dict.get('numero_do_processo')} to Kafka topic '{RAW_TOPIC}'")
    except Exception as e:
        logger.error(f"Failed to publish lawsuit to Kafka: {e}", exc_info=True)
        raise

async def close_producer() -> None:
    """Close Kafka producer"""
    global _producer
    async with _producer_lock:
        if _producer:
            await _producer.stop()
            _producer = None
            logger.info("Kafka producer stopped")

