from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, File, UploadFile

from app.db import get_connection
from app.dependencies import get_current_user
from app.schemas.prediction import PredictionHistoryResponse, PredictionResponse
from app.services.predict_service import predict_disease

router = APIRouter()


@router.post("/analyze", response_model=PredictionResponse)
async def analyze_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
) -> PredictionResponse:
    prediction = await predict_disease(file)
    created_at = datetime.now(timezone.utc).isoformat()

    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO predictions
            (user_id, disease_name, confidence, severity, treatment, prevention, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                current_user["id"],
                prediction["disease_name"],
                prediction["confidence"],
                prediction["severity"],
                prediction["treatment"],
                prediction["prevention"],
                created_at,
            ),
        )
        conn.commit()

    return PredictionResponse(created_at=created_at, **prediction)


@router.get("/history", response_model=List[PredictionHistoryResponse])
def get_history(current_user: dict = Depends(get_current_user)) -> List[PredictionHistoryResponse]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, disease_name, confidence, severity, treatment, prevention, created_at
            FROM predictions
            WHERE user_id = ?
            ORDER BY id DESC
            """,
            (current_user["id"],),
        ).fetchall()
    return [PredictionHistoryResponse(**dict(row)) for row in rows]


@router.delete("/history")
def clear_history(current_user: dict = Depends(get_current_user)) -> dict:
    with get_connection() as conn:
        conn.execute("DELETE FROM predictions WHERE user_id = ?", (current_user["id"],))
        conn.commit()
    return {"message": "History cleared"}