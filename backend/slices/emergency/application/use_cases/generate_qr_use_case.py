"""
Generate Emergency QR Use Case
Business logic for generating emergency QR codes for patients
"""
from typing import Optional
from uuid import UUID

from slices.emergency.domain.models.emergency_qr_model import EmergencyQR
from slices.emergency.application.ports.emergency_qr_repository import EmergencyQRRepositoryPort
from slices.emergency.application.dto.emergency_data_dto import EmergencyQRResponse, EmergencyQRDto
from slices.signup.infrastructure.persistence.patient_repository import PatientRepository


class GenerateQRUseCase:
    """Use case for generating emergency QR codes"""

    def __init__(
        self,
        emergency_qr_repository: EmergencyQRRepositoryPort,
        patient_repository: PatientRepository
    ):
        self.emergency_qr_repository = emergency_qr_repository
        self.patient_repository = patient_repository

    def execute(self, user_id: UUID, expires_in_days: Optional[int] = 365) -> EmergencyQRResponse:
        """
        Generate or retrieve active emergency QR for a patient

        Args:
            user_id: User ID of the patient
            expires_in_days: Days until QR expires (default 1 year)

        Returns:
            EmergencyQRResponse with QR code information

        Raises:
            ValueError: If patient not found or not complete
        """
        # Get patient by user_id
        patient = self.patient_repository.get_by_user_id(user_id)
        if not patient:
            raise ValueError("Patient not found")

        # Check if patient profile is complete (RF002)
        if not patient.is_rf002_complete:
            raise ValueError("Patient profile must be complete to generate emergency QR")

        # Check if patient already has an active QR
        existing_qr = self.emergency_qr_repository.get_active_by_patient_id(patient.id)

        if existing_qr and existing_qr.is_valid:
            # Return existing valid QR
            return EmergencyQRResponse(
                qr_code=EmergencyQRDto.from_orm(existing_qr),
                emergency_url=existing_qr.emergency_url
            )

        # Deactivate any existing QRs for this patient
        self.emergency_qr_repository.deactivate_patient_qrs(patient.id)

        # Create new emergency QR
        new_qr = EmergencyQR(patient_id=patient.id)
        if expires_in_days:
            new_qr.set_expiration_days(expires_in_days)

        # Save to database
        created_qr = self.emergency_qr_repository.create(new_qr)

        return EmergencyQRResponse(
            qr_code=EmergencyQRDto.from_orm(created_qr),
            emergency_url=created_qr.emergency_url
        )