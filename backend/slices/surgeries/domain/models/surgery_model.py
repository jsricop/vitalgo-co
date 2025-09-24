"""
Patient Surgery domain model
"""
from datetime import datetime, date
from sqlalchemy import Column, String, Text, Date, DateTime, BigInteger, Integer, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from shared.database.database import Base


class PatientSurgery(Base):
    """Patient surgeries model with BIGSERIAL for performance"""

    __tablename__ = "patient_surgeries"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    procedure_name = Column(String(300), nullable=False)
    surgery_date = Column(Date, nullable=False)
    hospital_name = Column(String(200), nullable=True)
    surgeon_name = Column(String(200), nullable=True)
    anesthesia_type = Column(String(100), nullable=True)
    duration_hours = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    complications = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    patient = relationship("Patient", backref="surgeries")

    def __repr__(self):
        return f"<PatientSurgery(id={self.id}, procedure='{self.procedure_name}', date={self.surgery_date})>"