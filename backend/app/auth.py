"""Simple JWT-like token signing for admin auth.

Le format du token est `<base64url(payload)>.<hex(hmac_sha256(secret, payload))>`.
Compatible avec le format utilisé côté Cloudflare Pages Functions, ce qui permet
au tableau de bord admin du frontend (`app/admin/page.tsx`) de fonctionner sans
modification quelle que soit la cible de déploiement (EasyPanel ou Cloudflare).
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from typing import Optional

from fastapi import HTTPException, Request

from app.config import settings


def _secret() -> bytes:
    secret = settings.ADMIN_TOKEN_SECRET or settings.ADMIN_PASSWORD or "change-me"
    return secret.encode("utf-8")


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def sign_admin_token(ttl_seconds: int = 60 * 60 * 8) -> str:
    payload = {
        "role": "admin",
        "iat": int(time.time()),
        "exp": int(time.time()) + ttl_seconds,
    }
    encoded = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(_secret(), encoded.encode("ascii"), hashlib.sha256).hexdigest()
    return f"{encoded}.{signature}"


def verify_admin_token(token: Optional[str]) -> bool:
    if not token:
        return False
    parts = token.split(".")
    if len(parts) != 2:
        return False
    encoded, signature = parts
    expected = hmac.new(_secret(), encoded.encode("ascii"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        return False
    try:
        payload = json.loads(_b64url_decode(encoded))
    except Exception:
        return False
    exp = payload.get("exp")
    if exp and int(exp) < int(time.time()):
        return False
    return True


def require_admin(request: Request) -> None:
    auth_header = request.headers.get("Authorization", "")
    token: Optional[str] = None
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="غير مصرح")
