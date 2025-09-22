"""
Dashboard statistics domain entities
"""
from dataclasses import dataclass, field
from typing import Dict, Optional, List
from datetime import datetime


@dataclass
class DashboardStats:
    """Dashboard statistics entity"""
    active_medications: int
    active_allergies: int
    allergies_by_severity: Dict[str, int]  # {"leve": 2, "moderada": 1, "severa": 0, "critica": 1}
    active_surgeries: int
    active_illnesses: int
    chronic_illnesses: int
    profile_completeness: float  # Percentage 0-100
    last_login: Optional[datetime]
    last_updated: Optional[datetime]


@dataclass
class MedicalDataSummary:
    """Summary of all medical data for a patient"""
    medications_count: int
    allergies_count: int
    surgeries_count: int
    illnesses_count: int
    has_critical_allergies: bool
    has_chronic_illnesses: bool
    recent_activity: Optional[datetime]


@dataclass
class Activity:
    """Recent activity entity"""
    type: str  # 'medication' | 'allergy' | 'surgery' | 'illness'
    description: str
    date: datetime


@dataclass
class DashboardData:
    """Complete dashboard data entity"""
    user_id: str
    patient_id: str
    full_name: str
    email: str
    stats: DashboardStats
    medical_summary: MedicalDataSummary
    recent_medications: List = field(default_factory=list)
    recent_activities: List[Activity] = field(default_factory=list)
    is_first_visit: bool = False