from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PresignedUrlRequest(BaseModel):
    file_name: str
    content_type: str
    folder: Optional[str] = "general"  # e.g., videos, menus

class PresignedUrlResponse(BaseModel):
    upload_url: str
    public_url: str
    key: str

class VideoCreate(BaseModel):
    title: str
    video_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    tagged_merchant_id: Optional[int] = None

class VideoResponse(BaseModel):
    id: int
    title: str
    video_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    status: str
    likes_count: int
    reviewer_id: int
    tagged_merchant_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
