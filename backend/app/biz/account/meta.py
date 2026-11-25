from enum import IntEnum
from app.core.meta import MF, UUID_LENGTH


class AccountStatusOpts(IntEnum):
    """账号状态"""
    ENABLE = 0
    DISABLE = 1


class AccountFields:
    # 数据库字段
    account_uuid = MF(
        comment="账号UUID",
        length=UUID_LENGTH,
        unique=True,
    )

    account = MF(
        comment="账号",
        length=32,
        pattern=r"^[a-zA-Z0-9_]{3,32}$",
        unique=True,
    )

    nickname = MF(
        comment="昵称",
        length=64,
    )

    avatar_url = MF(
        comment="头像URL",
        length=2048,
        default_value="",
    )

    email = MF(
        comment="邮箱",
        length=254,
        pattern=r'^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        default_value="",
    )

    phone_enc = MF(
        comment="手机号(加密存储)",
        length=320,
        default_value="",
    )

    account_status = MF(
        comment="账号状态",
        default_value=AccountStatusOpts.ENABLE,
    )

    password_hash = MF(
        comment="密码(Hash加密存储)",
        length=1024,
        default_value="",
    )

    # 业务前台字段
    password_encrypted = MF(
        comment="密码(加密传输)",
        length=1024,
    )

    phone = MF(
        comment="手机号(明文)",
        pattern=r"^(?:1[3-9]\d{9})?$"
    )

    phone_masked = MF(
        comment="手机号(脱敏),如151****1234",
    )

    password = MF(
        comment="密码(明文)",
        length=24,
    )
