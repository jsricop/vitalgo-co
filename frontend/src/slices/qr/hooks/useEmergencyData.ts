/**
 * Hook for emergency patient data access
 */
import { useState, useCallback } from 'react';
import { EmergencyPatientData } from '../types';
import { qrService } from '../services/qrService';

interface UseEmergencyDataReturn {
  emergencyData: EmergencyPatientData | null;
  isLoading: boolean;
  error: string | null;
  fetchEmergencyData: (qrUuid: string) => Promise<void>;
  clearError: () => void;
}

export function useEmergencyData(): UseEmergencyDataReturn {
  const [emergencyData, setEmergencyData] = useState<EmergencyPatientData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmergencyData = useCallback(async (qrUuid: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await qrService.getEmergencyData(qrUuid);
      setEmergencyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching emergency data');
      console.error('Emergency data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    emergencyData,
    isLoading,
    error,
    fetchEmergencyData,
    clearError,
  };
}