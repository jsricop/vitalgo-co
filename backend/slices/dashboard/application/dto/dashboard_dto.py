"""
Dashboard DTOs for API responses
Pydantic models for dashboard statistics and data
"""
from typing import Dict, Optional, List
from datetime import datetime
from pydantic import BaseModel
from .medical_data_dto import PatientMedicationDTO


class DashboardStatsDTO(BaseModel):
    """Pydantic model for dashboard statistics"""
    active_medications: int
    active_allergies: int
    allergies_by_severity: Dict[str, int]
    active_surgeries: int
    active_illnesses: int
    chronic_illnesses: int
    profile_completeness: float
    last_login: Optional[datetime] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True


class MedicalDataSummaryDTO(BaseModel):
    """Pydantic model for medical data summary"""
    medications_count: int
    allergies_count: int
    surgeries_count: int
    illnesses_count: int
    has_critical_allergies: bool
    has_chronic_illnesses: bool
    recent_activity: Optional[datetime] = None

    class Config:
        from_attributes = True


class ActivityDTO(BaseModel):
    """Pydantic model for recent activity items"""
    type: str  # 'medication' | 'allergy' | 'surgery' | 'illness'
    description: str
    date: datetime

    class Config:
        from_attributes = True


class DashboardDataDTO(BaseModel):
    """Pydantic model for complete dashboard data"""
    user_id: str
    patient_id: str
    full_name: str
    email: str
    stats: DashboardStatsDTO
    medical_summary: MedicalDataSummaryDTO
    recent_medications: List[PatientMedicationDTO] = []
    recent_activities: List[ActivityDTO] = []
    is_first_visit: bool = False

    class Config:
        from_attributes = True