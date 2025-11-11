from __future__ import annotations
import os
import sys
from dotenv import load_dotenv
from indexer.repository.es_repository import ensure_index
from indexer.services.indexing_service import index_from_db_service
from indexer.utils.logging_config import setup_logging, get_logger

logger = get_logger(__name__)

def initialize_startup() -> None:
    load_dotenv()
    log_file = os.getenv("LOG_FILE", "logs/app.log")
    log_level = os.getenv("LOG_LEVEL", "INFO")
    setup_logging(level=log_level, log_file=log_file, console=True)

    es_retry_attempts = int(os.getenv("ES_RETRY_ATTEMPTS", "3"))
    initial_load = os.getenv("INITIAL_LOAD_ON_START", "true").lower() == "true"

    try:
        created = ensure_index(retries=es_retry_attempts, delay=2.0)
    except RuntimeError as e:
        logger.error(str(e))
        sys.exit(1)

    if created and initial_load:
        logger.info("Index did not exist. Created new index. Starting initial load from database.")
        try:
            result = index_from_db_service()
            logger.info(
                "Initial load summary: success=%s failed=%s skipped=%s",
                result.get('indexed_success'),
                result.get('indexed_failed'),
                result.get('skipped'),
            )
        except Exception as e:
            logger.exception(f"Unexpected error during initial load: {e}")
    else:
        if created:
            logger.info("Index created but INITIAL_LOAD_ON_START=false - skipping initial load.")
        else:
            logger.info("Index already existed. Skipping initial load.")
