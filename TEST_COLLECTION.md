# Guia de Teste da Coleta Automática

Este guia explica como testar o fluxo completo de coleta automática de processos.

## 🎯 Objetivo

Testar o fluxo onde um usuário busca por um CNJ que não existe no Elasticsearch, e o sistema automaticamente:
1. Detecta que o processo não foi encontrado
2. Chama a API de coleta
3. Coleta o processo do tribunal
4. Publica no Kafka
5. Processa pelo pipeline
6. Indexa no Elasticsearch
7. Exibe o processo na próxima busca

## 📋 Pré-requisitos

Todos os serviços devem estar rodando. Execute:

```bash
make start-full
```

Aguarde alguns minutos para todos os serviços ficarem prontos.

## 🧪 Passo a Passo do Teste

### 1. Verificar que o processo não existe

Primeiro, vamos verificar que o processo não está no Elasticsearch:

```bash
# Buscar no Elasticsearch diretamente
curl "http://localhost:9200/lawsuits/_search?q=number:0710802-55.2018.8.02.0001&pretty"
```

Deve retornar `"hits": []` ou `"total": 0`.

### 2. Buscar no Frontend

1. Acesse: http://localhost:3000
2. Digite o CNJ: `0710802-55.2018.8.02.0001`
3. Clique em "Buscar"

### 3. Verificar a Resposta

Você deve ver uma mensagem de "Processo em coleta" com:
- Mensagem explicando que o processo está sendo coletado
- CNJ do processo
- Botão "Tentar novamente"

### 4. Monitorar o Processo de Coleta

Em outro terminal, monitore os logs:

```bash
# Logs do worker (vai mostrar a coleta)
docker compose logs -f data_collection_worker

# Logs do pipeline (vai mostrar o processamento)
docker compose logs -f parser classifier

# Logs do indexer (vai mostrar a indexação)
docker compose logs -f indexer-api
```

### 5. Verificar no Kafka

Acesse: http://localhost:8081

Verifique os tópicos:
- `lawsuit_raw`: Deve ter uma mensagem com o processo coletado
- `lawsuit_structured`: Deve ter a mensagem processada pelo parser
- `lawsuit_classified`: Deve ter a mensagem classificada

### 6. Aguardar Processamento

Aguarde aproximadamente **2-5 minutos** para:
- Worker coletar o processo (pode levar 1-2 minutos)
- Pipeline processar (alguns segundos)
- Indexer indexar (alguns segundos)

### 7. Buscar Novamente

1. No frontend, clique em "Tentar novamente" ou faça uma nova busca
2. O processo deve aparecer agora! ✅

### 8. Verificar no Elasticsearch

Confirme que o processo foi indexado:

```bash
curl "http://localhost:9200/lawsuits/_search?q=number:0710802-55.2018.8.02.0001&pretty"
```

Deve retornar o documento do processo.

## 🔍 Verificações Adicionais

### Verificar Cache no MongoDB

```bash
# Conectar ao MongoDB
docker exec -it data_collection_mongo mongosh -u root -p example --authenticationDatabase admin

# Usar o banco
use data_collection

# Ver processos coletados
db.cases.find().pretty()

# Ver partes
db.parties.find().pretty()

# Ver movimentações
db.movements.find().pretty()
```

### Verificar Fila no Redis

```bash
# Conectar ao Redis
docker exec -it data_collection_redis redis-cli

# Ver tamanho da fila
LLEN celery

# Ver mensagens na fila (se houver)
LRANGE celery 0 -1
```

### Testar API Diretamente

```bash
# Primeira chamada (deve retornar "queued")
curl "http://localhost:8200/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001"

# Segunda chamada após alguns minutos (deve retornar os dados)
curl "http://localhost:8200/lawsuit?lawsuit_number=0710802-55.2018.8.02.0001"
```

## ⚠️ Troubleshooting

### Worker não está coletando

- Verifique se o worker está rodando: `docker compose ps data_collection_worker`
- Verifique os logs: `docker compose logs data_collection_worker`
- Verifique se há tarefas na fila: `docker exec -it data_collection_redis redis-cli LLEN celery`

### Processo não aparece no Kafka

- Verifique os logs do worker para erros de publicação
- Verifique se o Kafka está acessível: `docker compose logs kafka`
- Verifique a conexão: `docker exec -it data_collection_worker ping kafka`

### Pipeline não processa

- Verifique se os serviços estão rodando: `docker compose ps parser classifier`
- Verifique os logs: `docker compose logs parser classifier`
- Verifique se há mensagens no tópico `lawsuit_raw` no Kafka Web UI

### Indexer não indexa

- Verifique se o indexer está consumindo: `docker compose logs indexer-api`
- Verifique se há mensagens no tópico `lawsuit_classified` no Kafka Web UI
- Verifique a conexão com Elasticsearch: `docker compose logs elasticsearch`

## 📝 CNJs de Teste

Aqui estão alguns CNJs válidos para testar:

- **TJAL (1ª instância)**: `0710802-55.2018.8.02.0001`
- **TJAL (2ª instância)**: `0710802-55.2018.8.02.0002`
- **TJCE (1ª instância)**: `0000127-55.2018.8.06.0001`
- **TJCE (2ª instância)**: `0000127-55.2018.8.06.0002`

**Nota**: Alguns processos podem não existir ou estar em segredo de justiça. Se isso acontecer, tente outro CNJ.

