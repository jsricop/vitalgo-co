/**
 * Custom hook for personal patient information fetching and state management
 * Provides loading states, error handling, and update functionality
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PersonalPatientInfo, PersonalPatientUpdate, UsePersonalPatientInfoResult } from '../types/personalInfo';
import { personalProfileApi } from '../services/personalProfileApi';

export function usePersonalPatientInfo(): UsePersonalPatientInfoResult {
  const [personalInfo, setPersonalInfo] = useState<PersonalPatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 usePersonalPatientInfo: Fetching personal patient info...');

      const data = await personalProfileApi.getPersonalPatientInfo();
      setPersonalInfo(data);
      console.log('✅ usePersonalPatientInfo: Personal patient info loaded successfully:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading personal patient information';
      console.error('❌ usePersonalPatientInfo: Error fetching personal info:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 usePersonalPatientInfo: Manual refetch requested');
    await fetchPersonalInfo();
  }, [fetchPersonalInfo]);

  const updatePersonalInfo = useCallback(async (updateData: PersonalPatientUpdate): Promise<{ success: boolean; message: string }> => {
    try {
      setError(null);
      console.log('🔄 usePersonalPatientInfo: Updating personal patient info...', updateData);

      const result = await personalProfileApi.updatePersonalPatientInfo(updateData);

      if (result.success) {
        // Refetch the data to get the updated information
        await fetchPersonalInfo();
        console.log('✅ usePersonalPatientInfo: Personal patient info updated successfully');
      } else {
        console.error('❌ usePersonalPatientInfo: Update failed:', result.message);
        setError(result.message);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating personal patient information';
      console.error('❌ usePersonalPatientInfo: Error updating personal info:', errorMessage);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [fetchPersonalInfo]);

  // Initial fetch on mount
  useEffect(() => {
    fetchPersonalInfo();
  }, [fetchPersonalInfo]);

  return {
    personalInfo,
    loading,
    error,
    updatePersonalInfo,
    refetch,
  };
}