from fastapi import APIRouter
from app.core.config import settings
from app.core.schemas import APIResponse

api = APIRouter()


@api.get("/public_key", summary="获取公钥信息")
async def get_public_key() -> APIResponse:
    data = settings.private_key.public_key().export_key().decode()
    return APIResponse(data=data)
