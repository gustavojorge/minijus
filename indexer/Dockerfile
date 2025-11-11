FROM python:3.11-slim

RUN apt-get update && apt-get install -y build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN pip install --no-cache-dir poetry==1.8.3

RUN poetry config virtualenvs.create false

RUN poetry install --no-root --no-interaction --no-ansi

COPY indexer ./indexer
COPY resources ./resources
COPY main.py ./

RUN mkdir -p logs

ENV PYTHONUNBUFFERED=1
ENV ES_HOST=http://elasticsearch:9200
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
