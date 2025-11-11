from indexer.services.enrichment_service import enrichment
from indexer.services.validation_service import ValidationError

def test_enrichment_from_http(sample_http_doc):
    doc = enrichment(sample_http_doc, origin="http_request")
    assert "number" in doc and "activities" in doc

def test_enrichment_from_db(sample_db_row):
    doc = enrichment(sample_db_row, origin="db")
    assert "number" in doc and "activities" in doc

def test_enrichment_invalid_origin(sample_http_doc):
    try:
        enrichment(sample_http_doc, origin="invalid")
    except ValidationError as e:
        assert "Unknown source" in str(e)
