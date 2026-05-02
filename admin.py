import csv
import io
import secrets
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.order import Order
from app.schemas.order import OrderListResponseSchema, AdminOrderSchema, OrderStatusUpdateSchema

router = APIRouter()
security = HTTPBasic()


def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, settings.ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, settings.ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="بيانات الدخول غير صحيحة",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


@router.get("/orders", response_model=OrderListResponseSchema)
async def list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    _admin: str = Depends(verify_admin),
):
    query = select(Order)
    count_query = select(func.count(Order.id))

    if status:
        query = query.where(Order.status == status)
        count_query = count_query.where(Order.status == status)

    if search:
        search_filter = (
            Order.customer_name.ilike(f"%{search}%")
            | Order.customer_phone.ilike(f"%{search}%")
            | Order.order_number.ilike(f"%{search}%")
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if date_from:
        try:
            dt_from = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            query = query.where(Order.created_at >= dt_from)
            count_query = count_query.where(Order.created_at >= dt_from)
        except ValueError:
            pass

    if date_to:
        try:
            dt_to = datetime.strptime(date_to, "%Y-%m-%d").replace(tzinfo=timezone.utc) + timedelta(days=1)
            query = query.where(Order.created_at < dt_to)
            count_query = count_query.where(Order.created_at < dt_to)
        except ValueError:
            pass

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    offset = (page - 1) * per_page
    query = query.order_by(Order.created_at.desc()).offset(offset).limit(per_page)

    result = await db.execute(query)
    orders = result.scalars().all()

    pages = (total + per_page - 1) // per_page

    return OrderListResponseSchema(
        orders=[AdminOrderSchema.model_validate(o) for o in orders],
        total=total,
        page=page,
        per_page=per_page,
        pages=pages,
    )


@router.patch("/orders/{order_number}")
async def update_order_status(
    order_number: str,
    data: OrderStatusUpdateSchema,
    db: AsyncSession = Depends(get_db),
    _admin: str = Depends(verify_admin),
):
    result = await db.execute(select(Order).where(Order.order_number == order_number))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")

    order.status = data.status
    order.updated_at = datetime.now(timezone.utc)
    await db.commit()

    return {"success": True, "order_number": order.order_number, "status": order.status}


@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _admin: str = Depends(verify_admin),
):
    now = datetime.now(timezone.utc)
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
    _admin: str = Depends(verify_admin),
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
        "order_number", "customer_name", "customer_phone", "total",
        "status", "city", "country", "created_at",
    ])

    for order in orders:
        writer.writerow([
            order.order_number,
            order.customer_name,
            order.customer_phone,
            str(order.total),
            order.status,
            order.city or "",
            order.country or "",
            order.created_at.isoformat(),
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=orders_export.csv"},
    )
