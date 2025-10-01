"""
Generate QR code use case
Generates QR code with logo for authenticated patient
"""
from uuid import UUID
from typing import Optional

from slices.qr.application.ports.qr_repository import QRRepositoryPort
from slices.qr.infrastructure.services.qr_generator_service import QRGeneratorService
from slices.qr.domain.models import QRCodeData
from shared.exceptions.application_exceptions import NotFoundException


class GenerateQRCodeUseCase:
    """Use case for generating patient QR code with VitalGo logo"""

    def __init__(self, qr_repository: QRRepositoryPort, qr_generator: QRGeneratorService):
        self.qr_repository = qr_repository
        self.qr_generator = qr_generator

    async def execute(self, patient_id: UUID) -> QRCodeData:
        """
        Execute the use case to generate QR code for a patient

        Args:
            patient_id: UUID of the patient

        Returns:
            QRCodeData: QR code data with base64 image

        Raises:
            NotFoundException: If patient QR code not found
        """
        # Get patient's QR code UUID from database
        qr_uuid = await self.qr_repository.get_patient_qr_code(patient_id)

        if not qr_uuid:
            raise NotFoundException("Patient QR code not found")

        # Generate emergency URL
        emergency_url = self.qr_generator.get_emergency_url(qr_uuid)

        # Generate QR code with logo
        qr_image_base64 = self.qr_generator.generate_qr_with_logo(qr_uuid)

        # Return QR code data
        return QRCodeData(
            patient_id=patient_id,
            qr_code=qr_uuid,
            emergency_url=emergency_url,
            qr_image_base64=qr_image_base64
        )