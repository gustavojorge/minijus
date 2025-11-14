from playwright.async_api import TimeoutError as PlaywrightTimeoutError
from app.crawlers.base_crawlers import BaseBrowserCrawler

class TJCEFirstInstanceCrawler(BaseBrowserCrawler):
    async def navigate(self, page, cnj: str) -> str | None:
        await page.goto("https://esaj.tjce.jus.br/cpopg/open.do", timeout=30000)

        first_part = cnj[:15]
        second_part = cnj[-4:]

        await page.get_by_role("textbox", name="Número do processo. Informe").fill(first_part)
        await page.get_by_role("textbox", name="Informe os quatro últimos dí").fill(second_part)

        await page.get_by_role("button", name="Consultar").click()

        try:
            await page.locator("#containerDadosPrincipaisProcesso").wait_for(timeout=15000)
        except PlaywrightTimeoutError:
            return await page.content()

        return await page.content()

