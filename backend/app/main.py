from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.biz.routers import routers
from app.core.config import settings


app = FastAPI(**settings.fastapi_kwargs)
app.add_middleware(CORSMiddleware, **settings.cors_kwargs)
app.include_router(routers)
