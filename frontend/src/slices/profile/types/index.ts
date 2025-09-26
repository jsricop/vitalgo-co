/**
 * Profile Types
 * Type definitions for profile slice components
 */

// Tab identifiers
export type ProfileTab = 'basic' | 'personal' | 'medical' | 'gynecological';

// Tab configuration
export interface TabConfig {
  id: ProfileTab;
  label: string;
  testId: string;
}

// Basic information interfaces (from signup)
export interface BasicPatientInfo {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phoneInternational: string;
  birthDate: string;
  originCountry: string;
  email: string;
}

// Basic information update interface
export interface BasicPatientUpdate {
  firstName?: string;
  lastName?: string;
  documentType?: string;
  documentNumber?: string;
  phoneInternational?: string;
  birthDate?: string;
  originCountry?: string;
  email?: string;
}

// Hook result interfaces
export interface UseBasicPatientInfoResult {
  basicInfo: BasicPatientInfo | null;
  loading: boolean;
  error: string | null;
  updateBasicInfo: (data: BasicPatientUpdate) => Promise<{ success: boolean; message: string }>;
  refetch: () => Promise<void>;
}

// Tab component props
export interface TabContentProps {
  'data-testid'?: string;
}

// Tab navigation props
export interface TabNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  'data-testid'?: string;
}