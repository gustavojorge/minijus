from abc import ABC, abstractmethod
from playwright.async_api import async_playwright, Page, TimeoutError as PlaywrightTimeoutError
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from app.exceptions.custom_exceptions import CrawlerTimeoutException
from app.utils.logging_config import get_logger

logger = get_logger(__name__)

# --- 1. MAIN ABSTRACT CLASS ---
class BaseCourtCrawler(ABC):
    def __init__(self, court_name: str):
        self.court_name = court_name

    @retry(
        retry=retry_if_exception_type(CrawlerTimeoutException),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1.5, min=2, max=10)
    )
    @abstractmethod
    async def run(self, cnj: str) -> str | None:
        pass

# --- 2. BASE FOR BROWSER CRAWLERS (PLAYWRIGHT) ---
class BaseBrowserCrawler(BaseCourtCrawler):
    def __init__(self, court_name: str, headless: bool = True, slow_mo: int = 0):
        super().__init__(court_name)
        self.headless = headless
        self.slow_mo = slow_mo

    @abstractmethod
    async def navigate(self, page: Page, cnj: str) -> str | None:
        pass

    async def run(self, cnj: str) -> str | None:
        logger.info(f"Run crawler Playwright for {self.court_name} - CNJ: {cnj}")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=self.headless, slow_mo=self.slow_mo)
            page = await browser.new_page()
            try:
                logger.debug(f"Browser initialized for {cnj}")
                result = await self.navigate(page, cnj)
                logger.info(f"Crawler completed successfully for {cnj}")
                return result
                
            except PlaywrightTimeoutError as e:
                logger.warning(f"Playwright timeout for {cnj} - raising CrawlerTimeoutException")
                raise CrawlerTimeoutException(cnj, self.court_name) from e
            except Exception as e:
                logger.error(f"Unexpected error in crawler for {cnj}: {e}")
                raise
            finally:
                await browser.close()
                logger.debug(f"Browser closed for {cnj}")

# --- 3. BASE FOR HTTP CRAWLERS ---
class BaseHttpCrawler(BaseCourtCrawler):
    """Base class for crawlers that use direct HTTP requests."""
    async def run(self, cnj: str) -> str | None:
        logger.info(f"Running HTTP crawler for {self.court_name} - CNJ: {cnj}")
        pass
