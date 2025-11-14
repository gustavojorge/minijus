from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions.custom_exceptions import (
    InvalidCNJException,
    CrawlerTimeoutException,
    DatabaseConnectionException,
    CrawlerNotFoundException,
    ScraperNotFoundException,
    CourtNotFoundException,
)

def register_error_handlers(app):

    @app.exception_handler(InvalidCNJException)
    async def invalid_cnj_handler(request: Request, exc: InvalidCNJException):
        return JSONResponse(
            status_code=400,
            content={
                "error_code": "INVALID_CNJ",
                "message": "Invalid CNJ number.",
                "detail": f"Received: {exc.cnj}",
            },
        )

    @app.exception_handler(CrawlerTimeoutException)
    async def crawler_timeout_handler(request: Request, exc: CrawlerTimeoutException):
        return JSONResponse(
            status_code=504,
            content={
                "error_code": "CRAWLER_TIMEOUT",
                "message": f"The crawler for court {exc.tribunal} timed out.",
                "detail": f"Case: {exc.cnj}",
            },
        )
    
    @app.exception_handler(CrawlerNotFoundException)
    async def crawler_not_found_handler(request: Request, exc: CrawlerNotFoundException):
        return JSONResponse(
            status_code=501, 
            content={
                "error_code": "CRAWLER_NOT_IMPLEMENTED",
                "message": "Collection for this court/instance has not yet been implemented.",
                "detail": f"Court: {exc.tribunal}, Instance: {exc.instancia}",
            },
        )

    @app.exception_handler(DatabaseConnectionException)
    async def database_connection_handler(request: Request, exc: DatabaseConnectionException):
        return JSONResponse(
            status_code=500,
            content={
                "error_code": "DB_CONNECTION_ERROR",
                "message": "Failed to connect to database.",
                "detail": exc.detail,
            },
        )
    
    @app.exception_handler(CourtNotFoundException)
    async def court_not_found_handler(request: Request, exc: CourtNotFoundException):
        return JSONResponse(
            status_code=400,
            content={
                "error_code": "UNSUPPORTED_COURT",
                "message": "The court extracted from the CNJ is not supported by the application.",
                "detail": f"Case: {exc.cnj}",
            },
        )

    @app.exception_handler(ScraperNotFoundException)
    async def scraper_not_found_handler(request: Request, exc: ScraperNotFoundException):
        return JSONResponse(
            status_code=501, 
            content={
                "error_code": "SCRAPER_NOT_IMPLEMENTED",
                "message": "The scraper for this court/instance has not yet been implemented.",
                "detail": f"Court: {exc.tribunal}, Instance: {exc.instancia}",
            },
        )
