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

def test_build_query_empty_with_filters_only():
    """Test query with empty string but filters present"""
    date_filter = DateFilter(date="2024-01-01", operator="=")
    filters = Filters(court="TJAL", date=date_filter)
    request = RequestModel(query="", filters=filters, limit=5, offset=0)
    query = build_query(request)
    
    assert "bool" in query
    assert "filter" in query["bool"]
    assert "must" not in query["bool"]
    assert len(query["bool"]["filter"]) == 2  # court + date

def test_build_query_with_court_filter_only():
    """Test query with only court filter"""
    filters = Filters(court="TJCE")
    request = RequestModel(query="direito civil", filters=filters, limit=5, offset=0)
    query = build_query(request)
    
    assert "bool" in query
    assert "must" in query["bool"]
    assert "filter" in query["bool"]
    assert len(query["bool"]["filter"]) == 1
    assert query["bool"]["filter"][0]["term"]["court"] == "TJCE"

def test_build_query_with_date_filter_only():
    """Test query with only date filter"""
    date_filter = DateFilter(date="2024-01-01", operator=">")
    filters = Filters(date=date_filter)
    request = RequestModel(query="direito civil", filters=filters, limit=5, offset=0)
    query = build_query(request)
    
    assert "bool" in query
    assert "must" in query["bool"]
    assert "filter" in query["bool"]
    assert len(query["bool"]["filter"]) == 1
    assert "range" in query["bool"]["filter"][0]
    assert query["bool"]["filter"][0]["range"]["date"]["gt"] == "2024-01-01"

def test_build_query_date_filter_operators():
    """Test all date filter operators"""
    # Test operator "<"
    date_filter_lt = DateFilter(date="2024-01-01", operator="<")
    filters_lt = Filters(date=date_filter_lt)
    request_lt = RequestModel(query="", filters=filters_lt, limit=5, offset=0)
    query_lt = build_query(request_lt)
    assert query_lt["bool"]["filter"][0]["range"]["date"]["lt"] == "2024-01-01"
    
    # Test operator "="
    date_filter_eq = DateFilter(date="2024-01-01", operator="=")
    filters_eq = Filters(date=date_filter_eq)
    request_eq = RequestModel(query="", filters=filters_eq, limit=5, offset=0)
    query_eq = build_query(request_eq)
    assert query_eq["bool"]["filter"][0]["range"]["date"]["gte"] == "2024-01-01"
    
    # Test operator ">"
    date_filter_gt = DateFilter(date="2024-01-01", operator=">")
    filters_gt = Filters(date=date_filter_gt)
    request_gt = RequestModel(query="", filters=filters_gt, limit=5, offset=0)
    query_gt = build_query(request_gt)
    assert query_gt["bool"]["filter"][0]["range"]["date"]["gt"] == "2024-01-01"
