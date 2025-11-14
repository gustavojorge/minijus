import pytest
import httpx
from unittest.mock import AsyncMock, MagicMock
from app.crawlers.tjal.httpx.tjal_first_instance_http import TJALFirstInstanceHttpCrawler
from app.exceptions.custom_exceptions import CrawlerTimeoutException

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

# Simula a página com um "modal" (input escondido)
HTML_MODAL_PAGE = """
<html>
    <body>
        <h1>Selecione o processo</h1>
        <input name="processoSelecionado" value="CODIGO_DO_PROCESSO_123" />
    </body>
</html>
"""

# Simula a página com uma lista de processos
HTML_LIST_PAGE = """
<html>
    <body>
        <h1>Lista de Processos</h1>
        <a href="/cpopg/show.do?processo.codigo=CODIGO_DA_LISTA_456" class="linkProcesso">
            0705069-74.2019.8.02.0001
        </a>
    </body>
</html>
"""


@pytest.mark.asyncio
async def test_run_direct_success(mocker):
    """
    A busca retorna diretamente a página de detalhes.
    """
    cnj = "0710802-55.2018.8.02.0001"
    crawler = TJALFirstInstanceHttpCrawler()
    
    mock_response = httpx.Response(200, text=HTML_FINAL_PAGE, request=httpx.Request("GET", crawler.url_busca))
    mocker.patch("httpx.AsyncClient.get", return_value=mock_response)

    result_html = await crawler.run(cnj)

    assert result_html == HTML_FINAL_PAGE

@pytest.mark.asyncio
async def test_run_modal_flow(mocker):
    """
    A busca retorna uma página modal
    e o crawler faz uma segunda requisição para obter a página final.
    """
    cnj = "0800171-88.2023.8.02.0001"
    crawler = TJALFirstInstanceHttpCrawler()

    mock_responses = [
        httpx.Response(200, text=HTML_MODAL_PAGE, request=httpx.Request("GET", crawler.url_busca)), # 1ª chamada
        httpx.Response(200, text=HTML_FINAL_PAGE, request=httpx.Request("GET", "https://...")) # 2ª chamada
    ]
    mock_client_get = mocker.patch("httpx.AsyncClient.get", side_effect=mock_responses)

    result_html = await crawler.run(cnj)

    assert result_html == HTML_FINAL_PAGE
    assert mock_client_get.call_count == 2 # Garante que as duas requisições foram feitas

@pytest.mark.asyncio
async def test_run_case_list_flow(mocker):
    """
    A busca retorna uma lista de processos e o crawler
    encontra o link correto e faz uma segunda requisição.
    """
    cnj = "0705069-74.2019.8.02.0001"
    crawler = TJALFirstInstanceHttpCrawler()

    mock_responses = [
        httpx.Response(200, text=HTML_LIST_PAGE, request=httpx.Request("GET", crawler.url_busca)),
        httpx.Response(200, text=HTML_FINAL_PAGE, request=httpx.Request("GET", "https://..."))
    ]
    mock_client_get = mocker.patch("httpx.AsyncClient.get", side_effect=mock_responses)

    result_html = await crawler.run(cnj)

    assert result_html == HTML_FINAL_PAGE
    assert mock_client_get.call_count == 2

@pytest.mark.asyncio
async def test_run_raises_timeout_exception(mocker):
    """
    Testa o cenário de falha onde o httpx lança um Timeout.
    O crawler deve capturar e relançar nossa exceção customizada.
    """
    cnj = "0710802-55.2018.8.02.0001"
    crawler = TJALFirstInstanceHttpCrawler()
    
    mocker.patch("httpx.AsyncClient.get", side_effect=httpx.TimeoutException("Timeout occurred"))

    with pytest.raises(CrawlerTimeoutException):
        await crawler.run(cnj)
