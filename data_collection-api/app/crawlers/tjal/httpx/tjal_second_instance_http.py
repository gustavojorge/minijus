import re
import httpx
from typing import Optional
from bs4 import BeautifulSoup
from app.crawlers.base_crawlers import BaseHttpCrawler
from app.exceptions.custom_exceptions import CrawlerTimeoutException
from app.utils.logging_config import get_logger


logger = get_logger(__name__)

class TJALSecondInstanceHttpCrawler(BaseHttpCrawler):
    def __init__(self, timeout: int = 30):
        super().__init__("TJAL")
        self.timeout = timeout
        self.base_url = "https://www2.tjal.jus.br"
        self.url_busca = f"{self.base_url}/cposg5/search.do"
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
                logger.info(f"Searching for {cnj} process in TJAL 2nd instance")
                response = await client.get(self.url_busca, params=params, headers=self.headers)
                response.raise_for_status()

                final_url = str(response.url)
                logger.info(f"Status {response.status_code} | URL: {final_url}")

                text = response.text
                soup = BeautifulSoup(text, "html.parser")

                # Scenario 1: Direct final page
                if "Movimentações" in text:
                    logger.info("Scenario 1: Direct final page")
                    return text

                # Scenario 2: Modal
                if "search.do" in final_url:
                    logger.info("Scenario 2: Modal")

                    input_tag = soup.find("input", {"name": "processoSelecionado"})
                    if not input_tag:
                        return text

                    processo_codigo = input_tag.get("value")
                    if not processo_codigo:
                        return text

                    url_final = f"https://www2.tjal.jus.br/cposg5/show.do?processo.codigo={processo_codigo}"

                    logger.info(f"Requesting final page: {url_final}")
                    final_response = await client.get(url_final, headers=self.headers)
                    final_response.raise_for_status()

                    return final_response.text
                
                # --- Scenario 3: Case List ---           
                link_processo = soup.find('a', class_='linkProcesso', string=re.compile(cnj))
                if link_processo:
                    logger.info("Scenario 3: Case List")
                    href = link_processo.get("href")
                    if not href:
                        return text

                    url_final = f"{self.base_url}{href}"

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
