from fastapi import APIRouter

router = APIRouter()

@router.get("/status", summary="Kiểm tra trạng thái Module Merchant")
def get_status():
    return {
        "module": "merchant",
        "status": "active",
        "description": "Quản lý cửa hàng (Merchant) & thực đơn (Menu)"
    }
