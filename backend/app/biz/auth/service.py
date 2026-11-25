from sqlalchemy import select
from app.core.orm import AsyncSession, ORM
from app.core.errors import BizError, APIError
from app.core.utils import SecurityUtils, jwt_manager
from app.core.actor import Actor
from app.biz.account.model import Account
from app.biz.account.meta import AccountStatusOpts
from .schema import RspSignIn, RspProfile


def generate_jwt(account_uuid: str, account_status: int) -> RspSignIn:
    if account_status == AccountStatusOpts.DISABLE.value:
        raise BizError(APIError.AUTH_ERR_ACCOUNT_DISABLED)

    access_token = jwt_manager.encode(account_uuid=account_uuid)
    return RspSignIn(access_token=access_token)


class AuthService:
    @staticmethod
    async def password_sign_in(
        session: AsyncSession,
        account: str,
        password: str
    ) -> RspSignIn:
        # 账号全部小写
        account = account.lower()
        orm = ORM(session)

        stmt = select(
            Account.account_uuid,
            Account.account,
            Account.account_status,
            Account.password_hash
        ).where(
            Account.account == account
        ).limit(1)

        acct = await orm.first(stmt)

        # 账号不存在 或 无密码 或 密码不匹配
        if acct is None or len(acct.password_hash) == 0 or not SecurityUtils.password_verify(password, acct.password_hash):
            raise BizError(APIError.AUTH_ERR_PASSWORD_SIGN_IN)

        return generate_jwt(acct.account_uuid, acct.account_status)

    @staticmethod
    async def get_profile(
        actor: Actor
    ) -> RspProfile:
        orm = actor.orm

        stmt = select(
            Account.account,
            Account.nickname,
            Account.email,
            Account.phone_enc,
            Account.avatar_url,
            Account.account_status,
        ).where(
            Account.account_uuid == actor.account_uuid
        ).limit(1)

        profile = await orm.first(stmt)
        if profile:
            phone_masked = SecurityUtils.phone_decrypt(profile.phone_enc)
            data = RspProfile(**profile, phone_masked=phone_masked)
        else:
            raise BizError(APIError.ACCOUNT_ERR_NOT_FOUND)

        return data
