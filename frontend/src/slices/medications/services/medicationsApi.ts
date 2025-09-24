/**
 * Medications API service
 * Handles all medication-related API calls with authentication and data transformation
 * Converts between camelCase (frontend) and snake_case (backend)
 */

import {
  Medication,
  MedicationFormData,
  CreateMedicationRequest,
  MedicationApiResponse
} from '../types';
import { LocalStorageService } from '../../../shared/services/local-storage-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class MedicationsAPIService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = LocalStorageService.getAccessToken();

    // JWT TOKEN DEBUG: Frontend token analysis for medications
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExp = payload.exp - currentTime;

        console.log('🔍 MEDICATIONS API JWT DEBUG - Token Analysis:');
        console.log(`   Current timestamp: ${currentTime}`);
        console.log(`   Token exp timestamp: ${payload.exp}`);
        console.log(`   Time until expiration: ${timeUntilExp} seconds`);
        console.log(`   Token valid: ${timeUntilExp > 0}`);

        if (timeUntilExp <= 0) {
          console.log('❌ MEDICATIONS API JWT DEBUG - TOKEN ALREADY EXPIRED!');
        }
      } catch (e) {
        console.error('❌ MEDICATIONS API JWT DEBUG - Token parsing failed:', e);
      }
    } else {
      console.log('❌ MEDICATIONS API JWT DEBUG - No access token found');
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
        console.error('🔍 MEDICATIONS API ERROR: Failed to parse error response as JSON:', jsonError);
        errorMessage = `HTTP ${response.status} - Failed to parse error response`;
        throw new Error(errorMessage);
      }

      // Debug log the full error structure for analysis
      console.error('🔍 MEDICATIONS API ERROR: Full error object:', errorData);

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
          console.log('🔍 MEDICATIONS API: Parsed validation errors:', validationErrors);
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

      console.error('🔍 MEDICATIONS API ERROR: Extracted message:', errorMessage);

      // Only redirect to login for specific authentication failures
      if (response.status === 401 || response.status === 403) {
        const isAuthFailure = errorMessage.includes('Authentication required') ||
                             errorMessage.includes('Invalid token') ||
                             errorMessage.includes('Token expired') ||
                             errorMessage.includes('Session not found') ||
                             errorMessage.includes('Account is locked');

        if (isAuthFailure) {
          console.log('🚨 Medications API: Authentication failure detected, redirecting to login:', errorMessage);
          LocalStorageService.clearAuthenticationData();
          window.location.href = '/login';
        } else {
          console.warn(`⚠️ Medications API: ${response.status} error but not an auth failure:`, errorMessage);
        }

        throw new Error(errorMessage || `HTTP ${response.status} - Access denied`);
      }

      throw new Error(errorMessage);
    }
    return response.json();
  }

  /**
   * Transform frontend medication data (camelCase) to API request format (snake_case)
   * Properly handles optional date fields by converting empty values to null
   */
  private transformToApiRequest(data: MedicationFormData): CreateMedicationRequest {
    // Helper function to safely handle optional string fields
    const safeString = (value: string | undefined | null): string | null => {
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return null;
      }
      return value.trim();
    };

    const result = {
      medication_name: data.medicationName,
      dosage: data.dosage,
      frequency: data.frequency,
      start_date: data.startDate,
      end_date: safeString(data.endDate),
      prescribed_by: safeString(data.prescribedBy),
      notes: safeString(data.notes),
      is_active: data.isActive
    };

    console.log('🔍 FRONTEND TRANSFORM DEBUG - Input data:', data);
    console.log('🔍 FRONTEND TRANSFORM DEBUG - Transformed result:', result);

    return result;
  }

  /**
   * Transform API response (snake_case) to frontend medication format (camelCase)
   */
  private transformFromApiResponse(response: MedicationApiResponse): Medication {
    return {
      id: response.id,
      patientId: response.patient_id,
      medicationName: response.medication_name,
      dosage: response.dosage,
      frequency: response.frequency,
      startDate: response.start_date,
      endDate: response.end_date,
      isActive: response.is_active,
      notes: response.notes,
      prescribedBy: response.prescribed_by,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
  }

  /**
   * Get all medications for the authenticated patient
   */
  async getMedications(): Promise<Medication[]> {
    try {
      console.log('📊 Fetching medications...');

      const response = await fetch(`${API_BASE_URL}/api/medications/`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      const apiMedications = await this.handleResponse<MedicationApiResponse[]>(response);
      const medications = apiMedications.map(med => this.transformFromApiResponse(med));

      console.log('✅ Medications loaded successfully:', medications.length, 'items');
      return medications;
    } catch (error) {
      console.error('❌ Error fetching medications:', error);
      throw error;
    }
  }

  /**
   * Create a new medication
   */
  async createMedication(data: MedicationFormData): Promise<Medication> {
    try {
      console.log('📝 Creating medication:', data.medicationName);

      const apiRequest = this.transformToApiRequest(data);
      const response = await fetch(`${API_BASE_URL}/api/medications/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(apiRequest),
      });

      const apiMedication = await this.handleResponse<MedicationApiResponse>(response);
      const medication = this.transformFromApiResponse(apiMedication);

      console.log('✅ Medication created successfully:', medication.medicationName);
      return medication;
    } catch (error) {
      console.error('❌ Error creating medication:', error);
      throw error;
    }
  }

  /**
   * Update an existing medication
   */
  async updateMedication(id: number, data: MedicationFormData): Promise<Medication> {
    try {
      console.log('📝 Updating medication ID:', id, 'Name:', data.medicationName);

      const apiRequest = this.transformToApiRequest(data);
      const response = await fetch(`${API_BASE_URL}/api/medications/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(apiRequest),
      });

      const apiMedication = await this.handleResponse<MedicationApiResponse>(response);
      const medication = this.transformFromApiResponse(apiMedication);

      console.log('✅ Medication updated successfully:', medication.medicationName);
      return medication;
    } catch (error) {
      console.error('❌ Error updating medication:', error);
      throw error;
    }
  }

  /**
   * Delete a medication
   */
  async deleteMedication(id: number): Promise<void> {
    try {
      console.log('🗑️ Deleting medication ID:', id);

      const response = await fetch(`${API_BASE_URL}/api/medications/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      await this.handleResponse(response);
      console.log('✅ Medication deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting medication:', error);
      throw error;
    }
  }

  /**
   * Toggle medication active status
   */
  async toggleMedicationStatus(id: number, isActive: boolean): Promise<Medication> {
    try {
      console.log('🔄 Toggling medication status ID:', id, 'Active:', isActive);

      // Get current medication data first
      const medications = await this.getMedications();
      const currentMedication = medications.find(med => med.id === id);

      if (!currentMedication) {
        throw new Error('Medication not found');
      }

      // Update with new status
      const updatedData: MedicationFormData = {
        medicationName: currentMedication.medicationName,
        dosage: currentMedication.dosage,
        frequency: currentMedication.frequency,
        startDate: currentMedication.startDate,
        endDate: currentMedication.endDate,
        prescribedBy: currentMedication.prescribedBy,
        notes: currentMedication.notes,
        isActive: isActive
      };

      return await this.updateMedication(id, updatedData);
    } catch (error) {
      console.error('❌ Error toggling medication status:', error);
      throw error;
    }
  }

  /**
   * Get medication by ID
   */
  async getMedicationById(id: number): Promise<Medication> {
    try {
      console.log('🔍 Fetching medication by ID:', id);

      const medications = await this.getMedications();
      const medication = medications.find(med => med.id === id);

      if (!medication) {
        throw new Error(`Medication with ID ${id} not found`);
      }

      console.log('✅ Medication found:', medication.medicationName);
      return medication;
    } catch (error) {
      console.error('❌ Error fetching medication by ID:', error);
      throw error;
    }
  }

  /**
   * Get medications summary for dashboard
   */
  async getMedicationsSummary(): Promise<{
    total: number;
    active: number;
    inactive: number;
    recentlyAdded: number;
  }> {
    try {
      const medications = await this.getMedications();
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const summary = {
        total: medications.length,
        active: medications.filter(med => med.isActive).length,
        inactive: medications.filter(med => !med.isActive).length,
        recentlyAdded: medications.filter(med =>
          new Date(med.createdAt) >= sevenDaysAgo
        ).length
      };

      console.log('📊 Medications summary:', summary);
      return summary;
    } catch (error) {
      console.error('❌ Error generating medications summary:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const medicationsAPI = new MedicationsAPIService();