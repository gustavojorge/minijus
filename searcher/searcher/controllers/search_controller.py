from fastapi import APIRouter, HTTPException
from searcher.models.request_models import RequestModel
from searcher.models.response_models import ResponseModel
from searcher.service.search_service import search_in_elastic

router = APIRouter(prefix="/search", tags=["Search"])

@router.post("/", response_model=ResponseModel)
async def search_process(request: RequestModel):
    try:
        response = search_in_elastic(request)
        if response.hits == 0:
            return ResponseModel(hits=0, lawsuits=[])

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error to perform search: {str(e)}")
