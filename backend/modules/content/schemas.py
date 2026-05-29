from pydantic import BaseModel, model_validator
from typing import Optional, Any
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
    post_type: Optional[str] = "video"

class VideoUserResponse(BaseModel):
    id: int
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    username: Optional[str] = None

    class Config:
        from_attributes = True

class VideoMerchantResponse(BaseModel):
    id: int
    name: str
    address: Optional[str] = None
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

class VideoResponse(BaseModel):
    id: int
    title: str
    video_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    post_type: str = "video"
    status: str
    likes_count: int
    comments_count: int = 0
    reviewer_id: int
    tagged_merchant_id: Optional[int] = None
    created_at: datetime
    is_ads: Optional[bool] = False
    
    # Các trường lồng nhau ánh xạ theo thiết kế của Frontend
    user: Optional[VideoUserResponse] = None
    restaurant: Optional[VideoMerchantResponse] = None

    @model_validator(mode="before")
    @classmethod
    def map_relations(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Nếu đã là dict (như item QC tự dựng), giữ nguyên
            return data
            
        # Ánh xạ từ ORM model (SQLAlchemy)
        reviewer = getattr(data, "reviewer", None)
        merchant = getattr(data, "tagged_merchant", None)
        
        obj_dict = {
            "id": data.id,
            "title": data.title,
            "video_url": data.video_url,
            "thumbnail_url": data.thumbnail_url,
            "description": data.description,
            "post_type": getattr(data, "post_type", "video"),
            "status": data.status,
            "likes_count": data.likes_count,
            "comments_count": len(getattr(data, "comments", [])) if hasattr(data, "comments") and getattr(data, "comments", []) else 0,
            "reviewer_id": data.reviewer_id,
            "tagged_merchant_id": data.tagged_merchant_id,
            "created_at": data.created_at,
            "is_ads": getattr(data, "is_ads", False),
        }
        
        if reviewer:
            obj_dict["user"] = {
                "id": reviewer.id,
                "full_name": reviewer.full_name or "Người dùng",
                "avatar_url": reviewer.avatar_url or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                "username": reviewer.email.split("@")[0] if reviewer.email else f"user_{reviewer.id}"
            }
        else:
            obj_dict["user"] = None
            
        if merchant:
            obj_dict["restaurant"] = {
                "id": merchant.id,
                "name": merchant.name,
                "address": merchant.address or "",
                "latitude": merchant.latitude,
                "longitude": merchant.longitude
            }
        else:
            obj_dict["restaurant"] = None
            
        return obj_dict

    class Config:
        from_attributes = True

class VideoFeedResponse(BaseModel):
    items: list[VideoResponse]
    next_cursor: Optional[str] = None
