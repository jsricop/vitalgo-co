"""
Medication management use cases
"""
from uuid import UUID
from typing import List, Optional
from datetime import date, datetime

from slices.medications.application.ports.medication_repository import MedicationRepositoryPort
from slices.medications.domain.models.medication_model import PatientMedication
from slices.medications.application.dto.medication_dto import (
    PatientMedicationDTO,
    CreateMedicationDTO,
    UpdateMedicationDTO
)
from slices.signup.domain.models.user_model import User


class ManageMedicationsUseCase:
    """Use case for managing patient medications (CRUD operations)"""

    def __init__(self, medication_repository: MedicationRepositoryPort):
        self.medication_repository = medication_repository

    async def get_medications(self, patient_id: UUID) -> List[PatientMedicationDTO]:
        """Get all medications for a patient with auto-disable of expired medications"""
        # First, automatically disable expired medications
        await self._auto_disable_expired_medications(patient_id)

        # Then return the updated list
        medications = await self.medication_repository.get_medications(patient_id)
        return [PatientMedicationDTO.model_validate(med, from_attributes=True) for med in medications]

    async def create_medication(self, medication_data: CreateMedicationDTO, patient_id: UUID, user: User) -> PatientMedicationDTO:
        """Create a new medication record"""
        medication = PatientMedication(
            patient_id=patient_id,
            **medication_data.model_dump()  # Convert DTO to dict for unpacking
        )

        created_medication = await self.medication_repository.create_medication(medication)
        return PatientMedicationDTO.model_validate(created_medication, from_attributes=True)

    async def update_medication(self, medication_id: int, medication_data: UpdateMedicationDTO, patient_id: UUID, user: User) -> Optional[PatientMedicationDTO]:
        """Update a medication record"""
        # Convert DTO to dict, excluding unset fields
        update_data = medication_data.model_dump(exclude_unset=True)

        updated_medication = await self.medication_repository.update_medication(medication_id, update_data)

        if updated_medication:
            return PatientMedicationDTO.model_validate(updated_medication, from_attributes=True)

        return None

    async def delete_medication(self, medication_id: int, patient_id: UUID, user: User) -> bool:
        """Delete a medication record"""
        return await self.medication_repository.delete_medication(medication_id, patient_id)

    async def get_medication_by_id(self, medication_id: int, patient_id: UUID) -> Optional[PatientMedicationDTO]:
        """Get a specific medication by ID"""
        medication = await self.medication_repository.get_medication_by_id(medication_id, patient_id)

        if medication:
            return PatientMedicationDTO.model_validate(medication, from_attributes=True)

        return None

    async def toggle_medication_status(self, medication_id: int, is_active: bool, patient_id: UUID, user: User) -> Optional[PatientMedicationDTO]:
        """Toggle medication active status"""
        # Create update DTO with only is_active field
        update_data = UpdateMedicationDTO(is_active=is_active)

        return await self.update_medication(medication_id, update_data, patient_id, user)


    async def _auto_disable_expired_medications(self, patient_id: UUID) -> None:
        """Automatically disable medications that have passed their end date"""
        try:
            medications = await self.medication_repository.get_medications(patient_id)
            today = date.today()

            expired_medications = [
                med for med in medications
                if med.is_active and med.end_date and med.end_date < today
            ]

            if expired_medications:
                print(f"🔄 Auto-disabling {len(expired_medications)} expired medications for patient {patient_id}")

                for medication in expired_medications:
                    # Update medication to inactive status
                    update_data = {"is_active": False}
                    await self.medication_repository.update_medication(medication.id, update_data)
                    print(f"✅ Auto-disabled medication: {medication.medication_name} (expired: {medication.end_date})")

        except Exception as e:
            print(f"❌ Error auto-disabling expired medications: {e}")
            # Don't raise exception to avoid blocking the main operation