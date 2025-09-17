"""
Patient SQLAlchemy model
"""
from sqlalchemy import Column, String, Date, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from shared.database import Base


class Patient(Base):
    """Patient model for storing patient-specific information"""

    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    qr_code = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4, index=True)
    full_name = Column(String(100), nullable=False)
    document_type_id = Column(Integer, ForeignKey("document_types.id"), nullable=False)
    document_number = Column(String(20), unique=True, nullable=False, index=True)
    phone_international = Column(String(20), nullable=False)
    birth_date = Column(Date, nullable=False)
    accept_terms = Column(Boolean, nullable=False)
    accept_terms_date = Column(DateTime(timezone=True), nullable=False)
    accept_policy = Column(Boolean, nullable=False)
    accept_policy_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="patient")
    document_type = relationship("DocumentType", backref="patients")

    def __repr__(self):
        return f"<Patient(full_name='{self.full_name}', document_number='{self.document_number}')>"