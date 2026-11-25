from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.schemas import APIResponse
from app.core.utils import SecurityUtils
from app.biz.deps import get_session, get_actor
from .service import AuthService
from .schema import (
    ReqSignInByPassword,
    RspSignIn,
    RspProfile,
)

api = APIRouter()


@api.post("/docs-login", summary="Swagger登录用")
async def swagger_login(
    req=Depends(OAuth2PasswordRequestForm),
    session=Depends(get_session)
) -> dict:
    data = await AuthService.password_sign_in(session, req.username, req.password)
    return {"access_token": data.access_token, "token_type": "bearer"}


@api.get("/public_key", summary="获取公钥信息")
async def get_public_key() -> APIResponse:
    data = settings.private_key.public_key().export_key().decode()
    return APIResponse(data=data)


@api.post("/sign_in", summary="账密登录")
async def sign_in(
    req: ReqSignInByPassword,
    session=Depends(get_session)
) -> APIResponse[RspSignIn]:
    password = SecurityUtils.req_params_decrypt(req.password_encrypted)
    data = await AuthService.password_sign_in(session, req.account, password)
    return APIResponse(data=data)


@api.get("/profile", summary="获取账号信息")
async def get_profile(
    actor=Depends(get_actor)
) -> APIResponse[RspProfile]:
    data = await AuthService.get_profile(actor)
    return APIResponse(data=data)
