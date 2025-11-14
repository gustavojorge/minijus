from app.scrapers.base_court_scraper import BaseCourtScraper
from app.scrapers.handlers.esaj.esaj_parties_handler import ESAJPartiesHandler
from app.scrapers.handlers.esaj.esaj_movements_handler import ESAJMovementsHandler
from app.scrapers.handlers.tjce.tjce_details_handler import TJCEDetailsHandler

class TJCEFirstInstanceScraper(BaseCourtScraper):
    def __init__(self):
        super().__init__(
            tribunal="TJCE",
            instancia=1,
            handlers=[TJCEDetailsHandler(), ESAJPartiesHandler(), ESAJMovementsHandler()]
        )

class TJCESecondInstanceScraper(BaseCourtScraper):
    def __init__(self):
        super().__init__(
            tribunal="TJCE",
            instancia=2,
            handlers=[TJCEDetailsHandler(), ESAJPartiesHandler(), ESAJMovementsHandler()]
        )
