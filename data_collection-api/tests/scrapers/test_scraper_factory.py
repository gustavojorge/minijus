import pytest
from app.scrapers.scraper_factory import ScraperFactory
from app.exceptions.custom_exceptions import ScraperNotFoundException

# Importa todas as classes de scraper para verificação
from app.scrapers.tjal_scrapers import TJALFirstInstanceScraper, TJALSecondInstanceScraper
from app.scrapers.tjce_scrapers import TJCEFirstInstanceScraper, TJCESecondInstanceScraper


# --- Testes de Sucesso ---

# Este decorador permite rodar o mesmo teste com diferentes parâmetros,
# tornando o código mais limpo e evitando repetição.
@pytest.mark.parametrize(
    "tribunal, instancia, expected_class",
    [
        # Casos do TJAL
        ("TJAL", 1, TJALFirstInstanceScraper),
        ("TJAL", 2, TJALSecondInstanceScraper),
        # Casos do TJCE
        ("TJCE", 1, TJCEFirstInstanceScraper),
        ("TJCE", 2, TJCESecondInstanceScraper),
    ]
)
def test_get_scraper_success(tribunal, instancia, expected_class):
    """
    Verifica se a fábrica retorna a classe de scraper correta para cada
    combinação válida de tribunal e instância.
    """
    # 1. Act (Ação)
    ScraperClass = ScraperFactory.get_scraper(tribunal, instancia)
    
    # 2. Assert (Verificação)
    assert ScraperClass == expected_class

# --- Testes de Falha ---

def test_get_scraper_invalid_court():
    """
    Verifica se a fábrica lança ScraperNotFoundException para um tribunal inválido.
    """
    with pytest.raises(ScraperNotFoundException):
        ScraperFactory.get_scraper("TJSP", 1)

def test_get_scraper_invalid_instance():
    """
    Verifica se a fábrica lança ScraperNotFoundException para uma instância inválida.
    """
    with pytest.raises(ScraperNotFoundException):
        ScraperFactory.get_scraper("TJAL", 3)

def test_get_scraper_case_insensitive():
    """
    Verifica se a fábrica funciona corretamente com o nome do tribunal em minúsculas.
    """
    ScraperClass = ScraperFactory.get_scraper("tjal", 1)
    assert ScraperClass == TJALFirstInstanceScraper
