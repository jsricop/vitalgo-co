/**
 * AllergyForm molecule component
 * Brand-compliant form for creating/editing allergies following MANUAL_DE_MARCA.md
 */
'use client';

import React from 'react';
import { AllergyFormProps } from '../../types';
import { useAllergyForm } from '../../hooks/useAllergyForm';

export const AllergyForm: React.FC<AllergyFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
  'data-testid': testId
}) => {
  const {
    formData,
    errors,
    isValid,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = useAllergyForm({
    initialData,
    onSubmit,
    onCancel
  });

  const isFormLoading = isLoading || isSubmitting;

  // VitalGo brand-compliant field classes
  const fieldClasses = (fieldName: keyof typeof errors) => `
    w-full px-3 py-2 border rounded-md text-base
    focus:outline-none focus:ring-2 transition-colors duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
    ${errors[fieldName]
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-vitalgo-dark-lighter focus:ring-vitalgo-green focus:border-vitalgo-green'
    }
  `;

  const labelClasses = "block text-sm font-medium text-vitalgo-dark mb-1";
  const errorClasses = "mt-1 text-sm text-red-600 font-medium";
  const requiredClasses = "text-red-500";

  const severityOptions = [
    { value: 'leve', label: 'Leve' },
    { value: 'moderada', label: 'Moderada' },
    { value: 'severa', label: 'Severa' },
    { value: 'critica', label: 'Crítica' }
  ];

  return (
    <div className="bg-white rounded-xl border border-vitalgo-dark-lightest p-6" data-testid={testId}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-vitalgo-dark">
          {mode === 'edit' ? 'Editar' : 'Agregar'} Alergia
        </h3>
        <p className="text-sm text-vitalgo-dark-light mt-1">
          {mode === 'edit'
            ? 'Actualiza la información de la alergia'
            : 'Completa la información de la nueva alergia'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Allergen Name */}
        <div>
          <label htmlFor="allergen" className={labelClasses}>
            Alérgeno <span className={requiredClasses}>*</span>
          </label>
          <input
            type="text"
            id="allergen"
            value={formData.allergen}
            onChange={(e) => handleInputChange('allergen', e.target.value)}
            className={fieldClasses('allergen')}
            placeholder="Ej: Polen, Nueces, Penicilina"
            disabled={isFormLoading}
            data-testid={`${testId}-allergen`}
            style={{ fontSize: '16px' }} // Prevents iOS zoom
            autoComplete="off"
          />
          {errors.allergen && (
            <p className={errorClasses} data-testid={`${testId}-allergen-error`}>
              {errors.allergen}
            </p>
          )}
        </div>

        {/* Severity Level */}
        <div>
          <label htmlFor="severityLevel" className={labelClasses}>
            Nivel de Severidad <span className={requiredClasses}>*</span>
          </label>
          <select
            id="severityLevel"
            value={formData.severityLevel}
            onChange={(e) => handleInputChange('severityLevel', e.target.value)}
            className={fieldClasses('severityLevel')}
            disabled={isFormLoading}
            data-testid={`${testId}-severity-level`}
            style={{ fontSize: '16px' }} // Prevents iOS zoom
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.severityLevel && (
            <p className={errorClasses} data-testid={`${testId}-severity-level-error`}>
              {errors.severityLevel}
            </p>
          )}
        </div>

        {/* Reaction Description */}
        <div>
          <label htmlFor="reactionDescription" className={labelClasses}>
            Descripción de la Reacción
          </label>
          <textarea
            id="reactionDescription"
            value={formData.reactionDescription || ''}
            onChange={(e) => handleInputChange('reactionDescription', e.target.value)}
            className={fieldClasses('reactionDescription')}
            placeholder="Describe los síntomas o reacciones que experimentas..."
            rows={3}
            disabled={isFormLoading}
            data-testid={`${testId}-reaction-description`}
            style={{ fontSize: '16px' }} // Prevents iOS zoom
          />
          {errors.reactionDescription && (
            <p className={errorClasses} data-testid={`${testId}-reaction-description-error`}>
              {errors.reactionDescription}
            </p>
          )}
        </div>

        {/* Diagnosis Date */}
        <div>
          <label htmlFor="diagnosisDate" className={labelClasses}>
            Fecha de Diagnóstico
          </label>
          <input
            type="date"
            id="diagnosisDate"
            value={formData.diagnosisDate || ''}
            onChange={(e) => handleInputChange('diagnosisDate', e.target.value)}
            className={fieldClasses('diagnosisDate')}
            disabled={isFormLoading}
            data-testid={`${testId}-diagnosis-date`}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            style={{ fontSize: '16px' }} // Prevents iOS zoom
          />
          {errors.diagnosisDate && (
            <p className={errorClasses} data-testid={`${testId}-diagnosis-date-error`}>
              {errors.diagnosisDate}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className={labelClasses}>
            Notas Adicionales
          </label>
          <textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className={fieldClasses('notes')}
            placeholder="Información adicional, tratamientos, precauciones..."
            rows={3}
            disabled={isFormLoading}
            data-testid={`${testId}-notes`}
            style={{ fontSize: '16px' }} // Prevents iOS zoom
          />
          {errors.notes && (
            <p className={errorClasses} data-testid={`${testId}-notes-error`}>
              {errors.notes}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-vitalgo-dark-lightest">
          <button
            type="button"
            onClick={onCancel}
            disabled={isFormLoading}
            className="px-4 py-2 text-sm font-medium text-vitalgo-dark bg-white border border-vitalgo-dark-lighter rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-vitalgo-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            data-testid={`${testId}-cancel`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid || isFormLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-vitalgo-green border border-transparent rounded-lg hover:bg-vitalgo-green-dark focus:outline-none focus:ring-2 focus:ring-vitalgo-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center"
            data-testid={`${testId}-submit`}
          >
            {isFormLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {mode === 'edit' ? 'Actualizar' : 'Guardar'} Alergia
          </button>
        </div>
      </form>
    </div>
  );
};