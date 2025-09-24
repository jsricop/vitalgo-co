"""
SQLAlchemy implementation of surgery repository
"""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from sqlalchemy.exc import SQLAlchemyError

from slices.surgeries.application.ports.surgery_repository import SurgeryRepositoryPort
from slices.surgeries.domain.models.surgery_model import PatientSurgery


class SurgeryRepository(SurgeryRepositoryPort):
    """SQLAlchemy implementation of surgery repository"""

    def __init__(self, db_session: Session):
        self.db = db_session

    async def get_surgeries_by_patient_id(self, patient_id: UUID) -> List[PatientSurgery]:
        """Get all surgeries for a specific patient"""
        try:
            return self.db.query(PatientSurgery).filter(
                PatientSurgery.patient_id == patient_id
            ).order_by(desc(PatientSurgery.surgery_date)).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error getting surgeries: {str(e)}")

    async def get_surgery_by_id(self, surgery_id: int, patient_id: UUID) -> Optional[PatientSurgery]:
        """Get a specific surgery by ID with patient ownership verification"""
        try:
            return self.db.query(PatientSurgery).filter(
                and_(
                    PatientSurgery.id == surgery_id,
                    PatientSurgery.patient_id == patient_id
                )
            ).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error getting surgery: {str(e)}")

    async def create_surgery(self, surgery: PatientSurgery) -> PatientSurgery:
        """Create a new surgery record"""
        try:
            self.db.add(surgery)
            self.db.commit()
            self.db.refresh(surgery)
            return surgery
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error creating surgery: {str(e)}")

    async def update_surgery(self, surgery_id: int, surgery_data: dict, patient_id: UUID) -> Optional[PatientSurgery]:
        """Update an existing surgery record with patient ownership verification"""
        try:
            surgery = self.db.query(PatientSurgery).filter(
                and_(
                    PatientSurgery.id == surgery_id,
                    PatientSurgery.patient_id == patient_id
                )
            ).first()

            if not surgery:
                return None

            for key, value in surgery_data.items():
                if hasattr(surgery, key):
                    setattr(surgery, key, value)

            self.db.commit()
            self.db.refresh(surgery)
            return surgery
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error updating surgery: {str(e)}")

    async def delete_surgery(self, surgery_id: int, patient_id: UUID) -> bool:
        """Delete a surgery record with patient ownership verification"""
        try:
            surgery = self.db.query(PatientSurgery).filter(
                and_(
                    PatientSurgery.id == surgery_id,
                    PatientSurgery.patient_id == patient_id
                )
            ).first()

            if not surgery:
                return False

            self.db.delete(surgery)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error deleting surgery: {str(e)}")