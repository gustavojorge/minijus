#!/bin/bash

# Script de teste para o sistema de filas
# Uso: ./test_queue.sh [CNJ]

set -e

CNJ=${1:-"0710802-55.2018.8.02.0001"}
API_URL="http://localhost:8000"
MAX_CACHE_AGE=86400

echo "🧪 Testando Sistema de Filas"
echo "================================"
echo "CNJ: $CNJ"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se API está respondendo
check_api() {
    echo -n "Verificando se API está respondendo... "
    if curl -s "$API_URL/" > /dev/null; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        echo "Erro: API não está respondendo em $API_URL"
        exit 1
    fi
}

# Função para verificar se Worker está rodando
check_worker() {
    echo -n "Verificando se Worker está rodando... "
    if docker ps | grep -q data_collection_worker; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        echo "Erro: Worker não está rodando"
        exit 1
    fi
}

# Função para verificar se Redis está respondendo
check_redis() {
    echo -n "Verificando se Redis está respondendo... "
    if docker exec data_collection_redis redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        echo "Erro: Redis não está respondendo"
        exit 1
    fi
}

# Teste 1: Primeira requisição (Cache MISS)
test_cache_miss() {
    echo ""
    echo "📤 Teste 1: Primeira Requisição (Cache MISS)"
    echo "--------------------------------------------"
    
    RESPONSE=$(curl -s "$API_URL/lawsuit?lawsuit_number=$CNJ&max_cache_age_seconds=$MAX_CACHE_AGE")
    
    if echo "$RESPONSE" | grep -q '"status":"queued"'; then
        echo -e "${GREEN}✓${NC} Tarefa enfileirada com sucesso"
        TASK_ID=$(echo "$RESPONSE" | grep -o '"task_id":"[^"]*"' | cut -d'"' -f4)
        echo "   Task ID: $TASK_ID"
        return 0
    else
        echo -e "${RED}✗${NC} Erro: Resposta inesperada"
        echo "Resposta: $RESPONSE"
        return 1
    fi
}

# Teste 2: Verificar se worker está processando
test_worker_processing() {
    echo ""
    echo "⚙️  Teste 2: Verificando Processamento do Worker"
    echo "--------------------------------------------"
    
    echo "Aguardando 5 segundos para worker iniciar processamento..."
    sleep 5
    
    if docker logs data_collection_worker 2>&1 | grep -q "Starting task execution for CNJ $CNJ"; then
        echo -e "${GREEN}✓${NC} Worker está processando a tarefa"
        return 0
    else
        echo -e "${YELLOW}⚠${NC}  Worker pode ainda não ter iniciado (verifique logs manualmente)"
        echo "   Execute: docker logs -f data_collection_worker"
        return 0
    fi
}

# Teste 3: Aguardar processamento e verificar cache
test_cache_hit() {
    echo ""
    echo "⏳ Teste 3: Aguardando Processamento e Verificando Cache"
    echo "--------------------------------------------"
    
    echo "Aguardando 60 segundos para processamento completo..."
    for i in {60..1}; do
        echo -ne "\r   Aguardando... ${i}s  "
        sleep 1
    done
    echo -ne "\r   Aguardando... 0s  \n"
    
    echo ""
    echo "Fazendo segunda requisição (deve retornar dados do cache)..."
    RESPONSE=$(curl -s "$API_URL/lawsuit?lawsuit_number=$CNJ&max_cache_age_seconds=$MAX_CACHE_AGE")
    
    if echo "$RESPONSE" | grep -q '"tribunal"'; then
        echo -e "${GREEN}✓${NC} Dados retornados do cache com sucesso"
        CASE_COUNT=$(echo "$RESPONSE" | grep -o '"tribunal"' | wc -l)
        echo "   Casos encontrados: $CASE_COUNT"
        return 0
    elif echo "$RESPONSE" | grep -q '"status":"queued"'; then
        echo -e "${YELLOW}⚠${NC}  Tarefa ainda não foi processada (pode levar mais tempo)"
        echo "   Execute novamente em alguns segundos"
        return 1
    else
        echo -e "${RED}✗${NC} Erro: Resposta inesperada"
        echo "Resposta: $RESPONSE"
        return 1
    fi
}

# Executar testes
main() {
    check_api
    check_worker
    check_redis
    
    if test_cache_miss; then
        test_worker_processing
        test_cache_hit
    fi
    
    echo ""
    echo "================================"
    echo "✅ Testes concluídos!"
    echo ""
    echo "Para ver logs em tempo real:"
    echo "  docker logs -f data_collection_worker"
    echo "  docker logs -f data_colection_api"
}

main

