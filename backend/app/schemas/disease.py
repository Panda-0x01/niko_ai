from pydantic import BaseModel
from typing import List
import uuid


class DiseaseResponse(BaseModel):
    id: uuid.UUID
    crop_name: str
    disease_name: str
    description: str
    symptoms: List[str]
    treatment: List[str]
    prevention: List[str]

    model_config = {"from_attributes": True}
