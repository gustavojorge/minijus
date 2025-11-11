import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from searcher.controllers.search_controller import router
from fastapi import FastAPI
from searcher.models.response_models import ResponseModel

app = FastAPI()
app.include_router(router)

client = TestClient(app)

@patch("searcher.controllers.search_controller.search_in_elastic")
def test_search_endpoint_success(mock_search):
    mock_response = ResponseModel(hits=1, lawsuits=[])
    mock_search.return_value = mock_response

    payload = {"query": "direito civil", "limit": 5, "offset": 0}
    response = client.post("/search/", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["hits"] == 1
    assert "lawsuits" in data

@patch("searcher.controllers.search_controller.search_in_elastic", side_effect=Exception("Elastic error"))
def test_search_endpoint_failure(mock_search):
    payload = {"query": "erro", "limit": 5, "offset": 0}
    response = client.post("/search/", json=payload)

    assert response.status_code == 500
    assert "Error to perform search" in response.text
