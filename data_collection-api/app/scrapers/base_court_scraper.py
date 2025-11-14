import re
from bs4 import BeautifulSoup
from app.models.case_schema import Case
import os
import logging

logger = logging.getLogger(__name__)

class BaseCourtScraper:
    def __init__(self, tribunal: str, instancia: int, handlers: list):
        self.tribunal = tribunal
        self.instancia = instancia
        self.handlers = handlers

    def _text_of(self, el):
        if not el:
            return ""
        return " ".join(el.stripped_strings)

    def parse_case(self, html: str, cnj: str) -> Case:

        soup = BeautifulSoup(html, "html.parser")

        # --- Check 1 (HIGHEST PRIORITY): The process doesn't exist? ---
        # 1) Search for element with id returnMessage and analyze its internal text
        not_found_el = soup.find(id="mensagemRetorno")
        if not_found_el:
            text = self._text_of(not_found_el)
            text_norm = re.sub(r"\s+", " ", text).strip()
            if re.search(r"não existem informações disponíveis|não existem informações|informações disponíveis para os parâmetros", text_norm, re.I):
                logger.info(f"Case {cnj} not found in court.")
                return Case(
                    tribunal=self.tribunal,
                    instancia=self.instancia,
                    numero_do_processo=cnj,
                    existe=False,
                    segredo_justica=False
                )
        # 2) Search for text patterns indicating non-existence
        # --- Check 2: If the process exists, is it under judicial secrecy? ---
        moves_table = soup.find('tbody', id='tabelaTodasMovimentacoes') or soup.find('tbody', id='tabelaUltimasMovimentacoes')
        if not moves_table:
            logger.info(f"Case {cnj} is under judicial secrecy (no movements table found).")
            return Case(
                tribunal=self.tribunal,
                instancia=self.instancia,
                numero_do_processo=cnj,
                segredo_justica=True,
                existe=True
            )

        # --- Normal case: run handlers to extract data ---
        logger.info(f"Case {cnj} found. Running handlers to extract data.")
        case_data = {}
        for handler in self.handlers:
            try:
                parsed = handler.parse(soup)
                if isinstance(parsed, dict):
                    case_data.update(parsed)
            except Exception as e:
                logger.warning(f"Handler {handler.__class__.__name__} failed: {e}")

        return Case(
            tribunal=self.tribunal,
            instancia=self.instancia,
            numero_do_processo=cnj,
            segredo_justica=False,
            existe=True,
            **case_data
        )
