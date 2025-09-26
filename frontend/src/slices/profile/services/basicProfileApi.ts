/**
 * Basic Profile API service
 * Handles CRUD operations for basic patient information using unified apiClient
 */
import { BasicPatientInfo, BasicPatientUpdate } from '../types';
import { apiClient } from '../../../shared/services/apiClient';

class BasicProfileAPIService {
  /**
   * Get basic patient information
   */
  async getBasicPatientInfo(): Promise<BasicPatientInfo> {
    try {
      console.log('📊 Fetching basic patient info...');

      const response = await apiClient.get<any>('/profile/basic');
      const data = response.data;

      // Transform snake_case to camelCase
      const basicInfo: BasicPatientInfo = {
        firstName: data.first_name,
        lastName: data.last_name,
        documentType: data.document_type,
        documentNumber: data.document_number,
        phoneInternational: data.phone_international,
        birthDate: data.birth_date,
        originCountry: data.origin_country,
        email: data.email,
      };

      console.log('✅ Basic patient info loaded successfully:', basicInfo);
      return basicInfo;
    } catch (error) {
      console.error('❌ Error fetching basic patient info:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  /**
   * Update basic patient information
   */
  async updateBasicPatientInfo(data: BasicPatientUpdate): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📝 Updating basic patient info:', data);

      // Transform camelCase to snake_case
      const apiRequest = {
        first_name: data.firstName,
        last_name: data.lastName,
        document_type: data.documentType,
        document_number: data.documentNumber,
        phone_international: data.phoneInternational,
        birth_date: data.birthDate,
        origin_country: data.originCountry,
        email: data.email,
      };

      const response = await apiClient.put<{ success: boolean; message: string }>('/profile/basic', apiRequest);

      console.log('✅ Basic patient info updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating basic patient info:', error);
      // Re-throw as standard Error for consistent error handling
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }
}

// Export singleton instance
export const basicProfileApi = new BasicProfileAPIService();