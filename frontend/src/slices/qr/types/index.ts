/**
 * QR slice type definitions
 */

export interface QRData {
  qrCode: string;
  emergencyUrl: string;
  qrImageBase64: string;
}

export interface EmergencyPatientData {
  fullName: string;
  bloodType?: string;
  emergencyContact?: string;
  criticalAllergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
}

export interface QRMetadata {
  qrCode: string;
  emergencyUrl: string;
  hasQrCode: boolean;
}