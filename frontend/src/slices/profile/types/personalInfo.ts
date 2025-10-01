/**
 * TypeScript interfaces for personal information components
 */

export interface PersonalPatientInfo {
  biological_sex?: string;
  gender?: string;
  gender_other?: string;  // For when gender is "OTRO"
  birth_country?: string;
  birth_country_other?: string;  // For when birth_country is "OTHER"
  birth_department?: string;
  birth_city?: string;
  residence_address?: string;
  residence_country?: string;
  residence_country_other?: string;  // For when residence_country is "OTHER"
  residence_department?: string;
  residence_city?: string;

  // Medical Information Fields (RF002)
  eps?: string;
  eps_other?: string;
  occupation?: string;
  additional_insurance?: string;
  complementary_plan?: string;
  complementary_plan_other?: string;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact_phone_alt?: string;

  // Gynecological Information Fields (RF003)
  is_pregnant?: boolean | null;
  pregnancy_weeks?: number | null;
  last_menstruation_date?: string | null;
  pregnancies_count?: number | null;
  births_count?: number | null;
  cesareans_count?: number | null;
  abortions_count?: number | null;
  contraceptive_method?: string | null;
}

export interface PersonalPatientUpdate {
  biological_sex?: string;
  gender?: string;
  gender_other?: string;  // For when gender is "OTRO"
  birth_country?: string;
  birth_country_other?: string;  // For when birth_country is "OTHER"
  birth_department?: string;
  birth_city?: string;
  residence_address?: string;
  residence_country?: string;
  residence_country_other?: string;  // For when residence_country is "OTHER"
  residence_department?: string;
  residence_city?: string;

  // Medical Information Fields (RF002)
  eps?: string;
  eps_other?: string;
  occupation?: string;
  additional_insurance?: string;
  complementary_plan?: string;
  complementary_plan_other?: string;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact_phone_alt?: string;

  // Gynecological Information Fields (RF003)
  is_pregnant?: boolean | null;
  pregnancy_weeks?: number | null;
  last_menstruation_date?: string | null;
  pregnancies_count?: number | null;
  births_count?: number | null;
  cesareans_count?: number | null;
  abortions_count?: number | null;
  contraceptive_method?: string | null;
}

export interface UsePersonalPatientInfoResult {
  personalInfo: PersonalPatientInfo | null;
  loading: boolean;
  error: string | null;
  updatePersonalInfo: (data: PersonalPatientUpdate) => Promise<{ success: boolean; message: string }>;
  refetch: () => Promise<void>;
}

// Alias for form data (same as PersonalPatientUpdate)
export type PersonalInfoFormData = PersonalPatientUpdate;

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