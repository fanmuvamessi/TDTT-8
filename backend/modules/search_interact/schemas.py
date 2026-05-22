from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

# User representation in comments/responses
class UserMinResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str

    model_config = ConfigDict(from_attributes=True)

# Likes Schemas
class LikeToggleResponse(BaseModel):
    liked: bool
    likes_count: int
    message: str

# Comments Schemas
class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None

class CommentResponse(BaseModel):
    id: int
    video_id: int
    content: str
    parent_id: Optional[int]
    created_at: datetime
    user: UserMinResponse

    model_config = ConfigDict(from_attributes=True)

# Geo-Search Schemas
class MerchantSearchResponse(BaseModel):
    id: int
    name: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    description: Optional[str] = None
    distance: float  # In kilometers
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
