"""
SQLAlchemy implementation of allergy repository
"""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from sqlalchemy.exc import SQLAlchemyError

from slices.allergies.application.ports.allergy_repository import AllergyRepositoryPort
from slices.allergies.domain.models.allergy_model import PatientAllergy


class AllergyRepository(AllergyRepositoryPort):
    """SQLAlchemy implementation of allergy repository"""

    def __init__(self, db_session: Session):
        self.db = db_session

    async def get_allergies_by_patient_id(self, patient_id: UUID) -> List[PatientAllergy]:
        """Get all allergies for a specific patient"""
        try:
            return self.db.query(PatientAllergy).filter(
                PatientAllergy.patient_id == patient_id
            ).order_by(desc(PatientAllergy.created_at)).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error getting allergies: {str(e)}")

    async def get_allergy_by_id(self, allergy_id: int, patient_id: UUID) -> Optional[PatientAllergy]:
        """Get a specific allergy by ID with patient ownership verification"""
        try:
            return self.db.query(PatientAllergy).filter(
                and_(
                    PatientAllergy.id == allergy_id,
                    PatientAllergy.patient_id == patient_id
                )
            ).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error getting allergy: {str(e)}")

    async def create_allergy(self, allergy: PatientAllergy) -> PatientAllergy:
        """Create a new allergy record"""
        try:
            self.db.add(allergy)
            self.db.commit()
            self.db.refresh(allergy)
            return allergy
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error creating allergy: {str(e)}")

    async def update_allergy(self, allergy_id: int, allergy_data: dict, patient_id: UUID) -> Optional[PatientAllergy]:
        """Update an existing allergy record with patient ownership verification"""
        try:
            allergy = self.db.query(PatientAllergy).filter(
                and_(
                    PatientAllergy.id == allergy_id,
                    PatientAllergy.patient_id == patient_id
                )
            ).first()

            if not allergy:
                return None

            for key, value in allergy_data.items():
                if hasattr(allergy, key):
                    setattr(allergy, key, value)

            self.db.commit()
            self.db.refresh(allergy)
            return allergy
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error updating allergy: {str(e)}")

    async def delete_allergy(self, allergy_id: int, patient_id: UUID) -> bool:
        """Delete an allergy record with patient ownership verification"""
        try:
            allergy = self.db.query(PatientAllergy).filter(
                and_(
                    PatientAllergy.id == allergy_id,
                    PatientAllergy.patient_id == patient_id
                )
            ).first()

            if not allergy:
                return False

            self.db.delete(allergy)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error deleting allergy: {str(e)}")