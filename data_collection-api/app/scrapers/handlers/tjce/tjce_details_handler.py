import re
from datetime import datetime
from bs4 import BeautifulSoup
from app.scrapers.handlers.abstract_handler import AbstractHandler

class TJCEDetailsHandler(AbstractHandler):
    def parse(self, soup: BeautifulSoup) -> dict:
        def _clean(text):
            return re.sub(r'\s+', ' ', text).strip() if text else None
        
        # --- CLASSE ---
        classe_element = soup.find(id='classeProcesso')
        classe = None
        if classe_element:
            classe_text = _clean(classe_element.text)
            if classe_text:
                classe = classe_text
            else:
                classe = _clean(classe_element.get('title'))

        # --- AREA ---
        area_element = soup.find(id='areaProcesso')
        area = _clean(area_element.text) if area_element else None

        # --- ASSUNTO ---
        assunto_element = soup.find(id='assuntoProcesso')
        assunto = _clean(assunto_element.text) if assunto_element else None

        # --- JUIZ ---
        juiz_element = soup.find(id='juizProcesso')
        if not juiz_element:
            juiz_element = soup.find(id='relatorProcesso')
        juiz = _clean(juiz_element.text) if juiz_element else None

        # --- DATA DE DISTRIBUIÇÃO ---
        data_dist = None
        dist_element_text = None

        dist_label = soup.find('span', class_='unj-label', string=re.compile(r'Distribuição'))
        if dist_label:
            dist_element = dist_label.find_next_sibling('div')
            if dist_element:
                dist_element_text = dist_element.text

        if not dist_element_text:
            dist_element = soup.find(id='dataHoraDistribuicaoProcesso') or soup.find(id='dataDistribuicaoProcesso')
            if dist_element:
                dist_element_text = dist_element.text
        
        if dist_element_text:
            match = re.search(r'\d{2}/\d{2}/\d{4}', _clean(dist_element_text))
            if match:
                try:
                    data_dist = datetime.strptime(match.group(0), "%d/%m/%Y").date()
                except ValueError:
                    data_dist = None

        # --- VALOR DA ACAO ---

        valor = None
        valor_element = soup.find(id='valorAcaoProcesso')
        if valor_element:
            valor_text = _clean(valor_element.text)
            valor_num = re.sub(r'[^\d,]', '', valor_text).replace(',', '.')
            try:
                valor = float(valor_num)
            except (ValueError, TypeError):
                pass

        return {
            "classe": classe,
            "area": area,
            "assunto": assunto,
            "data_de_distribuicao": data_dist,
            "juiz": juiz,
            "valor_da_acao": valor,
        }

