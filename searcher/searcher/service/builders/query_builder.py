from typing import Dict, Any
from searcher.utils.patterns import CNJ_PATTERN, SEARCH_FIELDS, PHRASE_PATTERN
from searcher.utils.logging_config import get_logger
from .filter_builder import build_filters

logger = get_logger(__name__)

def build_query(request) -> Dict[str, Any]:
    query_string = request.query.strip()

    if CNJ_PATTERN.match(query_string):
        logger.info(f"[QUERY] CNJ number")
        must_query = {"term": {"number": query_string}}

    elif match := PHRASE_PATTERN.match(query_string):
        logger.info(f"[QUERY] Phrase query")
        phrase_content = match.group("content")
        must_query = {
            "multi_match": {
                "query": phrase_content,
                "fields": SEARCH_FIELDS,
                "type": "phrase",
                "slop": 0,   
                "boost": 4   
            }
        }

    else:
        logger.info(f"[QUERY] General text search")
        must_query = {
            "bool": {
                "should": [
                    {
                        "multi_match": {
                            "query": query_string,
                            "fields": SEARCH_FIELDS,
                            "operator": "or",
                            "minimum_should_match": "75%"
                        }
                    },
                    {
                        "multi_match": {
                            "query": query_string,
                            "fields": SEARCH_FIELDS,
                            "type": "phrase",
                            "slop": 2,
                            "boost": 3
                        }
                    }
                ]
            }
        }

    filters = build_filters(request)

    return {
        "bool": {
            "must": [must_query],
            "filter": filters
        }
    }
