/**
 * API service for signup operations
 */
import { DocumentType, PatientRegistrationForm, ValidationResult, RegistrationResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/signup';

export class SignupApiService {
  static async getDocumentTypes(): Promise<DocumentType[]> {
    const response = await fetch(`${API_BASE_URL}/document-types`);

    if (!response.ok) {
      throw new Error('Failed to fetch document types');
    }

    return response.json();
  }

  static async validateDocument(documentNumber: string, documentType: string): Promise<ValidationResult> {
    const response = await fetch(
      `${API_BASE_URL}/validate-document?document_number=${encodeURIComponent(documentNumber)}&document_type=${encodeURIComponent(documentType)}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error('Failed to validate document');
    }

    return response.json();
  }

  static async validateEmail(email: string): Promise<ValidationResult> {
    const response = await fetch(
      `${API_BASE_URL}/validate-email?email=${encodeURIComponent(email)}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error('Failed to validate email');
    }

    return response.json();
  }

  static async registerPatient(formData: PatientRegistrationForm): Promise<RegistrationResponse> {
    const response = await fetch(`${API_BASE_URL}/patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: formData.fullName,
        document_type: formData.documentType,
        document_number: formData.documentNumber,
        phone_international: formData.phoneInternational,
        birth_date: formData.birthDate,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        accept_terms: formData.acceptTerms,
        accept_privacy: formData.acceptPrivacy,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.detail?.message || 'Error en el registro',
        errors: data.detail?.errors || {}
      };
    }

    return data;
  }
}