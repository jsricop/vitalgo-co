"""
Medical data management use cases
"""
from uuid import UUID
from typing import List, Optional, Dict, Any

from slices.dashboard.application.ports.dashboard_repository import DashboardRepositoryPort
from slices.dashboard.domain.models.medical_models import (
    PatientMedication,
    PatientAllergy,
    PatientSurgery,
    PatientIllness,
    DashboardActivityLog
)
from slices.signup.domain.models.user_model import User


class ManageMedicalDataUseCase:
    """Use case for managing patient medical data (CRUD operations)"""

    def __init__(self, dashboard_repository: DashboardRepositoryPort):
        self.dashboard_repository = dashboard_repository

    # Medication operations
    async def get_medications(self, patient_id: UUID) -> List[PatientMedication]:
        """Get all medications for a patient"""
        return await self.dashboard_repository.get_medications(patient_id)

    async def create_medication(self, medication_data: Dict[str, Any], patient_id: UUID, user: User) -> PatientMedication:
        """Create a new medication record"""
        medication = PatientMedication(
            patient_id=patient_id,
            **medication_data
        )

        created_medication = await self.dashboard_repository.create_medication(medication)

        # Log activity
        await self._log_activity(
            user=user,
            action="CREATE_MEDICATION",
            resource_type="medication",
            resource_id=created_medication.id,
            details=f"Created medication: {medication_data.get('medication_name', 'Unknown')}"
        )

        return created_medication

    async def update_medication(self, medication_id: int, medication_data: Dict[str, Any], patient_id: UUID, user: User) -> Optional[PatientMedication]:
        """Update a medication record"""
        updated_medication = await self.dashboard_repository.update_medication(medication_id, medication_data)

        if updated_medication:
            # Log activity
            await self._log_activity(
                user=user,
                action="UPDATE_MEDICATION",
                resource_type="medication",
                resource_id=medication_id,
                details=f"Updated medication: {medication_data.get('medication_name', 'Unknown')}"
            )

        return updated_medication

    async def delete_medication(self, medication_id: int, patient_id: UUID, user: User) -> bool:
        """Delete a medication record"""
        success = await self.dashboard_repository.delete_medication(medication_id, patient_id)

        if success:
            # Log activity
            await self._log_activity(
                user=user,
                action="DELETE_MEDICATION",
                resource_type="medication",
                resource_id=medication_id,
                details="Deleted medication"
            )

        return success

    # Allergy operations
    async def get_allergies(self, patient_id: UUID) -> List[PatientAllergy]:
        """Get all allergies for a patient"""
        return await self.dashboard_repository.get_allergies(patient_id)

    async def create_allergy(self, allergy_data: Dict[str, Any], patient_id: UUID, user: User) -> PatientAllergy:
        """Create a new allergy record"""
        allergy = PatientAllergy(
            patient_id=patient_id,
            **allergy_data
        )

        created_allergy = await self.dashboard_repository.create_allergy(allergy)

        # Log activity
        await self._log_activity(
            user=user,
            action="CREATE_ALLERGY",
            resource_type="allergy",
            resource_id=created_allergy.id,
            details=f"Created allergy: {allergy_data.get('allergen', 'Unknown')}"
        )

        return created_allergy

    async def update_allergy(self, allergy_id: int, allergy_data: Dict[str, Any], patient_id: UUID, user: User) -> Optional[PatientAllergy]:
        """Update an allergy record"""
        updated_allergy = await self.dashboard_repository.update_allergy(allergy_id, allergy_data)

        if updated_allergy:
            # Log activity
            await self._log_activity(
                user=user,
                action="UPDATE_ALLERGY",
                resource_type="allergy",
                resource_id=allergy_id,
                details=f"Updated allergy: {allergy_data.get('allergen', 'Unknown')}"
            )

        return updated_allergy

    async def delete_allergy(self, allergy_id: int, patient_id: UUID, user: User) -> bool:
        """Delete an allergy record"""
        success = await self.dashboard_repository.delete_allergy(allergy_id, patient_id)

        if success:
            # Log activity
            await self._log_activity(
                user=user,
                action="DELETE_ALLERGY",
                resource_type="allergy",
                resource_id=allergy_id,
                details="Deleted allergy"
            )

        return success

    # Surgery operations
    async def get_surgeries(self, patient_id: UUID) -> List[PatientSurgery]:
        """Get all surgeries for a patient"""
        return await self.dashboard_repository.get_surgeries(patient_id)

    async def create_surgery(self, surgery_data: Dict[str, Any], patient_id: UUID, user: User) -> PatientSurgery:
        """Create a new surgery record"""
        surgery = PatientSurgery(
            patient_id=patient_id,
            **surgery_data
        )

        created_surgery = await self.dashboard_repository.create_surgery(surgery)

        # Log activity
        await self._log_activity(
            user=user,
            action="CREATE_SURGERY",
            resource_type="surgery",
            resource_id=created_surgery.id,
            details=f"Created surgery: {surgery_data.get('procedure_name', 'Unknown')}"
        )

        return created_surgery

    async def update_surgery(self, surgery_id: int, surgery_data: Dict[str, Any], patient_id: UUID, user: User) -> Optional[PatientSurgery]:
        """Update a surgery record"""
        updated_surgery = await self.dashboard_repository.update_surgery(surgery_id, surgery_data)

        if updated_surgery:
            # Log activity
            await self._log_activity(
                user=user,
                action="UPDATE_SURGERY",
                resource_type="surgery",
                resource_id=surgery_id,
                details=f"Updated surgery: {surgery_data.get('procedure_name', 'Unknown')}"
            )

        return updated_surgery

    async def delete_surgery(self, surgery_id: int, patient_id: UUID, user: User) -> bool:
        """Delete a surgery record"""
        success = await self.dashboard_repository.delete_surgery(surgery_id, patient_id)

        if success:
            # Log activity
            await self._log_activity(
                user=user,
                action="DELETE_SURGERY",
                resource_type="surgery",
                resource_id=surgery_id,
                details="Deleted surgery"
            )

        return success

    # Illness operations
    async def get_illnesses(self, patient_id: UUID) -> List[PatientIllness]:
        """Get all illnesses for a patient"""
        return await self.dashboard_repository.get_illnesses(patient_id)

    async def create_illness(self, illness_data: Dict[str, Any], patient_id: UUID, user: User) -> PatientIllness:
        """Create a new illness record"""
        illness = PatientIllness(
            patient_id=patient_id,
            **illness_data
        )

        created_illness = await self.dashboard_repository.create_illness(illness)

        # Log activity
        await self._log_activity(
            user=user,
            action="CREATE_ILLNESS",
            resource_type="illness",
            resource_id=created_illness.id,
            details=f"Created illness: {illness_data.get('illness_name', 'Unknown')}"
        )

        return created_illness

    async def update_illness(self, illness_id: int, illness_data: Dict[str, Any], patient_id: UUID, user: User) -> Optional[PatientIllness]:
        """Update an illness record"""
        updated_illness = await self.dashboard_repository.update_illness(illness_id, illness_data)

        if updated_illness:
            # Log activity
            await self._log_activity(
                user=user,
                action="UPDATE_ILLNESS",
                resource_type="illness",
                resource_id=illness_id,
                details=f"Updated illness: {illness_data.get('illness_name', 'Unknown')}"
            )

        return updated_illness

    async def delete_illness(self, illness_id: int, patient_id: UUID, user: User) -> bool:
        """Delete an illness record"""
        success = await self.dashboard_repository.delete_illness(illness_id, patient_id)

        if success:
            # Log activity
            await self._log_activity(
                user=user,
                action="DELETE_ILLNESS",
                resource_type="illness",
                resource_id=illness_id,
                details="Deleted illness"
            )

        return success

    # Private helper methods
    async def _log_activity(self, user: User, action: str, resource_type: str, resource_id: int, details: str, ip_address: Optional[str] = None):
        """Log dashboard activity"""
        activity = DashboardActivityLog(
            user_id=user.id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address
        )

        await self.dashboard_repository.log_activity(activity)