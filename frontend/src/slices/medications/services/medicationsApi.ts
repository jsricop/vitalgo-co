/**
 * Medications API service
 * Handles all medication-related API calls using unified authentication
 * Converts between camelCase (frontend) and snake_case (backend)
 */

import {
  Medication,
  MedicationFormData,
  CreateMedicationRequest,
  MedicationApiResponse
} from '../types';
import { apiClient } from '../../../shared/services/apiClient';

class MedicationsAPIService {

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

      const response = await apiClient.get<MedicationApiResponse[]>('/medications/');
      const medications = response.data.map(med => this.transformFromApiResponse(med));

      console.log('✅ Medications loaded successfully:', medications.length, 'items');
      return medications;
    } catch (error) {
      console.error('❌ Error fetching medications:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
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
      const response = await apiClient.post<MedicationApiResponse>('/medications/', apiRequest);
      const medication = this.transformFromApiResponse(response.data);

      console.log('✅ Medication created successfully:', medication.medicationName);
      return medication;
    } catch (error) {
      console.error('❌ Error creating medication:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
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
      const response = await apiClient.put<MedicationApiResponse>(`/medications/${id}`, apiRequest);
      const medication = this.transformFromApiResponse(response.data);

      console.log('✅ Medication updated successfully:', medication.medicationName);
      return medication;
    } catch (error) {
      console.error('❌ Error updating medication:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  /**
   * Delete a medication
   */
  async deleteMedication(id: number): Promise<void> {
    try {
      console.log('🗑️ Deleting medication ID:', id);

      await apiClient.delete(`/medications/${id}`);
      console.log('✅ Medication deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting medication:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
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