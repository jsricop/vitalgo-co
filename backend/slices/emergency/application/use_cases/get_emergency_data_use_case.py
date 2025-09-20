"""
Get Emergency Data Use Case
Business logic for retrieving complete emergency medical data via QR code
"""
from typing import Optional
from uuid import UUID
from datetime import datetime

from slices.emergency.application.ports.emergency_qr_repository import EmergencyQRRepositoryPort
from slices.emergency.application.dto.emergency_data_dto import (
    EmergencyDataDto, EmergencyContactDto, MedicationDto, AllergyDto,
    DiseaseDto, SurgeryDto, GynecologicalHistoryDto
)
from slices.signup.infrastructure.persistence.patient_repository import PatientRepository
from sqlalchemy.orm import Session


class GetEmergencyDataUseCase:
    """Use case for retrieving emergency medical data"""

    def __init__(
        self,
        emergency_qr_repository: EmergencyQRRepositoryPort,
        patient_repository: PatientRepository,
        db: Session
    ):
        self.emergency_qr_repository = emergency_qr_repository
        self.patient_repository = patient_repository
        self.db = db

    def execute(self, qr_uuid: UUID, requesting_user_id: UUID) -> EmergencyDataDto:
        """
        Get complete emergency medical data by QR code

        Args:
            qr_uuid: QR code UUID
            requesting_user_id: User ID making the request

        Returns:
            EmergencyDataDto with complete medical information

        Raises:
            ValueError: If QR not found, invalid, or user not authorized
        """
        # Get QR code with patient data
        emergency_qr = self.emergency_qr_repository.get_with_patient_data(qr_uuid)

        if not emergency_qr:
            raise ValueError("Emergency QR code not found")

        if not emergency_qr.is_valid:
            raise ValueError("Emergency QR code is expired or inactive")

        # Verify the requesting user owns this QR code
        patient = emergency_qr.patient
        if patient.user_id != requesting_user_id:
            raise ValueError("Access denied: QR code belongs to different user")

        # Record access
        emergency_qr.record_access()
        self.emergency_qr_repository.update(emergency_qr)

        # Build emergency contact DTO
        emergency_contact = EmergencyContactDto(
            name=patient.emergency_contact_name or "",
            relationship=patient.emergency_contact_relationship.value if patient.emergency_contact_relationship else "",
            phone=patient.emergency_contact_phone or "",
            phone_alt=patient.emergency_contact_phone_alt
        )

        # Get medical history data
        medications = self._get_patient_medications(patient.id)
        allergies = self._get_patient_allergies(patient.id)
        diseases = self._get_patient_diseases(patient.id)
        surgeries = self._get_patient_surgeries(patient.id)
        gynecological = self._get_patient_gynecological_history(patient.id)

        # Calculate age
        today = datetime.now().date()
        age = today.year - patient.birth_date.year
        if today.month < patient.birth_date.month or (today.month == patient.birth_date.month and today.day < patient.birth_date.day):
            age -= 1

        # Build complete emergency data
        return EmergencyDataDto(
            # Personal Information
            full_name=patient.full_name,
            age=age,
            biological_sex=patient.biological_sex.value if patient.biological_sex else "",
            gender=patient.gender.value if patient.gender else "",
            birth_date=datetime.combine(patient.birth_date, datetime.min.time()),

            # Location Information
            residence_city=patient.residence_city or "",
            residence_department=patient.residence_department or "",
            birth_country=patient.birth_country or "",
            occupation=patient.occupation or "",

            # Critical Medical Information
            blood_type=patient.blood_type.value if patient.blood_type else "",

            # Social Security
            eps=patient.eps or "",
            additional_insurance=patient.additional_insurance,
            complementary_plan=patient.complementary_plan,

            # Emergency Contact
            emergency_contact=emergency_contact,

            # Medical History
            medications=medications,
            allergies=allergies,
            diseases=diseases,
            surgeries=surgeries,
            gynecological=gynecological,

            # QR metadata
            qr_generated_at=emergency_qr.generated_at,
            qr_expires_at=emergency_qr.expires_at,
            last_updated=patient.updated_at
        )

    def _get_patient_medications(self, patient_id: UUID) -> list[MedicationDto]:
        """Get patient's current medications"""
        from slices.profile.domain.models.medication_model import Medication

        medications = self.db.query(Medication).filter(
            Medication.patient_id == patient_id
        ).all()

        return [
            MedicationDto(
                name=med.name,
                dosage=med.dosage,
                frequency=med.frequency,
                prescribed_by=med.prescribed_by or "",
                start_date=datetime.combine(med.start_date, datetime.min.time()) if med.start_date else datetime.now(),
                notes=med.notes
            )
            for med in medications
        ]

    def _get_patient_allergies(self, patient_id: UUID) -> list[AllergyDto]:
        """Get patient's allergies"""
        from slices.profile.domain.models.allergy_model import Allergy

        allergies = self.db.query(Allergy).filter(
            Allergy.patient_id == patient_id
        ).all()

        return [
            AllergyDto(
                allergen=allergy.allergen,
                severity=allergy.severity.value if allergy.severity else "",
                symptoms=allergy.symptoms or "",
                treatment=allergy.treatment or "",
                diagnosis_date=datetime.combine(allergy.diagnosis_date, datetime.min.time()) if allergy.diagnosis_date else datetime.now(),
                notes=allergy.notes
            )
            for allergy in allergies
        ]

    def _get_patient_diseases(self, patient_id: UUID) -> list[DiseaseDto]:
        """Get patient's diseases/conditions"""
        from slices.profile.domain.models.disease_model import Disease

        diseases = self.db.query(Disease).filter(
            Disease.patient_id == patient_id
        ).all()

        return [
            DiseaseDto(
                condition=disease.condition,
                diagnosis_date=datetime.combine(disease.diagnosis_date, datetime.min.time()) if disease.diagnosis_date else datetime.now(),
                status=disease.status.value if disease.status else "",
                cie10_code=disease.cie10_code,
                notes=disease.notes
            )
            for disease in diseases
        ]

    def _get_patient_surgeries(self, patient_id: UUID) -> list[SurgeryDto]:
        """Get patient's surgery history"""
        from slices.profile.domain.models.surgery_model import Surgery

        surgeries = self.db.query(Surgery).filter(
            Surgery.patient_id == patient_id
        ).all()

        return [
            SurgeryDto(
                procedure=surgery.procedure,
                surgery_date=datetime.combine(surgery.surgery_date, datetime.min.time()) if surgery.surgery_date else datetime.now(),
                hospital=surgery.hospital or "",
                surgeon=surgery.surgeon or "",
                complications=surgery.complications,
                notes=surgery.notes
            )
            for surgery in surgeries
        ]

    def _get_patient_gynecological_history(self, patient_id: UUID) -> Optional[GynecologicalHistoryDto]:
        """Get patient's gynecological history if applicable"""
        from slices.profile.domain.models.gynecological_model import GynecologicalHistory

        gyn_history = self.db.query(GynecologicalHistory).filter(
            GynecologicalHistory.patient_id == patient_id
        ).first()

        if not gyn_history:
            return None

        return GynecologicalHistoryDto(
            is_pregnant=gyn_history.is_pregnant or False,
            pregnancy_weeks=gyn_history.pregnancy_weeks,
            last_menstruation_date=datetime.combine(gyn_history.last_menstruation_date, datetime.min.time()) if gyn_history.last_menstruation_date else None,
            pregnancies_count=gyn_history.pregnancies_count or 0,
            births_count=gyn_history.births_count or 0,
            csections_count=gyn_history.csections_count or 0,
            abortions_count=gyn_history.abortions_count or 0,
            contraceptive_method=gyn_history.contraceptive_method
        )