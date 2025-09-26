/**
 * IllnessForm molecule component
 * Inline form for creating and editing illnesses
 */
'use client';

import React from 'react';
import { IllnessFormProps, ILLNESS_STATUS_OPTIONS } from '../../types';
import { useIllnessForm } from '../../hooks/useIllnessForm';

export const IllnessForm: React.FC<IllnessFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  'data-testid': testId
}) => {
  const {
    formData,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useIllnessForm({
    initialData,
    onSubmit
  });

  const isFormLoading = isLoading || isSubmitting;

  // VitalGo brand-compliant field classes with error states
  const fieldClasses = (fieldName: keyof typeof errors) => `
    w-full px-3 py-2 border rounded-md text-base
    focus:outline-none focus:ring-2 transition-colors duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
    ${errors[fieldName]
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-vitalgo-dark-lighter focus:ring-vitalgo-green focus:border-vitalgo-green'
    }
  `;

  const errorClasses = 'mt-1 text-sm text-red-600 font-medium';
  const labelClasses = 'block text-sm font-medium text-vitalgo-dark mb-1';
  const requiredClasses = 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-vitalgo-dark-lightest p-6" data-testid={testId}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-vitalgo-dark">
          {initialData ? 'Editar' : 'Agregar'} Enfermedad
        </h3>
        <p className="text-sm text-vitalgo-dark-light mt-1">
          {initialData
            ? 'Actualiza la información de la enfermedad'
            : 'Completa la información de la nueva enfermedad'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Row 1: Illness Name and Diagnosis Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Illness Name */}
          <div>
            <label htmlFor="illnessName" className={labelClasses}>
              Nombre de la Enfermedad <span className={requiredClasses}>*</span>
            </label>
            <input
              type="text"
              id="illnessName"
              value={formData.illnessName}
              onChange={(e) => handleChange('illnessName', e.target.value)}
              className={fieldClasses('illnessName')}
              disabled={isFormLoading}
              placeholder="Ej: Hipertensión arterial"
              data-testid={`${testId}-illness-name`}
              style={{ fontSize: '16px' }}
              autoComplete="off"
            />
            {errors.illnessName && (
              <p className={errorClasses}>{errors.illnessName}</p>
            )}
          </div>

          {/* Diagnosis Date */}
          <div>
            <label htmlFor="diagnosisDate" className={labelClasses}>
              Fecha de Diagnóstico <span className={requiredClasses}>*</span>
            </label>
            <input
              type="date"
              id="diagnosisDate"
              value={formData.diagnosisDate}
              onChange={(e) => handleChange('diagnosisDate', e.target.value)}
              className={fieldClasses('diagnosisDate')}
              disabled={isFormLoading}
              data-testid={`${testId}-diagnosis-date`}
              style={{ fontSize: '16px' }}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.diagnosisDate && (
              <p className={errorClasses}>{errors.diagnosisDate}</p>
            )}
          </div>
        </div>

        {/* Row 2: Status and Chronic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClasses}>
              Estado <span className={requiredClasses}>*</span>
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={fieldClasses('status')}
              disabled={isFormLoading}
              data-testid={`${testId}-status`}
              style={{ fontSize: '16px' }}
            >
              {ILLNESS_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className={errorClasses}>{errors.status}</p>
            )}
          </div>

          {/* Chronic Checkbox */}
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              id="isChronic"
              checked={formData.isChronic}
              onChange={(e) => handleChange('isChronic', e.target.checked)}
              className="h-4 w-4 text-vitalgo-green border-gray-300 rounded focus:ring-vitalgo-green"
              disabled={isFormLoading}
              data-testid={`${testId}-is-chronic`}
            />
            <label htmlFor="isChronic" className="ml-2 text-sm text-gray-700">
              Condición crónica
            </label>
          </div>
        </div>

        {/* Row 3: CIE-10 Code and Diagnosed By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CIE-10 Code */}
          <div>
            <label htmlFor="cie10Code" className={labelClasses}>
              Código CIE-10
            </label>
            <input
              type="text"
              id="cie10Code"
              value={formData.cie10Code}
              onChange={(e) => handleChange('cie10Code', e.target.value)}
              className={fieldClasses('cie10Code')}
              disabled={isFormLoading}
              placeholder="Ej: I10"
              maxLength={10}
              data-testid={`${testId}-cie10-code`}
              style={{ fontSize: '16px' }}
              autoComplete="off"
            />
            {errors.cie10Code && (
              <p className={errorClasses}>{errors.cie10Code}</p>
            )}
          </div>

          {/* Diagnosed By */}
          <div>
            <label htmlFor="diagnosedBy" className={labelClasses}>
              Diagnosticado por
            </label>
            <input
              type="text"
              id="diagnosedBy"
              value={formData.diagnosedBy}
              onChange={(e) => handleChange('diagnosedBy', e.target.value)}
              className={fieldClasses('diagnosedBy')}
              disabled={isFormLoading}
              placeholder="Dr. Juan Pérez"
              data-testid={`${testId}-diagnosed-by`}
              style={{ fontSize: '16px' }}
              autoComplete="off"
            />
            {errors.diagnosedBy && (
              <p className={errorClasses}>{errors.diagnosedBy}</p>
            )}
          </div>
        </div>

        {/* Treatment Description */}
        <div>
          <label htmlFor="treatmentDescription" className={labelClasses}>
            Descripción del Tratamiento
          </label>
          <textarea
            id="treatmentDescription"
            value={formData.treatmentDescription}
            onChange={(e) => handleChange('treatmentDescription', e.target.value)}
            className={`${fieldClasses('treatmentDescription')} resize-none`}
            rows={3}
            disabled={isFormLoading}
            placeholder="Descripción del tratamiento actual..."
            data-testid={`${testId}-treatment-description`}
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className={labelClasses}>
            Notas Adicionales
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className={`${fieldClasses('notes')} resize-none`}
            rows={3}
            disabled={isFormLoading}
            placeholder="Notas adicionales sobre la enfermedad..."
            data-testid={`${testId}-notes`}
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-vitalgo-dark-lightest">
          <button
            type="button"
            onClick={onCancel}
            disabled={isFormLoading}
            className="px-4 py-2 text-sm font-medium text-vitalgo-dark bg-white border border-vitalgo-dark-lighter rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-vitalgo-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            data-testid={`${testId}-cancel-button`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-vitalgo-green border border-transparent rounded-lg hover:bg-vitalgo-green-dark focus:outline-none focus:ring-2 focus:ring-vitalgo-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center"
            disabled={!isValid || isFormLoading}
            data-testid={`${testId}-submit-button`}
          >
            {isFormLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {initialData ? 'Actualizar' : 'Guardar'} Enfermedad
          </button>
        </div>
      </form>
    </div>
  );
};