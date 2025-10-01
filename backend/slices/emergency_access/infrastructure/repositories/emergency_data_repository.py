"""
Emergency Data Repository for paramedic access
Aggregates patient data from multiple tables
"""
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session, joinedload

from slices.signup.domain.models.patient_model import Patient
from slices.medications.domain.models.medication_model import PatientMedication
from slices.allergies.domain.models.allergy_model import PatientAllergy
from slices.surgeries.domain.models.surgery_model import PatientSurgery
from slices.illnesses.domain.models.illness_model import PatientIllness


class EmergencyDataRepository:
    """Repository for fetching emergency patient data"""

    def __init__(self, db: Session):
        self.db = db

    def get_patient_by_qr_code(self, qr_code: UUID) -> Optional[Patient]:
        """
        Get patient by QR code

        Args:
            qr_code: Patient's unique QR code UUID

        Returns:
            Patient object or None if not found
        """
        return self.db.query(Patient).filter(
            Patient.qr_code == qr_code
        ).options(
            joinedload(Patient.document_type)
        ).first()

    def get_patient_medications(self, patient_id: UUID) -> List[PatientMedication]:
        """
        Get all active medications for a patient

        Args:
            patient_id: Patient's UUID

        Returns:
            List of active medications
        """
        return self.db.query(PatientMedication).filter(
            PatientMedication.patient_id == patient_id,
            PatientMedication.is_active == True
        ).order_by(PatientMedication.created_at.desc()).all()

    def get_patient_allergies(self, patient_id: UUID) -> List[PatientAllergy]:
        """
        Get all allergies for a patient

        Args:
            patient_id: Patient's UUID

        Returns:
            List of allergies
        """
        return self.db.query(PatientAllergy).filter(
            PatientAllergy.patient_id == patient_id
        ).order_by(PatientAllergy.severity_level.desc()).all()

    def get_patient_surgeries(self, patient_id: UUID) -> List[PatientSurgery]:
        """
        Get all surgeries for a patient

        Args:
            patient_id: Patient's UUID

        Returns:
            List of surgeries ordered by date (most recent first)
        """
        return self.db.query(PatientSurgery).filter(
            PatientSurgery.patient_id == patient_id
        ).order_by(PatientSurgery.surgery_date.desc()).all()

    def get_patient_illnesses(self, patient_id: UUID) -> List[PatientIllness]:
        """
        Get all active/chronic illnesses for a patient

        Args:
            patient_id: Patient's UUID

        Returns:
            List of illnesses (chronic conditions first)
        """
        return self.db.query(PatientIllness).filter(
            PatientIllness.patient_id == patient_id
        ).order_by(
            PatientIllness.is_chronic.desc(),
            PatientIllness.diagnosis_date.desc()
        ).all()
