from fastapi import APIRouter, Query
from app.repositories.case_repository import get_cached_cases
from app.tasks.lawsuit_tasks import collect_lawsuit_task
from app.utils.validators import normalize_and_validate_cnj
from app.utils.logging_config import get_logger
from app.metrics import lawsuit_requests_total, cache_cases_returned, queued_tasks_total

router = APIRouter()
logger = get_logger(__name__)

@router.get("/lawsuit")
async def get_lawsuit(lawsuit_number: str = Query(...), max_cache_age_seconds: int = Query(3600)):
    logger.info(f"Request received for the CNJ {lawsuit_number}")
    
    try:
        normalized_cnj = normalize_and_validate_cnj(lawsuit_number)
        logger.debug(f"CNJ validation passed (normalized: {normalized_cnj})")
        
        cached = get_cached_cases(normalized_cnj, max_cache_age_seconds)
        
        if cached:
            # Cache HIT: retorna dados imediatamente
            logger.info(f"Cache HIT for CNJ {normalized_cnj} - {len(cached)} cases found")
            lawsuit_requests_total.labels(result="cache_hit").inc()
            cache_cases_returned.labels(cnj=normalized_cnj).set(len(cached))
            return [case.model_dump(by_alias=True) for case in cached]
        
        # Cache MISS: enfileira a coleta
        logger.info(f"Cache MISS for CNJ {normalized_cnj} - queueing collection task")
        task = collect_lawsuit_task.delay(normalized_cnj, max_cache_age_seconds)
        lawsuit_requests_total.labels(result="cache_miss").inc()
        queued_tasks_total.labels(source="api").inc()
        
        return {
            "status": "queued",
            "task_id": task.id,
            "cnj": normalized_cnj,
            "message": "Data not in cache. Collection queued. Please check again later."
        }
        
    except Exception as e:
        logger.error(f"Error processing request for CNJ {lawsuit_number}: {e}")
        lawsuit_requests_total.labels(result="error").inc()
        raise
