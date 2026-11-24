from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.biz.routers import routers
from app.core.config import settings
from app.core.errors import BizError
from app.core.schemas import APIResponse


app = FastAPI(**settings.fastapi_kwargs)
app.add_middleware(CORSMiddleware, **settings.cors_kwargs)
app.include_router(routers)


@app.exception_handler(HTTPException)
async def handle_http_exception(req: Request, exc: HTTPException) -> JSONResponse:
    code = exc.status_code
    content = APIResponse(code=code, message=exc.detail).model_dump()
    return JSONResponse(status_code=code, content=content)


@app.exception_handler(RequestValidationError)
async def handle_request_valid_error(req: Request, exc: RequestValidationError) -> JSONResponse:
    code = 422
    errors = exc.errors()
    messages = []

    for error in errors:
        loc = ".".join(str(item) for item in error.get("loc", []))
        msg = error.get("msg", "请求参数错误")
        if loc:
            msg = f"{loc}: {msg}"
        messages.append(msg)

    content = APIResponse(code=code, message="请求参数错误",
                          data=messages).model_dump()
    return JSONResponse(status_code=code, content=content)


@app.exception_handler(BizError)
async def handle_biz_error(req: Request, exc: BizError) -> JSONResponse:
    """BizError的全局统一处理"""
    content = APIResponse(code=exc.code, message=exc.message,
                          data=exc.data).model_dump()
    return JSONResponse(status_code=200, content=content)
