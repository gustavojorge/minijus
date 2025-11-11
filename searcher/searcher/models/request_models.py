from pydantic import BaseModel, Field
from typing import Optional, Literal

class DateFilter(BaseModel):
    date: str = Field(..., description="Data a ser usada no filtro (YYYY-MM-DD)")
    operator: Literal["<", "=", ">"] = Field(..., description="Operador de comparação")

class Filters(BaseModel):
    court: Optional[str] = Field(None, description="Tribunal a ser filtrado")
    date: Optional[DateFilter] = Field(None, description="Filtro de data")

class RequestModel(BaseModel):
    query: str = Field(..., description="Consulta a ser realizada")
    filters: Optional[Filters] = Field(default=None)
    limit: Optional[int] = Field(default=10, description="Limite de resultados")
    offset: Optional[int] = Field(default=0, description="Deslocamento (paginação)")
