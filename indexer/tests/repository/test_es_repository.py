from unittest.mock import MagicMock, patch
from indexer.repository import es_repository

def test_ensure_index_creates_when_missing(mock_es_client):
    mock_es_client.indices.exists.return_value = False
    mock_es_client.indices.create.return_value = {"acknowledged": True}
    assert es_repository.ensure_index()

def test_index_single(mock_es_client):
    mock_es_client.index.return_value = {"result": "created"}
    resp = es_repository.index_single({"number": "1"}, _id="1")
    assert resp["result"] == "created"
