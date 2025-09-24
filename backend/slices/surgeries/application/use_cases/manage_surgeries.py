"""
Use cases for managing patient surgeries
"""
from typing import List, Optional
from uuid import UUID

from slices.surgeries.application.ports.surgery_repository import SurgeryRepositoryPort
from slices.surgeries.domain.models.surgery_model import PatientSurgery
from slices.surgeries.application.dto.surgery_dto import (
    PatientSurgeryDTO,
    CreateSurgeryDTO,
    UpdateSurgeryDTO
)


class ManageSurgeriesUseCase:
    """Use case for managing patient surgeries"""

    def __init__(self, surgery_repository: SurgeryRepositoryPort):
        self.surgery_repository = surgery_repository

    async def get_patient_surgeries(self, patient_id: UUID) -> List[PatientSurgeryDTO]:
        """Get all surgeries for a patient"""
        surgeries = await self.surgery_repository.get_surgeries_by_patient_id(patient_id)
        return [PatientSurgeryDTO.model_validate(surgery) for surgery in surgeries]

    async def get_surgery_by_id(self, surgery_id: int, patient_id: UUID) -> Optional[PatientSurgeryDTO]:
        """Get a specific surgery by ID"""
        surgery = await self.surgery_repository.get_surgery_by_id(surgery_id, patient_id)
        return PatientSurgeryDTO.model_validate(surgery) if surgery else None

    async def create_surgery(self, surgery_data: CreateSurgeryDTO, patient_id: UUID) -> PatientSurgeryDTO:
        """Create a new surgery record"""
        surgery = PatientSurgery(
            patient_id=patient_id,
            **surgery_data.model_dump()
        )

        created_surgery = await self.surgery_repository.create_surgery(surgery)
        return PatientSurgeryDTO.model_validate(created_surgery)

    async def update_surgery(self, surgery_id: int, surgery_data: UpdateSurgeryDTO, patient_id: UUID) -> Optional[PatientSurgeryDTO]:
        """Update an existing surgery record"""
        updated_surgery = await self.surgery_repository.update_surgery(
            surgery_id,
            surgery_data.model_dump(exclude_unset=True),
            patient_id
        )
        return PatientSurgeryDTO.model_validate(updated_surgery) if updated_surgery else None

    async def delete_surgery(self, surgery_id: int, patient_id: UUID) -> bool:
        """Delete a surgery record"""
        return await self.surgery_repository.delete_surgery(surgery_id, patient_id)