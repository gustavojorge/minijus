from app.crawlers.base_crawlers import BaseBrowserCrawler
from playwright.async_api import TimeoutError as PlaywrightTimeoutError
import logging

logger = logging.getLogger(__name__)

class TJALSecondInstanceCrawler(BaseBrowserCrawler):
    async def navigate(self, page, cnj: str) -> str | None:
        await page.goto("https://www2.tjal.jus.br/cposg5/open.do", timeout=30000)

        first_part = cnj[:15]
        second_part = cnj[-4:]

        await page.get_by_role("textbox", name="Número do processo. Informe").fill(first_part)
        await page.get_by_role("textbox", name="Informe os quatro últimos dí").fill(second_part)            
        await page.get_by_role("button", name="Consultar").click()
        
        await page.wait_for_timeout(600)

        modal_container = page.locator("div").filter(has_text="Selecione o processo").nth(2)
        if await modal_container.is_visible(timeout=4000):
            logger.info("Incident modal detected.")
            await page.locator("#modalIncidentes").get_by_role("radio").check()
            await page.get_by_role("button", name="Selecionar").click()

        try:
            await page.get_by_role("heading", name="Partes do Processo").wait_for(timeout=15000)
        except PlaywrightTimeoutError:
            return await page.content()

        return await page.content()
