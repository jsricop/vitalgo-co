/**
 * useSurgeries hook
 * Manages surgery data fetching and state with automatic refetch capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import { Surgery, UseSurgeriesResult } from '../types';
import { surgeriesApi } from '../services/surgeriesApi';

export const useSurgeries = (): UseSurgeriesResult => {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurgeries = useCallback(async () => {
    console.log('🔄 useSurgeries: Starting to fetch surgeries');

    try {
      setLoading(true);
      setError(null);

      const fetchedSurgeries = await surgeriesApi.getAllSurgeries();

      console.log('✅ useSurgeries: Successfully fetched surgeries:', fetchedSurgeries.length);
      setSurgeries(fetchedSurgeries);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch surgeries';
      console.error('❌ useSurgeries: Error fetching surgeries:', errorMessage);
      setError(errorMessage);
      setSurgeries([]); // Reset surgeries on error
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    console.log('🔄 useSurgeries: Manual refetch requested');
    await fetchSurgeries();
  }, [fetchSurgeries]);

  // Initial fetch on mount
  useEffect(() => {
    console.log('🚀 useSurgeries: Component mounted, initializing fetch');
    fetchSurgeries();
  }, [fetchSurgeries]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('📊 useSurgeries: State updated:', {
      surgeriesCount: surgeries.length,
      loading,
      hasError: !!error,
      errorMessage: error
    });
  }, [surgeries.length, loading, error]);

  return {
    surgeries,
    loading,
    error,
    refetch,
  };
};