"""
Get emergency data use case
Retrieves patient emergency information by QR code UUID
"""
from uuid import UUID
from typing import Optional

from slices.qr.application.ports.qr_repository import QRRepositoryPort
from slices.qr.domain.models import EmergencyPatientInfo
from shared.exceptions.application_exceptions import NotFoundException


class GetEmergencyDataUseCase:
    """Use case for retrieving patient emergency data by QR code"""

    def __init__(self, qr_repository: QRRepositoryPort):
        self.qr_repository = qr_repository

    async def execute(self, qr_uuid: UUID) -> EmergencyPatientInfo:
        """
        Execute the use case to get emergency patient information

        Args:
            qr_uuid: UUID of the QR code

        Returns:
            EmergencyPatientInfo: Emergency patient information

        Raises:
            NotFoundException: If QR code or patient not found
        """
        # Get emergency patient information by QR code UUID
        emergency_info = await self.qr_repository.get_emergency_patient_info(qr_uuid)

        if not emergency_info:
            raise NotFoundException("QR code not found or invalid")

        return emergency_info