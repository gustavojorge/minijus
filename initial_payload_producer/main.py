import asyncio
import json
import os
from typing import Dict

from aiokafka import AIOKafkaProducer


def load_json(file_path: str) -> Dict:
    with open(file_path, 'r') as file:
        return json.load(file)


async def produce(msg: Dict):
    KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

    producer = AIOKafkaProducer(
        loop=loop,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda j: json.dumps(j).encode("utf-8"),
    )
    await producer.start()
    try:
        await producer.send_and_wait("lawsuit_raw", msg)
        print(f"message sent: {msg}")
    finally:
        await producer.stop()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    lawsuit_data = load_json("lawsuit.json")
    loop.run_until_complete(produce(lawsuit_data))
