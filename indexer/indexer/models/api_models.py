from pydantic import BaseModel, Field
from typing import List, Optional, Any

class IndexDocumentRequest(BaseModel):
    number: str
    court: Optional[Any] = None
    nature: Optional[str] = None
    kind: Optional[str] = None
    subject: Optional[str] = None
    sensitiveKind: Optional[str] = None
    distributionDate: Optional[int] = None
    judgeName: Optional[str] = None
    value: Optional[float] = None
    justiceSecret: Optional[bool] = None
    courtInstance: Optional[int] = None
    relatedPeople: Optional[List[Any]] = None
    representedPersonLawyers: Optional[List[Any]] = None
    activities: Optional[List[Any]] = None

class IndexDocumentResponse(BaseModel):
    id: str
    result: str
    skipped: int
    reason: Optional[str] = None

class IndexDocumentsResponse(BaseModel):
    total_received: int
    prepared: int
    indexed_success: int
    indexed_failed: int
    skipped: int
    errors: Optional[Any] = None
    results: Optional[Any] = None

class DeleteDocumentResponse(BaseModel):
    id: str
    deleted: bool
    result: str

class ErrorResponse(BaseModel):
    detail: str
