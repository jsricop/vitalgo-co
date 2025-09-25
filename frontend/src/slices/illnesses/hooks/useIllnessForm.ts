/**
 * Custom hook for illness form state management
 * Handles form data, validation, and submission logic
 */
'use client';

import { useState, useCallback, useMemo } from 'react';
import { IllnessFormData, PatientIllnessDTO, UseIllnessFormResult, IllnessStatus } from '../types';

// Form validation rules
const validateForm = (data: IllnessFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.illnessName.trim()) {
    errors.illnessName = 'El nombre de la enfermedad es requerido';
  } else if (data.illnessName.length > 200) {
    errors.illnessName = 'El nombre no puede exceder 200 caracteres';
  }

  if (!data.diagnosisDate) {
    errors.diagnosisDate = 'La fecha de diagnóstico es requerida';
  } else {
    const date = new Date(data.diagnosisDate);
    const today = new Date();
    if (date > today) {
      errors.diagnosisDate = 'La fecha no puede ser futura';
    }
  }

  if (!data.status) {
    errors.status = 'El estado es requerido';
  }

  if (data.cie10Code && data.cie10Code.length > 10) {
    errors.cie10Code = 'El código CIE-10 no puede exceder 10 caracteres';
  }

  if (data.diagnosedBy && data.diagnosedBy.length > 200) {
    errors.diagnosedBy = 'El campo "Diagnosticado por" no puede exceder 200 caracteres';
  }

  return errors;
};

// Default form data
const getDefaultFormData = (): IllnessFormData => ({
  illnessName: '',
  diagnosisDate: '',
  status: 'activa' as IllnessStatus,
  isChronic: false,
  treatmentDescription: '',
  cie10Code: '',
  diagnosedBy: '',
  notes: '',
});

// Convert illness DTO to form data
const illnessToFormData = (illness: PatientIllnessDTO): IllnessFormData => ({
  illnessName: illness.illnessName,
  diagnosisDate: illness.diagnosisDate,
  status: illness.status,
  isChronic: illness.isChronic,
  treatmentDescription: illness.treatmentDescription || '',
  cie10Code: illness.cie10Code || '',
  diagnosedBy: illness.diagnosedBy || '',
  notes: illness.notes || '',
});

export function useIllnessForm(
  initialData?: PatientIllnessDTO,
  onSubmit?: (data: IllnessFormData) => Promise<void>
): UseIllnessFormResult {
  // Initialize form data
  const [formData, setFormData] = useState<IllnessFormData>(() =>
    initialData ? illnessToFormData(initialData) : getDefaultFormData()
  );

  // Handle field changes
  const handleChange = useCallback((field: keyof IllnessFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Validate form and calculate errors
  const errors = useMemo(() => validateForm(formData), [formData]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      console.warn('⚠️ useIllnessForm: Form validation failed:', errors);
      return;
    }

    if (onSubmit) {
      console.log('📝 useIllnessForm: Submitting form data:', formData.illnessName);
      try {
        await onSubmit(formData);
        console.log('✅ useIllnessForm: Form submitted successfully');
      } catch (error) {
        console.error('❌ useIllnessForm: Form submission failed:', error);
        throw error; // Re-throw to allow parent component to handle
      }
    }
  }, [formData, isValid, errors, onSubmit]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    const newData = initialData ? illnessToFormData(initialData) : getDefaultFormData();
    setFormData(newData);
    console.log('🔄 useIllnessForm: Form reset');
  }, [initialData]);

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isValid,
    errors,
  };
}