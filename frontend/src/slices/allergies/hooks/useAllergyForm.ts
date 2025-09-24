/**
 * Custom hook for allergy form state management and validation
 * Handles form data, validation, and submission logic
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { AllergyFormData, UseAllergyFormResult, AllergyFormErrors } from '../types';

interface UseAllergyFormProps {
  initialData?: Partial<AllergyFormData>;
  onSubmit: (data: AllergyFormData) => Promise<void>;
  onCancel?: () => void;
}

const defaultFormData: AllergyFormData = {
  allergen: '',
  severityLevel: 'leve',
  reactionDescription: '',
  diagnosisDate: '',
  notes: ''
};

const severityLevels = ['leve', 'moderada', 'severa', 'critica'];

export function useAllergyForm({
  initialData = {},
  onSubmit,
  onCancel
}: UseAllergyFormProps): UseAllergyFormResult {
  const [formData, setFormData] = useState<AllergyFormData>({
    ...defaultFormData,
    ...initialData
  });
  const [errors, setErrors] = useState<AllergyFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(prev => ({
      ...defaultFormData,
      ...initialData
    }));
  }, [initialData]);

  // Validation rules
  const validateField = useCallback((field: keyof AllergyFormData, value: string): string | null => {
    switch (field) {
      case 'allergen':
        if (!value || !value.trim()) {
          return 'El alérgeno es requerido';
        }
        if (value.trim().length < 2) {
          return 'El alérgeno debe tener al menos 2 caracteres';
        }
        if (value.trim().length > 200) {
          return 'El alérgeno no puede exceder 200 caracteres';
        }
        break;

      case 'severityLevel':
        if (!value || !value.trim()) {
          return 'El nivel de severidad es requerido';
        }
        if (!severityLevels.includes(value)) {
          return 'El nivel de severidad debe ser: leve, moderada, severa o crítica';
        }
        break;

      case 'reactionDescription':
        if (value && value.trim().length > 1000) {
          return 'La descripción de la reacción no puede exceder 1000 caracteres';
        }
        break;

      case 'diagnosisDate':
        if (value && value.trim()) {
          const diagnosisDate = new Date(value);
          const today = new Date();

          if (diagnosisDate > today) {
            return 'La fecha de diagnóstico no puede ser futura';
          }

          // Check if date is too old (more than 100 years ago)
          const hundredYearsAgo = new Date();
          hundredYearsAgo.setFullYear(today.getFullYear() - 100);

          if (diagnosisDate < hundredYearsAgo) {
            return 'La fecha de diagnóstico no puede ser tan antigua';
          }
        }
        break;

      case 'notes':
        if (value && value.trim().length > 1000) {
          return 'Las notas no pueden exceder 1000 caracteres';
        }
        break;
    }

    return null;
  }, []);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: AllergyFormErrors = {};

    (Object.keys(formData) as Array<keyof AllergyFormData>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Handle input change
  const handleInputChange = useCallback((field: keyof AllergyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    console.log('📝 useAllergyForm: Form submission started');

    if (!validateForm()) {
      console.warn('⚠️ useAllergyForm: Form validation failed');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('📝 useAllergyForm: Submitting form data:', formData);

      await onSubmit(formData);
      console.log('✅ useAllergyForm: Form submitted successfully');

      // Reset form on successful submission if no initial data (create mode)
      if (!initialData || Object.keys(initialData).length === 0) {
        resetForm();
      }
    } catch (error) {
      console.error('❌ useAllergyForm: Form submission error:', error);
      // Don't clear the form on error, let user retry
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validateForm, onSubmit, initialData]);

  // Reset form to default values
  const resetForm = useCallback(() => {
    console.log('🔄 useAllergyForm: Resetting form');
    setFormData({ ...defaultFormData });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Set form data (for external control)
  const setFormDataExternal = useCallback((data: Partial<AllergyFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 &&
                  formData.allergen.trim() !== '' &&
                  formData.severityLevel.trim() !== '';

  return {
    formData,
    errors,
    isValid,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormData: setFormDataExternal
  };
}