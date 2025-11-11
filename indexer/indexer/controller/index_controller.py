from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi import Body
from ..services.indexing_service import (
    index_from_db_service,
    index_single_document_service,
    index_multiple_documents_service,
    delete_document_service,
)
from ..services.validation_service import ValidationError
from ..models.api_models import (
    IndexDocumentRequest, IndexDocumentResponse, IndexDocumentsResponse, DeleteDocumentResponse, ErrorResponse
)

router = APIRouter(prefix="/index", tags=["index"])

@router.post("/db", response_model=IndexDocumentsResponse, responses={500: {"model": ErrorResponse}})
def index_db():
    result = index_from_db_service()
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/document", response_model=IndexDocumentResponse, responses={400: {"model": ErrorResponse}})
def index_document(body: IndexDocumentRequest = Body(...)):
    try:
        return index_single_document_service(body.dict())
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/documents", response_model=IndexDocumentsResponse, responses={400: {"model": ErrorResponse}})
def index_documents(body: list[IndexDocumentRequest] = Body(...)):
    try:
        return index_multiple_documents_service([doc.dict() for doc in body])
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/document/{doc_id}", response_model=DeleteDocumentResponse, responses={404: {"model": ErrorResponse}})
def delete_document(doc_id: str):
    resp = delete_document_service(doc_id)
    if not resp.get("deleted"):
        raise HTTPException(status_code=404, detail="Document not found")
    return resp
