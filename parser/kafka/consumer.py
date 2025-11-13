import json
from aiokafka import AIOKafkaConsumer
from .config import RAW_TOPIC, BOOTSTRAP_SERVERS

async def create_consumer() -> AIOKafkaConsumer:
    consumer = AIOKafkaConsumer(
        RAW_TOPIC,
        bootstrap_servers=BOOTSTRAP_SERVERS,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        enable_auto_commit=True,
        auto_offset_reset="earliest",
    )
    await consumer.start()
    return consumer
