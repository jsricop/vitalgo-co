/**
 * GynecologicalInfoEditModal molecule component
 * Modal for editing gynecological patient information following VitalGo patterns
 */
'use client';

import React, { useState, useEffect } from 'react';
import { PersonalPatientInfo, PersonalPatientUpdate } from '../../types/personalInfo';

interface GynecologicalInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PersonalPatientInfo | null;
  onSubmit: (data: PersonalPatientUpdate) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
  'data-testid'?: string;
}

export const GynecologicalInfoEditModal: React.FC<GynecologicalInfoEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
  'data-testid': testId = 'gynecological-info-edit-modal'
}) => {
  const [formData, setFormData] = useState<PersonalPatientUpdate>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      console.log('🔍 GynecologicalInfoEditModal initializing with data:', initialData);

      setFormData({
        is_pregnant: initialData.is_pregnant ?? null,
        pregnancy_weeks: initialData.pregnancy_weeks ?? null,
        last_menstruation_date: initialData.last_menstruation_date || '',
        pregnancies_count: initialData.pregnancies_count ?? null,
        births_count: initialData.births_count ?? null,
        cesareans_count: initialData.cesareans_count ?? null,
        abortions_count: initialData.abortions_count ?? null,
        contraceptive_method: initialData.contraceptive_method || ''
      });

      setErrors({});
      console.log('✅ GynecologicalInfoEditModal initialized');
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

  const handleFieldChange = (field: keyof PersonalPatientUpdate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Pregnancy validation
    if (formData.is_pregnant === true && (!formData.pregnancy_weeks || formData.pregnancy_weeks < 1 || formData.pregnancy_weeks > 42)) {
      newErrors.pregnancy_weeks = 'Las semanas de embarazo deben estar entre 1 y 42';
    }

    // Reproductive history validation
    const pregnancies = formData.pregnancies_count || 0;
    const births = formData.births_count || 0;
    const cesareans = formData.cesareans_count || 0;
    const abortions = formData.abortions_count || 0;

    // Business logic validation
    if (births > pregnancies) {
      newErrors.births_count = 'Los partos no pueden ser mayores que los embarazos';
    }

    if (cesareans > births) {
      newErrors.cesareans_count = 'Las cesáreas no pueden ser mayores que los partos';
    }

    if (abortions > pregnancies) {
      newErrors.abortions_count = 'Los abortos no pueden ser mayores que los embarazos';
    }

    if ((births + abortions) > pregnancies) {
      newErrors.pregnancies_count = 'La suma de partos y abortos no puede ser mayor que los embarazos';
    }

    // Date validation
    if (formData.last_menstruation_date && formData.last_menstruation_date.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.last_menstruation_date)) {
        newErrors.last_menstruation_date = 'Formato de fecha inválido (YYYY-MM-DD)';
      } else {
        const date = new Date(formData.last_menstruation_date);
        const today = new Date();
        if (date > today) {
          newErrors.last_menstruation_date = 'La fecha no puede ser futura';
        }
      }
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
                Editar Información Ginecológica
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
              Actualiza tu información de salud reproductiva y ginecológica
            </p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 pb-4">
            <div className="space-y-6">
              {/* Pregnancy Status Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-vitalgo-dark mb-4">Estado de Embarazo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-vitalgo-dark mb-3">
                      ¿Estás embarazada?
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="is_pregnant"
                          value="true"
                          checked={formData.is_pregnant === true}
                          onChange={() => {
                            handleFieldChange('is_pregnant', true);
                          }}
                          className="h-4 w-4 text-vitalgo-green focus:ring-vitalgo-green border-gray-300"
                        />
                        <span className="ml-2 text-sm text-vitalgo-dark">Sí</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="is_pregnant"
                          value="false"
                          checked={formData.is_pregnant === false}
                          onChange={() => {
                            handleFieldChange('is_pregnant', false);
                            handleFieldChange('pregnancy_weeks', null);
                          }}
                          className="h-4 w-4 text-vitalgo-green focus:ring-vitalgo-green border-gray-300"
                        />
                        <span className="ml-2 text-sm text-vitalgo-dark">No</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="is_pregnant"
                          value=""
                          checked={formData.is_pregnant === null}
                          onChange={() => {
                            handleFieldChange('is_pregnant', null);
                            handleFieldChange('pregnancy_weeks', null);
                          }}
                          className="h-4 w-4 text-vitalgo-green focus:ring-vitalgo-green border-gray-300"
                        />
                        <span className="ml-2 text-sm text-vitalgo-dark">Prefiero no responder</span>
                      </label>
                    </div>
                  </div>

                  {formData.is_pregnant === true && (
                    <div>
                      <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                        Semanas de embarazo
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="42"
                        value={formData.pregnancy_weeks || ''}
                        onChange={(e) => handleFieldChange('pregnancy_weeks', e.target.value ? parseInt(e.target.value) : null)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vitalgo-green ${
                          errors.pregnancy_weeks ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ej: 12"
                      />
                      {errors.pregnancy_weeks && (
                        <p className="mt-1 text-sm text-red-600">{errors.pregnancy_weeks}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Menstrual Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-vitalgo-dark mb-4">Información Menstrual</h4>
                <div>
                  <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                    Fecha de última menstruación
                  </label>
                  <input
                    type="date"
                    value={formData.last_menstruation_date || ''}
                    onChange={(e) => handleFieldChange('last_menstruation_date', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vitalgo-green ${
                      errors.last_menstruation_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.last_menstruation_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_menstruation_date}</p>
                  )}
                </div>
              </div>

              {/* Reproductive History Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-vitalgo-dark mb-4">Historial Reproductivo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                      Número de embarazos
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pregnancies_count || ''}
                      onChange={(e) => handleFieldChange('pregnancies_count', e.target.value ? parseInt(e.target.value) : null)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vitalgo-green ${
                        errors.pregnancies_count ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.pregnancies_count && (
                      <p className="mt-1 text-sm text-red-600">{errors.pregnancies_count}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                      Número de partos
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.births_count || ''}
                      onChange={(e) => handleFieldChange('births_count', e.target.value ? parseInt(e.target.value) : null)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vitalgo-green ${
                        errors.births_count ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.births_count && (
                      <p className="mt-1 text-sm text-red-600">{errors.births_count}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                      Número de cesáreas
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.cesareans_count || ''}
                      onChange={(e) => handleFieldChange('cesareans_count', e.target.value ? parseInt(e.target.value) : null)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vitalgo-green ${
                        errors.cesareans_count ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.cesareans_count && (
                      <p className="mt-1 text-sm text-red-600">{errors.cesareans_count}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                      Número de abortos
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.abortions_count || ''}
                      onChange={(e) => handleFieldChange('abortions_count', e.target.value ? parseInt(e.target.value) : null)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vitalgo-green ${
                        errors.abortions_count ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.abortions_count && (
                      <p className="mt-1 text-sm text-red-600">{errors.abortions_count}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contraception Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-vitalgo-dark mb-4">Anticoncepción</h4>
                <div>
                  <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                    Método anticonceptivo actual
                  </label>
                  <select
                    value={formData.contraceptive_method || ''}
                    onChange={(e) => handleFieldChange('contraceptive_method', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vitalgo-green"
                  >
                    <option value="">Selecciona un método</option>
                    <option value="NINGUNO">Ninguno</option>
                    <option value="PILDORA">Píldora anticonceptiva</option>
                    <option value="PRESERVATIVO">Preservativo</option>
                    <option value="DIU">DIU</option>
                    <option value="IMPLANTE">Implante subdérmico</option>
                    <option value="INYECCION">Inyección anticonceptiva</option>
                    <option value="DIAFRAGMA">Diafragma</option>
                    <option value="NATURAL">Métodos naturales</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
              </div>

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
                'Guardar Información Ginecológica'
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