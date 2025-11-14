import pytest
from pathlib import Path
from app.scrapers.base_court_scraper import BaseCourtScraper
from app.models.case_schema import Case

FIXTURES = Path(__file__).parent.parent / "fixtures"

class DummyHandler:
    def parse(self, soup):
        return {"classe": "Cível", "juiz": "Dr. Teste"}

def test_case_not_found():
    html = (FIXTURES / "case_not_found.html").read_text(encoding="utf-8")
    scraper = BaseCourtScraper("TJCE", 1, handlers=[])
    case = scraper.parse_case(html, "0000000-00.0000.0.00.0000")
    assert isinstance(case, Case)
    assert case.existe is False
    assert case.segredo_justica is False

def test_case_under_secrecy():
    html = (FIXTURES / "case_under_secrecy.html").read_text(encoding="utf-8")
    scraper = BaseCourtScraper("TJAL", 2, handlers=[])
    case = scraper.parse_case(html, "1111111-11.2024.8.00.0000")
    assert case.existe is True
    assert case.segredo_justica is True

def test_case_normal_with_handler():
    html = (FIXTURES / "case_normal.html").read_text(encoding="utf-8")
    scraper = BaseCourtScraper("TJAL", 1, handlers=[DummyHandler()])
    case = scraper.parse_case(html, "2222222-22.2024.8.00.0000")
    assert case.existe is True
    assert case.segredo_justica is False
    assert case.classe == "Cível"
    assert case.juiz == "Dr. Teste"
