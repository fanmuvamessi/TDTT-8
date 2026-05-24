from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class RegisterRequest(BaseModel):
    email: Optional[str] = Field(None, description="Địa chỉ email đăng ký")
    phone_number: Optional[str] = Field(None, description="Số điện thoại đăng ký (tuỳ chọn)")
    password: str = Field(..., min_length=6, description="Mật khẩu đăng ký (tối thiểu 6 ký tự)")
    full_name: Optional[str] = Field(None, description="Họ và tên người dùng")
    avatar_url: Optional[str] = Field(None, description="Đường dẫn ảnh đại diện")

class LoginRequest(BaseModel):
    email: Optional[str] = Field(None, description="Email hoặc Số điện thoại đăng nhập")
    phone_number: Optional[str] = Field(None, description="Số điện thoại đăng nhập (nếu tách riêng)")
    username: Optional[str] = Field(None, description="Trường đăng nhập chung (Email hoặc SĐT)")
    password: str = Field(..., description="Mật khẩu")

class UserResponse(BaseModel):
    id: int
    firebase_uid: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    meta_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
