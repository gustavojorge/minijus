from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel

class LawyerES(BaseModel):
    name: str

class RelatedPersonES(BaseModel):
    name: str
    role: Optional[str] = None

class ActivityES(BaseModel):
    date: Optional[str] = None
    description: str

class LawsuitES(BaseModel):
    number: str
    date: Optional[str] = None
    court: str
    judge: str
    kind: str
    lawyers: List[LawyerES]
    nature: str
    related_people: List[RelatedPersonES]
    subject: str
    value: float | None = None
    activities: List[ActivityES]
