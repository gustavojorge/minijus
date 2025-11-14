import asyncio
import json
import os
from typing import Dict

from aiokafka import AIOKafkaProducer
from aiokafka.errors import KafkaConnectionError, LeaderNotAvailableError


def load_json(file_path: str) -> Dict:
    with open(file_path, 'r') as file:
        return json.load(file)


async def produce(msg: Dict):
    KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
    max_retries = 20
    retry_delay = 5

    for attempt in range(max_retries):
        try:
            producer = AIOKafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda j: json.dumps(j).encode("utf-8"),
            )
            await producer.start()
            try:
                await producer.send_and_wait("lawsuit_raw", msg)
                print(f"message sent: {msg}")
                break  # Success, exit retry loop
            finally:
                await producer.stop()
        except (KafkaConnectionError, LeaderNotAvailableError) as e:
            if attempt < max_retries - 1:
                print(f"Kafka error (attempt {attempt + 1}/{max_retries}): {e}. Retrying in {retry_delay}s...")
                await asyncio.sleep(retry_delay)
            else:
                print(f"Failed to send message after {max_retries} attempts: {e}")
                raise
        except Exception as e:
            print(f"Unexpected error: {e}")
            raise


if __name__ == "__main__":
    lawsuit_data = load_json("lawsuit.json")
    asyncio.run(produce(lawsuit_data))
