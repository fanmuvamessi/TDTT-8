import json
import os
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Định vị thư mục chứa file config này để tìm đường dẫn tuyệt đối đến tệp .env
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/core/config.py -> core -> backend
ENV_FILE_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Food Review API"
    API_V1_STR: str = "/api"
    ENV: str = "development"
    
    # CORS Origins - Hỗ trợ cả định dạng JSON Array và Comma-separated list
    CORS_ORIGINS: Union[List[str], str] = []

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return []
            # Nếu chuỗi có định dạng JSON Array (bắt đầu bằng [ và kết thúc bằng ])
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if item]
                except json.JSONDecodeError:
                    pass  # Nếu parse JSON lỗi, fallback sang comma-separated
            
            # Phân tách bằng dấu phẩy (Comma-separated string)
            return [item.strip() for item in v.split(",") if item.strip()]
        elif isinstance(v, list):
            return [str(item).strip() for item in v if item]
        return []

    # URL kết nối Cơ sở dữ liệu PostgreSQL
    DATABASE_URL: str = ""

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fallback_to_sqlite(cls, v: str) -> str:
        if not v or not v.strip():
            print("[DATABASE] Không tìm thấy DATABASE_URL trong .env! Tự động lùi về xài SQLite local.")
            return "sqlite:///./food_review.db"
        return v

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE_PATH) if ENV_FILE_PATH.exists() else ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
