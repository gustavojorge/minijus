# Guia de Testes - Sistema de Filas

Este guia mostra como testar se o sistema de filas está funcionando corretamente.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Poetry instalado (para desenvolvimento local)

## 🚀 Passo 1: Instalar Dependências

```bash
poetry install
```

## 🐳 Passo 2: Subir os Serviços

```bash
docker compose up -d --build
```

Isso vai subir:
- **API** (FastAPI) na porta 8000
- **Redis** na porta 6379
- **Worker** (Celery) processando tarefas
- **MongoDB** na porta 27017

## ✅ Passo 3: Verificar se os Serviços Estão Rodando

### Verificar status dos containers:

```bash
docker compose ps
```

Você deve ver 4 containers com status "Up":
- `data_colection_api`
- `data_collection_redis`
- `data_collection_worker`
- `data_collection_mongo`

### Verificar logs do Worker (importante!):

```bash
docker logs data_collection_worker
```

Você deve ver algo como:
```
[INFO] celery@worker ready.
```

Se não aparecer "ready", aguarde alguns segundos e verifique novamente.

### Verificar se Redis está funcionando:

```bash
docker exec data_collection_redis redis-cli ping
```

Deve retornar: `PONG`

### Verificar se a API está respondendo:

```bash
curl http://localhost:8000/
```

Deve retornar:
```json
{"message": "Welcome to the Data Collection API. Use /lawsuit?lawsuit_number=CNJ to query cases."}
```

## 🧪 Passo 4: Testar o Fluxo Completo

### Teste 1: Primeira Requisição (Cache MISS - deve enfileirar)

```bash
curl "http://localhost:8000/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001&max_cache_age_seconds=86400"
```

**Resposta esperada:**
```json
{
  "status": "queued",
  "task_id": "abc123-def456-...",
  "cnj": "0710802-55.2018.8.02.0001",
  "message": "Data not in cache. Collection queued. Please check again later."
}
```

### Verificar se a tarefa foi enfileirada:

```bash
docker logs data_collection_worker --tail 20
```

Você deve ver algo como:
```
[INFO] Task app.tasks.lawsuit_tasks.collect_lawsuit_task[abc123-def456-...] received
[INFO] Starting task execution for CNJ 0710802-55.2018.8.02.0001
```

### Aguardar processamento (30-60 segundos)

O worker vai processar a tarefa. Você pode acompanhar em tempo real:

```bash
docker logs -f data_collection_worker
```

Pressione `Ctrl+C` para sair do modo follow.

### Teste 2: Segunda Requisição (Cache HIT - deve retornar dados)

Após o worker processar (aguarde ~1 minuto), faça a mesma requisição:

```bash
curl "http://localhost:8000/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001&max_cache_age_seconds=86400"
```

**Resposta esperada:**
```json
[
  {
    "tribunal": "TJAL",
    "numero_do_processo": "0710802-55.2018.8.02.0001",
    "classe": "...",
    "area": "...",
    ...
  }
]
```

## 📊 Passo 5: Monitoramento Avançado

### Ver logs da API:

```bash
docker logs -f data_colection_api
```

### Ver logs do Worker:

```bash
docker logs -f data_collection_worker
```

### Verificar tarefas no Redis:

```bash
docker exec data_collection_redis redis-cli
```

Dentro do Redis CLI:
```redis
KEYS *
LLEN celery
```

### Verificar dados no MongoDB:

```bash
docker exec -it data_collection_mongo mongosh -u root -p example --authenticationDatabase admin
```

Dentro do MongoDB:
```javascript
use data_collection
db.cases.find().pretty()
db.parties.find().pretty()
db.movements.find().pretty()
```

## 🔍 Passo 6: Testes de Casos Especiais

### Teste com CNJ inválido:

```bash
curl "http://localhost:8000/lawsuit?lawsuit_number=123"
```

Deve retornar erro de validação.

### Teste com cache expirado:

```bash
# Primeiro, colete um processo
curl "http://localhost:8000/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001&max_cache_age_seconds=86400"

# Aguarde processar...

# Depois, faça requisição com cache muito curto (1 segundo)
curl "http://localhost:8000/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001&max_cache_age_seconds=1"

# Deve enfileirar novamente (cache expirado)
```

## 🛠️ Troubleshooting

### Worker não está processando tarefas:

1. Verifique se o worker está rodando:
   ```bash
   docker logs data_collection_worker
   ```

2. Verifique se há erros:
   ```bash
   docker logs data_collection_worker | grep -i error
   ```

3. Reinicie o worker:
   ```bash
   docker compose restart worker
   ```

### Redis não está conectando:

1. Verifique se Redis está rodando:
   ```bash
   docker ps | grep redis
   ```

2. Teste conexão:
   ```bash
   docker exec data_collection_redis redis-cli ping
   ```

### API não está respondendo:

1. Verifique logs:
   ```bash
   docker logs data_collection_api
   ```

2. Verifique se a porta está livre:
   ```bash
   lsof -i :8000
   ```

## 🧹 Limpeza

### Parar todos os serviços:

```bash
docker compose down
```

### Parar e remover volumes (limpar dados):

```bash
docker compose down -v
```

## 📝 Checklist de Validação

- [ ] Todos os containers estão rodando (`docker compose ps`)
- [ ] Worker está "ready" (`docker logs data_collection_worker`)
- [ ] Redis responde PONG (`docker exec data_collection_redis redis-cli ping`)
- [ ] API responde na raiz (`curl http://localhost:8000/`)
- [ ] Primeira requisição retorna "queued"
- [ ] Worker processa a tarefa (ver logs)
- [ ] Segunda requisição retorna dados do cache
- [ ] Dados estão salvos no MongoDB

## 🎯 Teste Rápido (One-liner)

```bash
# Teste completo em uma linha
curl "http://localhost:8000/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001" && sleep 60 && curl "http://localhost:8000/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001"
```

