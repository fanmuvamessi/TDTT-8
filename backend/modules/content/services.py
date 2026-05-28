import uuid
import boto3
from botocore.config import Config
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.core.all_models import Video, Merchant
from backend.modules.content.schemas import VideoCreate

def get_r2_client():
    """
    Khởi tạo dynamic boto3 client cho Cloudflare R2.
    Tránh lỗi crash lúc import module nếu biến cấu hình chưa được định nghĩa đầy đủ.
    """
    if (not settings.CLOUDFLARE_R2_ACCOUNT_ID or 
        not settings.CLOUDFLARE_R2_ACCESS_KEY_ID or 
        not settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Dịch vụ lưu trữ đám mây Cloudflare R2 chưa được cấu hình đầy đủ."
        )
    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.CLOUDFLARE_R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        config=Config(signature_version="s3v4"),
        region_name="auto"
    )

def generate_presigned_upload_url(file_name: str, content_type: str, folder: str = "general") -> dict:
    """
    Tạo Presigned URL (PUT method) cho phép client upload file thẳng lên Cloudflare R2.
    """
    # 1. Tạo tên file duy nhất tránh ghi đè dữ liệu
    ext = file_name.split(".")[-1] if "." in file_name else ""
    unique_filename = f"{uuid.uuid4()}"
    if ext:
        unique_filename = f"{unique_filename}.{ext}"
        
    key = f"{folder}/{unique_filename}"
    
    # 2. Tạo client và sinh Presigned URL
    try:
        s3_client = get_r2_client()
        upload_url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": settings.CLOUDFLARE_R2_BUCKET_NAME,
                "Key": key,
                "ContentType": content_type
            },
            ExpiresIn=3600  # Link có hiệu lực trong 1 giờ
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi khởi tạo Presigned URL: {str(e)}"
        )
        
    # 3. Tạo Public URL để truy cập file sau khi upload thành công
    public_url_base = settings.CLOUDFLARE_R2_PUBLIC_URL
    if public_url_base:
        # Đảm bảo đường dẫn chuẩn xác
        public_url_base = public_url_base.rstrip("/")
        public_url = f"{public_url_base}/{key}"
    else:
        # Fallback về địa chỉ mặc định của Cloudflare R2
        public_url = f"https://pub-{settings.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/{settings.CLOUDFLARE_R2_BUCKET_NAME}/{key}"
        
    return {
        "upload_url": upload_url,
        "public_url": public_url,
        "key": key
    }

def create_video(db: Session, video_in: VideoCreate, reviewer_id: int) -> Video:
    """
    Lưu thông tin siêu dữ liệu (Metadata) của Video vào PostgreSQL.
    """
    # Xử lý chuẩn hóa tagged_merchant_id: nếu là 0 hoặc bé hơn, coi như không gắn thẻ (None)
    tagged_merchant_id = video_in.tagged_merchant_id
    if tagged_merchant_id is not None and tagged_merchant_id <= 0:
        tagged_merchant_id = None

    # Xác minh nhà hàng được gắn thẻ nếu có
    if tagged_merchant_id is not None:
        merchant = db.query(Merchant).filter(Merchant.id == tagged_merchant_id).first()
        if not merchant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nhà hàng/Cửa hàng được gắn thẻ không tồn tại trong hệ thống."
            )
            
    db_video = Video(
        title=video_in.title,
        video_url=video_in.video_url,
        thumbnail_url=video_in.thumbnail_url,
        description=video_in.description,
        reviewer_id=reviewer_id,
        tagged_merchant_id=tagged_merchant_id,
        status="pending"  # Mặc định chờ kiểm duyệt
    )
    
    try:
        db.add(db_video)
        db.commit()
        db.refresh(db_video)
        return db_video
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi lưu trữ thông tin video: {str(e)}"
        )

def get_videos(db: Session, skip: int = 0, limit: int = 10) -> list[Video]:
    """
    Lấy danh sách video (cho Feed) có phân trang.
    """
    return db.query(Video).offset(skip).limit(limit).all()
