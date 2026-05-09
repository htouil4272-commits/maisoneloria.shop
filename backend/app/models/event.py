from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, JSON
from app.database import Base

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), index=True, nullable=False)
    event_type = Column(String(50), index=True, nullable=False) # e.g. "pageview", "click", "add_to_cart"
    path = Column(String(255), nullable=True) # e.g. "/product"
    metadata_json = Column(JSON, nullable=True) # e.g. {"button": "buy_now", "product": "pack_8"}
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
