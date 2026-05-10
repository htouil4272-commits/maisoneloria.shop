import logging
import re
from pydantic_settings import BaseSettings
from typing import List

logger = logging.getLogger(__name__)

# Characters that are unsafe in shell/Docker/YAML environment variable values.
# '#' starts a comment in .env files; '$' triggers shell variable expansion.
_SHELL_UNSAFE_RE = re.compile(r"[#$%^&!]")


class Settings(BaseSettings):
    APP_NAME: str = "Maison Eloria API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql+asyncpg://maisoneloria:maisoneloria@maisoneloria_database:5432/maisoneloria"

    ALLOWED_ORIGINS: str = (
        "https://maisoneloria.shop,https://www.maisoneloria.shop,"
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    ADMIN_USERNAME: str = ""
    ADMIN_PASSWORD: str = ""
    # Generate with: python -c "import secrets; print(secrets.token_hex(32))"
    # Must use only hex chars [0-9a-f] — avoid #, $, %, ^ etc. (shell-unsafe)
    ADMIN_TOKEN_SECRET: str = ""

    MAXMIND_LICENSE_KEY: str = ""
    MAXMIND_DB_PATH: str = "data/GeoLite2-City.mmdb"

    GOOGLE_SHEETS_CREDENTIALS: str = ""
    GOOGLE_SHEETS_SPREADSHEET_ID: str = ""

    FB_ACCESS_TOKEN: str = ""
    FB_PIXEL_ID: str = "1544079200022148"

    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""

    SNAP_ACCESS_TOKEN: str = ""
    SNAP_PIXEL_ID: str = ""

    RATE_LIMIT_ORDERS_MAX: int = 5
    RATE_LIMIT_ORDERS_WINDOW: int = 600
    RATE_LIMIT_CONTACT_MAX: int = 3
    RATE_LIMIT_CONTACT_WINDOW: int = 300

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    def validate_secrets(self) -> None:
        """Log warnings for misconfigured secrets at startup."""
        if self.ADMIN_TOKEN_SECRET and _SHELL_UNSAFE_RE.search(self.ADMIN_TOKEN_SECRET):
            logger.warning(
                "ADMIN_TOKEN_SECRET contains shell-unsafe characters (#, $, %%, ^, etc.). "
                "These may be stripped or corrupted by Docker/shell env parsing, causing "
                "'Invalid Token' errors. Regenerate with: "
                "python -c \"import secrets; print(secrets.token_hex(32))\""
            )
        if not self.ADMIN_TOKEN_SECRET and not self.ADMIN_PASSWORD:
            logger.warning(
                "Neither ADMIN_TOKEN_SECRET nor ADMIN_PASSWORD is set. "
                "Admin tokens will be signed with the insecure fallback 'change-me'."
            )
        if not self.DATABASE_URL.startswith("postgresql+asyncpg://"):
            logger.error(
                "DATABASE_URL must use 'postgresql+asyncpg://' driver for async SQLAlchemy. "
                f"Current value starts with: {self.DATABASE_URL[:30]!r}"
            )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
settings.validate_secrets()
