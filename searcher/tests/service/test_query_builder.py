import pytest
from searcher.service.builders.query_builder import build_query
from searcher.models.request_models import RequestModel, Filters, DateFilter

def test_build_query_cnj_pattern():
    request = RequestModel(query="0217496-81.2021.8.06.0001", limit=5, offset=0)
    query = build_query(request)
    assert "term" in query["bool"]["must"][0]
    assert query["bool"]["must"][0]["term"]["number"] == request.query

def test_build_query_text_with_phrase():
    request = RequestModel(query="direito civil", limit=5, offset=0)
    query = build_query(request)
    assert "bool" in query["bool"]["must"][0]
    should = query["bool"]["must"][0]["bool"]["should"]
    assert len(should) == 2
    assert should[0]["multi_match"]["operator"] == "or"

def test_build_query_with_filters():
    date_filter = DateFilter(date="2024-01-01", operator="<")
    filters = Filters(court="TJSP", date=date_filter)
    request = RequestModel(query="direito civil", filters=filters, limit=5, offset=0)
    query = build_query(request)
    filter_clauses = query["bool"]["filter"]
    assert any("term" in f for f in filter_clauses)
    assert any("range" in f for f in filter_clauses)
