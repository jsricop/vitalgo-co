/**
 * Custom hook for medication CRUD operations
 * Handles create, update, delete actions with optimistic updates and error recovery
 */
'use client';

import { useState, useCallback } from 'react';
import { Medication, MedicationFormData, UseMedicationActionsResult } from '../types';
import { medicationsAPI } from '../services/medicationsApi';

export function useMedicationActions(): UseMedicationActionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create medication
  const createMedication = useCallback(async (data: MedicationFormData): Promise<Medication> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 useMedicationActions: Creating medication:', data.medicationName);

      const medication = await medicationsAPI.createMedication(data);
      console.log('✅ useMedicationActions: Medication created successfully:', medication.medicationName);

      return medication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating medication';
      console.error('❌ useMedicationActions: Create error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update medication
  const updateMedication = useCallback(async (id: number, data: MedicationFormData): Promise<Medication> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 useMedicationActions: Updating medication ID:', id, 'Name:', data.medicationName);

      const medication = await medicationsAPI.updateMedication(id, data);
      console.log('✅ useMedicationActions: Medication updated successfully:', medication.medicationName);

      return medication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating medication';
      console.error('❌ useMedicationActions: Update error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete medication
  const deleteMedication = useCallback(async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🗑️ useMedicationActions: Deleting medication ID:', id);

      await medicationsAPI.deleteMedication(id);
      console.log('✅ useMedicationActions: Medication deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting medication';
      console.error('❌ useMedicationActions: Delete error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle medication active status
  const toggleMedicationStatus = useCallback(async (id: number, isActive: boolean): Promise<Medication> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 useMedicationActions: Toggling medication status ID:', id, 'Active:', isActive);

      const medication = await medicationsAPI.toggleMedicationStatus(id, isActive);
      console.log('✅ useMedicationActions: Medication status toggled successfully:', medication.medicationName);

      return medication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error toggling medication status';
      console.error('❌ useMedicationActions: Toggle status error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createMedication,
    updateMedication,
    deleteMedication,
    toggleMedicationStatus,
    isLoading,
    error,
    clearError: clearError as any // Not in interface but useful internally
  };
}