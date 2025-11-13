from __future__ import annotations
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator

class CourtInfo(BaseModel):
    rawValue: Optional[str] = Field(None)

class PersistLawsuit(BaseModel):
    number: str = Field(..., description="Unique lawsuit number")
    court: Optional[CourtInfo] = None
    nature: Optional[str] = None
    kind: Optional[str] = None
    subject: Optional[str] = None
    sensitiveKind: Optional[str] = None
    distributionDate: Optional[Any] = Field(None, description="May be ISO string, epoch or datetime")
    judgeName: Optional[str] = None
    value: Optional[float] = None
    justiceSecret: Optional[bool] = None
    courtInstance: Optional[int] = None
    relatedPeople: List[Dict[str, Any]] = Field(default_factory=list)
    representedPersonLawyers: List[Dict[str, Any]] = Field(default_factory=list)
    activities: List[Dict[str, Any]] = Field(default_factory=list)
    documento_json: Optional[Dict[str, Any]] = Field(None, description="Full raw classified record")

    @field_validator("number")
    @classmethod
    def non_empty_number(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("number must be non-empty")
        return v.strip()

    @field_validator("value")
    @classmethod
    def non_negative_value(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("value cannot be negative")
        return v
