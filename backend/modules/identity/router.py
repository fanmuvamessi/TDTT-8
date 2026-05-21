from fastapi import APIRouter

router = APIRouter()

@router.get("/status", summary="Kiểm tra trạng thái Module Identity")
def get_status():
    return {
        "module": "identity",
        "status": "active",
        "description": "Quản lý định danh, đăng nhập Google & phân quyền"
    }
