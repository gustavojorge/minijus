import re

from searcher.config.settings import client, INDEX_NAME
from searcher.models.response_models import ResponseModel, Lawsuit, RelatedPerson, Lawyer, Activity
from searcher.service.builders.query_builder import build_query
from searcher.service.builders.highlight_builder import build_highlight
from searcher.utils.logging_config import get_logger

logger = get_logger(__name__)

def search_in_elastic(request) -> ResponseModel:
    logger.info(f"Initializing search in Elasticsearch: offset={request.offset}, limit={request.limit}")

    query_body = {
        "query": build_query(request),
        "from": request.offset,
        "size": request.limit,
        "highlight": build_highlight()
    }

    response = client.search(index=INDEX_NAME, body=query_body)
    logger.info(f"Query sent to Elasticsearch index '{INDEX_NAME}': {query_body}")

    total = response["hits"]["total"]["value"]
    hits_data = response["hits"]["hits"]

    logger.info(f"Total documents found: {total}")
    for hit in hits_data:
        logger.info(f"----> Document number: {hit['_source'].get('number', '')} | Score: {hit.get('_score', None)}")

    lawsuits = []

    for hit in hits_data:
        src = hit.get("_source", {})

        highlights = hit.get("highlight", {})

        def get_highlight(field, default=""):
            highlight_list = highlights.get(field, [])
            return highlight_list[0] if highlight_list else default

        def find_matching_highlight(highlight_list, original_text):
            if not original_text or not highlight_list:
                return None
            
            for highlight in highlight_list:
                highlight_text = re.sub(r'<mark>(.*?)</mark>', r'\1', highlight)
                if highlight_text.strip() == original_text.strip():
                    return highlight
            return highlight_list[0] if highlight_list else None

        related_people_highlights = highlights.get("related_people.name", [])
        
        related_people = [
            RelatedPerson(
                name=find_matching_highlight(related_people_highlights, p.get("name", "")) or p.get("name", ""),
                role=p.get("role", "")
            )
            for p in src.get("related_people", [])
        ]

        lawyers_highlights = highlights.get("lawyers.name", [])
        
        lawyers = [
            Lawyer(
                name=find_matching_highlight(lawyers_highlights, l.get("name", "")) or l.get("name", "")
            )
            for l in src.get("lawyers", [])
        ]
        
        activities = [
            Activity(
                date=a.get("date", ""),
                description=get_highlight("activities.description", a.get("description", ""))
            )
            for a in src.get("activities", [])
        ]

        lawsuit = Lawsuit(
            id=hit.get("_id", ""),
            number=get_highlight("number", src.get("number", "")),
            court=get_highlight("court", src.get("court", "")),
            nature=get_highlight("nature", src.get("nature", "")),
            kind=get_highlight("kind", src.get("kind", "")),
            subject=get_highlight("subject", src.get("subject", "")),
            date=src.get("date", ""),
            judge=get_highlight("judge", src.get("judge", "")),
            value=src.get("value", 0.0),
            related_people=related_people,
            lawyers=lawyers,
            activities=activities
        )

        lawsuits.append(lawsuit)

    logger.info(f"Total lawsuits returned: {len(lawsuits)}")
    return ResponseModel(hits=total, lawsuits=lawsuits)
