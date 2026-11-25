from fastapi import APIRouter, Security, Depends
from app.core.meta import APIResource
from app.core.schemas import APIResponse, PaginationData
from app.core.utils import SecurityUtils, UUIDGenUtils
from app.biz.deps import get_actor, get_pagination
from .service import AccountService
from .meta import AccountStatusOpts
from .schema import (
    ReqCreateAccount,
    RspCreateAccount,
    ArgCreateAccount,
)

api = APIRouter()
res = [
    LIST := APIResource("/list", "获取账号列表信息", "account:list"),
    CREATE := APIResource("/create", "创建账号", "account:create"),
]


@api.post(**CREATE.method_kwargs)
async def create_account(
    req: ReqCreateAccount,
    actor=Security(get_actor, scopes=CREATE.scopes)
) -> APIResponse[RspCreateAccount]:
    password = SecurityUtils.req_params_decrypt(req.password_encrypted)

    params = ArgCreateAccount(
        account_uuid=UUIDGenUtils.gen_account(),
        password=password,
        **req.model_dump()
    )

    data = await AccountService.create_account(actor, params)
    return APIResponse(data=data)


@api.get(**LIST.method_kwargs)
async def get_account_list(
    nickname: str | None = None,
    account: str | None = None,
    account_status: AccountStatusOpts | None = None,
    actor=Security(get_actor, scopes=LIST.scopes),
    pagination=Depends(get_pagination)
) -> APIResponse[PaginationData]:
    data = await AccountService.get_account_list(actor, pagination, nickname, account, account_status)
    return APIResponse(data=data)
