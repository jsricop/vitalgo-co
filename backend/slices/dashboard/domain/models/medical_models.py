"""
Medical data SQLAlchemy models for dashboard slice
Performance-optimized with BIGSERIAL primary keys
"""
from sqlalchemy import Column, String, Date, Boolean, Integer, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

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


class PatientIllness(Base):
    """Patient illnesses model with BIGSERIAL for performance"""

    __tablename__ = "patient_illnesses"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    illness_name = Column(String(200), nullable=False)
    diagnosis_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False)  # activa, en_tratamiento, curada, cronica
    is_chronic = Column(Boolean, default=False, nullable=False)
    treatment_description = Column(Text, nullable=True)
    cie10_code = Column(String(10), nullable=True)
    diagnosed_by = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    patient = relationship("Patient", backref="illnesses")

    def __repr__(self):
        return f"<PatientIllness(id={self.id}, illness='{self.illness_name}', status='{self.status}')>"


class DashboardActivityLog(Base):
    """Dashboard activity logs with BIGSERIAL for high frequency operations"""

    __tablename__ = "dashboard_activity_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(BigInteger, nullable=True)  # References medical table IDs
    details = Column(Text, nullable=True)  # JSON-like string for additional data
    ip_address = Column(String(45), nullable=True)  # Support IPv6
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", backref="dashboard_activities")

    def __repr__(self):
        return f"<DashboardActivityLog(id={self.id}, action='{self.action}', resource_type='{self.resource_type}')>"