from fastapi import FastAPI
from indexer.controller.index_controller import router as index_router
from indexer.utils.startup import initialize_startup

app = FastAPI(title="Indexer API")
app.include_router(index_router)

@app.on_event("startup")
def startup_event():
    initialize_startup()
