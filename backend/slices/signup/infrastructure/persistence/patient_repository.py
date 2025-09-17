"""
SQLAlchemy implementation of PatientRepository
"""
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session

from slices.signup.application.ports.patient_repository import PatientRepository
from slices.signup.domain.models.patient_model import Patient
from slices.signup.domain.models.document_type_model import DocumentType


class SQLAlchemyPatientRepository(PatientRepository):
    """SQLAlchemy implementation of patient repository"""

    def __init__(self, db_session: Session):
        self.db_session = db_session

    async def create(self, patient: Patient) -> Patient:
        """Create a new patient"""
        self.db_session.add(patient)
        self.db_session.commit()
        self.db_session.refresh(patient)
        return patient

    async def get_by_id(self, patient_id: UUID) -> Optional[Patient]:
        """Get patient by ID"""
        return self.db_session.query(Patient).filter(Patient.id == patient_id).first()

    async def get_by_user_id(self, user_id: UUID) -> Optional[Patient]:
        """Get patient by user ID"""
        return self.db_session.query(Patient).filter(Patient.user_id == user_id).first()

    async def get_by_qr_code(self, qr_code: UUID) -> Optional[Patient]:
        """Get patient by QR code"""
        return self.db_session.query(Patient).filter(Patient.qr_code == qr_code).first()

    async def document_exists(self, document_number: str) -> bool:
        """Check if document number already exists"""
        return self.db_session.query(Patient).filter(Patient.document_number == document_number).first() is not None

    async def get_document_types(self) -> List[DocumentType]:
        """Get all active document types"""
        return self.db_session.query(DocumentType).filter(DocumentType.is_active == True).all()

    async def update(self, patient: Patient) -> Patient:
        """Update patient information"""
        self.db_session.commit()
        self.db_session.refresh(patient)
        return patient