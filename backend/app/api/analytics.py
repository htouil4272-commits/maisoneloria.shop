import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.event import AnalyticsEvent
from app.models.order import Order
from app.schemas.analytics import AnalyticsEventCreate
from app.auth import require_admin

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/events")
async def record_event(
    event_data: AnalyticsEventCreate,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Record an analytics event from the frontend (public endpoint)."""
    try:
        event = AnalyticsEvent(
            session_id=event_data.session_id,
            event_type=event_data.event_type,
            path=event_data.path,
            metadata_json=event_data.metadata_json,
        )
        db.add(event)
        await db.commit()

        # Intercept for Meta CAPI
        client_ip = request.headers.get("X-Forwarded-For", request.client.host).split(",")[0].strip()
        user_agent = request.headers.get("User-Agent", "")
        
        event_type_lower = event_data.event_type.lower()
        if event_type_lower in ("addtocart", "initiatecheckout", "viewcontent"):
            meta = event_data.metadata_json or {}
            event_name_map = {
                "addtocart": "AddToCart",
                "initiatecheckout": "InitiateCheckout",
                "viewcontent": "ViewContent"
            }
            event_name = event_name_map[event_type_lower]
            event_id = meta.get("event_id")
            if event_id:
                from app.services.tracking import tracking_service
                import asyncio
                custom_data = {}
                if "currency" in meta:
                    custom_data["currency"] = meta["currency"]
                if "value" in meta:
                    custom_data["value"] = float(meta["value"])
                if "content_ids" in meta:
                    custom_data["content_ids"] = meta["content_ids"]
                    
                asyncio.create_task(
                    tracking_service.send_meta_capi_event(
                        event_name=event_name,
                        event_id=event_id,
                        ip_address=client_ip,
                        user_agent=user_agent,
                        custom_data=custom_data
                    )
                )

        return {"success": True}
    except Exception as e:
        logger.error(f"Failed to record analytics event: {e}")
        return {"success": False}

@router.get("/overview")
async def get_analytics_overview(
    days: int = Query(7, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Get analytics overview data for the admin dashboard."""
    # Use naive datetime for start_date to avoid asyncpg offset issues
    now = datetime.utcnow()
    start_date = now - timedelta(days=days)

    # Query Views
    views_result = await db.execute(
        select(func.count(AnalyticsEvent.id))
        .where(AnalyticsEvent.event_type == "pageview")
        .where(AnalyticsEvent.created_at >= start_date)
    )
    total_views = views_result.scalar_one() or 0

    # Query Unique Visitors
    visitors_result = await db.execute(
        select(func.count(func.distinct(AnalyticsEvent.session_id)))
        .where(AnalyticsEvent.created_at >= start_date)
    )
    unique_visitors = visitors_result.scalar_one() or 0

    # Query Clicks
    clicks_result = await db.execute(
        select(func.count(AnalyticsEvent.id))
        .where(AnalyticsEvent.event_type == "click")
        .where(AnalyticsEvent.created_at >= start_date)
    )
    total_clicks = clicks_result.scalar_one() or 0

    # Query Orders and Revenue (Confirmed / Total)
    orders_result = await db.execute(
        select(
            func.count(Order.id).label("total_orders"),
            func.sum(Order.total).label("total_revenue")
        )
        .where(Order.created_at >= start_date)
        .where(Order.status == "confirmed")
    )
    orders_row = orders_result.one()
    confirmed_orders = orders_row.total_orders or 0
    revenue = float(orders_row.total_revenue or 0.0)

    # Conversion Rate (Orders / Unique Visitors)
    conversion_rate = (confirmed_orders / unique_visitors * 100) if unique_visitors > 0 else 0.0

    # Daily Chart Data
    # For daily stats we can group by DATE(created_at) using PostgreSQL specific syntax
    # since we are using postgresql.
    chart_query = text("""
        SELECT
            CAST(e.created_at AS DATE) as date,
            COUNT(e.id) as views
        FROM analytics_events e
        WHERE e.event_type = 'pageview' AND e.created_at >= :start_date
        GROUP BY CAST(e.created_at AS DATE)
        ORDER BY CAST(e.created_at AS DATE) ASC
    """)
    views_chart_res = await db.execute(chart_query, {"start_date": start_date})
    views_by_date = {row[0].strftime("%Y-%m-%d"): row[1] for row in views_chart_res.all()}

    orders_chart_query = text("""
        SELECT
            CAST(o.created_at AS DATE) as date,
            COUNT(o.id) as orders,
            SUM(o.total) as revenue
        FROM orders o
        WHERE o.created_at >= :start_date AND o.status = 'confirmed'
        GROUP BY CAST(o.created_at AS DATE)
        ORDER BY CAST(o.created_at AS DATE) ASC
    """)
    orders_chart_res = await db.execute(orders_chart_query, {"start_date": start_date})
    orders_by_date = {row[0].strftime("%Y-%m-%d"): {"orders": row[1], "revenue": float(row[2] or 0.0)} for row in orders_chart_res.all()}

    # Merge chart data
    chart_data = []
    # Create list of days
    for i in range(days):
        d = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        chart_data.append({
            "date": d,
            "views": views_by_date.get(d, 0),
            "orders": orders_by_date.get(d, {}).get("orders", 0),
            "revenue": orders_by_date.get(d, {}).get("revenue", 0.0),
        })

    return {
        "success": True,
        "stats": {
            "views": total_views,
            "visitors": unique_visitors,
            "clicks": total_clicks,
            "revenue": revenue,
            "orders": confirmed_orders,
            "conversionRate": round(conversion_rate, 2),
        },
        "chartData": chart_data
    }
