from typing import AsyncGenerator
from fastapi import Depends, HTTPException, Query
from fastapi.security import SecurityScopes, OAuth2PasswordBearer
from jose.exceptions import ExpiredSignatureError
from app.core.orm import AsyncLocalSession, ORM
from app.core.actor import Actor
from app.core.utils import jwt_manager
from app.core.constants import DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE
from app.core.schemas import Pagination


oauth2 = OAuth2PasswordBearer("/auth/docs-login")


def get_pagination(
    page_num: int = Query(default=DEFAULT_PAGE_NUM, ge=1),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=100),
) -> Pagination:
    return Pagination(page_num=page_num, page_size=page_size)


async def get_session() -> AsyncGenerator:
    """获取数据库异步会话"""
    async with AsyncLocalSession() as session:
        try:
            yield session
            await session.commit()
        except:
            await session.rollback()
            raise


async def get_actor(
        scopes: SecurityScopes,
        session=Depends(get_session),
        token=Depends(oauth2),
) -> Actor:
    try:
        payload = jwt_manager.decode(token)
    except ExpiredSignatureError as e:
        raise HTTPException(401, "JWT已过期")
    except Exception as e:
        raise HTTPException(500, "JWT解析失败")

    if not (account_uuid := payload.get("account_uuid", "")):
        raise HTTPException(401, "无效的JWT")

    return Actor(ORM(session), account_uuid, ["ALL"])
