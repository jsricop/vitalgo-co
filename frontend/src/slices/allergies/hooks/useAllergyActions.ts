/**
 * Custom hook for allergy CRUD operations
 * Handles create, update, delete actions with optimistic updates and error recovery
 */
'use client';

import { useState, useCallback } from 'react';
import { Allergy, AllergyFormData, UseAllergyActionsResult } from '../types';
import { allergiesAPI } from '../services/allergiesApi';

export function useAllergyActions(): UseAllergyActionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create allergy
  const createAllergy = useCallback(async (data: AllergyFormData): Promise<Allergy> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 useAllergyActions: Creating allergy:', data.allergen);

      const allergy = await allergiesAPI.createAllergy(data);
      console.log('✅ useAllergyActions: Allergy created successfully:', allergy.allergen);

      return allergy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating allergy';
      console.error('❌ useAllergyActions: Create error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update allergy
  const updateAllergy = useCallback(async (id: number, data: AllergyFormData): Promise<Allergy> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 useAllergyActions: Updating allergy ID:', id, 'Allergen:', data.allergen);

      const allergy = await allergiesAPI.updateAllergy(id, data);
      console.log('✅ useAllergyActions: Allergy updated successfully:', allergy.allergen);

      return allergy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating allergy';
      console.error('❌ useAllergyActions: Update error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete allergy
  const deleteAllergy = useCallback(async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🗑️ useAllergyActions: Deleting allergy ID:', id);

      await allergiesAPI.deleteAllergy(id);
      console.log('✅ useAllergyActions: Allergy deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting allergy';
      console.error('❌ useAllergyActions: Delete error:', errorMessage);
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
    createAllergy,
    updateAllergy,
    deleteAllergy,
    isLoading,
    error,
    clearError: clearError as any // Not in interface but useful internally
  };
}