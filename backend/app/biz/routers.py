from fastapi import APIRouter
from .auth.api import api as auth_api
from .account.api import api as acct_api

routers = APIRouter()


for router, prefix, tags in [
    (auth_api, "/auth", ["身份认证"]),
    (acct_api, "/account", ["账号管理"]),
    # (app_api, "/app", ["应用管理"]),
    # (role_api, "/role", ["角色管理"]),
]:
    routers.include_router(router, prefix=prefix, tags=tags)  # type:ignore
