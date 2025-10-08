/**
 * Gynecological Information Types
 * For patient reproductive health data - only applicable to female patients
 */

export interface GynecologicalInfo {
  is_pregnant?: boolean | null;
  pregnancy_weeks?: number | null;
  last_menstruation_date?: string | null;
  menstrual_status?: string | null;
  pregnancies_count?: number | null;
  births_count?: number | null;
  cesareans_count?: number | null;
  abortions_count?: number | null;
  contraceptive_method?: string | null;
}

export interface GynecologicalInfoUpdate extends GynecologicalInfo {}

export interface GynecologicalInfoFormData {
  is_pregnant: boolean | null;
  pregnancy_weeks: number | null;
  last_menstruation_date: string | null;
  menstrual_status: string | null;
  pregnancies_count: number | null;
  births_count: number | null;
  cesareans_count: number | null;
  abortions_count: number | null;
  contraceptive_method: string | null;
}

// Contraceptive method options
export const CONTRACEPTIVE_METHODS = [
  { value: 'NINGUNO', label: 'Ninguno' },
  { value: 'ANTICONCEPTIVOS_ORALES', label: 'Anticonceptivos orales' },
  { value: 'DIU', label: 'DIU (Dispositivo intrauterino)' },
  { value: 'IMPLANTE', label: 'Implante' },
  { value: 'INYECCION', label: 'Inyección' },
  { value: 'PRESERVATIVO', label: 'Preservativo' },
  { value: 'METODO_NATURAL', label: 'Método natural' },
  { value: 'PARCHE', label: 'Parche' },
  { value: 'ANILLO_VAGINAL', label: 'Anillo vaginal' },
  { value: 'ESTERILIZACION', label: 'Esterilización' },
  { value: 'OTRO', label: 'Otro' },
] as const;

export type ContraceptiveMethod = typeof CONTRACEPTIVE_METHODS[number]['value'];

// Pregnancy status options
export const PREGNANCY_STATUS_OPTIONS = [
  { value: null, label: 'No especificado' },
  { value: false, label: 'No embarazada' },
  { value: true, label: 'Embarazada' },
] as const;

// Menstrual status options
export const MENSTRUAL_STATUS_OPTIONS = [
  { value: null, label: 'No especificado' },
  { value: 'NOT_STARTED', label: 'No ha tenido menstruación' },
  { value: 'ACTIVE', label: 'Tiene menstruación' },
  { value: 'MENOPAUSE', label: 'En menopausia' },
] as const;

export type MenstrualStatus = typeof MENSTRUAL_STATUS_OPTIONS[number]['value'];

// Form validation constraints
export const GYNECOLOGICAL_VALIDATION = {
  pregnancy_weeks: {
    min: 1,
    max: 42,
  },
  count_fields: {
    min: 0,
    max: 20, // Reasonable maximum
  },
} as const;