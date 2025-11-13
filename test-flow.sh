#!/bin/bash

# Script para testar o fluxo completo do sistema
# Verifica se um processo foi indexado e está disponível no frontend

set -e

echo "🔍 Testando o fluxo completo do sistema..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se um serviço está respondendo
check_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "Verificando $name... "
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ OK${NC}"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    echo -e "${RED}✗ FALHOU${NC}"
    return 1
}

# 1. Verificar infraestrutura
echo "1️⃣ Verificando infraestrutura..."
check_service "http://localhost:9200" "Elasticsearch" || exit 1
check_service "http://localhost:8081" "Kafka Web UI" || exit 1
check_service "http://localhost:5432" "PostgreSQL" || exit 1
echo ""

# 2. Verificar se há processos no Elasticsearch
echo "2️⃣ Verificando se há processos indexados no Elasticsearch..."
ES_COUNT=$(curl -s "http://localhost:9200/lawsuits/_count" | grep -o '"count":[0-9]*' | grep -o '[0-9]*' || echo "0")

if [ "$ES_COUNT" -gt "0" ]; then
    echo -e "${GREEN}✓ Encontrados $ES_COUNT processo(s) no Elasticsearch${NC}"
else
    echo -e "${YELLOW}⚠ Nenhum processo encontrado no Elasticsearch${NC}"
    echo "   Isso é normal se você acabou de iniciar o sistema."
    echo "   Aguarde alguns segundos para o pipeline processar a mensagem."
    echo ""
    echo "   Você pode verificar os logs do indexer com:"
    echo "   docker compose logs -f indexer-api"
    echo ""
fi
echo ""

# 3. Verificar searcher API
echo "3️⃣ Verificando Searcher API..."
if check_service "http://localhost:8100/docs" "Searcher API"; then
    echo "   Testando busca..."
    SEARCH_RESULT=$(curl -s -X POST "http://localhost:8100/search/" \
        -H "Content-Type: application/json" \
        -d '{"query": "1277567", "limit": 1}' || echo "")
    
    if echo "$SEARCH_RESULT" | grep -q "lawsuits"; then
        echo -e "${GREEN}✓ Busca funcionando corretamente${NC}"
    else
        echo -e "${YELLOW}⚠ Busca retornou vazio (pode ser normal se não houver processos)${NC}"
    fi
fi
echo ""

# 4. Verificar Backend GraphQL
echo "4️⃣ Verificando Backend GraphQL..."
if check_service "http://localhost:4000" "Backend GraphQL"; then
    echo -e "${GREEN}✓ Backend GraphQL está rodando${NC}"
    echo "   Acesse: http://localhost:4000"
fi
echo ""

# 5. Verificar Frontend
echo "5️⃣ Verificando Frontend..."
if check_service "http://localhost:3000" "Frontend"; then
    echo -e "${GREEN}✓ Frontend está rodando${NC}"
    echo "   Acesse: http://localhost:3000"
    echo ""
    echo "   Para testar, busque pelo número: 1277567-49.2023.8.09.0001"
fi
echo ""

# 6. Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumo:"
echo ""
echo "  Elasticsearch: $ES_COUNT processo(s) indexado(s)"
echo ""
echo "  URLs disponíveis:"
echo "    - Frontend:        http://localhost:3000"
echo "    - Backend GraphQL: http://localhost:4000"
echo "    - Searcher API:    http://localhost:8100"
echo "    - Kafka Web UI:    http://localhost:8081"
echo "    - Kibana:          http://localhost:5601"
echo ""
echo "  Para ver logs:"
echo "    - Indexer:  docker compose logs -f indexer-api"
echo "    - Pipeline: docker compose logs -f parser classifier db_sync"
echo "    - Todos:    docker compose logs -f"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

