/**
 * TypeScript types for signup slice
 */

export interface DocumentType {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface PatientRegistrationForm {
  fullName: string;
  documentType: string;
  documentNumber: string;
  phoneInternational: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  message?: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  user_id?: string;
  patient_id?: string;
  qr_code?: string;
  token?: string;
  redirect_url?: string;
  errors?: Record<string, string[]>;
}

export interface FieldValidationState {
  isValidating: boolean;
  isValid: boolean | null;
  error: string | null;
}