/**
 * Dashboard API service
 * Handles all dashboard-related API calls with authentication
 */

import {
  DashboardData
} from '../types';
import { apiClient } from '../../../shared/services/apiClient';

class DashboardAPIService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log('📊 DashboardAPI: Fetching dashboard data');

      const response = await apiClient.get<DashboardData>('/dashboard/');

      console.log('✅ DashboardAPI: Dashboard data fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof (error as any).status === 'number') {
        throw new Error((error as any).message);
      }
      throw error;
    }
  }

  // ALL MEDICAL CRUD OPERATIONS REMOVED - Now handled by dedicated slices:
  // - Medications: frontend/src/slices/medications/services/medicationsApi.ts -> /api/medications
  // - Allergies: Use dedicated allergies slice -> /api/allergies
  // - Surgeries: Use dedicated surgeries slice -> /api/surgeries
  // - Illnesses: Use dedicated illnesses slice -> /api/illnesses
  // Dashboard only handles summary/statistics data
}

export const dashboardAPI = new DashboardAPIService();