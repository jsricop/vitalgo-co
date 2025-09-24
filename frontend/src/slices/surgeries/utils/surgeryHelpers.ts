/**
 * Surgery utility functions
 * Helper functions for formatting, validation, and data transformation
 */

import { Surgery, SurgeryFormData, SurgeryFilters, SurgerySort, AnesthesiaTypeOption, AnesthesiaType } from '../types';

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
 * Format surgery duration for display
 */
export const formatDuration = (hours?: number): string => {
  if (!hours || hours === 0) return 'No especificada';

  if (hours === 1) return '1 hora';
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }

  // Handle decimal hours
  if (hours % 1 !== 0) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours % 1) * 60);

    if (wholeHours === 0) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }

    if (minutes === 0) {
      return `${wholeHours} hora${wholeHours !== 1 ? 's' : ''}`;
    }

    return `${wholeHours} hora${wholeHours !== 1 ? 's' : ''} y ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }

  return `${hours} hora${hours !== 1 ? 's' : ''}`;
};

/**
 * Format anesthesia type for display
 */
export const formatAnesthesiaType = (type?: string): string => {
  if (!type) return 'No especificada';

  const typeMap: Record<string, string> = {
    'general': 'General',
    'local': 'Local',
    'regional': 'Regional',
    'spinal': 'Espinal',
    'epidural': 'Epidural',
    'conscious_sedation': 'Sedación consciente',
    'other': 'Otra'
  };

  return typeMap[type.toLowerCase()] || type;
};

/**
 * Get anesthesia type options for select inputs
 */
export const getAnesthesiaTypeOptions = (): AnesthesiaTypeOption[] => [
  { value: '', label: 'Seleccionar tipo de anestesia' },
  { value: 'general', label: 'General' },
  { value: 'local', label: 'Local' },
  { value: 'regional', label: 'Regional' },
  { value: 'spinal', label: 'Espinal' },
  { value: 'epidural', label: 'Epidural' },
  { value: 'conscious_sedation', label: 'Sedación consciente' },
  { value: 'other', label: 'Otra' },
];

/**
 * Check if surgery is recent (within last 30 days)
 */
export const isRecentSurgery = (surgeryDate: string): boolean => {
  try {
    const surgery = new Date(surgeryDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return surgery >= thirtyDaysAgo;
  } catch {
    return false;
  }
};

/**
 * Check if surgery has complications
 */
export const hasComplications = (surgery: Surgery): boolean => {
  return !!(surgery.complications && surgery.complications.trim().length > 0);
};

/**
 * Check if surgery is recently added (within last 7 days)
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
 * Get surgery status and color based on date and complications
 */
export const getSurgeryStatus = (surgery: Surgery): {
  text: string;
  color: string;
  bgColor: string;
} => {
  if (hasComplications(surgery)) {
    return {
      text: 'Con complicaciones',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    };
  }

  if (isRecentSurgery(surgery.surgeryDate)) {
    return {
      text: 'Reciente',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    };
  }

  return {
    text: 'Normal',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  };
};

/**
 * Filter surgeries based on criteria
 */
export const filterSurgeries = (
  surgeries: Surgery[],
  filters: SurgeryFilters
): Surgery[] => {
  return surgeries.filter(surgery => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesProcedure = surgery.procedureName.toLowerCase().includes(searchLower);
      const matchesHospital = surgery.hospitalName?.toLowerCase().includes(searchLower);
      const matchesSurgeon = surgery.surgeonName?.toLowerCase().includes(searchLower);
      const matchesNotes = surgery.notes?.toLowerCase().includes(searchLower);
      const matchesComplications = surgery.complications?.toLowerCase().includes(searchLower);

      if (!matchesProcedure && !matchesHospital && !matchesSurgeon && !matchesNotes && !matchesComplications) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      const surgeryDate = new Date(surgery.surgeryDate);

      if (startDate && surgeryDate < new Date(startDate)) return false;
      if (endDate && surgeryDate > new Date(endDate)) return false;
    }

    // Hospital filter
    if (filters.hospitalName) {
      const filterHospital = filters.hospitalName.toLowerCase();
      const surgeryHospital = surgery.hospitalName?.toLowerCase() || '';
      if (!surgeryHospital.includes(filterHospital)) return false;
    }

    // Surgeon filter
    if (filters.surgeonName) {
      const filterSurgeon = filters.surgeonName.toLowerCase();
      const surgerySurgeon = surgery.surgeonName?.toLowerCase() || '';
      if (!surgerySurgeon.includes(filterSurgeon)) return false;
    }

    return true;
  });
};

/**
 * Sort surgeries based on criteria
 */
export const sortSurgeries = (
  surgeries: Surgery[],
  sort: SurgerySort
): Surgery[] => {
  return [...surgeries].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sort.field) {
      case 'procedureName':
        aValue = a.procedureName.toLowerCase();
        bValue = b.procedureName.toLowerCase();
        break;
      case 'surgeryDate':
        aValue = new Date(a.surgeryDate);
        bValue = new Date(b.surgeryDate);
        break;
      case 'hospitalName':
        aValue = (a.hospitalName || '').toLowerCase();
        bValue = (b.hospitalName || '').toLowerCase();
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
 * Validate surgery form data
 */
export const validateSurgeryData = (data: SurgeryFormData): string[] => {
  const errors: string[] = [];

  if (!data.procedureName.trim()) {
    errors.push('El nombre del procedimiento es requerido');
  }

  if (!data.surgeryDate.trim()) {
    errors.push('La fecha de la cirugía es requerida');
  }

  if (data.surgeryDate) {
    const date = new Date(data.surgeryDate);
    if (isNaN(date.getTime())) {
      errors.push('La fecha debe ser válida');
    } else {
      const now = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(now.getFullYear() + 5);
      if (date > maxDate) {
        errors.push('La fecha no puede ser más de 5 años en el futuro');
      }
    }
  }

  if (data.durationHours !== undefined && data.durationHours !== null) {
    if (data.durationHours < 0) {
      errors.push('La duración no puede ser negativa');
    }
    if (data.durationHours > 24) {
      errors.push('La duración no puede exceder 24 horas');
    }
  }

  return errors;
};

/**
 * Convert surgery to form data
 */
export const surgeryToFormData = (surgery: Surgery): SurgeryFormData => {
  return {
    procedureName: surgery.procedureName,
    surgeryDate: surgery.surgeryDate,
    hospitalName: surgery.hospitalName || '',
    surgeonName: surgery.surgeonName || '',
    anesthesiaType: surgery.anesthesiaType || '',
    durationHours: surgery.durationHours,
    notes: surgery.notes || '',
    complications: surgery.complications || '',
  };
};

/**
 * Generate surgery summary text
 */
export const getSurgerySummary = (surgery: Surgery): string => {
  const parts = [
    surgery.procedureName,
    surgery.hospitalName,
    surgery.surgeonName
  ];

  return parts.filter(Boolean).join(' - ') || surgery.procedureName;
};

/**
 * Get surgery priority based on complications and date
 */
export const getSurgeryPriority = (surgery: Surgery): number => {
  // Higher number = higher priority
  if (hasComplications(surgery)) return 4; // Highest priority
  if (isRecentSurgery(surgery.surgeryDate)) return 3;
  if (isRecentlyAdded(surgery.createdAt)) return 2;
  return 1; // Normal priority
};

/**
 * Check if two surgeries are the same (for duplicate detection)
 */
export const isSameSurgery = (surgery1: SurgeryFormData, surgery2: Surgery): boolean => {
  return surgery1.procedureName.toLowerCase().trim() === surgery2.procedureName.toLowerCase().trim() &&
         surgery1.surgeryDate === surgery2.surgeryDate &&
         (surgery1.hospitalName || '') === (surgery2.hospitalName || '');
};