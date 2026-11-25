from math import ceil
from typing import Annotated, Type
from sqlalchemy import text, String, event, Select, RowMapping, select, func
from sqlalchemy.orm import Mapped as M, mapped_column as mc, DeclarativeBase, ORMExecuteState, with_loader_criteria, Session
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from rgt.data import BaseMixin, SoftDeleteMixin
from .config import settings
from .meta import UUID_LENGTH
from .schemas import PaginationData, Pagination


engine = create_async_engine(**settings.orm_kwargs)

AsyncLocalSession: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False
)

# 操作者UUID
ACTOR_UUID = Annotated[
    str,
    mc(String(UUID_LENGTH), server_default=text("''"))
]


class ModelBase(DeclarativeBase, BaseMixin, SoftDeleteMixin):
    created_by: M[ACTOR_UUID] = mc(comment="数据创建者UUID")
    updated_by: M[ACTOR_UUID] = mc(comment="数据更新者UUID")


@event.listens_for(Session, "do_orm_execute")
def add_soft_del_filter(state: ORMExecuteState) -> None:
    """全局注册软删除(SQLALCHEMY的异步也是由同步的Session来实现)"""
    if (
        state.is_select
        and not state.is_column_load
        and not state.is_relationship_load
        and not state.execution_options.get("include_deleted", False)
    ):
        state.statement = state.statement.options(
            with_loader_criteria(
                SoftDeleteMixin,
                lambda cls: cls.is_deleted.is_(False),
                include_aliases=True
            )
        )


class ORM:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def first(self, stmt: Select) -> RowMapping | None:
        item = await self.session.execute(stmt)
        return item.mappings().first()

    async def all[T](self, stmt: Select, schema: Type[T] = dict) -> list[T]:
        items = await self.session.execute(stmt)
        return [schema(**item) for item in items.mappings()]

    async def counts(self, stmt: Select) -> int:
        count_stmt = select(func.count()).select_from(
            stmt.order_by(None).subquery()
        )
        return await self.session.scalar(count_stmt) or 0

    async def pagination[T](
        self,
        stmt: Select,
        pagination: Pagination,
        order_by_args: list | None = None,
        schema: Type[T] = dict
    ) -> PaginationData[T]:
        data = PaginationData(**pagination.model_dump())

        # 获取数据总数和页面总数
        data.total_items = await self.counts(stmt)

        data.total_pages = max(1, ceil(data.total_items / data.page_size))
        data.page_num = max(1, min(data.total_pages, data.page_num))

        # 没有数据
        if data.total_items == 0:
            return data

        # 排序
        page_stmt = stmt.order_by(*order_by_args) if order_by_args else stmt

        offset = (data.page_num-1) * data.page_size
        page_stmt = page_stmt.offset(offset).limit(data.page_size)
        data.items = await self.all(page_stmt, schema)

        return data
