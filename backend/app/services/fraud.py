import logging
from pathlib import Path

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class FraudService:
    def __init__(self):
        self._reader = None

    async def initialize(self):
        db_path = Path(settings.MAXMIND_DB_PATH)
        if db_path.exists():
            try:
                import geoip2.database
                self._reader = geoip2.database.Reader(str(db_path))
                logger.info("MaxMind GeoIP database loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load MaxMind DB: {e}")
        else:
            logger.warning(f"MaxMind DB not found at {db_path}. Fraud detection will use fallback.")
            if settings.MAXMIND_LICENSE_KEY:
                await self._download_maxmind_db(db_path)

    async def _download_maxmind_db(self, db_path: Path):
        try:
            url = (
                f"https://download.maxmind.com/app/geoip_download?"
                f"edition_id=GeoLite2-City&license_key={settings.MAXMIND_LICENSE_KEY}"
                f"&suffix=tar.gz"
            )
            db_path.parent.mkdir(parents=True, exist_ok=True)

            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    import tarfile
                    import io

                    tar = tarfile.open(fileobj=io.BytesIO(response.content), mode="r:gz")
                    for member in tar.getmembers():
                        if member.name.endswith(".mmdb"):
                            f = tar.extractfile(member)
                            if f:
                                db_path.write_bytes(f.read())
                                logger.info("MaxMind DB downloaded successfully")
                                import geoip2.database
                                self._reader = geoip2.database.Reader(str(db_path))
                                break
                    tar.close()
                else:
                    logger.error(f"Failed to download MaxMind DB: HTTP {response.status_code}")
        except Exception as e:
            logger.error(f"Error downloading MaxMind DB: {e}")

    async def check_order(self, ip: str, phone: str, user_agent: str) -> dict:
        result = {
            "allowed": True,
            "reason": None,
            "country": None,
            "city": None,
            "is_vpn": False,
            "fraud_score": 0.0,
        }

        if not self._reader:
            return result

        try:
            response = self._reader.city(ip)

            result["country"] = response.country.iso_code
            result["city"] = response.city.name

            fraud_score = 0.0

            if response.country.iso_code != "MA":
                result["allowed"] = False
                result["reason"] = "non_morocco"
                fraud_score += 0.5

            if hasattr(response, "traits"):
                traits = response.traits
                if getattr(traits, "is_anonymous_proxy", False) or getattr(traits, "is_anonymous_vpn", False):
                    result["is_vpn"] = True
                    result["allowed"] = False
                    result["reason"] = "vpn_detected"
                    fraud_score += 0.3

            suspicious_uas = ["bot", "crawler", "spider", "headless", "phantom", "selenium"]
            ua_lower = user_agent.lower()
            if any(s in ua_lower for s in suspicious_uas):
                fraud_score += 0.2
                if fraud_score >= 0.7:
                    result["allowed"] = False
                    result["reason"] = "suspicious_ua"

            result["fraud_score"] = min(fraud_score, 1.0)

            if fraud_score >= 0.7:
                result["allowed"] = False
                if not result["reason"]:
                    result["reason"] = "high_fraud_score"

        except Exception as e:
            logger.warning(f"GeoIP lookup failed for {ip}: {e}")

        return result


fraud_service = FraudService()
