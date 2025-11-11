from unittest.mock import patch, MagicMock
from searcher.service.search_service import search_in_elastic
from searcher.models.request_models import RequestModel

@patch("searcher.service.search_service.client")
def test_search_in_elastic_success(mock_client):
    mock_client.search.return_value = {
        "hits": {
            "total": {"value": 1},
            "hits": [
                {
                    "_id": "1",
                    "_source": {
                        "number": "123",
                        "court": "TJBA",
                        "nature": "Civil",
                        "kind": "Ação",
                        "subject": "Danos Morais",
                        "date": "2024-01-01",
                        "judge": "Maria Silva",
                        "value": 1000.0,
                        "related_people": [{"name": "João", "role": "autor"}],
                        "lawyers": [{"name": "Dr. José"}],
                        "activities": [{"date": "2024-01-02", "description": "Audiência"}],
                    },
                    "_score": 1.2
                }
            ]
        }
    }

    request = RequestModel(query="123", limit=5, offset=0)
    response = search_in_elastic(request)

    assert response.hits == 1
    assert len(response.lawsuits) == 1
    assert response.lawsuits[0].number == "123"
    assert response.lawsuits[0].court == "TJBA"
    assert response.lawsuits[0].lawyers[0].name == "Dr. José"
