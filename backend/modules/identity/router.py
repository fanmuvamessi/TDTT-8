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

@router.get(
    "/users/me/profile",
    response_model=schemas.UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Lấy hồ sơ cá nhân của chính mình",
    description="Truy xuất thông tin hồ sơ blogger chi tiết của chính người dùng hiện tại đang đăng nhập."
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return services.get_user_profile(db=db, user_id=current_user.id)

@router.get(
    "/users/{user_id}/profile",
    response_model=schemas.UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Lấy hồ sơ cá nhân của blogger khác",
    description="Truy xuất thông tin hồ sơ blogger chi tiết của bất kỳ người dùng nào qua ID công khai."
)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    return services.get_user_profile(db=db, user_id=user_id)

@router.post(
    "/google",
    response_model=schemas.TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Đăng nhập tài khoản bằng Google ID Token",
    description="Xác thực người dùng bằng Google ID Token từ Frontend Firebase SDK. Trả về Access Token và hồ sơ người dùng."
)
def login_google(
    data: schemas.GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    return services.login_google_user(db=db, data=data)