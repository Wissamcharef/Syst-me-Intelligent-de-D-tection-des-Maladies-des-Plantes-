from datetime import datetime, timezone
from time import perf_counter
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

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
    start = perf_counter()
    try:
        prediction = await predict_disease(file)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    execution_time_ms = round((perf_counter() - start) * 1000, 2)
    created_at = datetime.now(timezone.utc).isoformat()

    with get_connection() as conn:
        cursor = conn.execute(
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

    return PredictionResponse(
        id=cursor.lastrowid,
        created_at=created_at,
        execution_time_ms=execution_time_ms,
        **prediction,
    )


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