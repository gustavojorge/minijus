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
2. Subir a infraestrutura (Kafka, Postgres, Elasticsearch, MongoDB, Redis)
3. Iniciar os serviços de coleta de dados (data_collection-api, worker)
4. Iniciar o pipeline (parser, classifier, db_sync)
5. Produzir uma mensagem de exemplo
6. Iniciar os serviços backend (indexer, searcher)
7. Iniciar os serviços de aplicação (mock-api, backend-graphql, frontend)

## 📝 Execução Passo a Passo

### 1. Subir a Infraestrutura

```bash
make run-infra
```

Ou manualmente:
```bash
docker compose up -d zookeeper kafka kafka-web postgres pgadmin elasticsearch kibana mongo data_collection_redis
```

**Aguarde ~15-20 segundos** para todos os serviços ficarem prontos.

### 2. Verificar se o Kafka está funcionando

Acesse o Kafka Web UI: http://localhost:8081

### 3. Iniciar os Serviços de Coleta de Dados

```bash
make run-data-collection-services
```

Ou manualmente:
```bash
docker compose up -d data_collection-api data_collection_worker
```

Isso iniciará:
- **data_collection-api**: API para receber requisições de coleta de processos
- **data_collection_worker**: Worker Celery que processa as coletas e publica no Kafka

**Aguarde alguns segundos** para os serviços ficarem prontos.

### 4. Iniciar o Pipeline

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

### 5. Produzir uma Mensagem de Exemplo

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

### 6. Iniciar os Serviços Backend

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

### 7. Iniciar os Serviços de Aplicação

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

### 2. Buscar no Frontend (Processo já indexado)

Acesse: http://localhost:3000

Busque pelo número do processo: `1277567-49.2023.8.09.0001`

Este processo deve ser encontrado imediatamente se foi indexado pelo pipeline.

### 3. Testar Coleta Automática (Processo não indexado)

Para testar o fluxo completo de coleta:

1. **Busque por um CNJ que não existe no Elasticsearch** (ex: `0710802-55.2018.8.02.0001`)

2. **O sistema irá:**
   - Verificar no searcher (não encontrará)
   - Chamar a API de coleta automaticamente
   - Exibir mensagem de "Processo em coleta" no frontend

3. **Aguarde alguns minutos** enquanto:
   - O worker coleta o processo
   - Publica no Kafka (`lawsuit_raw`)
   - O pipeline processa: `raw → structured → classified`
   - O indexer indexa no Elasticsearch

4. **Tente buscar novamente** - o processo deve aparecer agora!

### 4. Verificar Logs da Coleta

```bash
# Logs da API de coleta
make logs-data-collection

# Ou individualmente
docker compose logs -f data_collection-api
docker compose logs -f data_collection_worker
```

### 5. Verificar os Logs

```bash
# Logs do indexer (para ver se processou do Kafka)
make logs-indexer

# Logs do pipeline
make logs-pipeline

# Logs da coleta de dados
make logs-data-collection

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

### Fluxo 1: Pipeline Inicial (Mensagem de Exemplo)
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

### Fluxo 2: Coleta Automática (Processo não encontrado)
```
1. Usuário busca CNJ no frontend
   ↓
2. backend-graphql chama searcher-api
   ↓ (não encontra - hits: 0)
3. backend-graphql chama data_collection-api
   ↓
4. data_collection-api verifica cache (MongoDB)
   ↓ (não encontra)
5. data_collection-api enfileira tarefa no Redis
   ↓
6. data_collection_worker processa coleta
   ↓ (coleta dados do tribunal)
7. data_collection_worker salva no MongoDB
   ↓
8. data_collection_worker publica no Kafka (lawsuit_raw)
   ↓
9. parser processa
   ↓ (publica em lawsuit_structured)
10. classifier processa
   ↓ (publica em lawsuit_classified)
11. indexer-api indexa no Elasticsearch
   ↓
12. Próxima busca: processo encontrado! ✅
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

### Coleta de dados não está funcionando
- Verifique se MongoDB e Redis estão rodando: `docker compose ps mongo data_collection_redis`
- Verifique os logs da API: `docker compose logs data_collection-api`
- Verifique os logs do worker: `docker compose logs data_collection_worker`
- Verifique se o Kafka está acessível: `docker compose logs kafka`
- Teste a API diretamente: `curl "http://localhost:8200/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001"`

## 📊 Portas dos Serviços

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000
- **Data Collection API**: http://localhost:8200
- **Searcher API**: http://localhost:8100
- **Indexer API**: http://localhost:8000
- **Mock API**: http://localhost:9777
- **Kafka Web UI**: http://localhost:8081
- **Kibana**: http://localhost:5601
- **Elasticsearch**: http://localhost:9200
- **PostgreSQL**: localhost:5432
- **PgAdmin**: http://localhost:8080
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

