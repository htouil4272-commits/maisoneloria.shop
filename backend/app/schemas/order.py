import re
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, field_validator, model_validator

MOROCCAN_PHONE_REGEX = re.compile(r"^(06|07)\d{8}$")


class OrderItemSchema(BaseModel):
    product_name: str
    variant: Optional[str] = None
    quantity: int
    price: Decimal

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError("الكمية يجب أن تكون 1 على الأقل")
        return v

    @field_validator("price")
    @classmethod
    def price_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("السعر يجب أن يكون أكبر من 0")
        return v


class OrderCreateSchema(BaseModel):
    customer_name: str
    customer_phone: str
    customer_city: str
    items: List[OrderItemSchema]
    total: Decimal
    page_url: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    fbclid: Optional[str] = None
    ttclid: Optional[str] = None
    sclid: Optional[str] = None
    fb_event_id: Optional[str] = None

    @field_validator("customer_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("الاسم يجب أن يكون 3 أحرف على الأقل")
        return v

    @field_validator("customer_phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip().replace(" ", "")
        if not MOROCCAN_PHONE_REGEX.match(v):
            raise ValueError("رقم الهاتف غير صالح. يجب أن يبدأ بـ 06 أو 07 متبوعاً بـ 8 أرقام")
        return v

    @field_validator("customer_city")
    @classmethod
    def validate_city(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("المرجو اختيار المدينة")
        return v

    @field_validator("items")
    @classmethod
    def validate_items(cls, v: List[OrderItemSchema]) -> List[OrderItemSchema]:
        if not v:
            raise ValueError("يجب إضافة منتج واحد على الأقل")
        return v

    @model_validator(mode="after")
    def validate_total(self):
        calculated = sum(item.price * item.quantity for item in self.items)
        if abs(self.total - calculated) > Decimal("0.01"):
            raise ValueError("المجموع غير متطابق مع المنتجات")
        return self


class OrderResponseSchema(BaseModel):
    order_number: str
    status: str
    total: Decimal
    delivery_estimate: str
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderDetailSchema(BaseModel):
    order_number: str
    customer_name: str
    customer_phone: str
    items: list
    total: Decimal
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AdminOrderSchema(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    items: list
    total: Decimal
    status: str
    ip_address: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    is_vpn: bool = False
    fraud_score: Decimal = Decimal("0")
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderListResponseSchema(BaseModel):
    orders: List[AdminOrderSchema]
    total: int
    page: int
    per_page: int
    pages: int


class OrderStatusUpdateSchema(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"]
        if v not in allowed:
            raise ValueError(f"الحالة غير صالحة. القيم المسموحة: {', '.join(allowed)}")
        return v
