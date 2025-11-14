import re
import httpx
from typing import Optional
from bs4 import BeautifulSoup
from app.crawlers.base_crawlers import BaseHttpCrawler
from app.exceptions.custom_exceptions import CrawlerTimeoutException
from app.utils.logging_config import get_logger

logger = get_logger(__name__)

class TJCEFirstInstanceHttpCrawler(BaseHttpCrawler):

    def __init__(self, timeout: int = 30):
        super().__init__("TJCE")
        self.timeout = timeout
        self.url_busca = "https://esaj.tjce.jus.br/cpopg/search.do"
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            )
        }

    async def run(self, cnj: str) -> Optional[str]:

        padrao_cnj = re.compile(r"^(\d{7}-\d{2}\.\d{4})\.\d\.\d{2}\.(\d{4})$")
        match = padrao_cnj.match(cnj)
        if not match:
            logger.warning(f"Invalid CNJ: {cnj}")
            return None

        numero_unificado, foro = match.group(1), match.group(2)

        params = {
            "conversationId": "",
            "cbPesquisa": "NUMPROC",
            "numeroDigitoAnoUnificado": numero_unificado,
            "foroNumeroUnificado": foro,
            "dePesquisaNuUnificado": [cnj, "UNIFICADO"],
            "dePesquisa": cnj,
            "tipoNuProcesso": "UNIFICADO",
        }

        async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
            try:
                logger.info(f"Searching for {cnj} process in TJCE 1st instance")
                response = await client.get(self.url_busca, params=params, headers=self.headers)
                response.raise_for_status()

                final_url = str(response.url)
                logger.info(f"Status {response.status_code} | URL: {final_url}")

                text = response.text
                soup = BeautifulSoup(text, "html.parser")

                # Scenario 1: Direct final page
                if soup.find(id="containerDadosPrincipaisProcesso"):
                    logger.info("Scenario 1: Direct final page")
                    return text

                # Scenario 2: Modal
                if "search.do" in final_url:
                    logger.info("Scenario 2: Modal")
                    soup = BeautifulSoup(text, "html.parser")

                    input_tag = soup.find("input", {"name": "processoSelecionado"})
                    if not input_tag:
                        return text

                    processo_codigo = input_tag.get("value")
                    if not processo_codigo:
                        return text

                    url_final = f"https://esaj.tjce.jus.br/cpopg/show.do?processo.codigo={processo_codigo}"

                    logger.info(f"Requesting final page: {url_final}")
                    final_response = await client.get(url_final, headers=self.headers)
                    final_response.raise_for_status()

                    return final_response.text

                return text

            except httpx.RequestError as e:
                logger.warning(f"HTTPX request error for CNJ {cnj}: {e}")
                raise CrawlerTimeoutException(cnj, self.court_name) from e
            except Exception as e:
                logger.error(f"Unexpected error in HTTPX crawler: {e}", exc_info=True)
                return None
