/**
 * TypeScript interfaces for personal information components
 */

export interface PersonalPatientInfo {
  biological_sex?: string;
  gender?: string;
  birth_country?: string;
  birth_department?: string;
  birth_city?: string;
  residence_address?: string;
  residence_department?: string;
  residence_city?: string;
}

export interface PersonalPatientUpdate {
  biological_sex?: string;
  gender?: string;
  birth_country?: string;
  birth_department?: string;
  birth_city?: string;
  residence_address?: string;
  residence_department?: string;
  residence_city?: string;
}

export interface UsePersonalPatientInfoResult {
  personalInfo: PersonalPatientInfo | null;
  loading: boolean;
  error: string | null;
  updatePersonalInfo: (data: PersonalPatientUpdate) => Promise<{ success: boolean; message: string }>;
  refetch: () => Promise<void>;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{value: string; label: string}>;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}