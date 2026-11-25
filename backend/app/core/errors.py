from enum import Enum
from typing import Any


class APIError(Enum):
    # 访问认证体系错误 1000~1099
    AUTH_ERR_PASSWORD_SIGN_IN = (1001, "账号或密码错误")
    AUTH_ERR_ACCOUNT_DISABLED = (1002, "账号已被停用")

    # 用户管理错误 1100~1199
    ACCOUNT_ERR_UNIQUE = (1100, "账号唯一性检测未通过")
    ACCOUNT_ERR_NOT_FOUND = (1101, "账号不存在")

    @property
    def code(self) -> int:
        return self.value[0]

    @property
    def message(self) -> str:
        return self.value[1]


class BizError(Exception):
    def __init__(self, error: APIError, data: Any | None = None) -> None:
        self.error = error
        self.data = data
        super().__init__(error.message)

    @property
    def code(self) -> int:
        return self.error.code

    @property
    def message(self) -> str:
        return self.error.message
