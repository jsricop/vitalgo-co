/**
 * Allergies slice type definitions
 * Domain-specific types following camelCase conventions for frontend
 */

// Core allergy interface (camelCase for frontend)
export interface Allergy {
  id: number;
  patientId: string;
  allergen: string;
  severityLevel: string; // "leve" | "moderada" | "severa" | "critica"
  reactionDescription?: string;
  diagnosisDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interface for creating/editing allergies
export interface AllergyFormData {
  allergen: string;
  severityLevel: string;
  reactionDescription?: string;
  diagnosisDate?: string;
  notes?: string;
}

// API request interface (snake_case for backend compatibility)
export interface CreateAllergyRequest {
  allergen: string;
  severity_level: string;
  reaction_description?: string;
  diagnosis_date?: string;
  notes?: string;
}

// API response interface (snake_case from backend)
export interface AllergyApiResponse {
  id: number;
  patient_id: string;
  allergen: string;
  severity_level: string;
  reaction_description?: string;
  diagnosis_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// CRUD actions interface
export interface AllergyActions {
  onCreate: (data: AllergyFormData) => Promise<void>;
  onUpdate: (id: number, data: AllergyFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

// Hook return types
export interface UseAllergiesResult {
  allergies: Allergy[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseAllergyFormResult {
  formData: AllergyFormData;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  handleInputChange: (field: keyof AllergyFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFormData: (data: Partial<AllergyFormData>) => void;
}

export interface UseAllergyActionsResult {
  createAllergy: (data: AllergyFormData) => Promise<Allergy>;
  updateAllergy: (id: number, data: AllergyFormData) => Promise<Allergy>;
  deleteAllergy: (id: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Component prop interfaces
export interface AllergyCardProps {
  allergy: Allergy;
  onEdit?: (allergy: Allergy) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  compact?: boolean;
  'data-testid'?: string;
}

export interface AllergyFormProps {
  initialData?: Partial<AllergyFormData>;
  onSubmit: (data: AllergyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  'data-testid'?: string;
}

export interface AllergiesCardProps {
  maxItems?: number;
  showAddButton?: boolean;
  onNavigateToFull?: () => void;
  onAddNew?: () => void;
  className?: string;
  'data-testid'?: string;
}

export interface AllergiesListProps {
  allergies: Allergy[];
  onEdit?: (allergy: Allergy) => void;
  onDelete?: (id: number) => void;
  onAddNew?: () => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  'data-testid'?: string;
}

// Validation types
export interface AllergyValidationRules {
  allergen: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
  };
  severityLevel: {
    required: boolean;
    allowedValues: string[];
  };
  diagnosisDate: {
    maxDate?: Date;
  };
}

// Form field error types
export type AllergyFormErrors = Partial<Record<keyof AllergyFormData, string>>;

// Severity level types
export type SeverityLevel = 'leve' | 'moderada' | 'severa' | 'critica';

// Filter and sort types
export interface AllergyFilters {
  severityLevel?: SeverityLevel;
  searchTerm?: string;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

export type AllergySortField = 'allergen' | 'severityLevel' | 'diagnosisDate' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface AllergySort {
  field: AllergySortField;
  direction: SortDirection;
}

// Dashboard integration types
export interface AllergySummary {
  total: number;
  bySeverity: {
    leve: number;
    moderada: number;
    severa: number;
    critica: number;
  };
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
export type AllergyEventHandler<T = void> = (allergy: Allergy) => T;
export type AllergyIdEventHandler<T = void> = (id: number) => T;
export type AllergyFormEventHandler = (data: AllergyFormData) => Promise<void>;

// Severity level display mappings
export interface SeverityLevelConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export type SeverityLevelMapping = Record<SeverityLevel, SeverityLevelConfig>;