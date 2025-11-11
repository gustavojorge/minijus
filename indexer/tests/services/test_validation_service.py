import pytest
from indexer.services.validation_service import validate_es_document, validate_raw_for_mapping, ValidationError

def test_validate_es_document_valid():
    doc = {"number": "123", "activities": [{"description": "OK"}]}
    assert validate_es_document(doc) == doc

def test_validate_es_document_missing_fields():
    doc = {"activities": []}
    with pytest.raises(ValidationError):
        validate_es_document(doc)

def test_validate_raw_for_mapping_valid():
    raw = {"number": "123", "activities": [{"description": "Atividade"}], "justiceSecret": False}
    assert validate_raw_for_mapping(raw, "http_request") is None

def test_validate_raw_for_mapping_secret_case():
    raw = {"number": "123", "activities": [{"description": "Atividade"}], "justiceSecret": True}
    with pytest.raises(ValidationError):
        validate_raw_for_mapping(raw, "http_request")

def test_validate_raw_for_mapping_missing_fields():
    raw = {"activities": []}
    with pytest.raises(ValidationError):
        validate_raw_for_mapping(raw, "http_request")
