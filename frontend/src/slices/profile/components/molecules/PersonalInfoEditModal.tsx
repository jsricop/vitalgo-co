/**
 * PersonalInfoEditModal molecule component
 * Modal for editing personal patient information following VitalGo patterns
 */
'use client';

import React, { useState, useEffect } from 'react';
import { PersonalPatientInfo, PersonalPatientUpdate } from '../../types/personalInfo';
import { DemographicInfoSection } from './DemographicInfoSection';
import { ResidenceInfoSection } from './ResidenceInfoSection';

interface PersonalInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PersonalPatientInfo | null;
  onSubmit: (data: PersonalPatientUpdate) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
  'data-testid'?: string;
}

export const PersonalInfoEditModal: React.FC<PersonalInfoEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
  'data-testid': testId = 'personal-info-edit-modal'
}) => {
  const [formData, setFormData] = useState<PersonalPatientUpdate>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      console.log('🔍 PersonalInfoEditModal initializing with data:', initialData);

      setFormData({
        biological_sex: initialData.biological_sex || '',
        gender: initialData.gender || '',
        birth_country: initialData.birth_country || '',
        birth_department: initialData.birth_department || '',
        birth_city: initialData.birth_city || '',
        residence_address: initialData.residence_address || '',
        residence_department: initialData.residence_department || '',
        residence_city: initialData.residence_city || ''
      });

      setErrors({});
      console.log('✅ PersonalInfoEditModal initialized');
    }
  }, [isOpen, initialData]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleFieldChange = (field: keyof PersonalPatientUpdate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.biological_sex?.trim()) {
      newErrors.biological_sex = 'El sexo biológico es obligatorio';
    }

    if (!formData.gender?.trim()) {
      newErrors.gender = 'El género es obligatorio';
    }

    if (!formData.birth_country?.trim()) {
      newErrors.birth_country = 'El país de nacimiento es obligatorio';
    }

    // Colombian birth location validation
    if (formData.birth_country === 'Colombia') {
      if (!formData.birth_department?.trim()) {
        newErrors.birth_department = 'El departamento de nacimiento es obligatorio para Colombia';
      }
      if (!formData.birth_city?.trim()) {
        newErrors.birth_city = 'La ciudad de nacimiento es obligatoria para Colombia';
      }
    }

    // Residence information validation
    if (!formData.residence_address?.trim()) {
      newErrors.residence_address = 'La dirección de residencia es obligatoria';
    }

    if (!formData.residence_department?.trim()) {
      newErrors.residence_department = 'El departamento de residencia es obligatorio';
    }

    if (!formData.residence_city?.trim()) {
      newErrors.residence_city = 'La ciudad de residencia es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const result = await onSubmit(formData);

      if (result.success) {
        onClose();
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado. Por favor intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      data-testid={testId}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
        data-testid="modal-overlay"
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
          data-testid="modal-content"
        >
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-xl font-semibold text-vitalgo-dark"
                id="modal-title"
                data-testid="modal-title"
              >
                Editar Información Personal
              </h3>
              <button
                type="button"
                className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-vitalgo-green"
                onClick={onClose}
                data-testid="modal-close-button"
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-vitalgo-dark-light">
              Actualiza tu información demográfica y de residencia
            </p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 pb-4">
            <div className="space-y-6">
              {/* Demographic Information Section */}
              <DemographicInfoSection
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />

              {/* Residence Information Section */}
              <ResidenceInfoSection
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />

              {/* General Error */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="ml-3 text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isFormLoading}
              className="inline-flex w-full justify-center rounded-md bg-vitalgo-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-vitalgo-green-light focus:outline-none focus:ring-2 focus:ring-vitalgo-green sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid={`${testId}-submit-button`}
            >
              {isFormLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                'Guardar Información Personal'
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
              onClick={onClose}
              disabled={isFormLoading}
              data-testid={`${testId}-cancel-button`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};