/**
 * QR API service
 * Handles communication with QR endpoints
 * Uses unified apiClient for authentication
 */
import { apiClient } from '../../../shared/services/apiClient';
import { QRData, EmergencyPatientData, QRMetadata } from '../types';

interface QRApiResponse {
  qr_uuid: string;
  qr_url: string;
  created_at: string;
  expires_at?: string;
}

export const qrService = {
  /**
   * Generate QR code for authenticated patient
   * Actually fetches existing QR or creates one via GET /api/qr/
   */
  async generateQRCode(): Promise<QRData> {
    const response = await apiClient.get<QRApiResponse>('/qr/');

    // Transform backend response to match frontend QRData type
    return {
      qrCode: response.data.qr_uuid,
      emergencyUrl: response.data.qr_url,
      qrImageBase64: '', // Will be generated client-side by QRCodeCanvas
    };
  },

  /**
   * Get QR metadata for authenticated patient
   */
  async getQRMetadata(): Promise<QRMetadata> {
    const response = await apiClient.get<QRApiResponse>('/qr/');

    return {
      qrCode: response.data.qr_uuid,
      emergencyUrl: response.data.qr_url,
      hasQrCode: true, // If endpoint returns data, QR exists
    };
  },

  /**
   * Get emergency patient data by QR UUID (public endpoint)
   */
  async getEmergencyData(qrUuid: string): Promise<EmergencyPatientData> {
    const response = await fetch(`${API_BASE}/emergency/${qrUuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to get emergency data');
    }

    const data = await response.json();
    return {
      fullName: data.full_name,
      bloodType: data.blood_type,
      emergencyContact: data.emergency_contact,
      criticalAllergies: data.critical_allergies || [],
      currentMedications: data.current_medications || [],
      chronicConditions: data.chronic_conditions || [],
    };
  },

  /**
   * Download QR code as image file
   */
  downloadQRCode(qrImageBase64: string, filename: string = 'mi-qr-vitalgo.png') {
    // Create download link
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrImageBase64}`;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};