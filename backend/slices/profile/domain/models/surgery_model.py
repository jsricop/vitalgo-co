"""
Surgery SQLAlchemy model for RF002 medical history
"""
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from shared.database import Base


class AnesthesiaType(enum.Enum):
    """Anesthesia type enumeration"""
    GENERAL = "general"
    LOCAL = "local"
    REGIONAL = "regional"
    SEDACION = "sedacion"


class Surgery(Base):
    """Surgery model for storing patient surgical history"""

    __tablename__ = "surgeries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    name = Column(String(200), nullable=False, index=True)  # Surgery name/type
    surgery_date = Column(Date, nullable=False)

    # Optional fields
    surgeon = Column(String(200), nullable=True)
    hospital = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    anesthesia_type = Column(Enum(AnesthesiaType), nullable=True)
    duration_minutes = Column(Integer, nullable=True)  # Surgery duration in minutes
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", backref="surgeries")

    @property
    def duration_hours_minutes(self) -> str:
        """Format duration as hours and minutes"""
        if not self.duration_minutes:
            return "No especificado"

        hours = self.duration_minutes // 60
        minutes = self.duration_minutes % 60

        if hours > 0 and minutes > 0:
            return f"{hours}h {minutes}min"
        elif hours > 0:
            return f"{hours}h"
        else:
            return f"{minutes}min"

    def __repr__(self):
        return f"<Surgery(name='{self.name}', date='{self.surgery_date}', hospital='{self.hospital}')>"