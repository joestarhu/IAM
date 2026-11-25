from dataclasses import dataclass
from typing import Any, Final
from fastapi import Query
from sqlalchemy import true, false, text
from sqlalchemy.orm import mapped_column, MappedColumn
from pydantic import Field

# UUID的字段长度
UUID_LENGTH: Final[int] = 48


@dataclass(slots=True, frozen=True)
class MF[T]:
    """MF 是 Meta Field的简称, 是为实现SSOT(Single Source of Truth)单一事实来源的基础"""

    # 字段描述
    comment: str

    # 字段是否唯一
    unique: bool = False

    # 字段默认值
    default_value: T | None = None

    # 字段长度
    length: int | None = None

    # 字段最小值
    min_value: T | None = None

    # 字段最大值
    max_value: T | None = None

    # 字段正则表达式
    pattern: str | None = None

    def to_mapped_column(self, orm_type: Any, **kwargs) -> MappedColumn:
        """转化为SQLALCHEMY的Mapped Column"""
        mc_kwargs = {
            "unique": self.unique,
            "comment": self.comment,
        }

        if self.length:
            mc_kwargs |= {"type_": orm_type(self.length)}
        else:
            mc_kwargs |= {"type_": orm_type}

        match self.default_value:
            case str():
                default_value = text(self.default_value)
            case bool():
                default_value = true() if self.default_value else false()
            case int() | float():
                default_value = text(f"{self.default_value}")
            case _:
                default_value = None

        if default_value is not None:
            mc_kwargs |= {"server_default": default_value}

        return mapped_column(**(mc_kwargs | kwargs))

    def to_field(self, **kwargs):
        """转化为Pydantic Field"""
        schema_kwargs: dict[str, Any] = {
            key: value for key, value in [
                ("description", self.comment),
                ("pattern", self.pattern),
                ("max_length", self.length),
                ("ge", self.min_value),
                ("le", self.max_value),
            ] if value is not None
        }

        return Field(**(schema_kwargs | kwargs))

    def to_field_desc(self):
        """转化为Pydantic Field, 只留一个description"""
        return Field(description=self.comment)

    def to_query(self,  **kwargs):
        return Query(
            description=self.comment
        )


@dataclass(slots=True, frozen=True)
class APIResource:
    path: str
    summary: str
    scope: str

    @property
    def method_kwargs(self) -> dict[str, Any]:
        return {
            "path": self.path,
            "summary": self.summary
        }

    @property
    def scopes(self) -> list[str]:
        return [self.scope]
