"""
Allergy SQLAlchemy model for RF002 medical history
"""
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from shared.database import Base


class AllergySeverity(enum.Enum):
    """Allergy severity enumeration"""
    LEVE = "leve"
    MODERADA = "moderada"
    SEVERA = "severa"
    CRITICA = "critica"


class Allergy(Base):
    """Allergy model for storing patient allergies"""

    __tablename__ = "allergies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    allergen = Column(String(200), nullable=False, index=True)  # What causes the allergy
    severity = Column(Enum(AllergySeverity), nullable=False)

    # Optional fields
    symptoms = Column(Text, nullable=True)  # Description of symptoms
    treatment = Column(Text, nullable=True)  # Treatment or medication
    diagnosis_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", backref="allergies")

    @property
    def is_critical(self) -> bool:
        """Check if allergy is critical or severe"""
        return self.severity in [AllergySeverity.SEVERA, AllergySeverity.CRITICA]

    def __repr__(self):
        return f"<Allergy(allergen='{self.allergen}', severity='{self.severity.value}')>"