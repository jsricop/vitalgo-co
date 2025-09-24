/**
 * Medication utility functions
 * Helper functions for formatting, validation, and data transformation
 */

import { Medication, MedicationFormData, MedicationFilters, MedicationSort } from '../types';

/**
 * Format medication frequency for display
 */
export const formatFrequency = (frequency: string): string => {
  const lowerFreq = frequency.toLowerCase().trim();

  // Common frequency mappings
  const frequencyMap: Record<string, string> = {
    'daily': 'Diariamente',
    'twice daily': 'Dos veces al día',
    'three times daily': 'Tres veces al día',
    'four times daily': 'Cuatro veces al día',
    'every 4 hours': 'Cada 4 horas',
    'every 6 hours': 'Cada 6 horas',
    'every 8 hours': 'Cada 8 horas',
    'every 12 hours': 'Cada 12 horas',
    'once weekly': 'Una vez por semana',
    'twice weekly': 'Dos veces por semana',
    'monthly': 'Mensualmente',
    'as needed': 'Según necesidad',
    'with meals': 'Con las comidas',
    'before meals': 'Antes de las comidas',
    'after meals': 'Después de las comidas',
    'at bedtime': 'Al acostarse'
  };

  return frequencyMap[lowerFreq] || frequency;
};

/**
 * Format medication dosage for display
 */
export const formatDosage = (dosage: string): string => {
  // Standardize common dosage formats
  return dosage
    .replace(/mg/gi, 'mg')
    .replace(/ml/gi, 'ml')
    .replace(/mcg/gi, 'mcg')
    .replace(/g/gi, 'g')
    .replace(/units?/gi, 'unidades')
    .replace(/tablet?s?/gi, 'tabletas')
    .replace(/capsule?s?/gi, 'cápsulas')
    .trim();
};

/**
 * Format date for display in Spanish locale
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Format date for display in short Spanish format (dd mmm yyyy)
 */
export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Format date for form inputs (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

/**
 * Calculate medication duration in days
 */
export const calculateDuration = (startDate: string, endDate?: string): number | null => {
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : null;
  } catch {
    return null;
  }
};

/**
 * Check if medication is recently added (within last 7 days)
 */
export const isRecentlyAdded = (createdAt: string): boolean => {
  try {
    const created = new Date(createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return created >= sevenDaysAgo;
  } catch {
    return false;
  }
};

/**
 * Check if medication is expiring soon (within next 7 days)
 */
export const isExpiringSoon = (endDate?: string): boolean => {
  if (!endDate) return false;

  try {
    const end = new Date(endDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const now = new Date();
    return end <= sevenDaysFromNow && end >= now;
  } catch {
    return false;
  }
};

/**
 * Check if medication is expired
 */
export const isExpired = (endDate?: string): boolean => {
  if (!endDate) return false;

  try {
    const end = new Date(endDate);
    const now = new Date();
    return end < now;
  } catch {
    return false;
  }
};

/**
 * Get medication status text and color
 */
export const getMedicationStatus = (medication: Medication): {
  text: string;
  color: string;
  bgColor: string;
} => {
  if (!medication.isActive) {
    return {
      text: 'Inactivo',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    };
  }

  if (isExpired(medication.endDate)) {
    return {
      text: 'Expirado',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    };
  }

  if (isExpiringSoon(medication.endDate)) {
    return {
      text: 'Por vencer',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    };
  }

  return {
    text: 'Activo',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  };
};

/**
 * Filter medications based on criteria
 */
export const filterMedications = (
  medications: Medication[],
  filters: MedicationFilters
): Medication[] => {
  return medications.filter(medication => {
    // Status filter
    if (filters.status) {
      const isActive = medication.isActive && !isExpired(medication.endDate);
      if (filters.status === 'active' && !isActive) return false;
      if (filters.status === 'inactive' && isActive) return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesName = medication.medicationName.toLowerCase().includes(searchLower);
      const matchesDosage = medication.dosage.toLowerCase().includes(searchLower);
      const matchesFrequency = medication.frequency.toLowerCase().includes(searchLower);
      const matchesDoctor = medication.prescribedBy?.toLowerCase().includes(searchLower);
      const matchesNotes = medication.notes?.toLowerCase().includes(searchLower);

      if (!matchesName && !matchesDosage && !matchesFrequency && !matchesDoctor && !matchesNotes) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      const medStartDate = new Date(medication.startDate);

      if (startDate && medStartDate < new Date(startDate)) return false;
      if (endDate && medStartDate > new Date(endDate)) return false;
    }

    return true;
  });
};

/**
 * Sort medications based on criteria
 */
export const sortMedications = (
  medications: Medication[],
  sort: MedicationSort
): Medication[] => {
  return [...medications].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sort.field) {
      case 'medicationName':
        aValue = a.medicationName.toLowerCase();
        bValue = b.medicationName.toLowerCase();
        break;
      case 'startDate':
        aValue = new Date(a.startDate);
        bValue = new Date(b.startDate);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Validate medication form data
 */
export const validateMedicationData = (data: MedicationFormData): string[] => {
  const errors: string[] = [];

  if (!data.medicationName.trim()) {
    errors.push('El nombre del medicamento es requerido');
  }

  if (!data.dosage.trim()) {
    errors.push('La dosis es requerida');
  }

  if (!data.frequency.trim()) {
    errors.push('La frecuencia es requerida');
  }

  if (!data.startDate.trim()) {
    errors.push('La fecha de inicio es requerida');
  }

  if (data.endDate && data.startDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
    }
  }

  return errors;
};

/**
 * Convert medication to form data
 */
export const medicationToFormData = (medication: Medication): MedicationFormData => {
  return {
    medicationName: medication.medicationName,
    dosage: medication.dosage,
    frequency: medication.frequency,
    startDate: medication.startDate,
    endDate: medication.endDate || '',
    prescribedBy: medication.prescribedBy || '',
    notes: medication.notes || '',
    isActive: medication.isActive
  };
};

/**
 * Generate medication summary text
 */
export const getMedicationSummary = (medication: Medication): string => {
  const parts = [
    medication.medicationName,
    medication.dosage,
    formatFrequency(medication.frequency)
  ];

  return parts.filter(Boolean).join(' - ');
};

/**
 * Check if two medications are the same (for duplicate detection)
 */
export const isSameMedication = (med1: MedicationFormData, med2: Medication): boolean => {
  return med1.medicationName.toLowerCase().trim() === med2.medicationName.toLowerCase().trim() &&
         med1.dosage.toLowerCase().trim() === med2.dosage.toLowerCase().trim();
};

/**
 * Get medication priority based on status and dates
 */
export const getMedicationPriority = (medication: Medication): number => {
  // Higher number = higher priority
  if (isExpired(medication.endDate)) return 1; // Lowest priority
  if (!medication.isActive) return 2;
  if (isExpiringSoon(medication.endDate)) return 4; // High priority
  if (isRecentlyAdded(medication.createdAt)) return 3;
  return 2; // Normal priority
};