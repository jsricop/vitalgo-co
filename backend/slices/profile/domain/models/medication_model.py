"""
Medication SQLAlchemy model for RF002 medical history
"""
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from shared.database import Base


class Medication(Base):
    """Medication model for storing current medications"""

    __tablename__ = "medications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    name = Column(String(200), nullable=False, index=True)
    dosage = Column(String(50), nullable=False)  # e.g., "50mg", "500mg"
    frequency = Column(String(100), nullable=False)  # e.g., "Cada 8 horas", "Diario"

    # Optional fields
    prescribed_by = Column(String(200), nullable=True)  # Doctor name
    start_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", backref="medications")

    def __repr__(self):
        return f"<Medication(name='{self.name}', dosage='{self.dosage}', frequency='{self.frequency}')>"