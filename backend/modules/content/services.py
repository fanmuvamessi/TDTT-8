import uuid
import boto3
from botocore.config import Config
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from backend.core.config import settings
from backend.core.all_models import Video, Merchant, Campaign
from backend.modules.content.schemas import VideoCreate
from backend.core.database import SessionLocal, Base

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
        post_type=video_in.post_type or "video",
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
    Lấy danh sách video (cho Feed) có phân trang (cũ).
    """
    return db.query(Video).offset(skip).limit(limit).all()

def get_video_feed(db: Session, cursor: Optional[str] = None, limit: int = 8, post_type: Optional[str] = None) -> dict:
    """
    Lấy danh sách video (cho Feed) có phân trang bằng Cursor
    và tự động trộn quảng cáo (Campaign) theo tỷ lệ 4:1.
    """
    # 1. Giải mã cursor
    cursor_data = decode_cursor(cursor)
    
    # 2. Truy vấn video thường (organic)
    query = db.query(Video)
    if post_type:
        query = query.filter(Video.post_type == post_type)
        
    if cursor_data:
        cursor_time, cursor_id = cursor_data
        query = query.filter(
            (Video.created_at < cursor_time) | 
            ((Video.created_at == cursor_time) & (Video.id < cursor_id))
        )
    
    # Lấy thêm 1 phần tử để xác định has_next
    query = query.order_by(Video.created_at.desc(), Video.id.desc())
    organic_videos = query.limit(limit + 1).all()
    
    # 3. Tính toán next_cursor
    has_next = len(organic_videos) > limit
    if has_next:
        organic_videos = organic_videos[:limit]
        last_video = organic_videos[-1]
        next_cursor = encode_cursor(last_video.created_at, last_video.id)
    else:
        next_cursor = None
        
    # 4. Lấy các chiến dịch quảng cáo (Ads) đang hoạt động
    active_campaigns = db.query(Campaign).filter(Campaign.is_active == True).all()
    
    # 5. Trộn Feed theo tỷ lệ 4 thường : 1 quảng cáo
    mixed_items = []
    campaigns_to_track = []
    ad_index = 0
    
    for i, video in enumerate(organic_videos):
        mixed_items.append(video)
        
        # Cứ sau 4 video thường, nếu có QC hoạt động thì chèn vào
        if (i + 1) % 4 == 0 and active_campaigns:
            campaign = active_campaigns[ad_index % len(active_campaigns)]
            ad_index += 1
            
            # Đóng gói campaign giống cấu trúc của VideoResponse
            ad_item = {
                "id": campaign.id,
                "title": campaign.title,
                "video_url": campaign.video_url,
                "thumbnail_url": campaign.thumbnail_url,
                "description": f"Được tài trợ bởi {campaign.merchant.name if campaign.merchant else ''}",
                "status": "approved",
                "likes_count": 0,
                "reviewer_id": 0,
                "tagged_merchant_id": campaign.merchant_id,
                "created_at": campaign.created_at,
                "is_ads": True,
                "user": {
                    "id": 0,
                    "full_name": campaign.merchant.name if campaign.merchant else "Được tài trợ",
                    "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                    "username": "sponsored"
                },
                "restaurant": {
                    "id": campaign.merchant_id,
                    "name": campaign.merchant.name if campaign.merchant else "",
                    "address": campaign.merchant.address if campaign.merchant else "",
                    "latitude": campaign.merchant.latitude if campaign.merchant else 0.0,
                    "longitude": campaign.merchant.longitude if campaign.merchant else 0.0
                } if campaign.merchant else None
            }
            mixed_items.append(ad_item)
            campaigns_to_track.append(campaign.id)
            
    return {
        "items": mixed_items,
        "next_cursor": next_cursor,
        "campaigns_to_track": campaigns_to_track
    }

from backend.common.pagination import decode_cursor, encode_cursor

def increment_campaign_impressions(campaign_ids: list[int]):
    """
    Tăng impressions_count của các chiến dịch quảng cáo được hiển thị trong tiến trình nền.
    Tạo và đóng kết nối riêng biệt để tránh tranh chấp khoá (lock) SQLite.
    """
    if not campaign_ids:
        return
    db = SessionLocal()
    try:
        db.query(Campaign).filter(Campaign.id.in_(campaign_ids)).update(
            {Campaign.impressions_count: Campaign.impressions_count + 1},
            synchronize_session=False
        )
        db.commit()
        print(f"[CONTENT] Đã tăng impressions cho các chiến dịch: {campaign_ids}")
    except Exception as e:
        db.rollback()
        print(f"[CONTENT] Lỗi khi tăng impressions trong background task: {e}")
    finally:
        db.close()
