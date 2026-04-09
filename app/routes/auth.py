import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token

from app.config import settings
from app.db import get_connection
from app.dependencies import get_current_user
from app.schemas.auth import (
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import create_token, hash_password, verify_password

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest) -> TokenResponse:
    with get_connection() as conn:
        existing = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            (payload.email.lower(),),
        ).fetchone()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists",
            )

        created_at = datetime.now(timezone.utc).isoformat()
        password_hash = hash_password(payload.password)
        cursor = conn.execute(
            "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (payload.name, payload.email.lower(), password_hash, created_at),
        )
        conn.commit()
        user_id = cursor.lastrowid

    user = UserResponse(
        id=user_id,
        name=payload.name,
        email=payload.email.lower(),
        created_at=created_at,
    )
    token = create_token(user_id=user_id, email=user.email)
    return TokenResponse(access_token=token, user=user)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?",
            (payload.email.lower(),),
        ).fetchone()

        if row is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if row["password_hash"] == "GOOGLE_AUTH":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Use Google Login for this account",
            )

        if not verify_password(payload.password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        user = UserResponse(
            id=row["id"],
            name=row["name"],
            email=row["email"],
            created_at=row["created_at"],
        )
        token = create_token(user_id=user.id, email=user.email)
        return TokenResponse(access_token=token, user=user)


@router.post("/google", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest) -> TokenResponse:
    try:
        id_info = id_token.verify_oauth2_token(
            payload.credential,
            requests.Request(),
            settings.google_client_id if settings.google_client_id else None,
        )
    except Exception as exc:
        logger.warning("Google token verification failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential (check Client ID and authorized origins in Google Cloud)",
        ) from exc

    email = str(id_info.get("email", "")).lower()
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is missing",
        )

    name = (
        str(id_info.get("name", "")).strip()
        or str(id_info.get("given_name", "")).strip()
        or "Google User"
    )

    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, name, email, created_at FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if row is None:
            created_at = datetime.now(timezone.utc).isoformat()
            cursor = conn.execute(
                "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (name, email, "GOOGLE_AUTH", created_at),
            )
            conn.commit()
            user = UserResponse(
                id=cursor.lastrowid,
                name=name,
                email=email,
                created_at=created_at,
            )
        else:
            user = UserResponse(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                created_at=row["created_at"],
            )

    token = create_token(user_id=user.id, email=user.email)
    return TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=UserResponse)
def me(current_user: dict = Depends(get_current_user)) -> UserResponse:
    return UserResponse(**current_user)