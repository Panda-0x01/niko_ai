import uuid
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.prediction import Prediction
from app.models.disease import Disease
from app.models.user import User
from app.schemas.prediction import PredictResponse
from app.config import get_settings
from app.ml.inference import get_predictor

settings = get_settings()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = settings.MAX_FILE_SIZE_MB * 1024 * 1024  # bytes


def _validate_image(file: UploadFile) -> None:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unsupported file type. Allowed: JPG, JPEG, PNG",
        )


async def _save_upload(file: UploadFile, user_id: str) -> tuple[bytes, str, str]:
    """
    Read file bytes, validate size, persist to disk.
    Returns (raw_bytes, file_path, image_url).
    """
    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE_MB} MB",
        )

    upload_dir = Path(settings.UPLOAD_DIR) / user_id
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_id = str(uuid.uuid4())
    ext = Path(file.filename or "image.jpg").suffix.lower() or ".jpg"
    filename = f"{file_id}{ext}"
    file_path = upload_dir / filename

    with open(file_path, "wb") as f:
        f.write(contents)

    image_url = f"/uploads/{user_id}/{filename}"
    return contents, str(file_path), image_url


async def predict_disease(
    db: Session,
    user: User,
    file: UploadFile,
) -> PredictResponse:
    _validate_image(file)
    raw_bytes, file_path, image_url = await _save_upload(file, str(user.id))

    # Run HuggingFace DINOv2 inference
    predictor = get_predictor()
    result = predictor.predict_from_bytes(raw_bytes)

    crop_name = result["crop"]
    disease_name = result["disease"]
    confidence = result["confidence"]

    # Fetch disease knowledge from DB (case-insensitive match)
    disease_record = (
        db.query(Disease)
        .filter(
            Disease.crop_name.ilike(crop_name),
            Disease.disease_name.ilike(disease_name),
        )
        .first()
    )

    description = disease_record.description if disease_record else "No description available for this diagnosis."
    symptoms   = disease_record.symptoms   if disease_record else []
    treatment  = disease_record.treatment  if disease_record else []
    prevention = disease_record.prevention if disease_record else []

    # Persist prediction
    prediction = Prediction(
        user_id=user.id,
        crop_name=crop_name,
        disease_name=disease_name,
        confidence=confidence,
        image_url=image_url,
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return PredictResponse(
        crop=crop_name,
        disease=disease_name,
        confidence=round(confidence, 4),
        description=description,
        symptoms=symptoms,
        treatment=treatment,
        prevention=prevention,
        prediction_id=prediction.id,
        image_url=image_url,
    )


def get_user_predictions(
    db: Session,
    user_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
):
    return (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id)
        .order_by(Prediction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_prediction_by_id(
    db: Session,
    prediction_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Prediction:
    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.id == prediction_id,
            Prediction.user_id == user_id,
        )
        .first()
    )
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found",
        )
    return prediction
