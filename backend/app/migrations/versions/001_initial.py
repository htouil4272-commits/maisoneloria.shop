"""Initial migration - create orders and leads tables

Revision ID: 001
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_number", sa.String(20), unique=True, nullable=False),
        sa.Column("customer_name", sa.String(255), nullable=False),
        sa.Column("customer_phone", sa.String(20), nullable=False),
        sa.Column("items", JSONB, nullable=False),
        sa.Column("total", sa.DECIMAL(10, 2), nullable=False),
        sa.Column("status", sa.String(50), server_default="pending"),
        sa.Column("ip_address", sa.String(45)),
        sa.Column("country", sa.String(2)),
        sa.Column("city", sa.String(100)),
        sa.Column("is_vpn", sa.Boolean(), server_default="false"),
        sa.Column("fraud_score", sa.DECIMAL(5, 2), server_default="0"),
        sa.Column("user_agent", sa.Text()),
        sa.Column("page_url", sa.Text()),
        sa.Column("utm_source", sa.String(100)),
        sa.Column("utm_medium", sa.String(100)),
        sa.Column("utm_campaign", sa.String(100)),
        sa.Column("fbclid", sa.String(255)),
        sa.Column("ttclid", sa.String(255)),
        sa.Column("sclid", sa.String(255)),
        sa.Column("fb_event_id", sa.String(255)),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_index("ix_orders_order_number", "orders", ["order_number"])
    op.create_index("ix_orders_status", "orders", ["status"])
    op.create_index("ix_orders_created_at", "orders", ["created_at"])
    op.create_index("ix_orders_customer_phone", "orders", ["customer_phone"])

    op.create_table(
        "leads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255)),
        sa.Column("phone", sa.String(20)),
        sa.Column("message", sa.Text()),
        sa.Column("source", sa.String(50)),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_index("ix_leads_source", "leads", ["source"])
    op.create_index("ix_leads_created_at", "leads", ["created_at"])


def downgrade() -> None:
    op.drop_table("leads")
    op.drop_table("orders")
