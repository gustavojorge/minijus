import re
from bs4 import BeautifulSoup
from app.scrapers.handlers.abstract_handler import AbstractHandler
from app.models.case_schema import Party

class ESAJPartiesHandler(AbstractHandler):
    def parse(self, soup: BeautifulSoup) -> dict:
        def _clean(text):
            return re.sub(r'\s+', ' ', text).strip() if text else None

        partes = []
        parts_table = soup.find('table', id='tableTodasPartes') or soup.find('table', id='tablePartesPrincipais')

        if parts_table:
            for row in parts_table.find_all('tr'):
                papel_element = row.find('span', class_='tipoDeParticipacao')
                nome_element = row.find('td', class_='nomeParteEAdvogado')

                if papel_element and nome_element:
                    papel = _clean(papel_element.text).replace(':', '')
                    nome = _clean(nome_element.find(string=True, recursive=False))

                    advogados = []
                    advogado_labels = nome_element.find_all('span', string=re.compile(r'Advogad[oa]|Def\. Público|Procurador[a]?'))
                    for label in advogado_labels:
                        if label.next_sibling:
                            adv_name = _clean(label.next_sibling)
                            advogados.append(adv_name)

                    partes.append(Party(nome=nome, papel=papel, advogado_as=advogados if advogados else None))

        return {"partes_do_processo": partes}
