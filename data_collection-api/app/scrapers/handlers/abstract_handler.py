from abc import ABC, abstractmethod
from bs4 import BeautifulSoup

class AbstractHandler(ABC):
    @abstractmethod
    def parse(self, soup: BeautifulSoup) -> dict:
        pass