"""Admin API endpoints — compatible with the frontend admin dashboard.

L'authentification se fait via `POST /api/admin/login` qui retourne un token
porté dans `Authorization: Bearer ...`. Les endpoints retournent un format
`{success, orders, counts}` et acceptent les actions par ID (compatible
direct avec `app/admin/page.tsx`).
"""
from __future__ import annotations

import csv
import hmac
import io
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import require_admin, sign_admin_token
from app.config import settings
from app.database import get_db
from app.middleware.rate_limit import RateLimiter
from app.models.order import Order

# كلمات السر الافتراضية المحظورة — يُرفض الدخول إذا لم يتم تغيير الـ password
_DEFAULT_PASSWORDS = {"changeme", "change-me", "change-me-in-production", "admin", "password", "123456"}

router = APIRouter()

ALLOWED_STATUSES = {"pending", "confirmed", "shipped", "delivered", "cancelled", "returned"}

login_rate_limiter = RateLimiter(max_requests=6, window_seconds=300)


class LoginPayload(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=8)


class StatusUpdatePayload(BaseModel):
    status: str
    notes: Optional[str] = None


def _serialize_order(order: Order) -> dict:
    return {
        "id": order.id,
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "customer_city": order.city or "",
        "items": order.items if isinstance(order.items, list) else [],
        "total": float(order.total) if order.total is not None else 0.0,
        "status": order.status,
        "notes": getattr(order, "notes", None),
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "updated_at": order.updated_at.isoformat() if order.updated_at else None,
    }


@router.post("/login")
async def admin_login(request: Request, payload: LoginPayload):
    client_ip = request.headers.get("X-Forwarded-For", "")
    client_ip = client_ip.split(",")[0].strip() or (request.client.host if request.client else "unknown")

    if not login_rate_limiter.is_allowed(client_ip):
        raise HTTPException(status_code=429, detail="محاولات كثيرة. حاول لاحقاً.")

    expected_password = settings.ADMIN_PASSWORD or ""
    if not expected_password:
        raise HTTPException(status_code=500, detail="ADMIN_PASSWORD غير مهيأ على السيرفر")

    # رفض كلمات السر الافتراضية — يجب تغييرها في .env
    if expected_password.lower() in _DEFAULT_PASSWORDS:
        raise HTTPException(
            status_code=500,
            detail="يجب تغيير ADMIN_PASSWORD الافتراضي في ملف .env قبل الاستخدام",
        )

    # مقارنة username و password بشكل آمن ضد هجمات timing
    username_ok = hmac.compare_digest(
        payload.username.encode(), (settings.ADMIN_USERNAME or "").encode()
    )
    password_ok = hmac.compare_digest(
        payload.password.encode(), expected_password.encode()
    )
    if not username_ok or not password_ok:
        raise HTTPException(status_code=401, detail="بيانات الدخول غير صحيحة")

    token = sign_admin_token()
    return {"success": True, "token": token}


@router.get("/orders")
async def list_orders(
    request: Request,
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    query = select(Order)

    if status and status in ALLOWED_STATUSES:
        query = query.where(Order.status == status)

    if search:
        like = f"%{search}%"
        query = query.where(
            (Order.customer_name.ilike(like))
            | (Order.customer_phone.ilike(like))
            | (Order.order_number.ilike(like))
        )

    query = query.order_by(Order.created_at.desc()).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()

    counts_result = await db.execute(
        select(Order.status, func.count(Order.id)).group_by(Order.status)
    )
    counts = {row[0]: int(row[1]) for row in counts_result.all()}

    return {
        "success": True,
        "orders": [_serialize_order(o) for o in orders],
        "counts": counts,
    }


@router.post("/orders/{order_id}/status")
async def update_status(
    order_id: int,
    payload: StatusUpdatePayload,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="الحالة غير صحيحة")

    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")

    order.status = payload.status
    if payload.notes is not None:
        order.notes = payload.notes
    order.updated_at = datetime.utcnow()
    await db.commit()

    return {"success": True, "status": order.status, "id": order.id}


@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=now.weekday())
    month_start = today_start.replace(day=1)

    async def period_stats(since: datetime):
        result = await db.execute(
            select(
                func.count(Order.id),
                func.coalesce(func.sum(Order.total), 0),
            ).where(Order.created_at >= since)
        )
        row = result.one()
        count = row[0] or 0
        revenue = row[1] or Decimal("0")
        aov = revenue / count if count > 0 else Decimal("0")
        return {"orders": count, "revenue": float(revenue), "aov": float(aov)}

    today_stats = await period_stats(today_start)
    week_stats = await period_stats(week_start)
    month_stats = await period_stats(month_start)

    status_result = await db.execute(
        select(Order.status, func.count(Order.id)).group_by(Order.status)
    )
    by_status = {row[0]: row[1] for row in status_result.all()}

    return {
        "success": True,
        "today": today_stats,
        "week": week_stats,
        "month": month_stats,
        "by_status": by_status,
    }


@router.get("/orders/export")
async def export_orders(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    query = select(Order)

    if date_from:
        try:
            dt_from = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            query = query.where(Order.created_at >= dt_from)
        except ValueError:
            pass

    if date_to:
        try:
            dt_to = datetime.strptime(date_to, "%Y-%m-%d").replace(tzinfo=timezone.utc) + timedelta(days=1)
            query = query.where(Order.created_at < dt_to)
        except ValueError:
            pass

    query = query.order_by(Order.created_at.desc())
    result = await db.execute(query)
    orders = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "order_number", "customer_name", "customer_phone", "customer_city", "total",
        "status", "country", "created_at",
    ])

    for order in orders:
        writer.writerow([
            order.order_number,
            order.customer_name,
            order.customer_phone,
            order.city or "",
            str(order.total),
            order.status,
            order.country or "",
            order.created_at.isoformat() if order.created_at else "",
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=orders_export.csv"},
    )
