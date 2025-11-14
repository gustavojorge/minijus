from app.scrapers.base_court_scraper import BaseCourtScraper
from app.scrapers.handlers.esaj.esaj_details_handler import ESAJDetailsHandler
from app.scrapers.handlers.esaj.esaj_parties_handler import ESAJPartiesHandler
from app.scrapers.handlers.esaj.esaj_movements_handler import ESAJMovementsHandler

class TJALFirstInstanceScraper(BaseCourtScraper):
    def __init__(self):
        super().__init__(
            tribunal="TJAL",
            instancia=1,
            handlers=[ESAJDetailsHandler(), ESAJPartiesHandler(), ESAJMovementsHandler()]
        )

class TJALSecondInstanceScraper(BaseCourtScraper):
    def __init__(self):
        super().__init__(
            tribunal="TJAL",
            instancia=2,
            handlers=[ESAJDetailsHandler(), ESAJPartiesHandler(), ESAJMovementsHandler()]
        )
