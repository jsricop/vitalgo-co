/**
 * Surgeries slice type definitions
 * Domain-specific types following camelCase conventions for frontend
 */

// Core surgery interface (camelCase for frontend)
export interface Surgery {
  id: number;
  patientId: string;
  procedureName: string;
  surgeryDate: string;
  hospitalName?: string;
  surgeonName?: string;
  anesthesiaType?: string;
  durationHours?: number;
  notes?: string;
  complications?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interface for creating/editing surgeries
export interface SurgeryFormData {
  procedureName: string;
  surgeryDate: string;
  hospitalName?: string;
  surgeonName?: string;
  anesthesiaType?: string;
  durationHours?: number;
  notes?: string;
  complications?: string;
}

// API request interface (snake_case for backend compatibility)
export interface CreateSurgeryRequest {
  procedure_name: string;
  surgery_date: string;
  hospital_name?: string;
  surgeon_name?: string;
  anesthesia_type?: string;
  duration_hours?: number;
  notes?: string;
  complications?: string;
}

// API response interface (snake_case from backend)
export interface SurgeryApiResponse {
  id: number;
  patient_id: string;
  procedure_name: string;
  surgery_date: string;
  hospital_name?: string;
  surgeon_name?: string;
  anesthesia_type?: string;
  duration_hours?: number;
  notes?: string;
  complications?: string;
  created_at: string;
  updated_at: string;
}

// CRUD actions interface
export interface SurgeryActions {
  onCreate: (data: SurgeryFormData) => Promise<void>;
  onUpdate: (id: number, data: SurgeryFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

// Hook return types
export interface UseSurgeriesResult {
  surgeries: Surgery[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseSurgeryFormResult {
  formData: SurgeryFormData;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  handleInputChange: (field: keyof SurgeryFormData, value: string | number | undefined) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFormData: (data: Partial<SurgeryFormData>) => void;
}

export interface UseSurgeryActionsResult {
  createSurgery: (data: SurgeryFormData) => Promise<Surgery>;
  updateSurgery: (id: number, data: SurgeryFormData) => Promise<Surgery>;
  deleteSurgery: (id: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Component prop interfaces
export interface SurgeryCardProps {
  surgery: Surgery;
  onEdit?: (surgery: Surgery) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  compact?: boolean;
  'data-testid'?: string;
}

export interface SurgeryFormProps {
  initialData?: Partial<SurgeryFormData>;
  onSubmit: (data: SurgeryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  'data-testid'?: string;
}

export interface SurgeriesCardProps {
  maxItems?: number;
  showAddButton?: boolean;
  onNavigateToFull?: () => void;
  onAddNew?: () => void;
  className?: string;
  'data-testid'?: string;
}

export interface SurgeriesListProps {
  surgeries: Surgery[];
  onEdit?: (surgery: Surgery) => void;
  onDelete?: (id: number) => void;
  onAddNew?: () => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  'data-testid'?: string;
}

// Validation types
export interface SurgeryValidationRules {
  procedureName: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
  };
  surgeryDate: {
    required: boolean;
    maxDate?: Date;
  };
  hospitalName: {
    maxLength?: number;
  };
  surgeonName: {
    maxLength?: number;
  };
  anesthesiaType: {
    maxLength?: number;
  };
  durationHours: {
    min?: number;
    max?: number;
  };
}

// Form field error types
export type SurgeryFormErrors = Partial<Record<keyof SurgeryFormData, string>>;

// Filter and sort types
export interface SurgeryFilters {
  searchTerm?: string;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  hospitalName?: string;
  surgeonName?: string;
}

export type SurgerySortField = 'procedureName' | 'surgeryDate' | 'updatedAt' | 'hospitalName';
export type SortDirection = 'asc' | 'desc';

export interface SurgerySort {
  field: SurgerySortField;
  direction: SortDirection;
}

// Dashboard integration types
export interface SurgerySummary {
  total: number;
  recent: number;
  withComplications: number;
  recentlyAdded: number;
  recentlyUpdated: number;
}

// Utility types for component states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Event handler types
export type SurgeryEventHandler<T = void> = (surgery: Surgery) => T;
export type SurgeryIdEventHandler<T = void> = (id: number) => T;
export type SurgeryFormEventHandler = (data: SurgeryFormData) => Promise<void>;

// Anesthesia type options (common types)
export type AnesthesiaType =
  | 'general'
  | 'local'
  | 'regional'
  | 'spinal'
  | 'epidural'
  | 'conscious_sedation'
  | 'other';

export interface AnesthesiaTypeOption {
  value: AnesthesiaType | string;
  label: string;
}

// Surgery status based on date and complications
export type SurgeryStatus = 'recent' | 'with_complications' | 'normal';

export interface SurgeryStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export type SurgeryStatusMapping = Record<SurgeryStatus, SurgeryStatusConfig>;