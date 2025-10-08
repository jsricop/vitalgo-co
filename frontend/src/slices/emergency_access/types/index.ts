/**
 * TypeScript types for Emergency Access slice
 * Paramedic-only access to patient emergency data
 */

export interface EmergencyMedication {
  medicationName: string;
  dosage: string;
  frequency: string;
  isActive: boolean;
  notes?: string;
  prescribedBy?: string;
}

export interface EmergencyAllergy {
  allergen: string;
  severityLevel: string;
  reactionDescription?: string;
  notes?: string;
}

export interface EmergencySurgery {
  procedureName: string;
  surgeryDate: string; // ISO date string
  hospitalName?: string;
  complications?: string;
}

export interface EmergencyIllness {
  illnessName: string;
  diagnosisDate: string; // ISO date string
  status: string;
  isChronic: boolean;
  treatmentDescription?: string;
  cie10Code?: string;
}

export interface EmergencyData {
  // Basic Information
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string; // ISO date string
  biologicalSex?: string;
  gender?: string;

  // Personal Information
  bloodType?: string;
  eps?: string;
  occupation?: string;
  residenceAddress?: string;
  residenceCountry?: string;
  residenceCity?: string;

  // Emergency Contacts
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactPhoneAlt?: string;

  // Medical Information
  medications: EmergencyMedication[];
  allergies: EmergencyAllergy[];
  surgeries: EmergencySurgery[];
  illnesses: EmergencyIllness[];

  // Gynecological Information (only if biologicalSex === 'F')
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  lastMenstruationDate?: string; // ISO date string
  menstrualStatus?: string; // 'NOT_STARTED', 'ACTIVE', 'MENOPAUSE', or null
  pregnanciesCount?: number;
  birthsCount?: number;
  cesareansCount?: number;
  abortionsCount?: number;
  contraceptiveMethod?: string;
}

export interface EmergencyAccessError {
  message: string;
  status?: number;
  detail?: string;
}
