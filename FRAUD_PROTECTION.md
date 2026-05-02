# FRAUD PROTECTION — Maison Eloria

## Overview

Protect against fake COD orders using MaxMind GeoIP2 for IP-based fraud detection. Only accept orders from Morocco, block VPN/proxy users, and flag suspicious behavior.

---

## MaxMind Integration

### Setup
1. Create account at [maxmind.com](https://www.maxmind.com)
2. Generate a license key (free tier: GeoLite2)
3. Download `GeoLite2-City.mmdb` database
4. Place in `backend/data/GeoLite2-City.mmdb`

### Environment Variables
```env
MAXMIND_LICENSE_KEY=your-license-key-here
MAXMIND_DB_PATH=./data/GeoLite2-City.mmdb
```

### Auto-Download Script
```python
# backend/scripts/download_maxmind.py
import os
import urllib.request
import tarfile

LICENSE_KEY = os.getenv("MAXMIND_LICENSE_KEY")
DB_PATH = os.getenv("MAXMIND_DB_PATH", "./data/GeoLite2-City.mmdb")

def download_db():
    if os.path.exists(DB_PATH):
        return
    
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    url = (
        f"https://download.maxmind.com/app/geoip_download"
        f"?edition_id=GeoLite2-City&license_key={LICENSE_KEY}"
        f"&suffix=tar.gz"
    )
    
    tar_path = "/tmp/GeoLite2-City.tar.gz"
    urllib.request.urlretrieve(url, tar_path)
    
    with tarfile.open(tar_path, "r:gz") as tar:
        for member in tar.getmembers():
            if member.name.endswith(".mmdb"):
                member.name = os.path.basename(member.name)
                tar.extract(member, os.path.dirname(DB_PATH))
                break
    
    os.remove(tar_path)
```

---

## Fraud Detection Service

```python
# backend/app/services/fraud.py

import geoip2.database
import geoip2.errors
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class FraudDetector:
    def __init__(self):
        self.reader = None
        try:
            self.reader = geoip2.database.Reader(settings.MAXMIND_DB_PATH)
        except Exception as e:
            logger.warning(f"MaxMind DB not available: {e}")
    
    def check_order(self, ip_address: str, phone: str, user_agent: str) -> dict:
        """
        Returns fraud assessment for an order.
        
        Returns:
            {
                "allowed": bool,
                "reason": str,
                "country": str,
                "city": str,
                "is_vpn": bool,
                "fraud_score": float  # 0.0 (clean) to 1.0 (fraud)
            }
        """
        result = {
            "allowed": True,
            "reason": "ok",
            "country": "unknown",
            "city": "unknown",
            "is_vpn": False,
            "fraud_score": 0.0
        }
        
        # If MaxMind not available, allow but log
        if not self.reader:
            logger.warning("MaxMind not configured — allowing all orders")
            return result
        
        try:
            response = self.reader.city(ip_address)
            
            result["country"] = response.country.iso_code or "unknown"
            result["city"] = response.city.name or "unknown"
            
            # Rule 1: Must be from Morocco
            if result["country"] != "MA":
                result["allowed"] = False
                result["reason"] = "not_morocco"
                result["fraud_score"] = 0.9
                return result
            
            # Rule 2: Check for known VPN/proxy traits
            traits = getattr(response, 'traits', None)
            if traits:
                if getattr(traits, 'is_anonymous_proxy', False):
                    result["is_vpn"] = True
                    result["allowed"] = False
                    result["reason"] = "vpn_detected"
                    result["fraud_score"] = 0.85
                    return result
                
                if getattr(traits, 'is_anonymous_vpn', False):
                    result["is_vpn"] = True
                    result["allowed"] = False
                    result["reason"] = "vpn_detected"
                    result["fraud_score"] = 0.85
                    return result
            
            # Rule 3: Phone number validation
            if not self._validate_moroccan_phone(phone):
                result["allowed"] = False
                result["reason"] = "invalid_phone"
                result["fraud_score"] = 0.7
                return result
            
            # Rule 4: Suspicious user agent
            if self._is_suspicious_ua(user_agent):
                result["fraud_score"] += 0.3
            
            # Rule 5: Rate limiting (checked separately in middleware)
            
        except geoip2.errors.AddressNotFoundError:
            result["fraud_score"] = 0.5
            logger.warning(f"IP not found in MaxMind: {ip_address}")
        except Exception as e:
            logger.error(f"Fraud check error: {e}")
        
        # Final decision
        if result["fraud_score"] >= 0.7:
            result["allowed"] = False
            result["reason"] = "high_fraud_score"
        
        return result
    
    def _validate_moroccan_phone(self, phone: str) -> bool:
        """Validate Moroccan phone number format."""
        import re
        phone = phone.strip().replace(' ', '').replace('-', '')
        return bool(re.match(r'^(0[67]\d{8}|\+212[67]\d{8}|212[67]\d{8})$', phone))
    
    def _is_suspicious_ua(self, user_agent: str) -> bool:
        """Check for bot/suspicious user agents."""
        if not user_agent:
            return True
        suspicious = ['bot', 'crawler', 'spider', 'curl', 'wget', 'python', 'postman']
        ua_lower = user_agent.lower()
        return any(s in ua_lower for s in suspicious)
    
    def close(self):
        if self.reader:
            self.reader.close()


# Singleton instance
fraud_detector = FraudDetector()
```

---

## Rate Limiting

### Per-IP Rate Limits
```python
# backend/app/middleware/rate_limit.py

from collections import defaultdict
from datetime import datetime, timedelta
import asyncio

class RateLimiter:
    def __init__(self):
        self.requests: dict[str, list[datetime]] = defaultdict(list)
        self.lock = asyncio.Lock()
    
    async def is_rate_limited(self, ip: str, max_requests: int = 5, window_minutes: int = 10) -> bool:
        """Check if IP has exceeded rate limit."""
        async with self.lock:
            now = datetime.utcnow()
            cutoff = now - timedelta(minutes=window_minutes)
            
            # Clean old entries
            self.requests[ip] = [
                t for t in self.requests[ip] if t > cutoff
            ]
            
            if len(self.requests[ip]) >= max_requests:
                return True
            
            self.requests[ip].append(now)
            return False

rate_limiter = RateLimiter()
```

### Rate Limit Rules
| Endpoint | Max Requests | Window |
|----------|-------------|--------|
| `POST /api/orders` | 5 | 10 minutes |
| `POST /api/contact` | 3 | 5 minutes |
| `POST /api/newsletter` | 3 | 5 minutes |

---

## Order Validation Pipeline

When an order comes in, run these checks in sequence:

```
1. Validate phone format (Moroccan: 06/07 + 8 digits)
   → FAIL: Return 400 "Invalid phone"

2. Rate limit check (5 orders per IP per 10 min)
   → FAIL: Return 429 "Too many requests"

3. MaxMind geo check (must be Morocco)
   → FAIL: Return 403 (generic error, don't reveal reason)

4. MaxMind VPN/proxy check
   → FAIL: Return 403 (generic error)

5. Fraud score calculation
   → Score >= 0.7: Block order
   → Score 0.3-0.7: Accept but flag for review
   → Score < 0.3: Accept normally

6. If all pass → Create order
```

---

## Fraud Dashboard (Admin)

### Flagged Orders View
- List orders with `fraud_score > 0.3`
- Show: order number, name, phone, IP, country, city, is_vpn, fraud_score
- Actions: Approve, Block, Blacklist IP

### Blacklist Management
- Maintain a table of blacklisted IPs and phone numbers
- Auto-block on repeat fraud detection

---

## Privacy & Error Handling

### Never Reveal Fraud Detection
- Don't tell the user their order was blocked for fraud
- Show generic error: "عذراً، لا يمكن معالجة طلبك حالياً"
- Offer WhatsApp as alternative (real customers will reach out)

### Data Retention
- IP addresses: Keep for 90 days, then anonymize
- Fraud scores: Keep for 1 year
- Log all fraud checks for analysis

---

## Fallback if MaxMind Unavailable

If the MaxMind database is not configured or fails to load:
1. Log a warning
2. Allow all orders through (don't block legitimate customers)
3. Still apply rate limiting and phone validation
4. Flag in admin: "⚠️ Fraud check unavailable"
