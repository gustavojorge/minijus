import os

RAW_TOPIC = os.getenv("RAW_TOPIC", "lawsuit_raw")
STRUCTURED_TOPIC = os.getenv("STRUCTURED_TOPIC", "lawsuit_structured")
BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
