class InvalidCNJException(Exception):
    """Exception raised when the CNJ number does not follow the valid pattern."""
    def __init__(self, cnj: str):
        self.cnj = cnj

class CrawlerTimeoutException(Exception):
    """Exception raised when the crawler reaches a timeout."""
    def __init__(self, cnj: str, tribunal: str):
        self.cnj = cnj
        self.tribunal = tribunal

class CrawlerNotFoundException(Exception):
    """Exception raised when a crawler is not found for a given court/instance."""
    def __init__(self, tribunal: str, instancia: int):
        self.tribunal = tribunal
        self.instancia = instancia
        super().__init__(f"No crawler found for {self.tribunal} - {self.instancia} instance")

class ScraperNotFoundException(Exception):
    """Exception raised when a scraper is not found for a given court/instance."""
    def __init__(self, tribunal: str, instancia: int):
        self.tribunal = tribunal
        self.instancia = instancia
        super().__init__(f"No scraper found for {self.tribunal} - {self.instancia} instance")

class DatabaseConnectionException(Exception):
    """Exception raised when a database connection failure occurs."""
    def __init__(self, detail: str):
        self.detail = detail

class CourtNotFoundException(Exception):
    def __init__(self, cnj: str):
        self.cnj = cnj
        super().__init__(f"Court not supported for CNJ {self.cnj}")
