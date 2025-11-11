from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field

class RoleInfo(BaseModel):
    rawValue: str
    normalized: Optional[str] = None

class CourtWrapper(BaseModel):
    rawValue: str = Field(..., description="Código do tribunal")

class RelatedPerson(BaseModel):
    id: str
    nameRaw: Optional[str] = None
    name: str
    role: RoleInfo
    author: Optional[bool] = None

class RepresentedLawyer(BaseModel):
    nameRaw: Optional[str] = None
    name: str
    representedPersonId: Optional[str] = None

class ActivityKB(BaseModel):
    date: int  
    text: str

class KBLawsuit(BaseModel):
    court: CourtWrapper
    nature: str
    kind: str
    subject: str
    sensitiveKind: Optional[str] = None
    distributionDate: int
    judgeName: str
    value: float
    justiceSecret: bool = False
    courtInstance: int
    number: str
    relatedPeople: List[RelatedPerson]
    representedPersonLawyers: List[RepresentedLawyer]
    activities: List[ActivityKB]


REQUIRED_KB_FIELDS = {f for f in KBLawsuit.model_fields.keys()}
