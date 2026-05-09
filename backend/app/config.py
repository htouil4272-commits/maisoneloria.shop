from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Maison Eloria API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql+asyncpg://maisoneloria:maisoneloria@maisoneloria_database:5432/maisoneloria"

    ALLOWED_ORIGINS: str = (
        "https://maisoneloria.shop,https://www.maisoneloria.shop,"
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    ADMIN_USERNAME: str = "Hamzaeloria01"
    ADMIN_PASSWORD: str = "0668110109zaki"
    # Si vide, on dérive la signature à partir de ADMIN_PASSWORD pour simplifier le déploiement.
    ADMIN_TOKEN_SECRET: str = ""

    MAXMIND_LICENSE_KEY: str = ""
    MAXMIND_DB_PATH: str = "data/GeoLite2-City.mmdb"

    GOOGLE_SHEETS_CREDENTIALS: str = ""
    GOOGLE_SHEETS_SPREADSHEET_ID: str = ""

    FB_ACCESS_TOKEN: str = "EAAbh69FmvrYBRZAZAI1HCvJHnTHAFghCUGr2ZB0i1iouej2wRefmBWBuFVtoCnPOkJUEot4jZA9xZA88e4wAf66RvhYZBP9tIJJVpYk0mmt3wlZBEfaC8onpDQbPYtjZAGEV9f3YWATW8kKXFiYpfEMLZBXcD4DHyrWZCuTxZCpFSFdV8bh4ZAyRUstAtmqxjdkZCfwZDZD"
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

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
