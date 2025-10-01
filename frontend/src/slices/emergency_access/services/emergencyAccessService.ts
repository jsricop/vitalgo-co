/**
 * Emergency Access Service
 * Paramedic-only service for accessing patient emergency data via QR code
 */

import { apiClient } from '@/shared/services/apiClient';
import { convertKeysToCamelCase } from '@/shared/utils/caseConversion';
import type { EmergencyData } from '../types';

export const emergencyAccessService = {
  /**
   * Get patient emergency data by QR code
   * Requires paramedic authentication
   *
   * @param qrCode - Patient's unique QR code UUID
   * @returns Promise<EmergencyData> - Complete patient emergency information
   * @throws ApiError - If request fails (401 unauthorized, 403 forbidden, 404 not found)
   */
  async getEmergencyData(qrCode: string): Promise<EmergencyData> {
    const response = await apiClient.get<EmergencyData>(`/emergency/${qrCode}`);
    // Backend returns snake_case, convert to camelCase for frontend
    return convertKeysToCamelCase<EmergencyData>(response.data);
  },
};
