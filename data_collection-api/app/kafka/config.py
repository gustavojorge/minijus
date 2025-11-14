import os

RAW_TOPIC = os.getenv("RAW_TOPIC", "lawsuit_raw")
BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

