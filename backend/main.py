import os
import sys

# Thêm thư mục cha vào sys.path để hỗ trợ chạy từ cả thư mục backend và thư mục gốc của dự án
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.append(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.database import engine, Base
from backend.core import all_models  # Đảm bảo tất cả models đã được import để tự động tạo bảng
from backend.modules.search_interact.router import router as search_interact_router

# Tự động tạo các bảng cơ sở dữ liệu nếu chưa tồn tại
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Food Review API",
    description="Hệ thống Backend MVP cho mạng xã hội & Đánh giá ẩm thực Food Review",
    version="1.0.0"
)

# Cấu hình CORS để frontend có thể gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Trong thực tế nên giới hạn domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các routers của module
app.include_router(search_interact_router)

@app.get("/api")
def read_root():
    return {"message": "Welcome to Food Review API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "environment": "Local/Vercel"}
