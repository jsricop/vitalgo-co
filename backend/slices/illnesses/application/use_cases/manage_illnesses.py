"""
Use cases for managing patient illnesses
"""
from typing import List, Optional
from uuid import UUID

from slices.illnesses.application.ports.illness_repository import IllnessRepositoryPort
from slices.illnesses.domain.models.illness_model import PatientIllness
from slices.illnesses.application.dto.illness_dto import (
    PatientIllnessDTO,
    CreateIllnessDTO,
    UpdateIllnessDTO
)


class ManageIllnessesUseCase:
    """Use case for managing patient illnesses"""

    def __init__(self, illness_repository: IllnessRepositoryPort):
        self.illness_repository = illness_repository

    async def get_patient_illnesses(self, patient_id: UUID) -> List[PatientIllnessDTO]:
        """Get all illnesses for a patient"""
        illnesses = await self.illness_repository.get_illnesses_by_patient_id(patient_id)
        return [PatientIllnessDTO.model_validate(illness) for illness in illnesses]

    async def get_illness_by_id(self, illness_id: int, patient_id: UUID) -> Optional[PatientIllnessDTO]:
        """Get a specific illness by ID"""
        illness = await self.illness_repository.get_illness_by_id(illness_id, patient_id)
        return PatientIllnessDTO.model_validate(illness) if illness else None

    async def create_illness(self, illness_data: CreateIllnessDTO, patient_id: UUID) -> PatientIllnessDTO:
        """Create a new illness record"""
        illness = PatientIllness(
            patient_id=patient_id,
            **illness_data.model_dump()
        )

        created_illness = await self.illness_repository.create_illness(illness)
        return PatientIllnessDTO.model_validate(created_illness)

    async def update_illness(self, illness_id: int, illness_data: UpdateIllnessDTO, patient_id: UUID) -> Optional[PatientIllnessDTO]:
        """Update an existing illness record"""
        updated_illness = await self.illness_repository.update_illness(
            illness_id,
            illness_data.model_dump(exclude_unset=True),
            patient_id
        )
        return PatientIllnessDTO.model_validate(updated_illness) if updated_illness else None

    async def delete_illness(self, illness_id: int, patient_id: UUID) -> bool:
        """Delete an illness record"""
        return await self.illness_repository.delete_illness(illness_id, patient_id)