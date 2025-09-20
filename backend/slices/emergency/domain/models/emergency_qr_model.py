"""
Emergency QR code SQLAlchemy model for RF004 emergency access
"""
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import uuid

from shared.database import Base


class EmergencyQR(Base):
    """Emergency QR code model for patient emergency access"""

    __tablename__ = "emergency_qrs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)

    # QR code unique identifier (used in URLs)
    qr_uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4, index=True)

    # QR code metadata
    generated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)  # Optional expiration
    is_active = Column(Boolean, default=True, nullable=False)

    # Access tracking
    access_count = Column(Integer, default=0, nullable=False)
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    patient = relationship("Patient", backref="emergency_qrs")

    @property
    def is_expired(self) -> bool:
        """Check if QR code is expired"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at

    @property
    def is_valid(self) -> bool:
        """Check if QR code is valid for use"""
        return self.is_active and not self.is_expired

    @property
    def emergency_url(self) -> str:
        """Get the emergency access URL for this QR code"""
        return f"/emergency/{self.qr_uuid}"

    def set_expiration_days(self, days: int) -> None:
        """Set expiration date from now + days"""
        self.expires_at = datetime.utcnow() + timedelta(days=days)

    def record_access(self) -> None:
        """Record an access to this QR code"""
        self.access_count += 1
        self.last_accessed_at = datetime.utcnow()

    def deactivate(self) -> None:
        """Deactivate this QR code"""
        self.is_active = False

    def regenerate_uuid(self) -> None:
        """Generate new UUID for security (invalidates old QR)"""
        self.qr_uuid = uuid.uuid4()
        self.generated_at = datetime.utcnow()
        self.access_count = 0
        self.last_accessed_at = None
        self.is_active = True

    def __repr__(self):
        status = "Active" if self.is_valid else "Inactive/Expired"
        return f"<EmergencyQR(patient_id='{self.patient_id}', status='{status}', accesses={self.access_count})>"