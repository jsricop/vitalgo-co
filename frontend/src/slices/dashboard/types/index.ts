/**
 * Dashboard slice type definitions
 * Medical data and dashboard types for patient interface
 */

export interface MedicalDataBase {
  id: number;
  patient_id: string;
  created_at: string;
  updated_at: string;
}

// PatientMedication interface REMOVED - Now handled by medications slice
// See: frontend/src/slices/medications/types/index.ts

export interface PatientAllergy extends MedicalDataBase {
  allergy_name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  notes?: string;
}

export interface PatientSurgery extends MedicalDataBase {
  surgery_name: string;
  surgery_date: string;
  hospital?: string;
  surgeon?: string;
  notes?: string;
}

export interface PatientIllness extends MedicalDataBase {
  illness_name: string;
  diagnosis_date: string;
  is_chronic: boolean;
  status: 'active' | 'resolved' | 'managed';
  notes?: string;
}

export interface DashboardStats {
  active_medications: number;
  active_allergies: number;
  allergies_by_severity: Record<string, number>;
  active_surgeries: number;
  active_illnesses: number;
  chronic_illnesses: number;
  profile_completeness: number;
  last_login?: string;
  last_updated?: string;
}

export interface DashboardData {
  user_id: string;
  patient_id: string;
  full_name: string;
  email: string;
  stats: DashboardStats;
  medical_summary: {
    medications_count: number;
    allergies_count: number;
    surgeries_count: number;
    illnesses_count: number;
    has_critical_allergies: boolean;
    has_chronic_illnesses: boolean;
    recent_activity?: string;
  };
  recent_medications: PatientMedication[];
  recent_activities: Array<{
    type: 'medication' | 'allergy' | 'surgery' | 'illness';
    description: string;
    date: string;
  }>;
  is_first_visit: boolean;
}

export interface MedicalDataFormData {
  // Medication fields REMOVED - Now handled by medications slice
  // See: frontend/src/slices/medications/types/index.ts

  allergy_name?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  notes?: string;

  surgery_name?: string;
  surgery_date?: string;
  hospital?: string;
  surgeon?: string;

  illness_name?: string;
  diagnosis_date?: string;
  is_chronic?: boolean;
  status?: 'active' | 'resolved' | 'managed';
}

export type MedicalDataType = 'medications' | 'allergies' | 'surgeries' | 'illnesses';

export interface MedicalDataAction {
  type: 'create' | 'update' | 'delete';
  dataType: MedicalDataType;
  id?: number;
  data?: MedicalDataFormData;
}