"""
Get Emergency Data Use Case
Aggregates all patient information for paramedic emergency access
"""
from typing import Optional
from uuid import UUID
from fastapi import HTTPException, status

from slices.emergency_access.application.dto.emergency_data_dto import (
    EmergencyDataResponseDTO,
    EmergencyMedicationDTO,
    EmergencyAllergyDTO,
    EmergencySurgeryDTO,
    EmergencyIllnessDTO,
)
from slices.emergency_access.infrastructure.repositories.emergency_data_repository import EmergencyDataRepository


class GetEmergencyDataUseCase:
    """Use case for fetching patient emergency data by QR code"""

    def __init__(self, repository: EmergencyDataRepository):
        self.repository = repository

    async def execute(self, qr_code: UUID) -> EmergencyDataResponseDTO:
        """
        Get all emergency data for a patient by QR code

        Args:
            qr_code: Patient's unique QR code UUID

        Returns:
            EmergencyDataResponseDTO with all patient information

        Raises:
            HTTPException: If patient not found (404)
        """
        # Get patient by QR code
        patient = self.repository.get_patient_by_qr_code(qr_code)

        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )

        # Get medical data
        medications = self.repository.get_patient_medications(patient.id)
        allergies = self.repository.get_patient_allergies(patient.id)
        surgeries = self.repository.get_patient_surgeries(patient.id)
        illnesses = self.repository.get_patient_illnesses(patient.id)

        # Build DTOs
        medication_dtos = [
            EmergencyMedicationDTO(
                medication_name=med.medication_name,
                dosage=med.dosage,
                frequency=med.frequency,
                is_active=med.is_active,
                notes=med.notes,
                prescribed_by=med.prescribed_by,
            )
            for med in medications
        ]

        allergy_dtos = [
            EmergencyAllergyDTO(
                allergen=allergy.allergen,
                severity_level=allergy.severity_level,
                reaction_description=allergy.reaction_description,
                notes=allergy.notes,
            )
            for allergy in allergies
        ]

        surgery_dtos = [
            EmergencySurgeryDTO(
                procedure_name=surgery.procedure_name,
                surgery_date=surgery.surgery_date,
                hospital_name=surgery.hospital_name,
                complications=surgery.complications,
            )
            for surgery in surgeries
        ]

        illness_dtos = [
            EmergencyIllnessDTO(
                illness_name=illness.illness_name,
                diagnosis_date=illness.diagnosis_date,
                status=illness.status,
                is_chronic=illness.is_chronic,
                treatment_description=illness.treatment_description,
                cie10_code=illness.cie10_code,
            )
            for illness in illnesses
        ]

        # Build response DTO
        response_data = {
            # Basic Information
            "full_name": patient.full_name,
            "document_type": patient.document_type.name if patient.document_type else "",
            "document_number": patient.document_number,
            "birth_date": patient.birth_date,
            "biological_sex": patient.biological_sex,

            # Personal Information
            "blood_type": patient.blood_type,
            "eps": patient.eps,
            "occupation": patient.occupation,
            "residence_address": patient.residence_address,
            "residence_country": patient.residence_country,
            "residence_city": patient.residence_city,

            # Emergency Contacts
            "emergency_contact_name": patient.emergency_contact_name,
            "emergency_contact_relationship": patient.emergency_contact_relationship,
            "emergency_contact_phone": patient.emergency_contact_phone,
            "emergency_contact_phone_alt": patient.emergency_contact_phone_alt,

            # Medical Information
            "medications": medication_dtos,
            "allergies": allergy_dtos,
            "surgeries": surgery_dtos,
            "illnesses": illness_dtos,
        }

        # Add gynecological information only if biological_sex is 'F'
        if patient.biological_sex == 'F':
            response_data.update({
                "is_pregnant": patient.is_pregnant,
                "pregnancy_weeks": patient.pregnancy_weeks,
                "last_menstruation_date": patient.last_menstruation_date,
                "pregnancies_count": patient.pregnancies_count,
                "births_count": patient.births_count,
                "cesareans_count": patient.cesareans_count,
                "abortions_count": patient.abortions_count,
                "contraceptive_method": patient.contraceptive_method,
            })

        return EmergencyDataResponseDTO(**response_data)
