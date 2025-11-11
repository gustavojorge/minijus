from unittest.mock import patch
from indexer.services.indexing_service import index_single_document_service, delete_document_service

def test_index_single_document_service_success(mock_es_client, sample_http_doc):
    mock_es_client.index.return_value = {"result": "created"}
    with patch("indexer.services.indexing_service.ensure_index"), \
         patch("indexer.services.indexing_service.enrichment", return_value=sample_http_doc), \
         patch("indexer.services.indexing_service.validate_raw_for_mapping", return_value=None):
        resp = index_single_document_service(sample_http_doc)
    assert resp["result"] == "created"

def test_delete_document_service_found(mock_es_client):
    mock_es_client.delete.return_value = {"result": "deleted"}
    with patch("indexer.services.indexing_service.ensure_index"):
        resp = delete_document_service("doc123")
    assert resp["deleted"] is True

def test_delete_document_service_not_found(mock_es_client):
    with patch("indexer.services.indexing_service.ensure_index"), \
         patch("indexer.services.indexing_service.delete_document", return_value={"found": False}):
        resp = delete_document_service("doc999")
    assert resp["deleted"] is False
