"""
QR repository implementation using SQLAlchemy
"""
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_
from sqlalchemy.exc import SQLAlchemyError

from slices.qr.application.ports.qr_repository import QRRepositoryPort
from slices.qr.domain.models import EmergencyPatientInfo
from slices.signup.domain.models.patient_model import Patient


class QRRepository(QRRepositoryPort):
    """SQLAlchemy implementation of QR repository"""

    def __init__(self, db_session: Session):
        self.db = db_session

    async def get_patient_qr_code(self, patient_id: UUID) -> Optional[UUID]:
        """Get patient's QR code UUID"""
        try:
            patient = self.db.query(Patient).filter(Patient.id == patient_id).first()
            return patient.qr_code if patient else None
        except SQLAlchemyError:
            return None

    async def get_emergency_patient_info(self, qr_uuid: UUID) -> Optional[EmergencyPatientInfo]:
        """Get emergency patient information by QR code UUID"""
        try:
            patient = self.db.query(Patient).filter(Patient.qr_code == qr_uuid).first()

            if not patient:
                return None

            # Get critical allergies (high severity)
            critical_allergies = []
            try:
                from slices.allergies.domain.models.allergy_model import PatientAllergy
                allergies = self.db.query(PatientAllergy).filter(
                    and_(
                        PatientAllergy.patient_id == patient.id,
                        PatientAllergy.severity.in_(['high', 'severe', 'critical'])
                    )
                ).all()
                critical_allergies = [allergy.allergen for allergy in allergies]
            except (ImportError, SQLAlchemyError):
                pass

            # Get current medications (active ones)
            current_medications = []
            try:
                from slices.medications.domain.models.medication_model import PatientMedication
                medications = self.db.query(PatientMedication).filter(
                    and_(
                        PatientMedication.patient_id == patient.id,
                        PatientMedication.is_active == True
                    )
                ).all()
                current_medications = [med.medication_name for med in medications]
            except (ImportError, SQLAlchemyError):
                pass

            # Get chronic conditions
            chronic_conditions = []
            try:
                from slices.illnesses.domain.models.illness_model import PatientIllness
                illnesses = self.db.query(PatientIllness).filter(
                    and_(
                        PatientIllness.patient_id == patient.id,
                        PatientIllness.is_chronic == True
                    )
                ).all()
                chronic_conditions = [illness.illness_name for illness in illnesses]
            except (ImportError, SQLAlchemyError):
                pass

            # Format emergency contact
            emergency_contact = None
            if patient.emergency_contact_name and patient.emergency_contact_phone:
                emergency_contact = f"{patient.emergency_contact_name} - {patient.emergency_contact_phone}"
            elif patient.emergency_contact_name:
                emergency_contact = patient.emergency_contact_name

            return EmergencyPatientInfo(
                qr_code=qr_uuid,
                full_name=patient.full_name,
                blood_type=patient.blood_type,
                emergency_contact=emergency_contact,
                critical_allergies=critical_allergies,
                current_medications=current_medications,
                chronic_conditions=chronic_conditions
            )

        except SQLAlchemyError:
            return None

    async def get_patient_id_by_qr_code(self, qr_uuid: UUID) -> Optional[UUID]:
        """Get patient ID by QR code UUID"""
        try:
            patient = self.db.query(Patient).filter(Patient.qr_code == qr_uuid).first()
            return patient.id if patient else None
        except SQLAlchemyError:
            return None