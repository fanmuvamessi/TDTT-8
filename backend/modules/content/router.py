from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List

from backend.core.database import get_db
from backend.core.security import get_current_user
from backend.core.all_models import User
from backend.modules.content import services, schemas

router = APIRouter()

@router.get("/status", summary="Kiểm tra trạng thái Module Content")
def get_status():
    return {
        "module": "content",
        "status": "active",
        "description": "Quản lý media, tải video review & thuật toán Feed"
    }

@router.post(
    "/presigned-url",
    response_model=schemas.PresignedUrlResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Khởi tạo link upload trực tiếp lên Cloudflare R2",
    description="Nhận vào tên file và định dạng để backend sinh Presigned PUT URL. Yêu cầu đăng nhập."
)
def get_upload_url(
    payload: schemas.PresignedUrlRequest,
    current_user: User = Depends(get_current_user)
):
    return services.generate_presigned_upload_url(
        file_name=payload.file_name,
        content_type=payload.content_type,
        folder=payload.folder
    )

@router.post(
    "/videos",
    response_model=schemas.VideoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Lưu trữ thông tin siêu dữ liệu (Metadata) của Video review",
    description="Sau khi Client upload file thành công lên R2 bằng Presigned URL, gọi API này để lưu metadata vào Postgres. Yêu cầu đăng nhập."
)
def create_video_metadata(
    payload: schemas.VideoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.create_video(
        db=db,
        video_in=payload,
        reviewer_id=current_user.id
    )

@router.get(
    "/videos",
    response_model=List[schemas.VideoResponse],
    summary="Lấy danh sách các Video review (Feed)",
    description="Truy xuất danh sách video để hiển thị trên bảng tin (Feed) công cộng. Hỗ trợ phân trang."
)
def list_videos(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng bản ghi tối đa trả về"),
    db: Session = Depends(get_db)
):
    return services.get_videos(db=db, skip=skip, limit=limit)
