from fastapi import APIRouter

router = APIRouter()

@router.get("/status", summary="Kiểm tra trạng thái Module Content")
def get_status():
    return {
        "module": "content",
        "status": "active",
        "description": "Quản lý media, tải video review & thuật toán Feed"
    }
