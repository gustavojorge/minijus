from app.crawlers.base_crawlers import BaseBrowserCrawler
from playwright.async_api import TimeoutError as PlaywrightTimeoutError
from app.utils.logging_config import get_logger

logger = get_logger(__name__)

class TJALFirstInstanceCrawler(BaseBrowserCrawler):
    async def navigate(self, page, cnj: str) -> str | None:
        logger.info(f"Navigating to TJAL first instance - CNJ: {cnj}")

        # Navigate to the initial page
        await page.goto("https://www2.tjal.jus.br/cpopg/open.do", timeout=30000)
        logger.debug(f"TJAL search page loaded for {cnj}")

        # Split the CNJ for filling
        first_part = cnj[:15]
        second_part = cnj[-4:]
        logger.debug(f"CNJ split into parts: {first_part} and {second_part}")

        # Fill in the form fields
        await page.get_by_role("textbox", name="Número do processo. Informe").fill(first_part)
        await page.get_by_role("textbox", name="Informe os quatro últimos dí").fill(second_part)
        logger.debug(f"Form fields filled for {cnj}")

        # Submit search
        async with page.expect_navigation():
            await page.get_by_role("button", name="Consultar").click()
        logger.debug(f"Search submitted for {cnj}")

        # Check if the case link is visible
        link_to_case = page.get_by_role("link", name=cnj)
        if await link_to_case.is_visible(timeout=5000):
            logger.info(f"Case link found for {cnj}, clicking...")
            async with page.expect_navigation():
                await link_to_case.click()
        else:
            logger.warning(f"Case link not found for {cnj}")

        # Wait for the details page to load
        try:
            await page.locator("#containerDadosPrincipaisProcesso").wait_for(timeout=15000)
            logger.info(f"Case details loaded successfully for {cnj}")
        except PlaywrightTimeoutError:
            logger.warning(f"Timeout waiting for case details for {cnj}")
            return await page.content()

        content = await page.content()
        logger.debug(f"Page content extracted for {cnj} (size: {len(content)})")
        return content
