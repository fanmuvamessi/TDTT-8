from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.core.all_models import User
from backend.core.security import get_current_user
from backend.modules.identity import schemas, services

router = APIRouter(tags=["Auth & Identity"])

@router.get("/status", summary="Kiểm tra trạng thái Module Identity")
def get_status():
    return {
        "module": "identity",
        "status": "active",
        "description": "Quản lý định danh, đăng nhập & phân quyền"
    }

@router.post(
    "/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Đăng ký tài khoản người dùng mới",
    description="Tạo tài khoản mới bằng Email/Số điện thoại và Mật khẩu. Hỗ trợ tự động tạo tài khoản trên Firebase và đồng bộ DB local."
)
def register(
    data: schemas.RegisterRequest,
    db: Session = Depends(get_db)
):
    return services.register_user(db=db, data=data)

@router.post(
    "/login",
    response_model=schemas.TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Đăng nhập tài khoản người dùng",
    description="Xác thực thông tin tài khoản bằng Email/Số điện thoại và Mật khẩu. Trả về JWT Access Token (Firebase ID Token hoặc Mock Token) và thông tin người dùng."
)
def login(
    data: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    return services.login_user(db=db, data=data)