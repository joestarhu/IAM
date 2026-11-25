from dataclasses import dataclass
from pydantic import BaseModel, Field
from .constants import DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE


class APIResponse[T](BaseModel):
    code: int = 0
    message: str = "成功"
    data: T | None = None


class Pagination(BaseModel):
    page_num: int = Field(default=DEFAULT_PAGE_NUM, description="当前页码")
    page_size: int = Field(default=DEFAULT_PAGE_SIZE, description="每页数量")


class PaginationData[T](Pagination):
    total_items: int = Field(default=0, description="数据总数")
    total_pages: int = Field(default=1, description="总页数")
    items: list[T] = Field(default_factory=list, description="数据")
