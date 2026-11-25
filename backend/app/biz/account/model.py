from sqlalchemy import String, SmallInteger
from app.core.orm import ModelBase, M
from .meta import AccountFields as AF, AccountStatusOpts


class Account(ModelBase):
    __tablename__ = "t_account"
    __table_args__ = (
        {"comment": "账号信息"}
    )

    account_uuid: M[str] = AF.account_uuid.to_mapped_column(String)
    account: M[str] = AF.account.to_mapped_column(String)
    nickname: M[str] = AF.nickname.to_mapped_column(String)
    avatar_url: M[str] = AF.avatar_url.to_mapped_column(String)
    email: M[str] = AF.email.to_mapped_column(String)
    phone_enc: M[str] = AF.phone_enc.to_mapped_column(String)
    account_status: M[AccountStatusOpts] = AF.account_status.to_mapped_column(
        SmallInteger)
    password_hash: M[str] = AF.password_hash.to_mapped_column(String)
