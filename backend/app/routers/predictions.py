from fastapi import APIRouter, Depends, File, UploadFile, status, Query
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.user import User
from app.models.prediction import Prediction
from app.models.disease import Disease
from app.schemas.prediction import PredictResponse, PredictionResponse
from app.core.dependencies import get_current_user
from app.services.prediction_service import predict_disease, get_user_predictions, get_prediction_by_id

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.post("/predict", response_model=PredictResponse, status_code=status.HTTP_201_CREATED)
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a crop leaf image and get disease prediction."""
    return await predict_disease(db, current_user, file)


@router.get("/history", response_model=List[PredictionResponse])
def history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get diagnosis history for the current user."""
    predictions = get_user_predictions(db, current_user.id, skip=skip, limit=limit)
    results = []
    for p in predictions:
        disease = (
            db.query(Disease)
            .filter(
                Disease.crop_name.ilike(p.crop_name),
                Disease.disease_name.ilike(p.disease_name),
            )
            .first()
        )
        results.append(
            PredictionResponse(
                id=p.id,
                crop_name=p.crop_name,
                disease_name=p.disease_name,
                confidence=p.confidence,
                image_url=p.image_url,
                created_at=p.created_at,
                description=disease.description if disease else None,
                symptoms=disease.symptoms if disease else [],
                treatment=disease.treatment if disease else [],
                prevention=disease.prevention if disease else [],
            )
        )
    return results


@router.get("/history/{prediction_id}", response_model=PredictionResponse)
def get_prediction(
    prediction_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific prediction by ID."""
    prediction = get_prediction_by_id(db, prediction_id, current_user.id)
    disease = (
        db.query(Disease)
        .filter(
            Disease.crop_name.ilike(prediction.crop_name),
            Disease.disease_name.ilike(prediction.disease_name),
        )
        .first()
    )
    return PredictionResponse(
        id=prediction.id,
        crop_name=prediction.crop_name,
        disease_name=prediction.disease_name,
        confidence=prediction.confidence,
        image_url=prediction.image_url,
        created_at=prediction.created_at,
        description=disease.description if disease else None,
        symptoms=disease.symptoms if disease else [],
        treatment=disease.treatment if disease else [],
        prevention=disease.prevention if disease else [],
    )


@router.delete("/history/{prediction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prediction(
    prediction_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a prediction from history."""
    prediction = get_prediction_by_id(db, prediction_id, current_user.id)
    db.delete(prediction)
    db.commit()
