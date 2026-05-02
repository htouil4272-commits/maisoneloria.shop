import asyncio
import logging

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.order import OrderCreateSchema, OrderResponseSchema, OrderDetailSchema
from app.services.order_service import OrderService
from app.services.fraud import fraud_service
from app.services.sheets import sheets_service
from app.services.tracking import tracking_service
from app.middleware.rate_limit import RateLimiter

logger = logging.getLogger(__name__)

router = APIRouter()

order_rate_limiter = RateLimiter(max_requests=5, window_seconds=600)


@router.post("/orders", response_model=dict)
async def create_order(
    order_data: OrderCreateSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    client_ip = request.headers.get("X-Forwarded-For", request.client.host).split(",")[0].strip()
    user_agent = request.headers.get("User-Agent", "")

    if not order_rate_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=429,
            detail="لقد تجاوزت الحد المسموح. حاول مرة أخرى لاحقاً",
        )

    fraud_result = await fraud_service.check_order(client_ip, order_data.customer_phone, user_agent)

    if not fraud_result["allowed"]:
        logger.warning(f"Order blocked by fraud check: ip={client_ip}, reason={fraud_result['reason']}")
        raise HTTPException(
            status_code=403,
            detail="عذراً، لا يمكن معالجة طلبك حالياً. يرجى المحاولة لاحقاً",
        )

    order = await OrderService.create_order(
        db=db,
        order_data=order_data,
        ip_address=client_ip,
        user_agent=user_agent,
        fraud_result=fraud_result,
    )

    asyncio.create_task(_post_order_tasks(order, order_data))

    return {
        "success": True,
        "order": OrderResponseSchema(
            order_number=order.order_number,
            status=order.status,
            total=order.total,
            delivery_estimate="2-4 أيام عمل",
            created_at=order.created_at,
        ).model_dump(),
    }


async def _post_order_tasks(order, order_data: OrderCreateSchema):
    try:
        await sheets_service.append_order(order)
    except Exception as e:
        logger.error(f"Google Sheets error: {e}")

    phone_international = "+212" + order.customer_phone[1:]

    tasks = []
    tasks.append(tracking_service.send_fb_capi_event(order, phone_international))
    tasks.append(tracking_service.send_tiktok_capi_event(order, phone_international))
    tasks.append(tracking_service.send_snap_capi_event(order, phone_international))

    results = await asyncio.gather(*tasks, return_exceptions=True)
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.error(f"CAPI event {i} failed: {result}")


@router.get("/orders/{order_number}")
async def get_order(order_number: str, db: AsyncSession = Depends(get_db)):
    order = await OrderService.get_by_order_number(db, order_number)
    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")

    return OrderDetailSchema(
        order_number=order.order_number,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        items=order.items,
        total=order.total,
        status=order.status,
        created_at=order.created_at,
        updated_at=order.updated_at,
    ).model_dump()
