from fastapi import APIRouter

router = APIRouter()

@router.get("/status", summary="Kiểm tra trạng thái Module Search & Interact")
def get_status():
    return {
        "module": "search_interact",
        "status": "active",
        "description": "Quản lý tìm kiếm không gian (Geo-Search) & tương tác (Like/Comment)"
    }
