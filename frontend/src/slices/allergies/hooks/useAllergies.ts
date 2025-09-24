/**
 * Custom hook for allergy data fetching and state management
 * Provides loading states, error handling, and real-time updates
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Allergy, UseAllergiesResult } from '../types';
import { allergiesAPI } from '../services/allergiesApi';

export function useAllergies(): UseAllergiesResult {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllergies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 useAllergies: Fetching allergies...');

      const data = await allergiesAPI.getAllergies();
      setAllergies(data);
      console.log('✅ useAllergies: Allergies loaded successfully:', data.length, 'items');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading allergies';
      console.error('❌ useAllergies: Error fetching allergies:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 useAllergies: Manual refetch requested');
    await fetchAllergies();
  }, [fetchAllergies]);

  // Initial fetch on mount
  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  // Add allergy to local state (optimistic update)
  const addAllergyToState = useCallback((allergy: Allergy) => {
    setAllergies(prev => [allergy, ...prev]);
  }, []);

  // Update allergy in local state (optimistic update)
  const updateAllergyInState = useCallback((updatedAllergy: Allergy) => {
    setAllergies(prev =>
      prev.map(allergy =>
        allergy.id === updatedAllergy.id ? updatedAllergy : allergy
      )
    );
  }, []);

  // Remove allergy from local state (optimistic update)
  const removeAllergyFromState = useCallback((allergyId: number) => {
    setAllergies(prev => prev.filter(allergy => allergy.id !== allergyId));
  }, []);

  return {
    allergies,
    loading,
    error,
    refetch,
    // Internal methods for optimistic updates (not exposed in interface)
    addAllergyToState: addAllergyToState as any,
    updateAllergyInState: updateAllergyInState as any,
    removeAllergyFromState: removeAllergyFromState as any,
  };
}