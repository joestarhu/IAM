from pydantic import BaseModel
from .meta import AccountFields as AF


class ReqCreateAccount(BaseModel):
    """创建账号请求"""
    account: str = AF.account.to_field()
    nickname: str = AF.nickname.to_field()
    password_encrypted: str = AF.password_encrypted.to_field()
    avatar_url: str = AF.avatar_url.to_field(default="")
    email: str = AF.email.to_field(default="")
    phone: str = AF.phone.to_field(default="")


class ArgCreateAccount(BaseModel):
    account_uuid: str = AF.account_uuid.to_field()
    account: str = AF.account.to_field()
    nickname: str = AF.nickname.to_field()
    avatar_url: str = AF.avatar_url.to_field(default="")
    email: str = AF.email.to_field(default="")
    phone: str = AF.phone.to_field(default="")
    password: str = AF.password.to_field(default="")


class RspCreateAccount(BaseModel):
    """创建账号返回"""
    account_uuid: str = AF.account_uuid.to_field()
