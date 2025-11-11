import json
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch

from indexer.controller.index_controller import router as index_router
from indexer.services.validation_service import ValidationError

app = FastAPI()
app.include_router(index_router)
client = TestClient(app)

def sample_http_doc():
    return {
        "number": "555555-12.2022.8.05.0002",
        "court": "TJBA",
        "nature": "Criminal",
        "subject": "Homicídio",
        "judge": "Carlos Santos",
        "kind": "Ação Penal",
        "activities": [{"description": "Audiência marcada"}],
        "justiceSecret": False
    }

@patch("indexer.controller.index_controller.index_from_db_service")
def test_index_db_success(mock_index_from_db):
    mock_index_from_db.return_value = {
        "total_received": 10,
        "prepared": 10,
        "indexed_success": 10,
        "indexed_failed": 0,
        "skipped": 0,
        "errors": [],
        "results": []
    }

    resp = client.post("/index/db")
    assert resp.status_code == 200
    data = resp.json()
    assert data["indexed_success"] == 10
    assert data["indexed_failed"] == 0


@patch("indexer.controller.index_controller.index_from_db_service")
def test_index_db_error_returns_500(mock_index_from_db):
    mock_index_from_db.return_value = {"error": "database connection failed"}
    resp = client.post("/index/db")
    assert resp.status_code == 500
    assert "database connection failed" in resp.text

@patch("indexer.controller.index_controller.index_single_document_service")
def test_index_document_success(mock_index_single):
    mock_index_single.return_value = {"id": "555555-12.2022.8.05.0002-1", "result": "created", "skipped": 0}
    payload = sample_http_doc()
    resp = client.post("/index/document", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == "555555-12.2022.8.05.0002-1"
    assert data["result"] == "created"

@patch("indexer.controller.index_controller.index_single_document_service")
def test_index_document_validation_error_returns_400(mock_index_single):
    mock_index_single.side_effect = ValidationError("Invalid doc")
    payload = sample_http_doc()
    resp = client.post("/index/document", json=payload)
    assert resp.status_code == 400
    assert "Invalid doc" in resp.text

@patch("indexer.controller.index_controller.index_multiple_documents_service")
def test_index_documents_success(mock_index_multiple):
    mock_index_multiple.return_value = {
        "total_received": 2,
        "prepared": 2,
        "indexed_success": 2,
        "indexed_failed": 0,
        "skipped": 0,
        "errors": [],
        "results": [{"id": "a", "status": "ready"}, {"id": "b", "status": "ready"}],
    }
    payload = [sample_http_doc(), sample_http_doc()]
    resp = client.post("/index/documents", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_received"] == 2
    assert data["indexed_success"] == 2

@patch("indexer.controller.index_controller.index_multiple_documents_service")
def test_index_documents_validation_error_returns_400(mock_index_multiple):
    mock_index_multiple.side_effect = ValidationError("Invalid docs")
    payload = [sample_http_doc()]
    resp = client.post("/index/documents", json=payload)
    assert resp.status_code == 400
    assert "Invalid docs" in resp.text

@patch("indexer.controller.index_controller.delete_document_service")
def test_delete_document_success(mock_delete):
    mock_delete.return_value = {"id": "doc123", "deleted": True, "result": "deleted"}
    resp = client.delete("/index/document/doc123")
    assert resp.status_code == 200
    data = resp.json()
    assert data["deleted"] is True
    assert data["id"] == "doc123"

@patch("indexer.controller.index_controller.delete_document_service")
def test_delete_document_not_found_returns_404(mock_delete):
    mock_delete.return_value = {"id": "doc999", "deleted": False, "result": "not_found"}
    resp = client.delete("/index/document/doc999")
    assert resp.status_code == 404
    assert "Document not found" in resp.text
