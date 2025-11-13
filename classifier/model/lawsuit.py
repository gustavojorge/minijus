from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class ClassifiedLawsuitBase(BaseModel):
    number: str = Field(..., description="Process number")
    subject: Optional[str] = Field(None, description="Original subject before classification")

    @field_validator("number")
    @classmethod
    def non_empty_number(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("number must be non-empty")
        return v.strip()

class ClassifiedLawsuit(ClassifiedLawsuitBase):
    sensitiveKind: Optional[str] = Field(None, description="Detected sensitive category")
