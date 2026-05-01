from pydantic import BaseModel


class TopPrediction(BaseModel):
    disease_name: str
    confidence: float


class PredictionResponse(BaseModel):
    id: int | None = None
    disease_name: str
    confidence: float
    severity: str
    treatment: str
    prevention: str
    created_at: str
    execution_time_ms: float | None = None
    top_predictions: list[TopPrediction] | None = None


class PredictionHistoryResponse(PredictionResponse):
    id: int