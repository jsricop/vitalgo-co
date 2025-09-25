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
    handleChange,
    handleSubmit,
    isValid,
    errors
  } = useIllnessForm(initialData, onSubmit);

  const inputClasses = `
    w-full px-3 py-2 text-sm border rounded-lg
    border-gray-300 focus:border-vitalgo-green focus:ring-1 focus:ring-vitalgo-green
    disabled:bg-gray-50 disabled:cursor-not-allowed
  `;

  const errorClasses = 'text-red-600 text-xs mt-1';
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" data-testid={testId}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-vitalgo-dark">
            {initialData ? 'Editar Enfermedad' : 'Nueva Enfermedad'}
          </h3>
        </div>

        {/* Row 1: Illness Name and Diagnosis Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Illness Name */}
          <div>
            <label htmlFor="illnessName" className={labelClasses}>
              Nombre de la Enfermedad *
            </label>
            <input
              type="text"
              id="illnessName"
              value={formData.illnessName}
              onChange={(e) => handleChange('illnessName', e.target.value)}
              className={inputClasses}
              disabled={isLoading}
              placeholder="Ej: Hipertensión arterial"
              data-testid={`${testId}-illness-name`}
            />
            {errors.illnessName && (
              <p className={errorClasses}>{errors.illnessName}</p>
            )}
          </div>

          {/* Diagnosis Date */}
          <div>
            <label htmlFor="diagnosisDate" className={labelClasses}>
              Fecha de Diagnóstico *
            </label>
            <input
              type="date"
              id="diagnosisDate"
              value={formData.diagnosisDate}
              onChange={(e) => handleChange('diagnosisDate', e.target.value)}
              className={inputClasses}
              disabled={isLoading}
              data-testid={`${testId}-diagnosis-date`}
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
              Estado *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClasses}
              disabled={isLoading}
              data-testid={`${testId}-status`}
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
              disabled={isLoading}
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
              className={inputClasses}
              disabled={isLoading}
              placeholder="Ej: I10"
              maxLength={10}
              data-testid={`${testId}-cie10-code`}
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
              className={inputClasses}
              disabled={isLoading}
              placeholder="Dr. Juan Pérez"
              data-testid={`${testId}-diagnosed-by`}
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
            className={`${inputClasses} h-20 resize-none`}
            disabled={isLoading}
            placeholder="Descripción del tratamiento actual..."
            data-testid={`${testId}-treatment-description`}
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
            className={`${inputClasses} h-20 resize-none`}
            disabled={isLoading}
            placeholder="Notas adicionales sobre la enfermedad..."
            data-testid={`${testId}-notes`}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vitalgo-green disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            data-testid={`${testId}-cancel-button`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-vitalgo-green border border-transparent rounded-lg hover:bg-vitalgo-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vitalgo-green disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isValid}
            data-testid={`${testId}-submit-button`}
          >
            {isLoading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};