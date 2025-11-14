from app.crawlers.tjal.playwright.tjal_first_instance import TJALFirstInstanceCrawler as TJALFirstInstanceBrowserCrawler
from app.crawlers.tjal.playwright.tjal_second_instance import TJALSecondInstanceCrawler as TJALSecondInstanceBrowserCrawler
from app.crawlers.tjce.playwright.tjce_first_instance import TJCEFirstInstanceCrawler as TJCEFirstInstanceBrowserCrawler
from app.crawlers.tjce.playwright.tjce_second_instance import TJCESecondInstanceCrawler as TJCESecondInstanceBrowserCrawler

from app.crawlers.tjal.httpx.tjal_first_instance_http import TJALFirstInstanceHttpCrawler
from app.crawlers.tjal.httpx.tjal_second_instance_http import TJALSecondInstanceHttpCrawler
from app.crawlers.tjce.httpx.tjce_first_instance_http import TJCEFirstInstanceHttpCrawler
from app.crawlers.tjce.httpx.tjce_second_instance_http import TJCESecondInstanceHttpCrawler

from app.exceptions.custom_exceptions import CrawlerNotFoundException

class CrawlerFactory:
    _crawlers = {
        "TJAL": {
            1: {"httpx": TJALFirstInstanceHttpCrawler, "playwright": TJALFirstInstanceBrowserCrawler},
            2: {"httpx": TJALSecondInstanceHttpCrawler, "playwright": TJALSecondInstanceBrowserCrawler},
        },
        "TJCE": {
            1: {"httpx": TJCEFirstInstanceHttpCrawler, "playwright": TJCEFirstInstanceBrowserCrawler},
            2: {"httpx": TJCESecondInstanceHttpCrawler, "playwright": TJCESecondInstanceBrowserCrawler},
        },
    }

    @staticmethod
    def get_crawler(tribunal: str, instancia: int, strategy: str):
        try:
            CrawlerClass = CrawlerFactory._crawlers[tribunal.upper()][instancia][strategy]
            
            if strategy == "httpx":
                return CrawlerClass()
            elif strategy == "playwright":
                return CrawlerClass(tribunal.upper(), headless=True)
            else:
                raise CrawlerNotFoundException(tribunal=tribunal, instancia=instancia)

        except KeyError:
            raise CrawlerNotFoundException(tribunal=tribunal, instancia=instancia)


