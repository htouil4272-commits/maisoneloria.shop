import secrets

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order
from app.schemas.order import OrderCreateSchema


class OrderService:
    @staticmethod
    def _new_order_token() -> str:
        """Unique-ish token, max length 20 to fit orders.order_number."""
        return f"ELO-{secrets.token_hex(5).upper()}"

    @staticmethod
    async def create_order(
        db: AsyncSession,
        order_data: OrderCreateSchema,
        ip_address: str,
        user_agent: str,
        fraud_result: dict,
    ) -> Order:
        last_error: IntegrityError | None = None
        for _ in range(6):
            order_number = OrderService._new_order_token()
            order = Order(
                order_number=order_number,
                customer_name=order_data.customer_name,
                customer_phone=order_data.customer_phone,
                items=[item.model_dump(mode="json") for item in order_data.items],
                total=order_data.total,
                status="pending",
                ip_address=ip_address,
                country=fraud_result.get("country"),
                city=order_data.customer_city,
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
            try:
                await db.commit()
                await db.refresh(order)
                return order
            except IntegrityError as e:
                last_error = e
                await db.rollback()
        raise last_error  # type: ignore[misc]

    @staticmethod
    async def get_by_order_number(db: AsyncSession, order_number: str) -> Order | None:
        result = await db.execute(
            select(Order).where(Order.order_number == order_number)
        )
        return result.scalar_one_or_none()
