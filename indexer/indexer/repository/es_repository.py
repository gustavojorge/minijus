from __future__ import annotations
import os
from typing import Any, Dict, Iterable, List, Tuple
import time
from elasticsearch import Elasticsearch, helpers
from ..utils.config import load_settings, INDEX_NAME
from elasticsearch import NotFoundError

_es_client: Elasticsearch | None = None

def get_es_client() -> Elasticsearch:
    global _es_client
    if _es_client is None:
        es_host = os.getenv("ES_HOST", "http://localhost:9200")
        _es_client = Elasticsearch(hosts=[es_host])
    return _es_client

def ensure_index(retries: int = 3, delay: float = 2.0) -> bool:
    es = get_es_client()
    attempt = 0
    while attempt <= retries:
        try:
            if not es.indices.exists(index=INDEX_NAME):
                settings = load_settings()
                es.indices.create(index=INDEX_NAME, body=settings)
                return True
            return False
        except Exception as e:
            attempt += 1
            if attempt > retries:
                raise RuntimeError(f"Failed ensuring index '{INDEX_NAME}' after {retries} retries: {e}")
            time.sleep(delay * attempt) 

def index_bulk(actions: Iterable[Dict[str, Any]]) -> Tuple[int, int, List[Dict[str, Any]]]:
    es = get_es_client()
    success, errors = helpers.bulk(
        es,
        actions,
        stats_only=False,
        raise_on_error=False,
    )
    failed = len(errors)
    return success, failed, errors

def index_single(doc: Dict[str, Any], _id: str) -> Dict[str, Any]:
    es = get_es_client()
    resp = es.index(index=INDEX_NAME, id=_id, document=doc)
    return resp

def delete_document(doc_id: str) -> Dict[str, Any]:
    es = get_es_client()
    try:
        resp = es.delete(index=INDEX_NAME, id=doc_id)
        return {"found": True, "result": resp.get("result")}
    except NotFoundError:
        return {"found": False, "result": "not_found"}
