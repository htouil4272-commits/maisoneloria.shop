from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.orders import router as orders_router
from app.api.contact import router as contact_router
from app.api.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(health_router, tags=["health"])
api_router.include_router(orders_router, tags=["orders"])
api_router.include_router(contact_router, tags=["contact"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
