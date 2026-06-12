from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid


class PredictionCreate(BaseModel):
    crop_name: str
    disease_name: str
    confidence: float
    image_url: Optional[str] = None


class PredictionResponse(BaseModel):
    id: uuid.UUID
    crop_name: str
    disease_name: str
    confidence: float
    image_url: Optional[str] = None
    created_at: datetime
    description: Optional[str] = None
    symptoms: Optional[List[str]] = None
    treatment: Optional[List[str]] = None
    prevention: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class PredictRequest(BaseModel):
    pass  # File upload handled via multipart form


class PredictResponse(BaseModel):
    crop: str
    disease: str
    confidence: float
    description: str
    symptoms: List[str]
    treatment: List[str]
    prevention: List[str]
    prediction_id: uuid.UUID
    image_url: Optional[str] = None
