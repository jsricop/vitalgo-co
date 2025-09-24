/**
 * Custom hook for medication data fetching and state management
 * Provides loading states, error handling, and real-time updates
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Medication, UseMedicationsResult } from '../types';
import { medicationsAPI } from '../services/medicationsApi';

export function useMedications(): UseMedicationsResult {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 useMedications: Fetching medications...');

      const data = await medicationsAPI.getMedications();
      setMedications(data);
      console.log('✅ useMedications: Medications loaded successfully:', data.length, 'items');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading medications';
      console.error('❌ useMedications: Error fetching medications:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 useMedications: Manual refetch requested');
    await fetchMedications();
  }, [fetchMedications]);

  // Initial fetch on mount
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  // Add medication to local state (optimistic update)
  const addMedicationToState = useCallback((medication: Medication) => {
    setMedications(prev => [medication, ...prev]);
  }, []);

  // Update medication in local state (optimistic update)
  const updateMedicationInState = useCallback((updatedMedication: Medication) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === updatedMedication.id ? updatedMedication : med
      )
    );
  }, []);

  // Remove medication from local state (optimistic update)
  const removeMedicationFromState = useCallback((medicationId: number) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
  }, []);

  return {
    medications,
    loading,
    error,
    refetch,
    // Internal methods for optimistic updates (not exposed in interface)
    addMedicationToState: addMedicationToState as any,
    updateMedicationInState: updateMedicationInState as any,
    removeMedicationFromState: removeMedicationFromState as any,
  };
}