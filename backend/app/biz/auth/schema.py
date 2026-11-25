from pydantic import BaseModel, Field
from app.biz.account.meta import AccountFields as AF, AccountStatusOpts


class ReqSignInByPassword(BaseModel):
    account: str = AF.account.to_field_desc()
    password_encrypted: str = AF.password_encrypted.to_field_desc()


class RspSignIn(BaseModel):
    access_token: str = Field(description="Access Token")


class RspProfile(BaseModel):
    account: str = AF.account.to_field_desc()
    nickname: str = AF.nickname.to_field_desc()
    avatar_url: str = AF.avatar_url.to_field_desc()
    phone_masked: str = AF.phone_masked.to_field_desc()
    email: str = AF.email.to_field_desc()
    account_status: AccountStatusOpts = AF.account_status.to_field_desc()
