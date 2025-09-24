"""
Medication SQLAlchemy model for medications slice
Performance-optimized with BIGSERIAL primary keys
"""
from sqlalchemy import Column, String, Date, Boolean, Integer, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from shared.database.database import Base


class PatientMedication(Base):
    """Patient medications model with BIGSERIAL for performance"""

    __tablename__ = "patient_medications"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    medication_name = Column(String(200), nullable=False)
    dosage = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    notes = Column(Text, nullable=True)
    prescribed_by = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    patient = relationship("Patient", backref="medications")

    def __repr__(self):
        return f"<PatientMedication(id={self.id}, medication_name='{self.medication_name}', is_active={self.is_active})>"