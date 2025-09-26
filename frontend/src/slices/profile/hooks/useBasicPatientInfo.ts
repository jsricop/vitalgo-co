/**
 * Custom hook for basic patient information fetching and state management
 * Provides loading states, error handling, and update functionality
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BasicPatientInfo, BasicPatientUpdate, UseBasicPatientInfoResult } from '../types';
import { basicProfileApi } from '../services/basicProfileApi';

export function useBasicPatientInfo(): UseBasicPatientInfoResult {
  const [basicInfo, setBasicInfo] = useState<BasicPatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBasicInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 useBasicPatientInfo: Fetching basic patient info...');

      const data = await basicProfileApi.getBasicPatientInfo();
      setBasicInfo(data);
      console.log('✅ useBasicPatientInfo: Basic patient info loaded successfully:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading basic patient information';
      console.error('❌ useBasicPatientInfo: Error fetching basic info:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 useBasicPatientInfo: Manual refetch requested');
    await fetchBasicInfo();
  }, [fetchBasicInfo]);

  const updateBasicInfo = useCallback(async (updateData: BasicPatientUpdate): Promise<{ success: boolean; message: string }> => {
    try {
      setError(null);
      console.log('🔄 useBasicPatientInfo: Updating basic patient info...', updateData);

      const result = await basicProfileApi.updateBasicPatientInfo(updateData);

      if (result.success) {
        // Refetch the data to get the updated information
        await fetchBasicInfo();
        console.log('✅ useBasicPatientInfo: Basic patient info updated successfully');
      } else {
        console.error('❌ useBasicPatientInfo: Update failed:', result.message);
        setError(result.message);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating basic patient information';
      console.error('❌ useBasicPatientInfo: Error updating basic info:', errorMessage);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [fetchBasicInfo]);

  // Initial fetch on mount
  useEffect(() => {
    fetchBasicInfo();
  }, [fetchBasicInfo]);

  return {
    basicInfo,
    loading,
    error,
    updateBasicInfo,
    refetch,
  };
}