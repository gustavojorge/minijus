import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from indexer.controller.index_controller import router as index_router
from indexer.utils.startup import initialize_startup
from indexer.kafka.runner import run as run_kafka_consumer

kafka_task = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    initialize_startup()
    # Start Kafka consumer in background
    global kafka_task
    kafka_task = asyncio.create_task(run_kafka_consumer())
    yield
    # Shutdown
    if kafka_task:
        kafka_task.cancel()
        try:
            await kafka_task
        except asyncio.CancelledError:
            pass

app = FastAPI(title="Indexer API", lifespan=lifespan)
app.include_router(index_router)
