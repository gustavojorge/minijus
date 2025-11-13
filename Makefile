###############################################
# Docker Compose command autodetection
# Priority: docker compose (v2) > docker-compose (v1)
###############################################
DOCKER_COMPOSE ?= $(shell \
	if docker compose version >/dev/null 2>&1; then echo "docker compose"; \
	elif docker-compose version >/dev/null 2>&1; then echo "docker-compose"; \
	else echo ""; fi)

ifeq ($(DOCKER_COMPOSE),)
$(error Nenhum comando 'docker compose' ou 'docker-compose' encontrado no PATH)
endif

.PHONY: run-elastic
run-elastic:
	@$(DOCKER_COMPOSE) up -d elasticsearch kibana

.PHONY: stop-elastic
stop-elastic:
	@$(DOCKER_COMPOSE) stop elasticsearch kibana

.PHONY: purge-elastic
purge-elastic:
	@$(DOCKER_COMPOSE) down -v elasticsearch kibana

.PHONY: run-kafka
run-kafka:
	@$(DOCKER_COMPOSE) up -d zookeeper kafka kafka-web

.PHONY: run-database
run-database:
	@$(DOCKER_COMPOSE) up -d postgres pgadmin

.PHONY: run-infra
run-infra: run-kafka run-database run-elastic

.PHONY: run-pipeline-apps
run-pipeline-apps:
	@$(DOCKER_COMPOSE) up -d parser classifier db_sync

.PHONY: run-backend-services
run-backend-services:
	@$(DOCKER_COMPOSE) up -d indexer-api searcher-api

.PHONY: run-app-services
run-app-services:
	@$(DOCKER_COMPOSE) up -d mock-api backend-graphql frontend

.PHONY: produce-example-message
produce-example-message:
	@echo "Produzindo mensagem de exemplo no Kafka..."
	@$(DOCKER_COMPOSE) up initial-payload-producer

.PHONY: build-all
build-all:
	@echo "Construindo todas as imagens..."
	@$(DOCKER_COMPOSE) build

.PHONY: start-full
start-full: build-all run-infra
	@echo "Aguardando infraestrutura ficar pronta..."
	@sleep 10
	@echo "Iniciando pipeline..."
	@$(DOCKER_COMPOSE) up -d parser classifier db_sync
	@sleep 5
	@echo "Produzindo mensagem de exemplo..."
	@$(DOCKER_COMPOSE) up initial-payload-producer
	@sleep 5
	@echo "Iniciando serviços backend..."
	@$(DOCKER_COMPOSE) up -d indexer-api searcher-api
	@sleep 5
	@echo "Iniciando serviços de aplicação..."
	@$(DOCKER_COMPOSE) up -d mock-api backend-graphql frontend
	@echo "✅ Todos os serviços foram iniciados!"
	@echo ""
	@echo "Acesse:"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend GraphQL: http://localhost:4000"
	@echo "  - Kafka Web UI: http://localhost:8081"
	@echo "  - Kibana: http://localhost:5601"

.PHONY: stop-all
stop-all:
	@$(DOCKER_COMPOSE) down

.PHONY: logs
logs:
	@$(DOCKER_COMPOSE) logs -f

.PHONY: logs-indexer
logs-indexer:
	@$(DOCKER_COMPOSE) logs -f indexer-api

.PHONY: logs-pipeline
logs-pipeline:
	@$(DOCKER_COMPOSE) logs -f parser classifier db_sync

.PHONY: test-flow
test-flow:
	@./test-flow.sh

.PHONY: test-integration
test-integration:
	pytest -q pipeline_integration_test

.PHONY: test-parser
test-parser:
	@cd parser && poetry install --no-interaction --no-ansi && poetry run pytest -q

.PHONY: test-classifier
test-classifier:
	@cd classifier && poetry install --no-interaction --no-ansi && poetry run pytest -q

.PHONY: test-db_sync
test-db_sync:
	@cd db_sync && poetry install --no-interaction --no-ansi && poetry run pytest -q

.PHONY: test-all
test-all: test-parser test-classifier test-db_sync test-integration
