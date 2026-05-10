import logging

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

logger = logging.getLogger(__name__)


def _create_engine():
    """Create SQLAlchemy engine; log clearly if the URL is malformed."""
    url = settings.async_database_url
    try:
        return create_async_engine(
            url,
            echo=settings.DEBUG,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
        )
    except Exception as exc:
        logger.error(
            f"Failed to create database engine with URL '{url[:60]}...': {exc}. "
            "Check DATABASE_URL in EasyPanel environment variables."
        )
        raise


engine = _create_engine()

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
