import pytest
from unittest.mock import AsyncMock, MagicMock, call
from app.services.lawsuit_service import get_lawsuit_data
from app.models.case_schema import Case
from app.exceptions.custom_exceptions import CrawlerTimeoutException, CrawlerNotFoundException, ScraperNotFoundException

# O decorador do pytest-asyncio é necessário para todas as funções de teste async
@pytest.mark.asyncio
async def test_get_lawsuit_data_cache_hit(mocker):
    """
    Cenário: Cache Hit
    Objetivo: Verificar se, quando o cache existe, a função retorna os dados do cache
    e NÃO chama os crawlers, scrapers ou a função de salvar.
    """
    # 1. Arrange (Preparação)
    mock_cnj = "1234567-89.2023.8.02.0001"
    mock_cached_data = [
        Case(tribunal="TJAL", instancia=1, numero_do_processo=mock_cnj, existe=True, classe="Ação de Teste de Cache"),
        Case(tribunal="TJAL", instancia=2, numero_do_processo=mock_cnj, existe=False)
    ]
    
    # Mock das dependências externas
    mocker.patch("app.services.lawsuit_service.detect_tribunal_from_cnj", return_value="TJAL")
    mocker.patch("app.services.lawsuit_service.get_cached_cases", return_value=mock_cached_data)
    
    # Cria "espiões" para garantir que as outras funções não sejam chamadas
    mock_crawler_factory = mocker.patch("app.services.lawsuit_service.CrawlerFactory.get_crawler")
    mock_scraper_factory = mocker.patch("app.services.lawsuit_service.ScraperFactory.get_scraper")
    mock_save_case = mocker.patch("app.services.lawsuit_service.save_case")

    # 2. Act (Ação)
    result = await get_lawsuit_data(mock_cnj, 3600)

    # 3. Assert (Verificação)
    assert result == mock_cached_data
    mock_crawler_factory.assert_not_called()
    mock_scraper_factory.assert_not_called()
    mock_save_case.assert_not_called()

@pytest.mark.asyncio
async def test_critical_timeout_failure(mocker):
    """
    Cenário: Timeout Crítico
    Objetivo: Verificar se o serviço propaga a exceção CrawlerTimeoutException.
    """
    # 1. Arrange
    mock_cnj = "3333333-33.2023.8.02.0001"
    mocker.patch("app.services.lawsuit_service.get_cached_cases", return_value=None)
    mocker.patch("app.services.lawsuit_service.detect_tribunal_from_cnj", return_value="TJAL")
    
    # Simula o HTTPX levantando a exceção
    mocker.patch(
        "app.services.lawsuit_service.CrawlerFactory.get_crawler", 
        side_effect=CrawlerTimeoutException(cnj=mock_cnj, tribunal="TJAL")
    )

    # 2. Act & 3. Assert
    with pytest.raises(CrawlerTimeoutException):
        await get_lawsuit_data(mock_cnj, 0)

