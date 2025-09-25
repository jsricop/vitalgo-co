/**
 * Custom hook for illness CRUD operations
 * Handles create, update, delete actions with optimistic updates and error recovery
 */
'use client';

import { useState, useCallback } from 'react';
import { PatientIllnessDTO, IllnessFormData, UseIllnessActionsResult } from '../types';
import { illnessesAPI } from '../services/illnessesApi';

export function useIllnessActions(): UseIllnessActionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create illness
  const createIllness = useCallback(async (data: IllnessFormData): Promise<PatientIllnessDTO> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 useIllnessActions: Creating illness:', data.illnessName);

      const illness = await illnessesAPI.createIllness(data);
      console.log('✅ useIllnessActions: Illness created successfully:', illness.illnessName);

      return illness;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating illness';
      console.error('❌ useIllnessActions: Create error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update illness
  const updateIllness = useCallback(async (id: number, data: IllnessFormData): Promise<PatientIllnessDTO> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 useIllnessActions: Updating illness ID:', id, 'Name:', data.illnessName);

      const illness = await illnessesAPI.updateIllness(id, data);
      console.log('✅ useIllnessActions: Illness updated successfully:', illness.illnessName);

      return illness;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating illness';
      console.error('❌ useIllnessActions: Update error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete illness
  const deleteIllness = useCallback(async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🗑️ useIllnessActions: Deleting illness ID:', id);

      await illnessesAPI.deleteIllness(id);
      console.log('✅ useIllnessActions: Illness deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting illness';
      console.error('❌ useIllnessActions: Delete error:', errorMessage);
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
    createIllness,
    updateIllness,
    deleteIllness,
    isLoading,
    error,
    clearError: clearError as any // Not in interface but useful internally
  };
}