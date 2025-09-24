/**
 * useSurgeryActions hook
 * Handles CRUD operations for surgeries with loading states and error handling
 */

import { useState, useCallback } from 'react';
import { Surgery, SurgeryFormData, UseSurgeryActionsResult } from '../types';
import { surgeriesApi } from '../services/surgeriesApi';

export const useSurgeryActions = (): UseSurgeryActionsResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createSurgery = useCallback(async (data: SurgeryFormData): Promise<Surgery> => {
    console.log('🔄 useSurgeryActions: Creating surgery:', data);

    try {
      setIsLoading(true);
      setError(null);

      const newSurgery = await surgeriesApi.createSurgery(data);

      console.log('✅ useSurgeryActions: Successfully created surgery:', newSurgery);
      return newSurgery;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create surgery';
      console.error('❌ useSurgeryActions: Error creating surgery:', errorMessage);
      setError(errorMessage);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSurgery = useCallback(async (id: number, data: SurgeryFormData): Promise<Surgery> => {
    console.log('🔄 useSurgeryActions: Updating surgery:', { id, data });

    try {
      setIsLoading(true);
      setError(null);

      const updatedSurgery = await surgeriesApi.updateSurgery(id, data);

      console.log('✅ useSurgeryActions: Successfully updated surgery:', updatedSurgery);
      return updatedSurgery;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update surgery';
      console.error('❌ useSurgeryActions: Error updating surgery:', errorMessage);
      setError(errorMessage);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSurgery = useCallback(async (id: number): Promise<void> => {
    console.log('🔄 useSurgeryActions: Deleting surgery:', id);

    try {
      setIsLoading(true);
      setError(null);

      await surgeriesApi.deleteSurgery(id);

      console.log('✅ useSurgeryActions: Successfully deleted surgery:', id);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete surgery';
      console.error('❌ useSurgeryActions: Error deleting surgery:', errorMessage);
      setError(errorMessage);
      throw err; // Re-throw to allow caller to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error when starting new actions
  const clearError = useCallback(() => {
    console.log('🧹 useSurgeryActions: Clearing error state');
    setError(null);
  }, []);

  return {
    createSurgery,
    updateSurgery,
    deleteSurgery,
    isLoading,
    error,
    clearError,
  };
};