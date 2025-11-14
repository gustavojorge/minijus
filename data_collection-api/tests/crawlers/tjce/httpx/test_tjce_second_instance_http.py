import pytest
import httpx
from unittest.mock import AsyncMock
from app.crawlers.tjce.httpx.tjce_second_instance_http import TJCESecondInstanceHttpCrawler
from app.exceptions.custom_exceptions import CrawlerTimeoutException

# --- MOCK HTMLs PARA SIMULAR AS RESPOSTAS DO SITE ---

# Simula a página final de detalhes do processo
HTML_FINAL_PAGE = """
<html>
    <body>
        <div id="containerDadosPrincipaisProcesso">
            <h1>Detalhes do Processo de 2ª Instância</h1>
        </div>
    </body>
</html>
"""

# Simula a página de desambiguação com um "modal" (input escondido)
HTML_MODAL_PAGE = """
<html>
    <body>
        <h1>Selecione o processo</h1>
        <form>
            <input name="processoSelecionado" value="CODIGO_DO_PROCESSO_SG_123" />
        </form>
    </body>
</html>
"""

# --- INÍCIO DOS TESTES ---

@pytest.mark.asyncio
async def test_run_direct_success_second_instance(mocker):
    """
    Testa o Cenário 1: A busca na 2ª instância retorna diretamente a página de detalhes.
    """
    cnj = "0070337-91.2008.8.06.0001"
    crawler = TJCESecondInstanceHttpCrawler()
    
    # Mocka a resposta do httpx para simular o sucesso direto
    # Nota: O crawler do TJCE verifica por "Movimentações", então garantimos que está no HTML
    html_final_com_movimentacoes = HTML_FINAL_PAGE.replace("</h1>", "</h1><p>Movimentações</p>")
    mock_response = httpx.Response(200, text=html_final_com_movimentacoes, request=httpx.Request("GET", crawler.url_busca))
    mocker.patch("httpx.AsyncClient.get", return_value=mock_response)

    result_html = await crawler.run(cnj)

    assert result_html == html_final_com_movimentacoes


@pytest.mark.asyncio
async def test_run_raises_timeout_exception_second_instance(mocker):
    """
    Testa o cenário de falha por Timeout para a 2ª instância.
    """
    cnj = "0710802-55.2018.8.06.0001"
    crawler = TJCESecondInstanceHttpCrawler()
    
    # Configura o mock para levantar um erro de timeout do httpx
    mocker.patch("httpx.AsyncClient.get", side_effect=httpx.TimeoutException("Timeout occurred"))

    # Verifica se a chamada a crawler.run() realmente lança a nossa exceção customizada
    with pytest.raises(CrawlerTimeoutException):
        await crawler.run(cnj)
