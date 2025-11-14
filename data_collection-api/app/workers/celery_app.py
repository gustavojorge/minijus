from celery import Celery
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "data_collection",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  
    task_soft_time_limit=25 * 60, 
    worker_prefetch_multiplier=1,  
    worker_max_tasks_per_child=50,
    include=["app.tasks.lawsuit_tasks"],  # Importa automaticamente as tarefas
)

# Importa as tarefas para garantir que sejam registradas
from app.tasks import lawsuit_tasks  # noqa: F401

