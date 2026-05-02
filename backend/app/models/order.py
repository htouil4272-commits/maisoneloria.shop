from datetime import datetime
from decimal import Decimal

from sqlalchemy import String, Text, Boolean, DECIMAL, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    items: Mapped[dict] = mapped_column(JSONB, nullable=False)
    total: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    ip_address: Mapped[str | None] = mapped_column(String(45))
    country: Mapped[str | None] = mapped_column(String(2))
    city: Mapped[str | None] = mapped_column(String(100))
    is_vpn: Mapped[bool] = mapped_column(Boolean, default=False)
    fraud_score: Mapped[Decimal] = mapped_column(DECIMAL(5, 2), default=0)
    user_agent: Mapped[str | None] = mapped_column(Text)
    page_url: Mapped[str | None] = mapped_column(Text)
    utm_source: Mapped[str | None] = mapped_column(String(100))
    utm_medium: Mapped[str | None] = mapped_column(String(100))
    utm_campaign: Mapped[str | None] = mapped_column(String(100))
    fbclid: Mapped[str | None] = mapped_column(String(255))
    ttclid: Mapped[str | None] = mapped_column(String(255))
    sclid: Mapped[str | None] = mapped_column(String(255))
    fb_event_id: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
