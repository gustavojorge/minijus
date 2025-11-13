from __future__ import annotations
import os
from typing import Any, Dict, Iterable, List
from ..repository.db_repository import get_db_conn, fetch_lawsuits
from ..repository.es_repository import ensure_index, index_bulk, index_single, delete_document
from ..utils.logging_config import get_logger
from .validation_service import ValidationError, validate_raw_for_mapping
from .enrichment_service import enrichment
from ..utils.config import INDEX_NAME

logger = get_logger(__name__)

def _generate_actions(rows: List[Dict[str, Any]]) -> tuple[List[Dict[str, Any]], int]:
    actions: List[Dict[str, Any]] = []
    skipped = 0
    for r in rows:
        try:
            logger.info(f"Validation Phase: Validating document {r.get('id')} for indexing.")
            validate_raw_for_mapping(r, origin='db')

            logger.info(f"Enrichment Phase: Transforming and normalizing document {r.get('id')}.")
            es_doc = enrichment(r, origin="db")
            
        except ValidationError:
            skipped += 1
            continue
        db_id = r.get("id")
        _id = str(db_id)
        actions.append({
            "_op_type": "index",
            "_index": INDEX_NAME,
            "_id": _id,
            "_source": es_doc,
        })
    return actions, skipped

def index_from_db_service() -> Dict[str, Any]:
    ensure_index()
    try:
        with get_db_conn() as conn:
            rows = fetch_lawsuits(conn)
    except Exception as e:
        logger.error(f"Erro on fetching data from database: {e}")
        return {
            "total_received": 0,
            "prepared": 0,
            "indexed_success": 0,
            "indexed_failed": 0,
            "skipped": 0,
            "errors": [str(e)],
            "results": []
        }

    logger.info(f"Index Phase: Indexing {len(rows)} documents from database.")
    actions, skipped = _generate_actions(rows)
    success, failed, errors = index_bulk(actions)
    logger.info(f"Index Phase: {success} documents indexed successfully.")
    logger.info(f"Summary: Success={success} Failed={failed} Skipped={skipped}")
    if errors:
        logger.error(f"Errors returned by bulk indexing: {len(errors)}")
    total_received = success + failed + skipped
    prepared = success + failed
    return {
        "total_received": total_received,
        "prepared": prepared,
        "indexed_success": success,
        "indexed_failed": failed,
        "skipped": skipped,
        "errors": errors,
        "results": [] 
    }

def index_single_document_service(raw_doc: Dict[str, Any]) -> Dict[str, Any]:
    ensure_index()
    try:
        logger.info(f"Validation Phase: Validating document {raw_doc.get('id')} for indexing.")
        validate_raw_for_mapping(raw_doc, origin='http_request')

        logger.info(f"Enrichment Phase: Transforming and normalizing document {raw_doc.get('id')}.")
        es_doc = enrichment(raw_doc, origin="http_request")
    except ValidationError as e:
        return {"skipped": 1, "reason": str(e)}

    court_instance = raw_doc.get("courtInstance")
    number = es_doc.get("number")
    _id = f"{number}-{court_instance}" if court_instance is not None else number
    resp = index_single(es_doc, _id=_id)

    logger.info(f"Index Phase: Document indexed successfully id={_id}")
    return {"id": _id, "result": resp.get("result"), "skipped": 0}

def index_multiple_documents_service(raw_docs: List[Dict[str, Any]]) -> Dict[str, Any]:

    ensure_index()
    actions: List[Dict[str, Any]] = []
    results: List[Dict[str, Any]] = []
    skipped = 0
    for raw in raw_docs:
        try:
            logger.info(f"Validation Phase: Validating document {raw.get('id')} for indexing.")
            validate_raw_for_mapping(raw, origin='http_request')

            logger.info(f"Enrichment Phase: Transforming and normalizing document {raw.get('id')}.")
            es_doc = enrichment(raw, origin='http_request')

            number = es_doc.get('number')
            court_instance = raw.get('courtInstance')
            _id = f"{number}-{court_instance}" if court_instance is not None else number
            actions.append({
                '_op_type': 'index',
                '_index': INDEX_NAME,
                '_id': _id,
                '_source': es_doc,
            })
            results.append({'id': _id, 'status': 'ready'})
        except ValidationError as e:
            skipped += 1
            results.append({'skipped': True, 'reason': str(e)})
            continue

    indexed_success = indexed_failed = 0
    errors: List[Dict[str, Any]] = []
    if actions:
        logger.info(f"Index Phase: Indexing {len(actions)} documents from database.")
        indexed_success, indexed_failed, errors = index_bulk(actions)
        logger.info(f"Index Phase: {indexed_success} documents indexed successfully.")
        logger.info(f"Summary: Success={indexed_success} Failed={indexed_failed} Skipped={skipped}")
        if errors:
            logger.error(f"Bulk Index Phase: Errors returned={len(errors)}")
    else:
        logger.warning("Bulk Index Phase: No valid documents to index (all skipped).")

    if errors:
        failed_ids = {err.get('index', {}).get('_id') for err in errors if err.get('index')}
        for r in results:
            if 'id' in r and r['id'] in failed_ids:
                r['status'] = 'failed'

    return {
        'total_received': len(raw_docs),
        'prepared': len(actions),
        'indexed_success': indexed_success,
        'indexed_failed': indexed_failed,
        'skipped': skipped,
        'errors': errors,
        'results': results,
    }

def delete_document_service(doc_id: str) -> Dict[str, Any]:
    ensure_index()
    resp = delete_document(doc_id)
    if not resp or not resp.get('found'):
        logger.info(f"Delete: Document id={doc_id} not found in index.")
        return {"id": doc_id, "deleted": False, "result": "not_found"}
    logger.info(f"Delete: Document id={doc_id} deleted successfully.")
    return {"id": doc_id, "deleted": True, "result": resp.get("result")}

def index_from_kafka_service(record: Dict[str, Any]) -> Dict[str, Any]:
    """
    Index a single document from Kafka (classified topic).
    The record format is the same as the knowledge base format.
    """
    ensure_index()
    try:
        logger.info(f"Validation Phase: Validating document {record.get('number')} for indexing from Kafka.")
        validate_raw_for_mapping(record, origin='http_request')

        logger.info(f"Enrichment Phase: Transforming and normalizing document {record.get('number')}.")
        es_doc = enrichment(record, origin="http_request")
    except ValidationError as e:
        return {"skipped": 1, "reason": str(e)}

    court_instance = record.get("courtInstance")
    number = es_doc.get("number")
    _id = f"{number}-{court_instance}" if court_instance is not None else number
    resp = index_single(es_doc, _id=_id)

    logger.info(f"Index Phase: Document indexed successfully from Kafka id={_id}")
    return {"id": _id, "result": resp.get("result"), "skipped": 0}
