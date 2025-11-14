from typing import List
from app.crawlers.crawler_factory import CrawlerFactory
from app.scrapers.scraper_factory import ScraperFactory
from app.models.case_schema import Case
from app.repositories.case_repository import get_cached_cases, save_case
from app.utils.cnj_utils import detect_tribunal_from_cnj
from app.exceptions.custom_exceptions import CrawlerNotFoundException, CrawlerTimeoutException, ScraperNotFoundException
from app.utils.logging_config import get_logger

logger = get_logger(__name__)

async def get_lawsuit_data(lawsuit_number: str, max_cache_age_seconds: int) -> List[Case]:
    tribunal = detect_tribunal_from_cnj(lawsuit_number)
    logger.info(f"Starting data collection for {lawsuit_number} - Court: {tribunal}")
    
    cached = get_cached_cases(lawsuit_number, max_cache_age_seconds)
    if cached:
        logger.info(f"Cache HIT for the case {lawsuit_number}")
        return cached
    else:
        logger.info(f"Cache MISS for the case {lawsuit_number} - executing crawler/scraper")

    results: List[Case] = []

    for instancia in [1, 2]:
        logger.info(f"Processing {instancia}ª instance for {lawsuit_number}")
        
        html = None
        try:
            # Try HTTPX first
            try:
                logger.debug(f"Trying HTTPX crawler for {tribunal} {instancia}ª instance")
                http_crawler = CrawlerFactory.get_crawler(tribunal, instancia, strategy="httpx")
                html = await http_crawler.run(lawsuit_number)
                logger.info(f"HTTPX crawler executed successfully for {tribunal} {instancia}ª instance")
            except CrawlerNotFoundException:
                logger.warning(f"HTTPX crawler not found for {tribunal} {instancia}ª instance")
            except CrawlerTimeoutException:
                logger.warning(f"Timeout in HTTPX crawler for {tribunal} {instancia}ª instance")
            except Exception as e:
                logger.warning(f"Failed HTTPX crawler for {tribunal} {instancia}ª instance: {e}")

            # Fallback to Playwright if HTTPX failed
            if not html:
                try:
                    logger.debug(f"Fallback: trying Playwright crawler for {tribunal} {instancia}ª instance")
                    pw_crawler = CrawlerFactory.get_crawler(tribunal, instancia, strategy="playwright")
                    html = await pw_crawler.run(lawsuit_number)
                    logger.info(f"Playwright crawler executed successfully for {tribunal} {instancia}ª instance")
                except CrawlerNotFoundException:
                    logger.error(f"No crawler found for {tribunal} {instancia}ª instance")
                except CrawlerTimeoutException:
                    logger.warning(f"Timeout in Playwright crawler for {tribunal} {instancia}ª instance")
                except Exception as e:
                    logger.warning(f"Failed Playwright crawler for {tribunal} {instancia}ª instance: {e}")

            ScraperClass = ScraperFactory.get_scraper(tribunal, instancia)
            scraper = ScraperClass()
            case = scraper.parse_case(html or "", lawsuit_number)
            logger.debug(f"Case parsed for {tribunal} {instancia}ª instance")

            try:
                save_case(case)
                logger.info(f"Data for {instancia}ª instance saved to database")
            except Exception as e:
                logger.error(f"Failed to save to database: {e}")

            results.append(case)
            logger.info(f"{instancia}ª instance processed successfully for {lawsuit_number}")

        except (CrawlerNotFoundException, ScraperNotFoundException) as e:
            logger.info(f"Skipping {instancia}ª instance: {e}")
            continue
        except CrawlerTimeoutException:
            logger.error(f"Timeout while processing {lawsuit_number} in {instancia}ª instance")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while processing {lawsuit_number} in {instancia}ª instance: {e}")

    logger.info(f"Data collection completed for {lawsuit_number} - {len(results)} cases returned")
    return results  