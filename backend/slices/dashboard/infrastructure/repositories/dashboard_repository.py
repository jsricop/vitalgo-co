"""
Dashboard repository implementation using SQLAlchemy
"""
from datetime import datetime
from typing import List, Optional, Dict
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc
from sqlalchemy.exc import SQLAlchemyError

from slices.dashboard.application.ports.dashboard_repository import DashboardRepositoryPort
# Import medical models from dedicated slices for dashboard queries
from slices.medications.domain.models.medication_model import PatientMedication
from slices.allergies.domain.models.allergy_model import PatientAllergy
from slices.surgeries.domain.models.surgery_model import PatientSurgery
from slices.illnesses.domain.models.illness_model import PatientIllness

# Import dashboard-specific models only
from slices.dashboard.domain.models.medical_models import DashboardActivityLog
from slices.dashboard.domain.entities.dashboard_stats import DashboardStats, MedicalDataSummary
from slices.signup.domain.models.patient_model import Patient
from slices.signup.domain.models.user_model import User


class DashboardRepository(DashboardRepositoryPort):
    """SQLAlchemy implementation of dashboard repository"""

    def __init__(self, db_session: Session):
        self.db = db_session

    # Dashboard Statistics
    async def get_dashboard_stats(self, patient_id: UUID) -> DashboardStats:
        """Get aggregated dashboard statistics for a patient"""
        try:
            # Get active medications count
            active_medications = self.db.query(PatientMedication).filter(
                and_(
                    PatientMedication.patient_id == patient_id,
                    PatientMedication.is_active == True
                )
            ).count()

            # Get allergies counts and severity breakdown
            allergies_query = self.db.query(PatientAllergy).filter(
                PatientAllergy.patient_id == patient_id
            )
            total_allergies = allergies_query.count()

            # Group allergies by severity
            allergies_by_severity = {}
            severity_counts = self.db.query(
                PatientAllergy.severity_level,
                func.count(PatientAllergy.id)
            ).filter(
                PatientAllergy.patient_id == patient_id
            ).group_by(PatientAllergy.severity_level).all()

            for severity, count in severity_counts:
                allergies_by_severity[severity] = count

            # Ensure all severity levels are present
            for severity in ["leve", "moderada", "severa", "critica"]:
                if severity not in allergies_by_severity:
                    allergies_by_severity[severity] = 0

            # Get surgeries count
            total_surgeries = self.db.query(PatientSurgery).filter(
                PatientSurgery.patient_id == patient_id
            ).count()

            # Get illnesses counts
            active_illnesses = self.db.query(PatientIllness).filter(
                and_(
                    PatientIllness.patient_id == patient_id,
                    PatientIllness.status.in_(["activa", "en_tratamiento"])
                )
            ).count()

            chronic_illnesses = self.db.query(PatientIllness).filter(
                and_(
                    PatientIllness.patient_id == patient_id,
                    PatientIllness.is_chronic == True
                )
            ).count()

            # Get patient to calculate profile completeness
            patient = self.db.query(Patient).filter(Patient.id == patient_id).first()
            profile_completeness = self._calculate_profile_completeness(patient)

            # Get last login from user
            user = self.db.query(User).filter(User.id == patient.user_id).first() if patient else None
            last_login = user.last_login if user else None

            # Get last updated timestamp
            last_updated = datetime.utcnow()

            return DashboardStats(
                active_medications=active_medications,
                active_allergies=total_allergies,
                allergies_by_severity=allergies_by_severity,
                active_surgeries=total_surgeries,
                active_illnesses=active_illnesses,
                chronic_illnesses=chronic_illnesses,
                profile_completeness=profile_completeness,
                last_login=last_login,
                last_updated=last_updated
            )

        except SQLAlchemyError as e:
            raise Exception(f"Database error getting dashboard stats: {str(e)}")

    async def get_medical_data_summary(self, patient_id: UUID) -> MedicalDataSummary:
        """Get summary of all medical data for a patient"""
        try:
            medications_count = self.db.query(PatientMedication).filter(
                PatientMedication.patient_id == patient_id
            ).count()

            allergies_count = self.db.query(PatientAllergy).filter(
                PatientAllergy.patient_id == patient_id
            ).count()

            surgeries_count = self.db.query(PatientSurgery).filter(
                PatientSurgery.patient_id == patient_id
            ).count()

            illnesses_count = self.db.query(PatientIllness).filter(
                PatientIllness.patient_id == patient_id
            ).count()

            # Check for critical allergies
            has_critical_allergies = self.db.query(PatientAllergy).filter(
                and_(
                    PatientAllergy.patient_id == patient_id,
                    PatientAllergy.severity_level == "critica"
                )
            ).first() is not None

            # Check for chronic illnesses
            has_chronic_illnesses = self.db.query(PatientIllness).filter(
                and_(
                    PatientIllness.patient_id == patient_id,
                    PatientIllness.is_chronic == True
                )
            ).first() is not None

            # Get most recent activity across all medical data
            recent_dates = []

            latest_medication = self.db.query(func.max(PatientMedication.updated_at)).filter(
                PatientMedication.patient_id == patient_id
            ).scalar()
            if latest_medication:
                recent_dates.append(latest_medication)

            latest_allergy = self.db.query(func.max(PatientAllergy.updated_at)).filter(
                PatientAllergy.patient_id == patient_id
            ).scalar()
            if latest_allergy:
                recent_dates.append(latest_allergy)

            latest_surgery = self.db.query(func.max(PatientSurgery.updated_at)).filter(
                PatientSurgery.patient_id == patient_id
            ).scalar()
            if latest_surgery:
                recent_dates.append(latest_surgery)

            latest_illness = self.db.query(func.max(PatientIllness.updated_at)).filter(
                PatientIllness.patient_id == patient_id
            ).scalar()
            if latest_illness:
                recent_dates.append(latest_illness)

            recent_activity = max(recent_dates) if recent_dates else None

            return MedicalDataSummary(
                medications_count=medications_count,
                allergies_count=allergies_count,
                surgeries_count=surgeries_count,
                illnesses_count=illnesses_count,
                has_critical_allergies=has_critical_allergies,
                has_chronic_illnesses=has_chronic_illnesses,
                recent_activity=recent_activity
            )

        except SQLAlchemyError as e:
            raise Exception(f"Database error getting medical summary: {str(e)}")

    # Private helper methods to calculate stats from existing data
    async def get_recent_medications(self, patient_id: UUID, limit: int = 5) -> List[PatientMedication]:
        """Get recent medications for dashboard display"""
        try:
            return self.db.query(PatientMedication).filter(
                PatientMedication.patient_id == patient_id
            ).order_by(desc(PatientMedication.created_at)).limit(limit).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error getting recent medications: {str(e)}")

    async def get_recent_activities(self, patient_id: UUID, limit: int = 5) -> List[Dict]:
        """Get recent activities for dashboard display"""
        try:
            activities = []

            # Get recent medication activities
            recent_medications = self.db.query(PatientMedication).filter(
                PatientMedication.patient_id == patient_id
            ).order_by(desc(PatientMedication.created_at)).limit(2).all()

            for med in recent_medications:
                activities.append({
                    'type': 'medication',
                    'description': f'Medicamento añadido: {med.medication_name}',
                    'date': med.created_at
                })

            # Get recent allergy activities
            recent_allergies = self.db.query(PatientAllergy).filter(
                PatientAllergy.patient_id == patient_id
            ).order_by(desc(PatientAllergy.created_at)).limit(2).all()

            for allergy in recent_allergies:
                activities.append({
                    'type': 'allergy',
                    'description': f'Alergia registrada: {allergy.allergen}',
                    'date': allergy.created_at
                })

            # Get recent surgery activities
            recent_surgeries = self.db.query(PatientSurgery).filter(
                PatientSurgery.patient_id == patient_id
            ).order_by(desc(PatientSurgery.created_at)).limit(1).all()

            for surgery in recent_surgeries:
                activities.append({
                    'type': 'surgery',
                    'description': f'Cirugía registrada: {surgery.procedure_name}',
                    'date': surgery.created_at
                })

            # Sort all activities by date and limit
            activities.sort(key=lambda x: x['date'], reverse=True)
            return activities[:limit]

        except SQLAlchemyError as e:
            raise Exception(f"Database error getting recent activities: {str(e)}")

    # Private helper methods
    def _calculate_profile_completeness(self, patient: Optional[Patient]) -> float:
        """Calculate profile completeness percentage"""
        if not patient:
            return 0.0

        required_fields = [
            patient.full_name,
            patient.document_type,
            patient.document_number,
            patient.phone_international,
            patient.birth_date
        ]

        completed_fields = sum(1 for field in required_fields if field)
        total_fields = len(required_fields)

        return (completed_fields / total_fields) * 100.0