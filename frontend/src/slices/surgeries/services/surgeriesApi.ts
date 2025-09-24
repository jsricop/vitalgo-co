/**
 * Surgeries API service
 * Handles all surgery-related API calls with authentication and data transformation
 * Converts between camelCase (frontend) and snake_case (backend)
 */

import {
  Surgery,
  SurgeryFormData,
  CreateSurgeryRequest,
  SurgeryApiResponse
} from '../types';
import { LocalStorageService } from '../../../shared/services/local-storage-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class SurgeriesAPIService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = LocalStorageService.getAccessToken();

    // JWT TOKEN DEBUG: Frontend token analysis for surgeries
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExp = payload.exp - currentTime;

        console.log('🔍 SURGERIES API JWT DEBUG - Token Analysis:');
        console.log(`   Current timestamp: ${currentTime}`);
        console.log(`   Token exp timestamp: ${payload.exp}`);
        console.log(`   Time until expiration: ${timeUntilExp} seconds`);
        console.log(`   Token valid: ${timeUntilExp > 0}`);

        if (timeUntilExp <= 0) {
          console.log('❌ SURGERIES API JWT DEBUG - TOKEN ALREADY EXPIRED!');
        }
      } catch (e) {
        console.error('❌ SURGERIES API JWT DEBUG - Token parsing failed:', e);
      }
    } else {
      console.log('❌ SURGERIES API JWT DEBUG - No access token found');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      let errorMessage: string;

      try {
        errorData = await response.json();
      } catch (jsonError) {
        console.error('🔍 SURGERIES API ERROR: Failed to parse error response as JSON:', jsonError);
        errorMessage = `HTTP ${response.status} - Failed to parse error response`;
        throw new Error(errorMessage);
      }

      // Debug log the full error structure for analysis
      console.error('🔍 SURGERIES API ERROR: Full error object:', errorData);

      // Extract meaningful error message from different error structures
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.detail) {
        // Check if detail is the new validation error format from our enhanced backend
        if (typeof errorData.detail === 'object' && errorData.detail.errors && Array.isArray(errorData.detail.errors)) {
          // New enhanced validation error format: { message: "...", errors: [...] }
          const validationErrors = errorData.detail.errors;
          if (validationErrors.length > 0) {
            // Format multiple validation errors for user display
            const errorMessages = validationErrors.map((error: any) => {
              return `${error.field}: ${error.message}`;
            });
            errorMessage = `Validation failed: ${errorMessages.join(', ')}`;
          } else {
            errorMessage = errorData.detail.message || 'Validation failed';
          }
          console.log('🔍 SURGERIES API: Parsed validation errors:', validationErrors);
        } else if (typeof errorData.detail === 'string') {
          // Standard FastAPI error
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Standard FastAPI validation errors array format
          const firstError = errorData.detail[0];
          errorMessage = firstError.msg || firstError.message || 'Validation error';
        } else {
          // Complex detail object - try to extract meaningful info
          errorMessage = JSON.stringify(errorData.detail);
        }
      } else if (errorData.message) {
        // Alternative error format
        errorMessage = errorData.message;
      } else if (Array.isArray(errorData) && errorData.length > 0) {
        // Direct validation errors array format (legacy FastAPI)
        const firstError = errorData[0];
        errorMessage = firstError.msg || firstError.message || 'Validation error';
      } else if (typeof errorData === 'object') {
        // Complex object - try to extract meaningful info
        const errorKeys = Object.keys(errorData);
        if (errorKeys.length > 0) {
          const firstKey = errorKeys[0];
          const firstValue = errorData[firstKey];
          errorMessage = `${firstKey}: ${typeof firstValue === 'string' ? firstValue : JSON.stringify(firstValue)}`;
        } else {
          errorMessage = `HTTP ${response.status} - Server error`;
        }
      } else {
        errorMessage = `HTTP ${response.status} - Unknown error format`;
      }

      console.error('🔍 SURGERIES API ERROR: Extracted message:', errorMessage);

      // Only redirect to login for specific authentication failures
      if (response.status === 401 || response.status === 403) {
        const isAuthFailure = errorMessage.includes('Authentication required') ||
                             errorMessage.includes('Invalid token') ||
                             errorMessage.includes('Token expired') ||
                             errorMessage.includes('Session not found') ||
                             errorMessage.includes('Account is locked');

        if (isAuthFailure) {
          console.log('🚨 Surgeries API: Authentication failure detected, redirecting to login:', errorMessage);
          LocalStorageService.clearAuthenticationData();
          window.location.href = '/login';
        } else {
          console.warn(`⚠️ Surgeries API: ${response.status} error but not an auth failure:`, errorMessage);
        }

        throw new Error(errorMessage || `HTTP ${response.status} - Access denied`);
      }

      throw new Error(errorMessage);
    }
    return response.json();
  }

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

    const response = await fetch(`${API_BASE_URL}/api/surgeries`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    const apiSurgeries: SurgeryApiResponse[] = await this.handleResponse(response);
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

    const response = await fetch(`${API_BASE_URL}/api/surgeries`, {
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