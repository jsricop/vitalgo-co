/**
 * Illnesses API Service for VitalGo
 * Handles CRUD operations with sophisticated UUID strategy:
 * - BigInteger ID (number) for primary keys
 * - UUID patient_id (string) with transformation
 * - camelCase ↔ snake_case conversion
 */

import { PatientIllnessDTO, IllnessFormData } from '../types';
import { apiClient } from '../../../shared/services/apiClient';


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
    try {
      console.log('🔍 IllnessesAPI: Fetching illnesses');

      const response = await apiClient.get<any[]>('/illnesses/');
      const illnesses = response.data.map(transformFromApiResponse);

      console.log('✅ IllnessesAPI: Fetched', illnesses.length, 'illnesses');
      return illnesses;
    } catch (error) {
      console.error('❌ Error fetching illnesses:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  // Get specific illness by ID
  async fetchIllnessById(id: number): Promise<PatientIllnessDTO> {
    try {
      console.log('🔍 IllnessesAPI: Fetching illness ID:', id);

      const response = await apiClient.get<any>(`/illnesses/${id}`);
      const illness = transformFromApiResponse(response.data);

      console.log('✅ IllnessesAPI: Fetched illness:', illness.illnessName);
      return illness;
    } catch (error) {
      console.error('❌ Error fetching illness by ID:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  // Create new illness
  async createIllness(illnessData: IllnessFormData): Promise<PatientIllnessDTO> {
    try {
      console.log('📝 IllnessesAPI: Creating illness:', illnessData.illnessName);

      const requestData = transformToApiRequest(illnessData);
      const response = await apiClient.post<any>('/illnesses/', requestData);
      const illness = transformFromApiResponse(response.data);

      console.log('✅ IllnessesAPI: Created illness:', illness.illnessName);
      return illness;
    } catch (error) {
      console.error('❌ Error creating illness:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  // Update existing illness
  async updateIllness(id: number, illnessData: IllnessFormData): Promise<PatientIllnessDTO> {
    try {
      console.log('📝 IllnessesAPI: Updating illness ID:', id, 'Name:', illnessData.illnessName);

      const requestData = transformToApiRequest(illnessData);
      const response = await apiClient.put<any>(`/illnesses/${id}`, requestData);
      const illness = transformFromApiResponse(response.data);

      console.log('✅ IllnessesAPI: Updated illness:', illness.illnessName);
      return illness;
    } catch (error) {
      console.error('❌ Error updating illness:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  // Delete illness
  async deleteIllness(id: number): Promise<void> {
    try {
      console.log('🗑️ IllnessesAPI: Deleting illness ID:', id);

      await apiClient.delete(`/illnesses/${id}`);
      console.log('✅ IllnessesAPI: Deleted illness ID:', id);
    } catch (error) {
      console.error('❌ Error deleting illness:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }
}

// Export singleton instance
export const illnessesAPI = new IllnessesApi();

// Export utilities for testing
export const apiTransformers = {
  transformFromApiResponse,
  transformToApiRequest,
};