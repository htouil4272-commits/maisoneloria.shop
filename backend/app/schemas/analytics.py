from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class AnalyticsEventCreate(BaseModel):
    session_id: str
    event_type: str
    path: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None
