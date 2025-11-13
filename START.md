# Guia de Execução do Projeto

Este guia explica como executar o projeto completo, desde a infraestrutura até o frontend.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Variáveis de ambiente configuradas (crie um arquivo `.env` na raiz se necessário)

## 🚀 Execução Rápida (Tudo de uma vez)

```bash
make start-full
```

Este comando irá:
1. Construir todas as imagens
2. Subir a infraestrutura (Kafka, Postgres, Elasticsearch)
3. Iniciar o pipeline (parser, classifier, db_sync)
4. Produzir uma mensagem de exemplo
5. Iniciar os serviços backend (indexer, searcher)
6. Iniciar os serviços de aplicação (mock-api, backend-graphql, frontend)

## 📝 Execução Passo a Passo

### 1. Subir a Infraestrutura

```bash
make run-infra
```

Ou manualmente:
```bash
docker compose up -d zookeeper kafka kafka-web postgres pgadmin elasticsearch kibana
```

**Aguarde ~10-15 segundos** para todos os serviços ficarem prontos.

### 2. Verificar se o Kafka está funcionando

Acesse o Kafka Web UI: http://localhost:8081

### 3. Iniciar o Pipeline

```bash
make run-pipeline-apps
```

Ou manualmente:
```bash
docker compose up -d parser classifier db_sync
```

Isso iniciará:
- **parser**: Consome `lawsuit_raw` e publica em `lawsuit_structured`
- **classifier**: Consome `lawsuit_structured` e publica em `lawsuit_classified`
- **db_sync**: Consome `lawsuit_classified` e salva no PostgreSQL

### 4. Produzir uma Mensagem de Exemplo

```bash
make produce-example-message
```

Ou manualmente:
```bash
docker compose up initial-payload-producer
```

Isso irá:
- Ler o arquivo `initial_payload_producer/lawsuit.json`
- Publicar no tópico `lawsuit_raw`
- O pipeline processará automaticamente: `raw → structured → classified`

### 5. Iniciar os Serviços Backend

```bash
make run-backend-services
```

Ou manualmente:
```bash
docker compose up -d indexer-api searcher-api
```

Isso iniciará:
- **indexer-api**: Consome `lawsuit_classified` e indexa no Elasticsearch
- **searcher-api**: API de busca no Elasticsearch

**Aguarde alguns segundos** para o indexer processar a mensagem.

### 6. Iniciar os Serviços de Aplicação

```bash
make run-app-services
```

Ou manualmente:
```bash
docker compose up -d mock-api backend-graphql frontend
```

## 🧪 Testar o Fluxo Completo

### 1. Verificar se o processo foi indexado

Acesse o Kibana: http://localhost:5601

Ou verifique diretamente no Elasticsearch:
```bash
curl http://localhost:9200/lawsuits/_search?pretty
```

### 2. Buscar no Frontend

Acesse: http://localhost:3000

Busque pelo número do processo: `1277567-49.2023.8.09.0001`

### 3. Verificar os Logs

```bash
# Logs do indexer (para ver se processou do Kafka)
make logs-indexer

# Logs do pipeline
make logs-pipeline

# Todos os logs
make logs
```

## 🔍 Verificar o Fluxo no Kafka

1. Acesse http://localhost:8081
2. Verifique os tópicos:
   - `lawsuit_raw`: Mensagem inicial
   - `lawsuit_structured`: Mensagem processada pelo parser
   - `lawsuit_classified`: Mensagem classificada

## 🛠️ Comandos Úteis

```bash
# Parar tudo
make stop-all

# Ver logs de um serviço específico
docker compose logs -f indexer-api

# Reconstruir um serviço específico
docker compose build indexer-api
docker compose up -d indexer-api

# Ver status de todos os serviços
docker compose ps

# Limpar tudo (volumes incluídos)
docker compose down -v
```

## 🔄 Fluxo Completo de Dados

```
1. initial_payload_producer
   ↓ (publica em lawsuit_raw)
2. parser
   ↓ (publica em lawsuit_structured)
3. classifier
   ↓ (publica em lawsuit_classified)
4. db_sync
   ↓ (salva no PostgreSQL)
5. indexer-api (consome lawsuit_classified)
   ↓ (indexa no Elasticsearch)
6. searcher-api
   ↓ (busca no Elasticsearch)
7. backend-graphql
   ↓ (expõe GraphQL)
8. frontend
   ↓ (consome GraphQL)
```

## ⚠️ Troubleshooting

### Kafka não está recebendo mensagens
- Verifique se o zookeeper e kafka estão rodando: `docker compose ps`
- Verifique os logs: `docker compose logs kafka`

### Indexer não está processando
- Verifique se o Kafka está acessível: `docker compose logs indexer-api`
- Verifique se há mensagens no tópico `lawsuit_classified` no Kafka Web UI

### Frontend não encontra processos
- Verifique se o Elasticsearch tem dados: `curl http://localhost:9200/lawsuits/_count`
- Verifique os logs do searcher: `docker compose logs searcher-api`
- Verifique os logs do backend-graphql: `docker compose logs backend-graphql`

## 📊 Portas dos Serviços

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000
- **Searcher API**: http://localhost:8100
- **Indexer API**: http://localhost:8000
- **Mock API**: http://localhost:9777
- **Kafka Web UI**: http://localhost:8081
- **Kibana**: http://localhost:5601
- **Elasticsearch**: http://localhost:9200
- **PostgreSQL**: localhost:5432
- **PgAdmin**: http://localhost:8080

