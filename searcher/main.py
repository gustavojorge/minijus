from fastapi import FastAPI
from searcher.controllers import search_controller
import os
from searcher.utils.logging_config import setup_logging, get_logger  

log_file = os.getenv("LOG_FILE", "logs/app.log")
log_level = os.getenv("LOG_LEVEL", "INFO")
setup_logging(level=log_level, log_file=log_file, console=True)  

app = FastAPI(title="Searcher API")
app.include_router(search_controller.router)
logger = get_logger(__name__)

@app.on_event("startup")
def startup_event():
    logger.info("Searcher API has started successfully.")