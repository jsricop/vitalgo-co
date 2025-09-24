"""
Use cases for managing patient allergies
"""
from typing import List, Optional
from uuid import UUID

from slices.allergies.application.ports.allergy_repository import AllergyRepositoryPort
from slices.allergies.domain.models.allergy_model import PatientAllergy
from slices.allergies.application.dto.allergy_dto import (
    PatientAllergyDTO,
    CreateAllergyDTO,
    UpdateAllergyDTO
)


class ManageAllergiesUseCase:
    """Use case for managing patient allergies"""

    def __init__(self, allergy_repository: AllergyRepositoryPort):
        self.allergy_repository = allergy_repository

    async def get_patient_allergies(self, patient_id: UUID) -> List[PatientAllergyDTO]:
        """Get all allergies for a patient"""
        allergies = await self.allergy_repository.get_allergies_by_patient_id(patient_id)
        return [PatientAllergyDTO.model_validate(allergy, from_attributes=True) for allergy in allergies]

    async def get_allergy_by_id(self, allergy_id: int, patient_id: UUID) -> Optional[PatientAllergyDTO]:
        """Get a specific allergy by ID"""
        allergy = await self.allergy_repository.get_allergy_by_id(allergy_id, patient_id)
        return PatientAllergyDTO.model_validate(allergy, from_attributes=True) if allergy else None

    async def create_allergy(self, allergy_data: CreateAllergyDTO, patient_id: UUID) -> PatientAllergyDTO:
        """Create a new allergy record"""
        allergy = PatientAllergy(
            patient_id=patient_id,
            **allergy_data.model_dump()
        )

        created_allergy = await self.allergy_repository.create_allergy(allergy)
        return PatientAllergyDTO.model_validate(created_allergy, from_attributes=True)

    async def update_allergy(self, allergy_id: int, allergy_data: UpdateAllergyDTO, patient_id: UUID) -> Optional[PatientAllergyDTO]:
        """Update an existing allergy record"""
        updated_allergy = await self.allergy_repository.update_allergy(
            allergy_id,
            allergy_data.model_dump(exclude_unset=True),
            patient_id
        )
        return PatientAllergyDTO.model_validate(updated_allergy, from_attributes=True) if updated_allergy else None

    async def delete_allergy(self, allergy_id: int, patient_id: UUID) -> bool:
        """Delete an allergy record"""
        return await self.allergy_repository.delete_allergy(allergy_id, patient_id)