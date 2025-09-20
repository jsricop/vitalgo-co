"""
Profile completion use case for RF002
"""
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from uuid import UUID

from slices.signup.domain.models.patient_model import Patient, BiologicalSex, Gender, BloodType, EmergencyContactRelationship
from slices.profile.domain.models import Medication, Allergy, Disease, Surgery, GynecologicalHistory
from slices.profile.domain.models.allergy_model import AllergySeverity
from slices.profile.domain.models.surgery_model import AnesthesiaType
from slices.profile.domain.models.gynecological_model import ContraceptiveMethod
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

        completeness_info = patient.check_rf002_mandatory_completeness()
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
            biological_sex=patient.biological_sex.value if patient.biological_sex else None,
            gender=patient.gender.value if patient.gender else None,
            birth_country=patient.birth_country,
            birth_department=patient.birth_department,
            birth_city=patient.birth_city,
            residence_address=patient.residence_address,
            residence_department=patient.residence_department,
            residence_city=patient.residence_city,
            eps=patient.eps,
            eps_other=patient.eps_other,
            occupation=patient.occupation,
            additional_insurance=patient.additional_insurance,
            complementary_plan=patient.complementary_plan,
            complementary_plan_other=patient.complementary_plan_other,
            blood_type=patient.blood_type.value if patient.blood_type else None,
            emergency_contact_name=patient.emergency_contact_name,
            emergency_contact_relationship=patient.emergency_contact_relationship.value if patient.emergency_contact_relationship else None,
            emergency_contact_phone=patient.emergency_contact_phone,
            emergency_contact_phone_alt=patient.emergency_contact_phone_alt,
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
            # Update demographic information
            if profile_data.biological_sex:
                patient.biological_sex = BiologicalSex(profile_data.biological_sex)
            if profile_data.gender:
                patient.gender = Gender(profile_data.gender)
            if profile_data.birth_country:
                patient.birth_country = profile_data.birth_country
            if profile_data.birth_department:
                patient.birth_department = profile_data.birth_department
            if profile_data.birth_city:
                patient.birth_city = profile_data.birth_city

            # Update residence information
            if profile_data.residence_address:
                patient.residence_address = profile_data.residence_address
            if profile_data.residence_department:
                patient.residence_department = profile_data.residence_department
            if profile_data.residence_city:
                patient.residence_city = profile_data.residence_city

            # Update social security information
            if profile_data.eps:
                patient.eps = profile_data.eps
            if profile_data.eps_other:
                patient.eps_other = profile_data.eps_other
            if profile_data.occupation:
                patient.occupation = profile_data.occupation

            # Update additional insurance
            if profile_data.additional_insurance:
                patient.additional_insurance = profile_data.additional_insurance
            if profile_data.complementary_plan:
                patient.complementary_plan = profile_data.complementary_plan
            if profile_data.complementary_plan_other:
                patient.complementary_plan_other = profile_data.complementary_plan_other

            # Update medical information
            if profile_data.blood_type:
                patient.blood_type = BloodType(profile_data.blood_type)

            # Update emergency contact
            if profile_data.emergency_contact_name:
                patient.emergency_contact_name = profile_data.emergency_contact_name
            if profile_data.emergency_contact_relationship:
                patient.emergency_contact_relationship = EmergencyContactRelationship(profile_data.emergency_contact_relationship)
            if profile_data.emergency_contact_phone:
                patient.emergency_contact_phone = profile_data.emergency_contact_phone
            if profile_data.emergency_contact_phone_alt:
                patient.emergency_contact_phone_alt = profile_data.emergency_contact_phone_alt

            self.db.commit()

            # Check updated completeness
            completeness_info = patient.check_rf002_mandatory_completeness()

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
        """Get patient medications"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return []

        medications = self.db.query(Medication).filter(Medication.patient_id == patient.id).all()
        return [
            MedicationDTO(
                id=med.id,
                name=med.name,
                dosage=med.dosage,
                frequency=med.frequency,
                prescribed_by=med.prescribed_by,
                start_date=med.start_date,
                notes=med.notes
            )
            for med in medications
        ]

    def add_medication(self, user_id: str, medication_data: MedicationDTO) -> Dict[str, Any]:
        """Add new medication"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        try:
            medication = Medication(
                patient_id=patient.id,
                name=medication_data.name,
                dosage=medication_data.dosage,
                frequency=medication_data.frequency,
                prescribed_by=medication_data.prescribed_by,
                start_date=medication_data.start_date,
                notes=medication_data.notes
            )
            self.db.add(medication)
            self.db.commit()

            return {
                "success": True,
                "message": "Medication added successfully",
                "medication_id": str(medication.id)
            }
        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error adding medication: {str(e)}"}

    def update_medication(self, user_id: str, medication_id: str, medication_data: MedicationDTO) -> Dict[str, Any]:
        """Update existing medication"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        medication = self.db.query(Medication).filter(
            Medication.id == medication_id,
            Medication.patient_id == patient.id
        ).first()

        if not medication:
            return {"success": False, "message": "Medication not found"}

        try:
            medication.name = medication_data.name
            medication.dosage = medication_data.dosage
            medication.frequency = medication_data.frequency
            medication.prescribed_by = medication_data.prescribed_by
            medication.start_date = medication_data.start_date
            medication.notes = medication_data.notes

            self.db.commit()
            return {"success": True, "message": "Medication updated successfully"}
        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error updating medication: {str(e)}"}

    def delete_medication(self, user_id: str, medication_id: str) -> Dict[str, Any]:
        """Delete medication"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        medication = self.db.query(Medication).filter(
            Medication.id == medication_id,
            Medication.patient_id == patient.id
        ).first()

        if not medication:
            return {"success": False, "message": "Medication not found"}

        try:
            self.db.delete(medication)
            self.db.commit()
            return {"success": True, "message": "Medication deleted successfully"}
        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error deleting medication: {str(e)}"}

    # Allergy management methods (following same pattern as medications)
    def get_allergies(self, user_id: str) -> List[AllergyDTO]:
        """Get all allergies for a patient"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return []

        allergies = self.db.query(Allergy).filter(Allergy.patient_id == patient.id).all()

        return [
            AllergyDTO(
                id=allergy.id,
                allergen=allergy.allergen,
                severity=allergy.severity.value if allergy.severity else "",
                symptoms=allergy.symptoms,
                treatment=allergy.treatment,
                diagnosis_date=allergy.diagnosis_date,
                notes=allergy.notes
            )
            for allergy in allergies
        ]

    def add_allergy(self, user_id: str, allergy_data: AllergyDTO) -> Dict[str, Any]:
        """Add new allergy"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        try:
            allergy = Allergy(
                patient_id=patient.id,
                allergen=allergy_data.allergen,
                severity=AllergySeverity(allergy_data.severity) if allergy_data.severity else None,
                symptoms=allergy_data.symptoms,
                treatment=allergy_data.treatment,
                diagnosis_date=allergy_data.diagnosis_date,
                notes=allergy_data.notes
            )

            self.db.add(allergy)
            self.db.commit()
            self.db.refresh(allergy)

            return {"success": True, "message": "Allergy added successfully", "allergy_id": str(allergy.id)}
        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error adding allergy: {str(e)}"}

    def update_allergy(self, user_id: str, allergy_id: str, allergy_data: AllergyDTO) -> Dict[str, Any]:
        """Update existing allergy"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        allergy = self.db.query(Allergy).filter(
            Allergy.id == allergy_id,
            Allergy.patient_id == patient.id
        ).first()

        if not allergy:
            return {"success": False, "message": "Allergy not found"}

        try:
            allergy.allergen = allergy_data.allergen
            allergy.severity = AllergySeverity(allergy_data.severity) if allergy_data.severity else None
            allergy.symptoms = allergy_data.symptoms
            allergy.treatment = allergy_data.treatment
            allergy.diagnosis_date = allergy_data.diagnosis_date
            allergy.notes = allergy_data.notes

            self.db.commit()
            return {"success": True, "message": "Allergy updated successfully"}
        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error updating allergy: {str(e)}"}

    def delete_allergy(self, user_id: str, allergy_id: str) -> Dict[str, Any]:
        """Delete allergy"""
        patient = self.db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            return {"success": False, "message": "Patient not found"}

        allergy = self.db.query(Allergy).filter(
            Allergy.id == allergy_id,
            Allergy.patient_id == patient.id
        ).first()

        if not allergy:
            return {"success": False, "message": "Allergy not found"}

        try:
            self.db.delete(allergy)
            self.db.commit()
            return {"success": True, "message": "Allergy deleted successfully"}
        except Exception as e:
            self.db.rollback()
            return {"success": False, "message": f"Error deleting allergy: {str(e)}"}

    # Similar methods for diseases, surgeries, and gynecological history
    # (Following the same pattern as medications and allergies)