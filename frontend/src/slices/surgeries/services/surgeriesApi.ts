/**
 * Surgeries API service
 * Handles all surgery-related API calls using unified authentication
 * Converts between camelCase (frontend) and snake_case (backend)
 */

import {
  Surgery,
  SurgeryFormData,
  CreateSurgeryRequest,
  SurgeryApiResponse
} from '../types';
import { apiClient } from '../../../shared/services/apiClient';

class SurgeriesAPIService {
  /**
   * Transform frontend surgery data (camelCase) to API request format (snake_case)
   * Properly handles optional fields by converting empty values to null
   */
  private transformToApiRequest(data: SurgeryFormData): CreateSurgeryRequest {
    // Helper function to safely handle optional string fields
    const safeString = (value: string | undefined | null): string | null => {
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return null;
      }
      return value.trim();
    };

    // Helper function to safely handle optional number fields
    const safeNumber = (value: number | undefined | null): number | null => {
      if (value === undefined || value === null || isNaN(value)) {
        return null;
      }
      return value;
    };

    const apiData: CreateSurgeryRequest = {
      procedure_name: data.procedureName.trim(),
      surgery_date: data.surgeryDate,
      hospital_name: safeString(data.hospitalName),
      surgeon_name: safeString(data.surgeonName),
      anesthesia_type: safeString(data.anesthesiaType),
      duration_hours: safeNumber(data.durationHours),
      notes: safeString(data.notes),
      complications: safeString(data.complications),
    };

    console.log('🔄 SURGERIES API: Transforming form data to API request:', { formData: data, apiData });
    return apiData;
  }

  /**
   * Transform API response (snake_case) to frontend format (camelCase)
   */
  private transformFromApiResponse(apiData: SurgeryApiResponse): Surgery {
    const surgery: Surgery = {
      id: apiData.id,
      patientId: apiData.patient_id,
      procedureName: apiData.procedure_name,
      surgeryDate: apiData.surgery_date,
      hospitalName: apiData.hospital_name || undefined,
      surgeonName: apiData.surgeon_name || undefined,
      anesthesiaType: apiData.anesthesia_type || undefined,
      durationHours: apiData.duration_hours || undefined,
      notes: apiData.notes || undefined,
      complications: apiData.complications || undefined,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
    };

    console.log('🔄 SURGERIES API: Transforming API response to frontend format:', { apiData, surgery });
    return surgery;
  }

  /**
   * Get all surgeries for the authenticated patient
   */
  async getAllSurgeries(): Promise<Surgery[]> {
    console.log('📡 SURGERIES API: Fetching all surgeries for patient');

    const response = await apiClient.get<SurgeryApiResponse[]>('/surgeries/');
    const apiSurgeries = response.data;
    const surgeries = apiSurgeries.map(surgery => this.transformFromApiResponse(surgery));

    console.log('✅ SURGERIES API: Successfully fetched surgeries:', surgeries.length);
    return surgeries;
  }

  /**
   * Get a specific surgery by ID
   */
  async getSurgeryById(id: number): Promise<Surgery> {
    console.log('📡 SURGERIES API: Fetching surgery by ID:', id);

    const response = await fetch(`${API_BASE_URL}/api/surgeries/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    const apiSurgery: SurgeryApiResponse = await this.handleResponse(response);
    const surgery = this.transformFromApiResponse(apiSurgery);

    console.log('✅ SURGERIES API: Successfully fetched surgery:', surgery);
    return surgery;
  }

  /**
   * Create a new surgery
   */
  async createSurgery(data: SurgeryFormData): Promise<Surgery> {
    console.log('📡 SURGERIES API: Creating new surgery:', data);

    const apiData = this.transformToApiRequest(data);

    const response = await fetch(`${API_BASE_URL}/api/surgeries/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    const apiSurgery: SurgeryApiResponse = await this.handleResponse(response);
    const surgery = this.transformFromApiResponse(apiSurgery);

    console.log('✅ SURGERIES API: Successfully created surgery:', surgery);
    return surgery;
  }

  /**
   * Update an existing surgery
   */
  async updateSurgery(id: number, data: SurgeryFormData): Promise<Surgery> {
    console.log('📡 SURGERIES API: Updating surgery:', { id, data });

    const apiData = this.transformToApiRequest(data);

    const response = await fetch(`${API_BASE_URL}/api/surgeries/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    const apiSurgery: SurgeryApiResponse = await this.handleResponse(response);
    const surgery = this.transformFromApiResponse(apiSurgery);

    console.log('✅ SURGERIES API: Successfully updated surgery:', surgery);
    return surgery;
  }

  /**
   * Delete a surgery
   */
  async deleteSurgery(id: number): Promise<void> {
    console.log('📡 SURGERIES API: Deleting surgery:', id);

    const response = await fetch(`${API_BASE_URL}/api/surgeries/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    // Handle 204 No Content response for successful deletion
    if (response.status === 204) {
      console.log('✅ SURGERIES API: Successfully deleted surgery:', id);
      return;
    }

    // If not 204, handle as normal response (should be error)
    await this.handleResponse(response);
    console.log('✅ SURGERIES API: Successfully deleted surgery:', id);
  }
}

// Export singleton instance
export const surgeriesApi = new SurgeriesAPIService();