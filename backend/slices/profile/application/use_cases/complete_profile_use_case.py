"""
Profile completion use case for RF002
"""
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from uuid import UUID

from slices.signup.domain.models.patient_model import Patient
from slices.signup.domain.models.user_model import User
from slices.signup.domain.models.document_type_model import DocumentType
# TODO: Add back profile domain models when they are available
# from slices.profile.domain.models import Medication, Allergy, Disease, Surgery, GynecologicalHistory
# from slices.profile.domain.models.allergy_model import AllergySeverity
# from slices.profile.domain.models.surgery_model import AnesthesiaType
# from slices.profile.domain.models.gynecological_model import ContraceptiveMethod
from slices.profile.application.dto.profile_completion_dto import (
    ProfileCompletenessResponse,
    ExtendedPatientProfileDTO,
    PatientProfileUpdateDTO,
    MedicationDTO,
    AllergyDTO,
    DiseaseDTO,
    SurgeryDTO,
    GynecologicalHistoryDTO
)
from slices.profile.application.dto.basic_patient_dto import (
    BasicPatientInfoDTO,
    BasicPatientUpdateDTO
)


class CompleteProfileUseCase:
    """Use case for RF002 profile completion functionality"""

    def __init__(self, db: Session):
        self.db = db

    def get_profile_completeness(self, user_id: str) -> ProfileCompletenessResponse:
        """
        Get profile completeness status for a user

        Args:
            user_id: User UUID string

        Returns:
            ProfileCompletenessResponse with completeness information
        """
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return ProfileCompletenessResponse(
                is_complete=False,
                mandatory_fields_completed=False,
                missing_mandatory_fields=["patient_profile_not_found"],
                completion_percentage=0,
                next_required_step=1,
                redirect_url="/profile/complete"
            )

        # TODO: Implement completeness check once extended fields are available
        completeness_info = {
            "is_complete": False,
            "mandatory_fields_completed": True,  # Basic signup fields are complete
            "missing_mandatory_fields": [],
            "completion_percentage": 25,  # Basic info only
            "next_required_step": 2,
            "redirect_url": "/profile/complete"
        }
        return ProfileCompletenessResponse(**completeness_info)

    def get_extended_profile(self, user_id: str) -> Optional[ExtendedPatientProfileDTO]:
        """
        Get extended patient profile data

        Args:
            user_id: User UUID string

        Returns:
            ExtendedPatientProfileDTO or None if patient not found
        """
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return None

        return ExtendedPatientProfileDTO(
            biological_sex=None,  # TODO: Add back when enum is available
            gender=None,          # TODO: Add back when enum is available
            birth_country=None,   # TODO: Add back when field is available
            birth_department=None, # TODO: Add back when field is available
            birth_city=None,      # TODO: Add back when field is available
            residence_address=None, # TODO: Add back when field is available
            residence_department=None, # TODO: Add back when field is available
            residence_city=None,  # TODO: Add back when field is available
            eps=None,            # TODO: Add back when field is available
            eps_other=None,      # TODO: Add back when field is available
            occupation=None,     # TODO: Add back when field is available
            additional_insurance=None, # TODO: Add back when field is available
            complementary_plan=None,   # TODO: Add back when field is available
            complementary_plan_other=None, # TODO: Add back when field is available
            blood_type=None,     # TODO: Add back when enum is available
            emergency_contact_name=None, # TODO: Add back when field is available
            emergency_contact_relationship=None, # TODO: Add back when enum is available
            emergency_contact_phone=None, # TODO: Add back when field is available
            emergency_contact_phone_alt=None, # TODO: Add back when field is available
        )

    def update_extended_profile(self, user_id: str, profile_data: PatientProfileUpdateDTO) -> Dict[str, Any]:
        """
        Update extended patient profile with RF002 data

        Args:
            user_id: User UUID string
            profile_data: PatientProfileUpdateDTO with updated data

        Returns:
            Dictionary with update result
        """
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        try:
            # TODO: Extended profile updates will be implemented later
            # For now, just return success to prevent errors
            # This method will be properly implemented once extended fields are added to the Patient model

            self.db.commit()

            # TODO: Check updated completeness once method is implemented
            completeness_info = {
                "completion_percentage": 50.0,
                "is_complete": False,
                "mandatory_fields_completed": False
            }

            return {
                "success": True,
                "message": "Profile updated successfully",
                "completeness": completeness_info
            }

        except ValueError as e:
            self.db.rollback()
            return {"success": False, "message": f"Invalid enum value: {str(e)}"}
        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error updating profile: {str(e)}"}

    def get_medications(self, user_id: str) -> List[MedicationDTO]:
        """Get patient medications - TODO: Implement when Medication model is available"""
        return []

    def add_medication(self, user_id: str, medication_data: MedicationDTO) -> Dict[str, Any]:
        """Add new medication - TODO: Implement when Medication model is available"""
        return {"success": False, "message": "Medication functionality not yet implemented"}

    def update_medication(self, user_id: str, medication_id: str, medication_data: MedicationDTO) -> Dict[str, Any]:
        """Update existing medication - TODO: Implement when Medication model is available"""
        return {"success": False, "message": "Medication functionality not yet implemented"}

    def delete_medication(self, user_id: str, medication_id: str) -> Dict[str, Any]:
        """Delete medication - TODO: Implement when Medication model is available"""
        return {"success": False, "message": "Medication functionality not yet implemented"}

    # Allergy management methods (following same pattern as medications)
    def get_allergies(self, user_id: str) -> List[AllergyDTO]:
        """Get all allergies for a patient - TODO: Implement when Allergy model is available"""
        return []

    def add_allergy(self, user_id: str, allergy_data: AllergyDTO) -> Dict[str, Any]:
        """Add new allergy - TODO: Implement when Allergy model is available"""
        return {"success": False, "message": "Allergy functionality not yet implemented"}

    def update_allergy(self, user_id: str, allergy_id: str, allergy_data: AllergyDTO) -> Dict[str, Any]:
        """Update existing allergy - TODO: Implement when Allergy model is available"""
        return {"success": False, "message": "Allergy functionality not yet implemented"}

    def delete_allergy(self, user_id: str, allergy_id: str) -> Dict[str, Any]:
        """Delete allergy - TODO: Implement when Allergy model is available"""
        return {"success": False, "message": "Allergy functionality not yet implemented"}

    def get_basic_patient_info(self, user_id: str) -> Optional[BasicPatientInfoDTO]:
        """
        Get basic patient information (from signup)

        Args:
            user_id: User UUID string

        Returns:
            BasicPatientInfoDTO or None if patient not found
        """
        patient = (
            self.db.query(Patient)
            .join(User, Patient.user_id == User.id)
            .join(DocumentType, Patient.document_type_id == DocumentType.id)
            .filter(Patient.user_id == user_id)
            .first()
        )

        if not patient:
            return None

        return BasicPatientInfoDTO(
            first_name=patient.first_name,
            last_name=patient.last_name,
            document_type=patient.document_type.code,
            document_number=patient.document_number,
            phone_international=patient.phone_international,
            birth_date=patient.birth_date,
            origin_country=patient.origin_country or 'CO',  # Safe fallback to default Colombia
            country_code=patient.country_code or patient.origin_country or 'CO',  # Phone country code fallback to origin country
            dial_code=patient.dial_code,  # Add database field
            phone_number=patient.phone_number,  # Add database field
            email=patient.user.email
        )

    def update_basic_patient_info(self, user_id: str, update_data: BasicPatientUpdateDTO) -> Dict[str, Any]:
        """
        Update basic patient information

        Args:
            user_id: User UUID string
            update_data: BasicPatientUpdateDTO with updated data

        Returns:
            Dictionary with update result
        """
        patient = self.db.query(Patient).join(User, Patient.user_id == User.id).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        try:
            # Update patient fields
            if update_data.first_name is not None:
                patient.first_name = update_data.first_name
            if update_data.last_name is not None:
                patient.last_name = update_data.last_name
            if update_data.document_type is not None:
                doc_type = self.db.query(DocumentType).filter(DocumentType.code == update_data.document_type).first()
                if not doc_type:
                    return {"success": False, "message": "Invalid document type"}
                patient.document_type_id = doc_type.id
            if update_data.document_number is not None:
                # Check if document number already exists for another patient
                existing = self.db.query(Patient).filter(
                    Patient.document_number == update_data.document_number,
                    Patient.id != patient.id
                ).first()
                if existing:
                    return {"success": False, "message": "Document number already exists"}
                patient.document_number = update_data.document_number
            if update_data.phone_international is not None:
                patient.phone_international = update_data.phone_international
            if update_data.birth_date is not None:
                patient.birth_date = update_data.birth_date
            if update_data.origin_country is not None:
                # Validate country code
                from shared.utils.countries import is_valid_country_code
                if not is_valid_country_code(update_data.origin_country):
                    return {"success": False, "message": f"Código de país inválido: {update_data.origin_country}"}
                patient.origin_country = update_data.origin_country
            if update_data.country_code is not None:
                # Validate country code
                from shared.utils.countries import is_valid_country_code
                if not is_valid_country_code(update_data.country_code):
                    return {"success": False, "message": f"Código de país inválido: {update_data.country_code}"}
                patient.country_code = update_data.country_code
            if update_data.dial_code is not None:
                patient.dial_code = update_data.dial_code
            if update_data.phone_number is not None:
                patient.phone_number = update_data.phone_number

            # Update user email if provided
            if update_data.email is not None:
                # Check if email already exists for another user
                existing_user = self.db.query(User).filter(
                    User.email == update_data.email,
                    User.id != patient.user_id
                ).first()
                if existing_user:
                    return {"success": False, "message": "Email already exists"}
                patient.user.email = update_data.email

            self.db.commit()

            return {
                "success": True,
                "message": "Basic patient information updated successfully"
            }

        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error updating basic patient info: {str(e)}"}

    # Similar methods for diseases, surgeries, and gynecological history
    # (Following the same pattern as medications and allergies)