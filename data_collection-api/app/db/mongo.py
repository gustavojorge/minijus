import os
from typing import Optional
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ServerSelectionTimeoutError
from app.exceptions.custom_exceptions import DatabaseConnectionException

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "data_collection")

_client: Optional[MongoClient] = None

def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    return _client

def get_db():
    client = get_client()
    try:
        client.admin.command("ping")
    except ServerSelectionTimeoutError as e:
        raise DatabaseConnectionException(detail=str(e))
    return client[MONGODB_DB]

def ensure_indexes():
    db = get_db()
    db.cases.create_index(
        [("numero_do_processo", ASCENDING), ("instancia", ASCENDING)],
        unique=True,
        name="case_number_instance_idx"
    )
    db.cases.create_index("updated_at", name="case_updated_at_idx")
    db.parties.create_index("case_id", name="party_case_idx")
    db.movements.create_index("case_id", name="movement_case_idx")
