from enum import Enum
from typing import Any


class APIError(Enum):
    # 访问认证体系错误 1000~1099
    AUTH_ERR_PASSWORD_SIGN_IN = (1001, "账号或密码错误")
    AUTH_ERR_ACCOUNT_DISABLED = (1002, "账号已被停用")

    @property
    def code(self) -> int:
        return self.value[0]

    @property
    def message(self) -> str:
        return self.value[1]


class BizError(Exception):
    def __int__(self, error: APIError, data: Any | None = None) -> None:
        self.error = error
        self.data = data
        super().__init__(error.message)

    @property
    def code(self) -> int:
        return self.error.code

    @property
    def message(self) -> str:
        return self.error.message
