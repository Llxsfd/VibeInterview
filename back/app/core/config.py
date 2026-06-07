from pathlib import Path
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Interview Platform"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    DATABASE_URL: str = "postgresql+psycopg2://postgres:llx123123@localhost:5432/smart_interview_platform"
    POSTGRES_ADMIN_URL: str = "postgresql+psycopg2://postgres:llx123123@localhost:5432/postgres"
    JWT_SECRET_KEY: str = Field(default="change-this-local-dev-secret")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    STORAGE_DIR: Path = Path("storage")
    MAX_UPLOAD_SIZE_MB: int = 50

    OPENAI_API_KEY: str | None = None
    DEEPSEEK_API_KEY: str | None = None
    QWEN_API_KEY: str | None = None
    ASR_PROVIDER_API_KEY: str | None = None
    TTS_PROVIDER_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

settings = Settings()
