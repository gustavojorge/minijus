from datetime import datetime
from bs4 import BeautifulSoup, Tag
from app.scrapers.handlers.abstract_handler import AbstractHandler
from app.models.case_schema import Movement

class ESAJMovementsHandler(AbstractHandler):
    def parse(self, soup: BeautifulSoup) -> dict:
        def _clean(text):
            return " ".join(text.split()).strip() if text else None

        movimentacoes = []
        moves_table = soup.find('tbody', id='tabelaTodasMovimentacoes')
        if not moves_table:
             moves_table = soup.find('tbody', id='tabelaUltimasMovimentacoes')

        if moves_table:
            for row in moves_table.find_all('tr'):
                cells = row.find_all('td')
                
                if len(cells) >= 3:
                    data_element = cells[0]
                    movimento_element = cells[2]
                    
                    try:
                        data_text = _clean(data_element.get_text())
                        data = datetime.strptime(data_text, "%d/%m/%Y").date()
                    except (ValueError, IndexError):
                        continue
                    
                    movimento = _clean(movimento_element.get_text(separator=' ', strip=True))
                    
                    if data and movimento:
                        movimentacoes.append(Movement(data=data, movimento=movimento))

        return {"lista_das_movimentacoes": movimentacoes}