import subprocess
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.router import api_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)


def run_migrations():
    """Run Alembic migrations — failure is logged but never crashes the server."""
    logger.info("Running database migrations...")
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            check=True,
            capture_output=True,
            text=True,
            timeout=60,
        )
        logger.info("Migrations applied successfully")
        if result.stdout:
            logger.info(f"Alembic output: {result.stdout[:500]}")
    except subprocess.CalledProcessError as e:
        logger.error(
            f"Migration failed (app will still start — check DATABASE_URL): {e.stderr[:500]}"
        )
    except FileNotFoundError:
        logger.warning("Alembic not found, skipping migrations")
    except subprocess.TimeoutExpired:
        logger.error("Migration timed out after 60s — DB may be unreachable")
    except Exception as exc:
        logger.error(f"Unexpected migration error: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Allowed origins: {settings.ALLOWED_ORIGINS[:80]}")

    run_migrations()

    from app.services.fraud import fraud_service
    await fraud_service.initialize()

    logger.info("Server ready — /api/health is live")
    yield
    logger.info("Server shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
