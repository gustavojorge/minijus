FROM python:3.11-slim

ARG APP_DIR

# Directories setup
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# System dependencies
RUN pip install poetry==1.8.2

COPY $APP_DIR /usr/src/app/
RUN poetry install --no-dev

