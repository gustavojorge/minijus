from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class Party(BaseModel):
    nome: str
    papel: str
    advogado_as: Optional[List[str]] = Field(default=None, alias="advogado(as)")
    
    class Config:
        populate_by_name = True 

class Movement(BaseModel):
    data: date
    movimento: str

class Case(BaseModel):
    tribunal: str 
    classe: Optional[str] = None
    area: Optional[str] = None
    assunto: Optional[str] = None
    data_de_distribuicao: Optional[date] = None
    juiz: Optional[str] = None
    valor_da_acao: Optional[float] = None
    segredo_justica: bool = False
    existe: bool = True
    partes_do_processo: List[Party] = []
    lista_das_movimentacoes: List[Movement] = []
    instancia: int 
    numero_do_processo: Optional[str] = None
