from __future__ import annotations
from typing import Optional, List
from pydantic import BaseModel, Field, validator

class Court(BaseModel):
    rawValue: Optional[str] = Field(default=None, description="Raw tribunal value")

class Role(BaseModel):
    rawValue: str = Field(default="", description="Original role string")
    normalized: str = Field(default="", description="Normalized role string")

class RelatedPerson(BaseModel):
    id: str = Field(..., description="Unique identifier for the related person")
    nameRaw: str = Field(default="", description="Raw name as received")
    name: str = Field(default="", description="Normalized name")
    role: Role
    author: bool = Field(default=False, description="Whether this person is an author/requerente")

class RepresentedPersonLawyer(BaseModel):
    nameRaw: str = Field(default="", description="Raw lawyer name")
    name: str = Field(default="", description="Normalized lawyer name")
    representedPersonId: str = Field(..., description="ID of the person represented by this lawyer")

class Activity(BaseModel):
    date: Optional[int] = Field(None, description="Unix timestamp (UTC) for the movement date")
    text: str = Field(default="", description="Movement description")

class Lawsuit(BaseModel):
    court: Court
    nature: Optional[str] = None
    kind: Optional[str] = None
    subject: Optional[str] = None
    distributionDate: Optional[int] = Field(None, description="Unix timestamp of distribution date")
    judgeName: Optional[str] = None
    value: Optional[float] = None
    justiceSecret: Optional[bool] = None
    courtInstance: Optional[int] = None
    number: str = Field(..., description="Process number")
    relatedPeople: List[RelatedPerson] = Field(default_factory=list)
    representedPersonLawyers: List[RepresentedPersonLawyer] = Field(default_factory=list)
    activities: List[Activity] = Field(default_factory=list)

    @validator("number")
    def validate_number(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("number must be a non-empty string")
        return v

    @validator("value")
    def non_negative_value(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("value cannot be negative")
        return v

    @validator("distributionDate")
    def valid_timestamp(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("distributionDate timestamp must be non-negative")
        return v
