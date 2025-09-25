/**
 * Custom hook for illness data fetching and state management
 * Provides loading states, error handling, and real-time updates
 * Follows the exact same pattern as useMedications (no useAuth needed - AuthGuard handles it)
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PatientIllnessDTO, UseIllnessesResult } from '../types';
import { illnessesAPI } from '../services/illnessesApi';

export function useIllnesses(): UseIllnessesResult {
  const [illnesses, setIllnesses] = useState<PatientIllnessDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIllnesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 useIllnesses: Fetching illnesses...');

      const data = await illnessesAPI.fetchIllnesses();
      setIllnesses(data);
      console.log('✅ useIllnesses: Illnesses loaded successfully:', data.length, 'items');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading illnesses';
      console.error('❌ useIllnesses: Error fetching illnesses:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 useIllnesses: Manual refetch requested');
    await fetchIllnesses();
  }, [fetchIllnesses]);

  // Initial fetch on mount and when auth state changes
  useEffect(() => {
    fetchIllnesses();
  }, [fetchIllnesses]);

  // Add illness to local state (optimistic update)
  const addIllnessToState = useCallback((illness: PatientIllnessDTO) => {
    setIllnesses(prev => [illness, ...prev]);
  }, []);

  // Update illness in local state (optimistic update)
  const updateIllnessInState = useCallback((updatedIllness: PatientIllnessDTO) => {
    setIllnesses(prev =>
      prev.map(illness =>
        illness.id === updatedIllness.id ? updatedIllness : illness
      )
    );
  }, []);

  // Remove illness from local state (optimistic update)
  const removeIllnessFromState = useCallback((illnessId: number) => {
    setIllnesses(prev => prev.filter(illness => illness.id !== illnessId));
  }, []);

  return {
    illnesses,
    isLoading: loading,
    error,
    mutate: refetch, // Keep same interface as SWR version
    // Internal methods for optimistic updates (not exposed in interface)
    refetch,
    addIllnessToState: addIllnessToState as any,
    updateIllnessInState: updateIllnessInState as any,
    removeIllnessFromState: removeIllnessFromState as any,
  };
}