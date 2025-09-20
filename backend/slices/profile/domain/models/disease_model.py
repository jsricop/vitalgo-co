"""
Disease SQLAlchemy model for RF002 medical history
"""
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from shared.database import Base


class Disease(Base):
    """Disease model for storing patient medical conditions"""

    __tablename__ = "diseases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    name = Column(String(200), nullable=False, index=True)  # Disease/condition name
    diagnosis_date = Column(Date, nullable=False)

    # Optional fields
    cie10_code = Column(String(10), nullable=True, index=True)  # ICD-10 code
    symptoms = Column(Text, nullable=True)
    current_treatment = Column(Text, nullable=True)
    prescribing_doctor = Column(String(200), nullable=True)
    is_chronic = Column(Boolean, default=False, nullable=False)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", backref="diseases")

    def __repr__(self):
        chronic_str = " (Crónica)" if self.is_chronic else ""
        return f"<Disease(name='{self.name}', diagnosis_date='{self.diagnosis_date}'{chronic_str})>"