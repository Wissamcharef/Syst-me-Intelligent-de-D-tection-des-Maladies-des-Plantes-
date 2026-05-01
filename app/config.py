import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel

_REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_REPO_ROOT / ".env")


def _resolved_path(env_key: str, default_relative: str) -> str:
    raw = os.getenv(env_key, default_relative)
    if os.path.isabs(raw):
        return raw
    return str((_REPO_ROOT / raw).resolve())


def _parse_bool(value: str, default: bool = False) -> bool:
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def _parse_float_list(raw: str) -> list[float] | None:
    if not raw or not raw.strip():
        return None
    parts = [p.strip() for p in raw.split(",") if p.strip()]
    try:
        values = [float(p) for p in parts]
    except ValueError:
        return None
    if len(values) != 3:
        return None
    return values


class Settings(BaseModel):
    secret_key: str = os.getenv("SECRET_KEY", "change-this-secret-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_path: str = _resolved_path("DATABASE_PATH", "app_data.db")
    google_client_id: str = os.getenv(
        "GOOGLE_CLIENT_ID",
        "774644744854-123od2rimp87fqov27nivhln25md3a94.apps.googleusercontent.com",
    )
    predict_mode: str = os.getenv("PREDICT_MODE", "mock")
    remote_predict_url: str = os.getenv("REMOTE_PREDICT_URL", "")
    remote_predict_timeout_seconds: float = float(
        os.getenv("REMOTE_PREDICT_TIMEOUT_SECONDS", "20")
    )
    remote_predict_api_key: str = os.getenv("REMOTE_PREDICT_API_KEY", "")
    model_path: str = _resolved_path("MODEL_PATH", "app/models/model.pth")
    class_names_path: str = _resolved_path(
        "CLASS_NAMES_PATH", "app/models/class_names.json"
    )
    model_input_size: int = int(os.getenv("MODEL_INPUT_SIZE", "256"))
    model_resize_size: int = int(os.getenv("MODEL_RESIZE_SIZE", os.getenv("MODEL_INPUT_SIZE", "256")))
    model_center_crop: bool = _parse_bool(os.getenv("MODEL_CENTER_CROP", "false"))
    model_normalize_mean: list[float] | None = _parse_float_list(os.getenv("MODEL_NORMALIZE_MEAN", ""))
    model_normalize_std: list[float] | None = _parse_float_list(os.getenv("MODEL_NORMALIZE_STD", ""))


settings = Settings()
