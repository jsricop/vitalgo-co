"""
Patient Allergy domain model
"""
from datetime import datetime, date
from sqlalchemy import Column, String, Text, Date, DateTime, BigInteger, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from shared.database.database import Base


class PatientAllergy(Base):
    """Patient allergies model with BIGSERIAL for performance"""

    __tablename__ = "patient_allergies"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    allergen = Column(String(200), nullable=False)
    severity_level = Column(String(50), nullable=False)  # leve, moderada, severa, critica
    reaction_description = Column(Text, nullable=True)
    diagnosis_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    patient = relationship("Patient", backref="allergies")

    def __repr__(self):
        return f"<PatientAllergy(id={self.id}, allergen='{self.allergen}', severity='{self.severity_level}')>"