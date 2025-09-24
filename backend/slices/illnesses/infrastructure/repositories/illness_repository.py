"""
SQLAlchemy implementation of illness repository
"""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from sqlalchemy.exc import SQLAlchemyError

from slices.illnesses.application.ports.illness_repository import IllnessRepositoryPort
from slices.illnesses.domain.models.illness_model import PatientIllness


class IllnessRepository(IllnessRepositoryPort):
    """SQLAlchemy implementation of illness repository"""

    def __init__(self, db_session: Session):
        self.db = db_session

    async def get_illnesses_by_patient_id(self, patient_id: UUID) -> List[PatientIllness]:
        """Get all illnesses for a specific patient"""
        try:
            return self.db.query(PatientIllness).filter(
                PatientIllness.patient_id == patient_id
            ).order_by(desc(PatientIllness.created_at)).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error getting illnesses: {str(e)}")

    async def get_illness_by_id(self, illness_id: int, patient_id: UUID) -> Optional[PatientIllness]:
        """Get a specific illness by ID with patient ownership verification"""
        try:
            return self.db.query(PatientIllness).filter(
                and_(
                    PatientIllness.id == illness_id,
                    PatientIllness.patient_id == patient_id
                )
            ).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error getting illness: {str(e)}")

    async def create_illness(self, illness: PatientIllness) -> PatientIllness:
        """Create a new illness record"""
        try:
            self.db.add(illness)
            self.db.commit()
            self.db.refresh(illness)
            return illness
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error creating illness: {str(e)}")

    async def update_illness(self, illness_id: int, illness_data: dict, patient_id: UUID) -> Optional[PatientIllness]:
        """Update an existing illness record with patient ownership verification"""
        try:
            illness = self.db.query(PatientIllness).filter(
                and_(
                    PatientIllness.id == illness_id,
                    PatientIllness.patient_id == patient_id
                )
            ).first()

            if not illness:
                return None

            for key, value in illness_data.items():
                if hasattr(illness, key):
                    setattr(illness, key, value)

            self.db.commit()
            self.db.refresh(illness)
            return illness
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error updating illness: {str(e)}")

    async def delete_illness(self, illness_id: int, patient_id: UUID) -> bool:
        """Delete an illness record with patient ownership verification"""
        try:
            illness = self.db.query(PatientIllness).filter(
                and_(
                    PatientIllness.id == illness_id,
                    PatientIllness.patient_id == patient_id
                )
            ).first()

            if not illness:
                return False

            self.db.delete(illness)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error deleting illness: {str(e)}")