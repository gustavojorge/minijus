import pytest
import httpx
from unittest.mock import AsyncMock, MagicMock
from app.crawlers.tjal.httpx.tjal_second_instance_http import TJALSecondInstanceHttpCrawler
from app.exceptions.custom_exceptions import CrawlerTimeoutException

HTML_FINAL_PAGE = """
<html>
    <body>
        <div id="containerDadosPrincipaisProcesso">
            <h1>Detalhes do Processo de 2ª Instância</h1>
        </div>
    </body>
</html>
"""

HTML_MODAL_PAGE = """
<html>
    <body>
        <h1>Selecione o processo</h1>
        <input name="processoSelecionado" value="CODIGO_DO_PROCESSO_SG_123" />
    </body>
</html>
"""


@pytest.mark.asyncio
async def test_run_direct_success_second_instance(mocker):
    """
    A busca na 2ª instância retorna diretamente a página de detalhes.
    """
    cnj = "0710802-55.2018.8.02.0001"
    crawler = TJALSecondInstanceHttpCrawler()
    
    mock_response = httpx.Response(200, text=HTML_FINAL_PAGE, request=httpx.Request("GET", crawler.url_busca))
    mocker.patch("httpx.AsyncClient.get", return_value=mock_response)

    result_html = await crawler.run(cnj)

    assert result_html == HTML_FINAL_PAGE

@pytest.mark.asyncio
async def test_run_modal_flow_second_instance(mocker):
    """
    A busca na 2ª instância retorna uma página de modal.
    """
    cnj = "0800171-88.2023.8.02.0001"
    crawler = TJALSecondInstanceHttpCrawler()

    mock_responses = [
        httpx.Response(200, text=HTML_MODAL_PAGE, request=httpx.Request("GET", crawler.url_busca)),
        httpx.Response(200, text=HTML_FINAL_PAGE, request=httpx.Request("GET", "https://..."))
    ]
    mock_client_get = mocker.patch("httpx.AsyncClient.get", side_effect=mock_responses)

    result_html = await crawler.run(cnj)

    assert result_html == HTML_FINAL_PAGE
    assert mock_client_get.call_count == 2

@pytest.mark.asyncio
async def test_run_raises_timeout_exception_second_instance(mocker):
    """
    Testa o cenário de falha por Timeout para a 2ª instância.
    """
    cnj = "0710802-55.2018.8.02.0001"
    crawler = TJALSecondInstanceHttpCrawler()
    mocker.patch("httpx.AsyncClient.get", side_effect=httpx.TimeoutException("Timeout occurred"))

    with pytest.raises(CrawlerTimeoutException):
        await crawler.run(cnj)