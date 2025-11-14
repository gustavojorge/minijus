import pytest
from app.crawlers.crawler_factory import CrawlerFactory
from app.exceptions.custom_exceptions import CrawlerNotFoundException

# Importa todas as classes de crawler para verificação
from app.crawlers.tjal.httpx.tjal_first_instance_http import TJALFirstInstanceHttpCrawler
from app.crawlers.tjal.httpx.tjal_second_instance_http import TJALSecondInstanceHttpCrawler
from app.crawlers.tjal.playwright.tjal_first_instance import TJALFirstInstanceCrawler as TJALFirstInstanceBrowserCrawler
from app.crawlers.tjal.playwright.tjal_second_instance import TJALSecondInstanceCrawler as TJALSecondInstanceBrowserCrawler
from app.crawlers.tjce.httpx.tjce_first_instance_http import TJCEFirstInstanceHttpCrawler
from app.crawlers.tjce.httpx.tjce_second_instance_http import TJCESecondInstanceHttpCrawler
from app.crawlers.tjce.playwright.tjce_first_instance import TJCEFirstInstanceCrawler as TJCEFirstInstanceBrowserCrawler
from app.crawlers.tjce.playwright.tjce_second_instance import TJCESecondInstanceCrawler as TJCESecondInstanceBrowserCrawler

# --- Testes de Sucesso ---

@pytest.mark.parametrize(
    "tribunal, instancia, strategy, expected_class",
    [
        # Casos do TJAL
        ("TJAL", 1, "httpx", TJALFirstInstanceHttpCrawler),
        ("TJAL", 1, "playwright", TJALFirstInstanceBrowserCrawler),
        ("TJAL", 2, "httpx", TJALSecondInstanceHttpCrawler),
        ("TJAL", 2, "playwright", TJALSecondInstanceBrowserCrawler),
        # Casos do TJCE
        ("TJCE", 1, "httpx", TJCEFirstInstanceHttpCrawler),
        ("TJCE", 1, "playwright", TJCEFirstInstanceBrowserCrawler),
        ("TJCE", 2, "httpx", TJCESecondInstanceHttpCrawler),
        ("TJCE", 2, "playwright", TJCESecondInstanceBrowserCrawler),
    ]
)
def test_get_crawler_success(tribunal, instancia, strategy, expected_class):
    """
    Verifica se a fábrica retorna a instância correta do crawler para cada
    combinação válida de tribunal, instância e estratégia.
    """
    crawler = CrawlerFactory.get_crawler(tribunal, instancia, strategy)
    
    assert isinstance(crawler, expected_class)

# --- Testes de Falha ---

def test_get_crawler_invalid_court():
    """
    Verifica se a fábrica lança CrawlerNotFoundException para um tribunal inválido.
    """
    with pytest.raises(CrawlerNotFoundException):
        CrawlerFactory.get_crawler("TJSP", 1, "httpx")

def test_get_crawler_invalid_instance():
    """
    Verifica se a fábrica lança CrawlerNotFoundException para uma instância inválida.
    """
    with pytest.raises(CrawlerNotFoundException):
        CrawlerFactory.get_crawler("TJAL", 3, "httpx")

def test_get_crawler_invalid_strategy():
    """
    Verifica se a fábrica lança CrawlerNotFoundException para uma estratégia inválida.
    """
    with pytest.raises(CrawlerNotFoundException):
        CrawlerFactory.get_crawler("TJCE", 1, "requests")
