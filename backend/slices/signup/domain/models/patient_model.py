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

    # Name fields - industry standard separated structure
    first_name = Column(String(100), nullable=False, index=True)
    last_name = Column(String(100), nullable=False, index=True)
    document_type_id = Column(Integer, ForeignKey("document_types.id"), nullable=False)
    document_number = Column(String(20), unique=True, nullable=False, index=True)
    # Phone fields - new separated structure
    country_code = Column(String(2), nullable=True)  # "CO", "US", etc.
    dial_code = Column(String(5), nullable=True)     # "+57", "+1", etc.
    phone_number = Column(String(15), nullable=True) # "3001234567"

    # Legacy field - maintained for backward compatibility
    phone_international = Column(String(20), nullable=False)
    birth_date = Column(Date, nullable=False)

    # Country information - Patient's country of origin
    origin_country = Column(String(2), nullable=False, server_default='CO')
    accept_terms = Column(Boolean, nullable=False)
    accept_terms_date = Column(DateTime(timezone=True), nullable=False)
    accept_policy = Column(Boolean, nullable=False)
    accept_policy_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="patient")
    document_type = relationship("DocumentType", backref="patients")

    def set_phone_data(self, phone_country_code: str, dial_code: str, phone_number: str):
        """Set phone data using new separated fields and update legacy field"""
        self.country_code = phone_country_code  # This is for phone, not origin country
        self.dial_code = dial_code
        self.phone_number = phone_number
        # Update legacy field for backward compatibility
        self.phone_international = f"{dial_code} {phone_number}"


    @property
    def full_name(self) -> str:
        """Get full name from first_name and last_name fields"""
        return f"{self.first_name} {self.last_name}"

    @property
    def formatted_phone_international(self) -> str:
        """Get international phone number from new fields if available, fallback to legacy"""
        if self.dial_code and self.phone_number:
            return f"{self.dial_code} {self.phone_number}"
        return self.phone_international

    @property
    def clean_phone_number(self) -> str:
        """Get only the numeric part of the phone number"""
        if self.phone_number:
            return ''.join(filter(str.isdigit, self.phone_number))
        # Fallback to extracting from legacy field
        if self.phone_international:
            # Remove dial code and non-digits
            parts = self.phone_international.split(' ', 1)
            if len(parts) > 1:
                return ''.join(filter(str.isdigit, parts[1]))
            return ''.join(filter(str.isdigit, self.phone_international))
        return ""

    @property
    def origin_country_name(self) -> str:
        """Get country name from origin country code"""
        from shared.utils.countries import get_country_name
        return get_country_name(self.origin_country or 'CO')

    @property
    def origin_country_display(self) -> str:
        """Get country with flag emoji for display"""
        from shared.utils.countries import get_country_display
        return get_country_display(self.origin_country or 'CO')

    def __repr__(self):
        return f"<Patient(name='{self.full_name}', document_number='{self.document_number}')>"