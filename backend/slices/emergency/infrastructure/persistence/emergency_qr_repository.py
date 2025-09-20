"""
Emergency QR Repository Implementation
Concrete implementation of emergency QR repository following hexagonal architecture
"""
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_

from slices.emergency.domain.models.emergency_qr_model import EmergencyQR
from slices.emergency.application.ports.emergency_qr_repository import EmergencyQRRepositoryPort
from shared.database import get_db


class EmergencyQRRepository(EmergencyQRRepositoryPort):
    """SQLAlchemy implementation of Emergency QR repository"""

    def __init__(self, db: Session):
        self.db = db

    def create(self, emergency_qr: EmergencyQR) -> EmergencyQR:
        """Create new emergency QR code"""
        self.db.add(emergency_qr)
        self.db.commit()
        self.db.refresh(emergency_qr)
        return emergency_qr

    def get_by_uuid(self, qr_uuid: UUID) -> Optional[EmergencyQR]:
        """Get emergency QR by UUID"""
        return self.db.query(EmergencyQR).filter(
            EmergencyQR.qr_uuid == qr_uuid
        ).first()

    def get_by_patient_id(self, patient_id: UUID) -> List[EmergencyQR]:
        """Get all emergency QRs for a patient"""
        return self.db.query(EmergencyQR).filter(
            EmergencyQR.patient_id == patient_id
        ).order_by(EmergencyQR.created_at.desc()).all()

    def get_active_by_patient_id(self, patient_id: UUID) -> Optional[EmergencyQR]:
        """Get active emergency QR for a patient"""
        return self.db.query(EmergencyQR).filter(
            and_(
                EmergencyQR.patient_id == patient_id,
                EmergencyQR.is_active == True
            )
        ).order_by(EmergencyQR.created_at.desc()).first()

    def update(self, emergency_qr: EmergencyQR) -> EmergencyQR:
        """Update emergency QR"""
        self.db.commit()
        self.db.refresh(emergency_qr)
        return emergency_qr

    def delete(self, emergency_qr: EmergencyQR) -> None:
        """Delete emergency QR"""
        self.db.delete(emergency_qr)
        self.db.commit()

    def deactivate_patient_qrs(self, patient_id: UUID) -> None:
        """Deactivate all QR codes for a patient"""
        self.db.query(EmergencyQR).filter(
            EmergencyQR.patient_id == patient_id
        ).update({"is_active": False})
        self.db.commit()

    def get_with_patient_data(self, qr_uuid: UUID) -> Optional[EmergencyQR]:
        """Get emergency QR with full patient data loaded"""
        return self.db.query(EmergencyQR).options(
            joinedload(EmergencyQR.patient)
        ).filter(EmergencyQR.qr_uuid == qr_uuid).first()