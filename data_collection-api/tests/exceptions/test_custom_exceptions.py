import pytest
from app.exceptions.custom_exceptions import (
    InvalidCNJException,
    CrawlerTimeoutException,
    CrawlerNotFoundException,
    ScraperNotFoundException,
    DatabaseConnectionException,
    CourtNotFoundException,
)

def test_invalid_cnj_exception():
    """Verifica se InvalidCNJException armazena o CNJ corretamente."""
    cnj = "12345"
    with pytest.raises(InvalidCNJException) as exc_info:
        raise InvalidCNJException(cnj=cnj)
    
    assert exc_info.value.cnj == cnj

def test_crawler_timeout_exception():
    """Verifica se CrawlerTimeoutException armazena o CNJ e o tribunal."""
    cnj = "0710802-55.2018.8.02.0001"
    tribunal = "TJAL"
    with pytest.raises(CrawlerTimeoutException) as exc_info:
        raise CrawlerTimeoutException(cnj=cnj, tribunal=tribunal)
    
    assert exc_info.value.cnj == cnj
    assert exc_info.value.tribunal == tribunal

def test_crawler_not_found_exception():
    """Verifica se CrawlerNotFoundException armazena o tribunal e a instância."""
    tribunal = "TJAL"
    instancia = 1
    with pytest.raises(CrawlerNotFoundException) as exc_info:
        raise CrawlerNotFoundException(tribunal=tribunal, instancia=instancia)
    
    assert exc_info.value.tribunal == tribunal
    assert exc_info.value.instancia == instancia
    assert str(exc_info.value) == f"Nenhum crawler encontrado para {tribunal} - {instancia}ª instância"

def test_scraper_not_found_exception():
    """Verifica se ScraperNotFoundException armazena o tribunal e a instância."""
    tribunal = "TJCE"
    instancia = 2
    with pytest.raises(ScraperNotFoundException) as exc_info:
        raise ScraperNotFoundException(tribunal=tribunal, instancia=instancia)
    
    assert exc_info.value.tribunal == tribunal
    assert exc_info.value.instancia == instancia
    assert str(exc_info.value) == f"Nenhum scraper encontrado para {tribunal} - {instancia}ª instância"

def test_database_connection_exception():
    """Verifica se DatabaseConnectionException armazena o detalhe do erro."""
    detail = "Connection timed out"
    with pytest.raises(DatabaseConnectionException) as exc_info:
        raise DatabaseConnectionException(detail=detail)
    
    assert exc_info.value.detail == detail

def test_court_not_found_exception():
    """Verifica se CourtNotFoundException armazena o CNJ."""
    cnj = "0000000-00.2023.8.99.0001"
    with pytest.raises(CourtNotFoundException) as exc_info:
        raise CourtNotFoundException(cnj=cnj)
    
    assert exc_info.value.cnj == cnj
    assert str(exc_info.value) == f"Tribunal não suportado para o CNJ {cnj}"
