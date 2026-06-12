from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
import uuid
from app.database import Base


class Disease(Base):
    __tablename__ = "diseases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    crop_name = Column(String(255), nullable=False, index=True)
    disease_name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    symptoms = Column(ARRAY(Text), nullable=False, default=[])
    treatment = Column(ARRAY(Text), nullable=False, default=[])
    prevention = Column(ARRAY(Text), nullable=False, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Disease {self.crop_name} - {self.disease_name}>"
