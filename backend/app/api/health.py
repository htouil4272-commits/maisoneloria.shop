import os
from datetime import datetime, timezone

from fastapi import APIRouter

from app.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic liveness probe — always responds even if DB is down."""
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": settings.APP_VERSION,
    }


@router.get("/health/full")
async def health_check_full():
    """Detailed health check including database connectivity."""
    from app.database import check_db_connection

    db_status = await check_db_connection()

    db_url_preview = settings.async_database_url
    # Mask password in URL for safe logging
    try:
        from urllib.parse import urlparse, urlunparse
        parsed = urlparse(db_url_preview)
        masked = parsed._replace(netloc=parsed.netloc.replace(
            parsed.password or "", "***"
        ) if parsed.password else parsed.netloc)
        db_url_preview = urlunparse(masked)[:80]
    except Exception:
        db_url_preview = db_url_preview[:30] + "..."

    return {
        "status": "ok" if db_status["status"] == "ok" else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": settings.APP_VERSION,
        "database": db_status,
        "db_url_preview": db_url_preview,
        "admin_configured": bool(settings.ADMIN_USERNAME and settings.ADMIN_PASSWORD),
        "env": os.environ.get("APP_ENV", "unknown"),
    }
