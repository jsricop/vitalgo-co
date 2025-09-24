/**
 * SurgeryForm molecule component
 * Brand-compliant form for creating/editing surgeries following MANUAL_DE_MARCA.md
 */
'use client';

import React from 'react';
import { SurgeryFormProps, AnesthesiaTypeOption } from '../../types';
import { useSurgeryForm } from '../../hooks/useSurgeryForm';

export const SurgeryForm: React.FC<SurgeryFormProps> = ({
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
  } = useSurgeryForm({
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

  const anesthesiaOptions: AnesthesiaTypeOption[] = [
    { value: '', label: 'No especificado' },
    { value: 'general', label: 'Anestesia General' },
    { value: 'local', label: 'Anestesia Local' },
    { value: 'regional', label: 'Anestesia Regional' },
    { value: 'spinal', label: 'Anestesia Espinal' },
    { value: 'epidural', label: 'Anestesia Epidural' },
    { value: 'conscious_sedation', label: 'Sedación Consciente' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div className="bg-white rounded-xl border border-vitalgo-dark-lightest p-6" data-testid={testId}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-vitalgo-dark">
          {mode === 'edit' ? 'Editar' : 'Agregar'} Cirugía
        </h3>
        <p className="text-sm text-vitalgo-dark-light mt-1">
          {mode === 'edit'
            ? 'Actualiza la información de la cirugía'
            : 'Completa la información de la nueva cirugía'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Procedure Name */}
        <div>
          <label htmlFor="procedureName" className={labelClasses}>
            Nombre del Procedimiento <span className={requiredClasses}>*</span>
          </label>
          <input
            type="text"
            id="procedureName"
            value={formData.procedureName}
            onChange={(e) => handleInputChange('procedureName', e.target.value)}
            className={fieldClasses('procedureName')}
            placeholder="Ej: Apendicectomía, Cirugía de Vesícula Biliar"
            disabled={isFormLoading}
            data-testid={`${testId}-procedure-name`}
            style={{ fontSize: '16px' }} // Prevents iOS zoom
            autoComplete="off"
          />
          {errors.procedureName && (
            <p className={errorClasses} data-testid={`${testId}-procedure-name-error`}>
              {errors.procedureName}
            </p>
          )}
        </div>

        {/* Surgery Date */}
        <div>
          <label htmlFor="surgeryDate" className={labelClasses}>
            Fecha de la Cirugía <span className={requiredClasses}>*</span>
          </label>
          <input
            type="date"
            id="surgeryDate"
            value={formData.surgeryDate}
            onChange={(e) => handleInputChange('surgeryDate', e.target.value)}
            className={fieldClasses('surgeryDate')}
            disabled={isFormLoading}
            data-testid={`${testId}-surgery-date`}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            style={{ fontSize: '16px' }} // Prevents iOS zoom
          />
          {errors.surgeryDate && (
            <p className={errorClasses} data-testid={`${testId}-surgery-date-error`}>
              {errors.surgeryDate}
            </p>
          )}
        </div>

        {/* Two-column layout for hospital and surgeon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hospital Name */}
          <div>
            <label htmlFor="hospitalName" className={labelClasses}>
              Hospital o Clínica
            </label>
            <input
              type="text"
              id="hospitalName"
              value={formData.hospitalName || ''}
              onChange={(e) => handleInputChange('hospitalName', e.target.value)}
              className={fieldClasses('hospitalName')}
              placeholder="Ej: Hospital Central"
              disabled={isFormLoading}
              data-testid={`${testId}-hospital-name`}
              style={{ fontSize: '16px' }} // Prevents iOS zoom
              autoComplete="off"
            />
            {errors.hospitalName && (
              <p className={errorClasses} data-testid={`${testId}-hospital-name-error`}>
                {errors.hospitalName}
              </p>
            )}
          </div>

          {/* Surgeon Name */}
          <div>
            <label htmlFor="surgeonName" className={labelClasses}>
              Nombre del Cirujano
            </label>
            <input
              type="text"
              id="surgeonName"
              value={formData.surgeonName || ''}
              onChange={(e) => handleInputChange('surgeonName', e.target.value)}
              className={fieldClasses('surgeonName')}
              placeholder="Ej: Dr. Juan Pérez"
              disabled={isFormLoading}
              data-testid={`${testId}-surgeon-name`}
              style={{ fontSize: '16px' }} // Prevents iOS zoom
              autoComplete="off"
            />
            {errors.surgeonName && (
              <p className={errorClasses} data-testid={`${testId}-surgeon-name-error`}>
                {errors.surgeonName}
              </p>
            )}
          </div>
        </div>

        {/* Two-column layout for anesthesia and duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Anesthesia Type */}
          <div>
            <label htmlFor="anesthesiaType" className={labelClasses}>
              Tipo de Anestesia
            </label>
            <select
              id="anesthesiaType"
              value={formData.anesthesiaType || ''}
              onChange={(e) => handleInputChange('anesthesiaType', e.target.value)}
              className={fieldClasses('anesthesiaType')}
              disabled={isFormLoading}
              data-testid={`${testId}-anesthesia-type`}
              style={{ fontSize: '16px' }} // Prevents iOS zoom
            >
              {anesthesiaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.anesthesiaType && (
              <p className={errorClasses} data-testid={`${testId}-anesthesia-type-error`}>
                {errors.anesthesiaType}
              </p>
            )}
          </div>

          {/* Duration Hours */}
          <div>
            <label htmlFor="durationHours" className={labelClasses}>
              Duración (horas)
            </label>
            <input
              type="number"
              id="durationHours"
              value={formData.durationHours || ''}
              onChange={(e) => handleInputChange('durationHours', e.target.value ? parseInt(e.target.value) : undefined)}
              className={fieldClasses('durationHours')}
              placeholder="Ej: 2"
              min="0"
              max="24"
              step="1"
              disabled={isFormLoading}
              data-testid={`${testId}-duration-hours`}
              style={{ fontSize: '16px' }} // Prevents iOS zoom
            />
            {errors.durationHours && (
              <p className={errorClasses} data-testid={`${testId}-duration-hours-error`}>
                {errors.durationHours}
              </p>
            )}
          </div>
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
            placeholder="Información adicional sobre la cirugía, preparativos, recuperación..."
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

        {/* Complications */}
        <div>
          <label htmlFor="complications" className={labelClasses}>
            Complicaciones
          </label>
          <textarea
            id="complications"
            value={formData.complications || ''}
            onChange={(e) => handleInputChange('complications', e.target.value)}
            className={fieldClasses('complications')}
            placeholder="Describe cualquier complicación que haya surgido durante o después de la cirugía..."
            rows={3}
            disabled={isFormLoading}
            data-testid={`${testId}-complications`}
            style={{ fontSize: '16px' }} // Prevents iOS zoom
          />
          {errors.complications && (
            <p className={errorClasses} data-testid={`${testId}-complications-error`}>
              {errors.complications}
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
            {mode === 'edit' ? 'Actualizar' : 'Guardar'} Cirugía
          </button>
        </div>
      </form>
    </div>
  );
};