import logging

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

logger = logging.getLogger(__name__)

# Lazy engine — created on first access so a bad DATABASE_URL never crashes
# the import and the /api/health endpoint stays reachable for diagnostics.
_engine = None
_session_factory = None


def get_engine():
    global _engine
    if _engine is None:
        url = settings.async_database_url
        try:
            _engine = create_async_engine(
                url,
                echo=settings.DEBUG,
                pool_size=5,
                max_overflow=10,
                pool_pre_ping=True,
                pool_recycle=300,
            )
            logger.info(f"Database engine created: {url[:60]}...")
        except Exception as exc:
            logger.error(
                f"Failed to create database engine: {exc}. "
                "Check DATABASE_URL in EasyPanel → backend → Environment."
            )
            raise
    return _engine


def get_session_factory():
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
        )
    return _session_factory


class Base(DeclarativeBase):
    pass


async def get_db():
    async with get_session_factory()() as session:
        try:
            yield session
        finally:
            await session.close()


async def check_db_connection() -> dict:
    """Returns DB status for the health endpoint without crashing."""
    try:
        from sqlalchemy import text
        async with get_session_factory()() as session:
            await session.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as exc:
        return {"status": "error", "detail": str(exc)[:200]}
