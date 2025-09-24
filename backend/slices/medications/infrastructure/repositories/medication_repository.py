"""
Medication repository implementation
Handles medication data persistence using SQLAlchemy
"""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_

from slices.medications.application.ports.medication_repository import MedicationRepositoryPort
from slices.medications.domain.models.medication_model import PatientMedication


class MedicationRepository(MedicationRepositoryPort):
    """SQLAlchemy implementation of medication repository"""

    def __init__(self, db: Session):
        self.db = db

    async def get_medications(self, patient_id: UUID) -> List[PatientMedication]:
        """Get all medications for a patient"""
        return self.db.query(PatientMedication).filter(
            PatientMedication.patient_id == patient_id
        ).order_by(PatientMedication.created_at.desc()).all()

    async def create_medication(self, medication: PatientMedication) -> PatientMedication:
        """Create a new medication record"""
        self.db.add(medication)
        self.db.commit()
        self.db.refresh(medication)
        return medication

    async def update_medication(self, medication_id: int, medication_data: dict) -> Optional[PatientMedication]:
        """Update a medication record"""
        medication = self.db.query(PatientMedication).filter(
            PatientMedication.id == medication_id
        ).first()

        if not medication:
            return None

        # Update only provided fields
        for field, value in medication_data.items():
            if hasattr(medication, field):
                setattr(medication, field, value)

        self.db.commit()
        self.db.refresh(medication)
        return medication

    async def delete_medication(self, medication_id: int, patient_id: UUID) -> bool:
        """Delete a medication record"""
        medication = self.db.query(PatientMedication).filter(
            and_(
                PatientMedication.id == medication_id,
                PatientMedication.patient_id == patient_id
            )
        ).first()

        if not medication:
            return False

        self.db.delete(medication)
        self.db.commit()
        return True

    async def get_medication_by_id(self, medication_id: int, patient_id: UUID) -> Optional[PatientMedication]:
        """Get a specific medication by ID"""
        return self.db.query(PatientMedication).filter(
            and_(
                PatientMedication.id == medication_id,
                PatientMedication.patient_id == patient_id
            )
        ).first()