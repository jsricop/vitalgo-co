/**
 * Medications slice type definitions
 * Domain-specific types following camelCase conventions for frontend
 */

// Core medication interface (camelCase for frontend)
export interface Medication {
  id: number;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  prescribedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interface for creating/editing medications
export interface MedicationFormData {
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
  isActive: boolean;
}

// API request interface (snake_case for backend compatibility)
export interface CreateMedicationRequest {
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  prescribed_by?: string;
  notes?: string;
  is_active: boolean;
}

// API response interface (snake_case from backend)
export interface MedicationApiResponse {
  id: number;
  patient_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  notes?: string;
  prescribed_by?: string;
  created_at: string;
  updated_at: string;
}

// CRUD actions interface
export interface MedicationActions {
  onCreate: (data: MedicationFormData) => Promise<void>;
  onUpdate: (id: number, data: MedicationFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggleActive: (id: number, isActive: boolean) => Promise<void>;
}

// Hook return types
export interface UseMedicationsResult {
  medications: Medication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseMedicationFormResult {
  formData: MedicationFormData;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  handleInputChange: (field: keyof MedicationFormData, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFormData: (data: Partial<MedicationFormData>) => void;
}

export interface UseMedicationActionsResult {
  createMedication: (data: MedicationFormData) => Promise<Medication>;
  updateMedication: (id: number, data: MedicationFormData) => Promise<Medication>;
  deleteMedication: (id: number) => Promise<void>;
  toggleMedicationStatus: (id: number, isActive: boolean) => Promise<Medication>;
  isLoading: boolean;
  error: string | null;
}

// Component prop interfaces
export interface MedicationCardProps {
  medication: Medication;
  onEdit?: (medication: Medication) => void;
  onDelete?: (id: number) => void;
  onToggleActive?: (id: number, isActive: boolean) => void;
  showActions?: boolean;
  compact?: boolean;
  'data-testid'?: string;
}

export interface MedicationFormProps {
  initialData?: Partial<MedicationFormData>;
  onSubmit: (data: MedicationFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  'data-testid'?: string;
}

export interface MedicationsCardProps {
  maxItems?: number;
  showAddButton?: boolean;
  onNavigateToFull?: () => void;
  onAddNew?: () => void;
  className?: string;
  'data-testid'?: string;
}

export interface MedicationsListProps {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
  onDelete?: (id: number) => void;
  onAddNew?: () => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  'data-testid'?: string;
}

// Validation types
export interface MedicationValidationRules {
  medicationName: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
  };
  dosage: {
    required: boolean;
    pattern?: RegExp;
  };
  frequency: {
    required: boolean;
    minLength?: number;
  };
  startDate: {
    required: boolean;
    maxDate?: Date;
  };
  endDate: {
    minDate?: Date;
  };
}

// Form field error types
export type MedicationFormErrors = Partial<Record<keyof MedicationFormData, string>>;

// Status types
export type MedicationStatus = 'active' | 'inactive';

// Filter and sort types
export interface MedicationFilters {
  status?: MedicationStatus;
  searchTerm?: string;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

export type MedicationSortField = 'medicationName' | 'startDate' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface MedicationSort {
  field: MedicationSortField;
  direction: SortDirection;
}

// Dashboard integration types
export interface MedicationSummary {
  total: number;
  active: number;
  inactive: number;
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
export type MedicationEventHandler<T = void> = (medication: Medication) => T;
export type MedicationIdEventHandler<T = void> = (id: number) => T;
export type MedicationFormEventHandler = (data: MedicationFormData) => Promise<void>;