from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.modules.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Cấu hình CORS linh hoạt từ .env (hỗ trợ JSON và Comma-separated)
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Đăng ký Router tổng dưới prefix chung (ví dụ: /api)
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get(settings.API_V1_STR, tags=["General"])
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

@app.get(f"{settings.API_V1_STR}/health", tags=["General"])
def health_check():
    return {
        "status": "ok",
        "environment": settings.ENV,
        "database_configured": bool(settings.DATABASE_URL)
    }
