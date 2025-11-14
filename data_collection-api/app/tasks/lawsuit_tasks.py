import asyncio
from app.workers.celery_app import celery_app
from app.services.lawsuit_service import get_lawsuit_data
from app.utils.logging_config import get_logger
from app.kafka.producer import publish_lawsuit, close_producer

logger = get_logger(__name__)


def _case_to_dict(case) -> dict:
    """Convert Case model to dictionary format expected by parser (lawsuit_raw topic)"""
    return {
        "tribunal": case.tribunal,
        "classe": case.classe,
        "area": case.area,
        "assunto": case.assunto,
        "data_de_distribuicao": case.data_de_distribuicao.isoformat() if case.data_de_distribuicao else None,
        "juiz": case.juiz,
        "valor_da_acao": case.valor_da_acao,
        "segredo_justica": case.segredo_justica,
        "existe": case.existe,
        "partes_do_processo": [
            {
                "nome": p.nome,
                "papel": p.papel,
                "advogado(as)": p.advogado_as or []
            }
            for p in case.partes_do_processo
        ],
        "lista_das_movimentacoes": [
            {
                "data": m.data.isoformat() if m.data else None,
                "movimento": m.movimento
            }
            for m in case.lista_das_movimentacoes
        ],
        "instancia": case.instancia,
        "numero_do_processo": case.numero_do_processo
    }


@celery_app.task(bind=True, max_retries=3, name="app.tasks.lawsuit_tasks.collect_lawsuit_task")
def collect_lawsuit_task(self, cnj: str, max_cache_age_seconds: int = 3600):
    """
    Async task that executes the complete collection of a process.
    After collection, publishes each case to Kafka raw topic for pipeline processing.
    """
    logger.info(f"Starting task execution for CNJ {cnj}")
    
    try:
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(
            get_lawsuit_data(cnj, max_cache_age_seconds)
        )
        
        # Publish each collected case to Kafka for pipeline processing
        published_count = 0
        for case in result:
            try:
                case_dict = _case_to_dict(case)
                loop.run_until_complete(publish_lawsuit(case_dict))
                published_count += 1
            except Exception as e:
                logger.error(f"Failed to publish case {case.numero_do_processo} to Kafka: {e}", exc_info=True)
                # Continue publishing other cases even if one fails
        
        logger.info(f"Task completed successfully for CNJ {cnj} - {len(result)} cases collected, {published_count} published to Kafka")
        return {
            "status": "success",
            "cases_count": len(result),
            "published_count": published_count,
            "cnj": cnj
        }
        
    except Exception as exc:
        logger.error(f"Task failed for CNJ {cnj}: {exc}", exc_info=True)
        
        # Retry com exponential backoff
        if self.request.retries < self.max_retries:
            countdown = 60 * (2 ** self.request.retries)  
            logger.warning(f"Retrying task for CNJ {cnj} in {countdown} seconds (attempt {self.request.retries + 1}/{self.max_retries})")
            raise self.retry(exc=exc, countdown=countdown)
        else:
            logger.error(f"Task failed permanently for CNJ {cnj} after {self.max_retries} retries")
            return {
                "status": "failed",
                "cnj": cnj,
                "error": str(exc)
            }

