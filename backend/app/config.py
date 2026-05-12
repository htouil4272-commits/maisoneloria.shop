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
        "https://api.maisoneloria.shop,"
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    ADMIN_USERNAME: str = "Hamzaeloria01"
    ADMIN_PASSWORD: str = "0668110109zaki"
    # Generate with: python -c "import secrets; print(secrets.token_hex(32))"
    # Must use only hex chars [0-9a-f] — avoid #, $, %, ^ etc. (shell-unsafe)
    ADMIN_TOKEN_SECRET: str = "604d2091c6e1c4a0058b871987d605bd241f17387c2fb8bb41753bb46fc201eb"

    MAXMIND_LICENSE_KEY: str = ""
    MAXMIND_DB_PATH: str = "data/GeoLite2-City.mmdb"

    GOOGLE_SHEETS_CREDENTIALS: str = ""
    GOOGLE_SHEETS_SPREADSHEET_ID: str = ""

    META_PIXEL_ID: str = "749884987768036"
    META_ACCESS_TOKEN: str = "EAAbh69FmvrYBRQNNk3cAZB6H0jr3HVDiDKtMZBLtPookVIh24EcPUxzn27YzM31fDklOom9yZBqJvvsKLLUDk6eTGanmBw3fkFbTnbAfTHD7h1rz9AQkxF2r5WcvmsojBRJacINDNTEF0ZBT4k96wUv47ysyN5APNrYWhgzUPWY20IzVr1X4gBLv1iXUeAZDZD"
    META_TEST_EVENT_CODE: str = "TEST87958"

    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""

    SNAP_ACCESS_TOKEN: str = ""
    SNAP_PIXEL_ID: str = ""

    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_ADMIN_NUMBER: str = "212665114751"

    RATE_LIMIT_ORDERS_MAX: int = 5
    RATE_LIMIT_ORDERS_WINDOW: int = 600
    RATE_LIMIT_CONTACT_MAX: int = 3
    RATE_LIMIT_CONTACT_WINDOW: int = 300

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def async_database_url(self) -> str:
        """Return DATABASE_URL guaranteed to use the asyncpg driver.

        Auto-corrects common mistakes:
        - 'postgres://'     → 'postgresql+asyncpg://'  (Heroku/Railway style)
        - 'postgresql://'   → 'postgresql+asyncpg://'  (missing driver suffix)
        - Literal placeholders like <DB_PASSWORD> are replaced with 'PLACEHOLDER'
          so the URL is at least parseable; the connection will fail gracefully
          at runtime rather than crashing at import time.
        """
        url = self.DATABASE_URL or ""
        # Sanitise literal angle-bracket placeholders that break URL parsing
        if "<" in url or ">" in url:
            import re as _re
            url = _re.sub(r"<[^>]*>", "PLACEHOLDER", url)
        if url.startswith("postgres://"):
            url = "postgresql+asyncpg://" + url[len("postgres://"):]
        elif url.startswith("postgresql://") and "+asyncpg" not in url:
            url = "postgresql+asyncpg://" + url[len("postgresql://"):]
        if not url:
            url = "postgresql+asyncpg://maisoneloria:PLACEHOLDER@maisoneloria_database:5432/maisoneloria"
        return url

    def validate_secrets(self) -> None:
        """Log warnings/errors for misconfigured env vars at startup."""
        if "<" in self.DATABASE_URL or ">" in self.DATABASE_URL:
            logger.error(
                "DATABASE_URL contains a literal placeholder (< or >). "
                "Open EasyPanel → backend → Environment and replace "
                "<DB_PASSWORD> with your real Postgres password. "
                "Get it from: EasyPanel → maisoneloria_database → Connect."
            )
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
        logger.info(
            f"DATABASE_URL (effective): {self.async_database_url[:60]}..."
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


try:
    settings = Settings()
    settings.validate_secrets()
except Exception as _exc:
    logger.error(f"Failed to load settings: {_exc}")
    settings = Settings()  # fallback with defaults
