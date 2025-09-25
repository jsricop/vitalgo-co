/**
 * Illnesses API Service for VitalGo
 * Handles CRUD operations with sophisticated UUID strategy:
 * - BigInteger ID (number) for primary keys
 * - UUID patient_id (string) with transformation
 * - camelCase ↔ snake_case conversion
 */

import { PatientIllnessDTO, IllnessFormData } from '../types';
import { LocalStorageService } from '../../../shared/services/local-storage-service';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_ENDPOINTS = {
  illnesses: '/api/illnesses',
} as const;

// Request headers with authentication - using LocalStorageService like medications
const getHeaders = (): HeadersInit => {
  const token = LocalStorageService.getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// API Response Error
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Handle API response
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Use status text if JSON parsing fails
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiError(response.status, errorMessage);
  }

  try {
    return await response.json();
  } catch {
    // Return empty object if no content
    return {} as T;
  }
};

// Transform API response (snake_case) to frontend format (camelCase)
const transformFromApiResponse = (apiData: any): PatientIllnessDTO => ({
  id: apiData.id,                                    // BigInteger as number
  patientId: apiData.patient_id,                     // UUID as string (sophisticated serialization)
  illnessName: apiData.illness_name,                 // snake_case → camelCase
  diagnosisDate: apiData.diagnosis_date,             // ISO date string
  status: apiData.status,
  isChronic: apiData.is_chronic,                     // snake_case → camelCase
  treatmentDescription: apiData.treatment_description, // snake_case → camelCase
  cie10Code: apiData.cie10_code,                     // snake_case → camelCase
  diagnosedBy: apiData.diagnosed_by,                 // snake_case → camelCase
  notes: apiData.notes,
  createdAt: apiData.created_at,                     // ISO datetime string
  updatedAt: apiData.updated_at,                     // ISO datetime string
});

// Transform frontend format (camelCase) to API request (snake_case)
const transformToApiRequest = (frontendData: IllnessFormData): Record<string, any> => ({
  illness_name: frontendData.illnessName,            // camelCase → snake_case
  diagnosis_date: frontendData.diagnosisDate,        // ISO date string
  status: frontendData.status,
  is_chronic: frontendData.isChronic,                // camelCase → snake_case
  treatment_description: frontendData.treatmentDescription, // camelCase → snake_case
  cie10_code: frontendData.cie10Code,                // camelCase → snake_case
  diagnosed_by: frontendData.diagnosedBy,            // camelCase → snake_case
  notes: frontendData.notes,
});

// Illnesses API class
export class IllnessesApi {
  // Get all illnesses for current patient
  async fetchIllnesses(): Promise<PatientIllnessDTO[]> {
    console.log('🔍 IllnessesAPI: Fetching illnesses');

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.illnesses}/`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await handleResponse<any[]>(response);
    const illnesses = data.map(transformFromApiResponse);

    console.log('✅ IllnessesAPI: Fetched', illnesses.length, 'illnesses');
    return illnesses;
  }

  // Get specific illness by ID
  async fetchIllnessById(id: number): Promise<PatientIllnessDTO> {
    console.log('🔍 IllnessesAPI: Fetching illness ID:', id);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.illnesses}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await handleResponse<any>(response);
    const illness = transformFromApiResponse(data);

    console.log('✅ IllnessesAPI: Fetched illness:', illness.illnessName);
    return illness;
  }

  // Create new illness
  async createIllness(illnessData: IllnessFormData): Promise<PatientIllnessDTO> {
    console.log('📝 IllnessesAPI: Creating illness:', illnessData.illnessName);

    const requestData = transformToApiRequest(illnessData);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.illnesses}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData),
    });

    const data = await handleResponse<any>(response);
    const illness = transformFromApiResponse(data);

    console.log('✅ IllnessesAPI: Created illness:', illness.illnessName);
    return illness;
  }

  // Update existing illness
  async updateIllness(id: number, illnessData: IllnessFormData): Promise<PatientIllnessDTO> {
    console.log('📝 IllnessesAPI: Updating illness ID:', id, 'Name:', illnessData.illnessName);

    const requestData = transformToApiRequest(illnessData);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.illnesses}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(requestData),
    });

    const data = await handleResponse<any>(response);
    const illness = transformFromApiResponse(data);

    console.log('✅ IllnessesAPI: Updated illness:', illness.illnessName);
    return illness;
  }

  // Delete illness
  async deleteIllness(id: number): Promise<void> {
    console.log('🗑️ IllnessesAPI: Deleting illness ID:', id);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.illnesses}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    await handleResponse<void>(response);

    console.log('✅ IllnessesAPI: Deleted illness ID:', id);
  }
}

// Export singleton instance
export const illnessesAPI = new IllnessesApi();

// Export utilities for testing
export const apiTransformers = {
  transformFromApiResponse,
  transformToApiRequest,
};