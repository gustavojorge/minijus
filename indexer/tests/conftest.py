import pytest
from unittest.mock import MagicMock, patch
from elasticsearch import Elasticsearch

@pytest.fixture
def mock_es_client():
    client = MagicMock(spec=Elasticsearch)
    client.indices = MagicMock()  # Adiciona o atributo indices como mock
    with patch("indexer.repository.es_repository.get_es_client", return_value=client):
        yield client

@pytest.fixture
def sample_db_row():
    return {
        "id": 1,
        "number": "123456-89.2020.8.05.0001",
        "court": "TJBA",
        "nature": "Civil",
        "kind": "Ação",
        "subject": "Indenização",
        "distribution_date": "2020-01-01",
        "judge_name": "Maria",
        "value": 10000.0,
        "justice_secret": False,
        "court_instance": 1,
        "related_people": [{"name": "João", "role": "autor"}],
        "represented_person_lawyers": [{"name": "José"}],
        "activities": [{"description": "Distribuído"}]
    }

@pytest.fixture
def sample_http_doc():
    return {
        "number": "555555-12.2022.8.05.0002",
        "court": "TJBA",
        "nature": "Criminal",
        "subject": "Homicídio",
        "judge": "Carlos",
        "kind": "Ação Penal",
        "activities": [{"description": "Audiência marcada"}],
        "justiceSecret": False,
    }
