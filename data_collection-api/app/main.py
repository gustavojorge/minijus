from fastapi import FastAPI
from app.controllers import lawsuit_controller
from app.exceptions.error_handlers import register_error_handlers
from app.db.mongo import ensure_indexes
from app.utils.logging_config import setup_logging, get_logger
from app.metrics_endpoint import router as metrics_router
import os

setup_logging(
    level=os.getenv("LOG_LEVEL", "INFO"),
    log_file=os.getenv("LOG_FILE", "logs/app.log")
)

logger = get_logger(__name__)

app = FastAPI(title="Data Collection API")

app.include_router(lawsuit_controller.router)
app.include_router(metrics_router)

register_error_handlers(app)

@app.get("/")
async def root():
    return {"message": "Welcome to the Data Collection API. Use /lawsuit?lawsuit_number=CNJ to query cases."}

@app.on_event("startup")
def on_startup():
    try:
        logger.info("Starting application...")
        ensure_indexes()
        logger.info("MongoDB indices created successfully")
    except Exception as e:
        logger.error("Failed to create MongoDB indices", exc_info=True)
        raise
