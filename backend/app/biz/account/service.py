from sqlalchemy import insert, or_, select
from app.core.actor import Actor
from app.core.utils import SecurityUtils
from app.core.orm import AsyncSession
from app.core.errors import BizError, APIError
from app.core.schemas import PaginationData, Pagination
from .schema import RspCreateAccount, ArgCreateAccount
from .model import Account
from .meta import AccountStatusOpts


async def ensure_account_unique(
    session: AsyncSession,
    account_uuid: str | None = None,
    account: str | None = None,
    phone_enc: str | None = None,
    email: str | None = None,
    is_exclude_uuid: bool = False
) -> None:
    # 构建查询条件
    or_conditions_args = [
        condition for flag, condition in [
            (account, Account.account == account),
            (phone_enc, Account.phone_enc == phone_enc),
            (email, Account.email == email),
            (is_exclude_uuid == False, Account.account_uuid == account_uuid)
        ] if flag
    ]

    if len(or_conditions_args) == 0:
        return

    where_clause_args = []
    if is_exclude_uuid:
        where_clause_args.append(Account.account_uuid != account_uuid)
    where_clause_args.append(or_(*or_conditions_args))

    stmt = select(
        Account.account_uuid,
        Account.account,
        Account.phone_enc,
        Account.email
    ).where(*where_clause_args)
    items = await session.execute(stmt)

    # 核验字段
    check_fields = [
        ("account_uuid", account_uuid),
        ("account", account),
        ("phone_enc", phone_enc),
        ("email", email),
    ]

    existed_fields = []
    for item in items.mappings():
        for field, value in check_fields:
            target = item.get(field, None)
            if target and target == value:
                existed_fields.append(field)

    if existed_fields:
        raise BizError(APIError.ACCOUNT_ERR_UNIQUE, data=existed_fields)


class AccountService:
    @staticmethod
    async def create_account(
        actor: Actor,
        params: ArgCreateAccount,
    ) -> RspCreateAccount:
        session = actor.orm.session

        account_uuid = params.account_uuid
        account = params.account.lower()
        email = params.email
        phone_enc = SecurityUtils.phone_encrypt(params.phone)
        password_hash = SecurityUtils.password_hash(params.password)

        await ensure_account_unique(session, account_uuid, account, phone_enc, email)

        stmt = insert(Account).values(
            account_uuid=account_uuid,
            account=account,
            nickname=params.nickname,
            avatar_url=params.avatar_url,
            email=email,
            phone_enc=phone_enc,
            password_hash=password_hash,
        )
        await session.execute(stmt)

        data = RspCreateAccount(account_uuid=account_uuid)
        return data

    @staticmethod
    async def get_account_list(
        actor: Actor,
        pagination: Pagination,
        nickname: str | None = None,
        account: str | None = None,
        account_status: AccountStatusOpts | None = None
    ) -> PaginationData:
        # 模糊匹配
        where_clause_args = [
            field.icontains(value) for value, field in [
                (nickname, Account.nickname),
                (account, Account.account)
            ] if value
        ]

        # 精准匹配
        if account_status is not None:
            where_clause_args.append(Account.account_status == account_status)

        stmt = select(
            Account.account_uuid,
            Account.account,
            Account.nickname,
            Account.avatar_url,
            Account.phone_enc,
            Account.email,
            Account.account_status,
            Account.created_at,
        ).where(*where_clause_args)

        data = await actor.orm.pagination(
            stmt,
            pagination,
            order_by_args=[Account.created_at.desc()]
        )

        for item in data.items:
            item["phone_masked"] = SecurityUtils.phone_decrypt(
                item["phone_enc"])
        return data
