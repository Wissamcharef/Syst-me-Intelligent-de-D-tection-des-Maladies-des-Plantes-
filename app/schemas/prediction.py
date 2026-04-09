from pydantic import BaseModel


class PredictionResponse(BaseModel):
    disease_name: str
    confidence: float
    severity: str
    treatment: str
    prevention: str
    created_at: str


class PredictionHistoryResponse(PredictionResponse):
    id: int