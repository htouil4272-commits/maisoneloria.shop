from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order
from app.schemas.order import OrderCreateSchema


class OrderService:
    @staticmethod
    async def generate_order_number(db: AsyncSession) -> str:
        result = await db.execute(select(func.count(Order.id)))
        count = result.scalar() or 0
        return f"ELO-{count + 1:04d}"

    @staticmethod
    async def create_order(
        db: AsyncSession,
        order_data: OrderCreateSchema,
        ip_address: str,
        user_agent: str,
        fraud_result: dict,
    ) -> Order:
        order_number = await OrderService.generate_order_number(db)

        order = Order(
            order_number=order_number,
            customer_name=order_data.customer_name,
            customer_phone=order_data.customer_phone,
            items=[item.model_dump(mode="json") for item in order_data.items],
            total=order_data.total,
            status="pending",
            ip_address=ip_address,
            country=fraud_result.get("country"),
            city=fraud_result.get("city"),
            is_vpn=fraud_result.get("is_vpn", False),
            fraud_score=fraud_result.get("fraud_score", 0),
            user_agent=user_agent,
            page_url=order_data.page_url,
            utm_source=order_data.utm_source,
            utm_medium=order_data.utm_medium,
            utm_campaign=order_data.utm_campaign,
            fbclid=order_data.fbclid,
            ttclid=order_data.ttclid,
            sclid=order_data.sclid,
            fb_event_id=order_data.fb_event_id,
        )

        db.add(order)
        await db.commit()
        await db.refresh(order)

        return order

    @staticmethod
    async def get_by_order_number(db: AsyncSession, order_number: str) -> Order | None:
        result = await db.execute(
            select(Order).where(Order.order_number == order_number)
        )
        return result.scalar_one_or_none()
