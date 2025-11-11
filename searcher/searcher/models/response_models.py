from pydantic import BaseModel, Field
from typing import List, Optional

class RelatedPerson(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None

class Lawyer(BaseModel):
    name: Optional[str] = None

class Activity(BaseModel):
    description: Optional[str] = None
    date: Optional[str] = None

class Lawsuit(BaseModel):
    number: Optional[str] = None
    activities: Optional[List[Activity]] = None
    id: Optional[str] = None
    court: Optional[str] = None
    nature: Optional[str] = None
    kind: Optional[str] = None
    subject: Optional[str] = None
    date: Optional[str] = None
    judge: Optional[str] = None
    value: Optional[float] = None
    related_people: Optional[List[RelatedPerson]] = None
    lawyers: Optional[List[Lawyer]] = None

class ResponseModel(BaseModel):
    hits: int
    lawsuits: List[Lawsuit]
