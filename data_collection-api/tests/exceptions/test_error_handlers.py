import pytest
import httpx
from fastapi import FastAPI, Request

from app.exceptions.custom_exceptions import (
    InvalidCNJException,
    CrawlerTimeoutException,
    DatabaseConnectionException,
    CrawlerNotFoundException,
    ScraperNotFoundException,
    CourtNotFoundException,
)
from app.exceptions.error_handlers import register_error_handlers

test_app = FastAPI()

# Cria endpoints "falsos" que lançam cada uma das exceções
@test_app.get("/invalid-cnj")
async def raise_invalid_cnj():
    raise InvalidCNJException(cnj="12345")

@test_app.get("/crawler-timeout")
async def raise_crawler_timeout():
    raise CrawlerTimeoutException(cnj="0710802-55.2018.8.02.0001", tribunal="TJAL")

@test_app.get("/crawler-not-found")
async def raise_crawler_not_found():
    raise CrawlerNotFoundException(tribunal="TJAL", instancia=1)

@test_app.get("/db-connection-error")
async def raise_db_connection_error():
    raise DatabaseConnectionException(detail="Timeout connecting to replica set")

@test_app.get("/court-not-found")
async def raise_court_not_found():
    raise CourtNotFoundException(cnj="0000-00.2023.8.99.0001")

@test_app.get("/scraper-not-found")
async def raise_scraper_not_found():
    raise ScraperNotFoundException(tribunal="TJCE", instancia=2)

# 3. Registra todos os seus handlers na aplicação de teste
register_error_handlers(test_app)



@pytest.mark.asyncio
async def test_invalid_cnj_handler():
    """Verifica se o handler para InvalidCNJException retorna 400 Bad Request."""
    async with httpx.AsyncClient(app=test_app, base_url="http://test") as client:
        response = await client.get("/invalid-cnj")
    
    assert response.status_code == 400
    expected_json = {
        "error_code": "INVALID_CNJ",
        "message": "Número CNJ inválido.",
        "detail": "Recebido: 12345",
    }
    assert response.json() == expected_json

@pytest.mark.asyncio
async def test_crawler_timeout_handler():
    """Verifica se o handler para CrawlerTimeoutException retorna 504 Gateway Timeout."""
    async with httpx.AsyncClient(app=test_app, base_url="http://test") as client:
        response = await client.get("/crawler-timeout")
    
    assert response.status_code == 504
    expected_json = {
        "error_code": "CRAWLER_TIMEOUT",
        "message": "O crawler do tribunal TJAL atingiu timeout.",
        "detail": "Processo: 0710802-55.2018.8.02.0001",
    }
    assert response.json() == expected_json

@pytest.mark.asyncio
async def test_crawler_not_found_handler():
    """Verifica se o handler para CrawlerNotFoundException retorna 501 Not Implemented."""
    async with httpx.AsyncClient(app=test_app, base_url="http://test") as client:
        response = await client.get("/crawler-not-found")
    
    assert response.status_code == 501
    expected_json = {
        "error_code": "CRAWLER_NOT_IMPLEMENTED",
        "message": "A coleta para este tribunal/instância ainda não foi implementada.",
        "detail": "Tribunal: TJAL, Instância: 1",
    }
    assert response.json() == expected_json

@pytest.mark.asyncio
async def test_database_connection_handler():
    """Verifica se o handler para DatabaseConnectionException retorna 500 Internal Server Error."""
    async with httpx.AsyncClient(app=test_app, base_url="http://test") as client:
        response = await client.get("/db-connection-error")
    
    assert response.status_code == 500
    expected_json = {
        "error_code": "DB_CONNECTION_ERROR",
        "message": "Falha ao conectar ao banco de dados.",
        "detail": "Timeout connecting to replica set",
    }
    assert response.json() == expected_json

@pytest.mark.asyncio
async def test_court_not_found_handler():
    """Verifica se o handler para CourtNotFoundException retorna 400 Bad Request."""
    async with httpx.AsyncClient(app=test_app, base_url="http://test") as client:
        response = await client.get("/court-not-found")
    
    assert response.status_code == 400
    expected_json = {
        "error_code": "UNSUPPORTED_COURT",
        "message": "O tribunal extraído do CNJ não é suportado pela aplicação.",
        "detail": "Processo: 0000-00.2023.8.99.0001",
    }
    assert response.json() == expected_json

@pytest.mark.asyncio
async def test_scraper_not_found_handler():
    """Verifica se o handler para ScraperNotFoundException retorna 501 Not Implemented."""
    async with httpx.AsyncClient(app=test_app, base_url="http://test") as client:
        response = await client.get("/scraper-not-found")
    
    assert response.status_code == 501
    expected_json = {
        "error_code": "SCRAPER_NOT_IMPLEMENTED",
        "message": "O scraper para este tribunal/instância ainda não foi implementado.",
        "detail": "Tribunal: TJCE, Instância: 2",
    }
    assert response.json() == expected_json
