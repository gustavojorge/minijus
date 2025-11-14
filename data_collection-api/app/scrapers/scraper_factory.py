from app.scrapers.tjal_scrapers import TJALFirstInstanceScraper, TJALSecondInstanceScraper
from app.scrapers.tjce_scrapers import TJCEFirstInstanceScraper, TJCESecondInstanceScraper
from app.exceptions.custom_exceptions import ScraperNotFoundException

class ScraperFactory:
    @staticmethod
    def get_scraper(court: str, instance: int):
        court = court.upper()

        mapping = {
            ("TJAL", 1): TJALFirstInstanceScraper,
            ("TJAL", 2): TJALSecondInstanceScraper,
            ("TJCE", 1): TJCEFirstInstanceScraper,
            ("TJCE", 2): TJCESecondInstanceScraper,
        }

        scraper_class = mapping.get((court, instance))
        if not scraper_class:
            raise ScraperNotFoundException(tribunal=court, instancia=instance)

        return scraper_class
