from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    reported_entity_type: str = Field(..., examples=["user", "merchant", "post", "reel"], description="Type of entity being reported")
    reported_entity_id: str = Field(..., description="ID of the entity being reported")
    reason: str = Field(..., description="Reason for the report")

class ReportResponse(BaseModel):
    id: str
    reporter_id: int
    reported_entity_type: str
    reported_entity_id: str
    reason: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReportUpdateStatus(BaseModel):
    status: str = Field(..., examples=["under_review", "resolved", "rejected"], description="New status for the report")