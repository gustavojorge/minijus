import pytest
import httpx
from unittest.mock import AsyncMock
from app.crawlers.tjce.httpx.tjce_first_instance_http import TJCEFirstInstanceHttpCrawler
from app.exceptions.custom_exceptions import CrawlerTimeoutException

# --- MOCK HTMLs PARA SIMULAR AS RESPOSTAS DO SITE ---

# Simula a página final de detalhes do processo
HTML_FINAL_PAGE = """
<html>
    <body>
        <div id="containerDadosPrincipaisProcesso">
            <h1>Detalhes do Processo</h1>
        </div>
    </body>
</html>
"""

# Simula a página de desambiguação com um "modal" (input escondido)
HTML_MODAL_PAGE = """
<html>
    <body>
        <h1>Selecione o processo</h1>
        <input name="processoSelecionado" value="CODIGO_DO_PROCESSO_123" />
    </body>
</html>
"""


@pytest.mark.asyncio
async def test_run_direct_success(mocker):
    """
    Testa o Cenário 1: A busca retorna diretamente a página de detalhes.
    """
    # 1. Arrange (Preparação)
    cnj = "0070337-91.2008.8.06.0001"
    crawler = TJCEFirstInstanceHttpCrawler()
    
    # Mocka a resposta do httpx para simular o sucesso direto
    mock_response = httpx.Response(200, text=HTML_FINAL_PAGE, request=httpx.Request("GET", crawler.url_busca))
    mocker.patch("httpx.AsyncClient.get", return_value=mock_response)

    result_html = await crawler.run(cnj)

    assert result_html == HTML_FINAL_PAGE

@pytest.mark.asyncio
async def test_run_raises_timeout_exception(mocker):
    """
    Testa o cenário de falha onde o httpx lança um Timeout.
    O crawler deve capturar e relançar nossa exceção customizada.
    """
    cnj = "0070337-91.2008.8.06.0001"
    crawler = TJCEFirstInstanceHttpCrawler()
    
    # Configura o mock para levantar um erro de timeout do httpx
    mocker.patch("httpx.AsyncClient.get", side_effect=httpx.TimeoutException("Timeout occurred"))

    # Verifica se a chamada a crawler.run() realmente lança a nossa exceção customizada
    with pytest.raises(CrawlerTimeoutException):
        await crawler.run(cnj)

@pytest.mark.asyncio
async def test_run_invalid_cnj_returns_none(mocker):
    """
    Testa se um CNJ com formato inválido retorna None sem fazer requisições.
    """
    invalid_cnj = "12345"
    crawler = TJCEFirstInstanceHttpCrawler()
    mock_client_get = mocker.patch("httpx.AsyncClient.get")

    result = await crawler.run(invalid_cnj)

    assert result is None
    mock_client_get.assert_not_called() # Garante que nenhuma requisição de rede foi feita
