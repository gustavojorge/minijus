import os

CLASSIFIED_TOPIC = os.getenv("CLASSIFIED_TOPIC", "lawsuit_classified")
BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

