FROM python:3.11-slim

RUN pip install --no-cache-dir poetry

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

RUN poetry install --no-root --no-interaction --no-ansi

COPY . .

RUN poetry run playwright install --with-deps

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
