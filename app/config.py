import os

from pydantic import BaseModel


class Settings(BaseModel):
    secret_key: str = os.getenv("SECRET_KEY", "change-this-secret-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_path: str = os.getenv("DATABASE_PATH", "app_data.db")
    google_client_id: str = os.getenv(
        "GOOGLE_CLIENT_ID",
        "774644744854-123od2rimp87fqov27nivhln25md3a94.apps.googleusercontent.com",
    )


settings = Settings()
