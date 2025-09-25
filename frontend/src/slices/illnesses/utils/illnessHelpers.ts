/**
 * Illness utility functions
 * Helper functions for formatting, validation, and data transformation
 */

import { PatientIllnessDTO, IllnessFormData, IllnessStatus } from '../types';

/**
 * Format illness status for display
 */
export const formatStatus = (status: IllnessStatus): string => {
  const statusMap: Record<IllnessStatus, string> = {
    'activa': 'Activa',
    'en_tratamiento': 'En Tratamiento',
    'curada': 'Curada',
    'cronica': 'Crónica'
  };

  return statusMap[status] || status;
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
 * Calculate days since diagnosis
 */
export const calculateDuration = (diagnosisDate: string): number | null => {
  try {
    const diagnosis = new Date(diagnosisDate);
    const today = new Date();

    const diffTime = today.getTime() - diagnosis.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : null;
  } catch {
    return null;
  }
};

/**
 * Check if illness is recently added (within last 7 days)
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
 * Get illness status with colors and styling
 */
export const getIllnessStatus = (illness: PatientIllnessDTO): {
  text: string;
  color: string;
  bgColor: string;
  dotColor: string;
} => {
  switch (illness.status) {
    case 'activa':
      return {
        text: 'Activa',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        dotColor: 'bg-red-500'
      };
    case 'en_tratamiento':
      return {
        text: 'En Tratamiento',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        dotColor: 'bg-blue-500'
      };
    case 'curada':
      return {
        text: 'Curada',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        dotColor: 'bg-green-500'
      };
    case 'cronica':
      return {
        text: 'Crónica',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        dotColor: 'bg-orange-500'
      };
    default:
      return {
        text: illness.status,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        dotColor: 'bg-gray-500'
      };
  }
};

/**
 * Filter illnesses based on criteria
 */
export const filterIllnesses = (
  illnesses: PatientIllnessDTO[],
  filterStatus: 'all' | 'activas' | 'cronicas' | 'curadas',
  searchTerm?: string
): PatientIllnessDTO[] => {
  return illnesses.filter(illness => {
    // Status filter
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'activas':
          if (illness.status !== 'activa') return false;
          break;
        case 'cronicas':
          if (!illness.isChronic) return false;
          break;
        case 'curadas':
          if (illness.status !== 'curada') return false;
          break;
      }
    }

    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = illness.illnessName.toLowerCase().includes(searchLower);
      const matchesTreatment = illness.treatmentDescription?.toLowerCase().includes(searchLower);
      const matchesDiagnosed = illness.diagnosedBy?.toLowerCase().includes(searchLower);
      const matchesNotes = illness.notes?.toLowerCase().includes(searchLower);
      const matchesCie10 = illness.cie10Code?.toLowerCase().includes(searchLower);

      if (!matchesName && !matchesTreatment && !matchesDiagnosed && !matchesNotes && !matchesCie10) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort illnesses based on criteria
 */
export const sortIllnesses = (
  illnesses: PatientIllnessDTO[],
  sortField: 'illnessName' | 'diagnosisDate' | 'updatedAt' | 'status',
  sortDirection: 'asc' | 'desc' = 'desc'
): PatientIllnessDTO[] => {
  return [...illnesses].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sortField) {
      case 'illnessName':
        aValue = a.illnessName.toLowerCase();
        bValue = b.illnessName.toLowerCase();
        break;
      case 'diagnosisDate':
        aValue = new Date(a.diagnosisDate);
        bValue = new Date(b.diagnosisDate);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Validate illness form data
 */
export const validateIllnessData = (data: IllnessFormData): string[] => {
  const errors: string[] = [];

  if (!data.illnessName.trim()) {
    errors.push('El nombre de la enfermedad es requerido');
  }

  if (!data.diagnosisDate.trim()) {
    errors.push('La fecha de diagnóstico es requerida');
  }

  if (!data.status.trim()) {
    errors.push('El estado es requerido');
  }

  // Validate diagnosis date is not in future
  if (data.diagnosisDate) {
    const diagnosisDate = new Date(data.diagnosisDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (diagnosisDate > today) {
      errors.push('La fecha de diagnóstico no puede ser futura');
    }
  }

  return errors;
};

/**
 * Convert illness to form data
 */
export const illnessToFormData = (illness: PatientIllnessDTO): IllnessFormData => {
  return {
    illnessName: illness.illnessName,
    diagnosisDate: illness.diagnosisDate,
    status: illness.status,
    isChronic: illness.isChronic,
    treatmentDescription: illness.treatmentDescription || '',
    cie10Code: illness.cie10Code || '',
    diagnosedBy: illness.diagnosedBy || '',
    notes: illness.notes || ''
  };
};

/**
 * Generate illness summary text
 */
export const getIllnessSummary = (illness: PatientIllnessDTO): string => {
  const parts = [
    illness.illnessName,
    formatStatus(illness.status)
  ];

  if (illness.isChronic) {
    parts.push('(Crónica)');
  }

  return parts.filter(Boolean).join(' - ');
};

/**
 * Check if two illnesses are the same (for duplicate detection)
 */
export const isSameIllness = (illness1: IllnessFormData, illness2: PatientIllnessDTO): boolean => {
  return illness1.illnessName.toLowerCase().trim() === illness2.illnessName.toLowerCase().trim() &&
         illness1.diagnosisDate === illness2.diagnosisDate;
};

/**
 * Get illness priority based on status and chronic condition
 */
export const getIllnessPriority = (illness: PatientIllnessDTO): number => {
  // Higher number = higher priority
  if (illness.status === 'curada') return 1; // Lowest priority
  if (illness.status === 'cronica' || illness.isChronic) return 4; // High priority
  if (illness.status === 'activa') return 3;
  if (illness.status === 'en_tratamiento') return 3;
  if (isRecentlyAdded(illness.createdAt)) return 3;
  return 2; // Normal priority
};

/**
 * Get chronic condition indicator
 */
export const getChronicIndicator = (illness: PatientIllnessDTO): {
  show: boolean;
  text: string;
  color: string;
  bgColor: string;
} => {
  if (illness.isChronic || illness.status === 'cronica') {
    return {
      show: true,
      text: 'Crónica',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    };
  }

  return {
    show: false,
    text: '',
    color: '',
    bgColor: ''
  };
};

/**
 * Format duration since diagnosis
 */
export const formatDurationSinceDiagnosis = (diagnosisDate: string): string => {
  const duration = calculateDuration(diagnosisDate);

  if (duration === null) return '';

  if (duration === 0) return 'Hoy';
  if (duration === 1) return 'Hace 1 día';
  if (duration < 30) return `Hace ${duration} días`;
  if (duration < 365) {
    const months = Math.floor(duration / 30);
    return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
  }

  const years = Math.floor(duration / 365);
  return years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
};

/**
 * Get status counts for dashboard statistics
 */
export const getStatusCounts = (illnesses: PatientIllnessDTO[]) => {
  const total = illnesses.length;
  const activas = illnesses.filter(illness => illness.status === 'activa').length;
  const cronicas = illnesses.filter(illness => illness.isChronic || illness.status === 'cronica').length;
  const curadas = illnesses.filter(illness => illness.status === 'curada').length;
  const enTratamiento = illnesses.filter(illness => illness.status === 'en_tratamiento').length;

  return {
    total,
    activas,
    cronicas,
    curadas,
    enTratamiento
  };
};