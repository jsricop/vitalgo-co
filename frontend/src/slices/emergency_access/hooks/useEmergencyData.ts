/**
 * useEmergencyData Hook
 * Fetches patient emergency data by QR code for paramedic access
 */

import { useState, useEffect } from 'react';
import { emergencyAccessService } from '../services/emergencyAccessService';
import type { EmergencyData, EmergencyAccessError } from '../types';

interface UseEmergencyDataResult {
  data: EmergencyData | null;
  loading: boolean;
  error: EmergencyAccessError | null;
  refetch: () => Promise<void>;
}

export function useEmergencyData(qrCode: string | null): UseEmergencyDataResult {
  const [data, setData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<EmergencyAccessError | null>(null);

  const fetchData = async () => {
    if (!qrCode) {
      setError({ message: 'QR code is required', status: 400 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const emergencyData = await emergencyAccessService.getEmergencyData(qrCode);
      setData(emergencyData);
    } catch (err: any) {
      const apiError: EmergencyAccessError = {
        message: err.message || 'Failed to fetch emergency data',
        status: err.status || 500,
        detail: err.details || err.detail,
      };
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qrCode) {
      fetchData();
    }
  }, [qrCode]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
