/**
 * MedicationCard molecule component
 * VitalGo brand-compliant card for displaying individual medication information
 */
'use client';

import React from 'react';
import { MedicationCardProps } from '../../types';
import { MedicationIcon } from '../atoms/MedicationIcon';
import { MedicationStatus } from '../atoms/MedicationStatus';
import { formatDate, formatDateShort, formatDosage, formatFrequency, getMedicationSummary } from '../../utils/medicationHelpers';

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onEdit,
  onDelete,
  onToggleActive,
  showActions = true,
  compact = false,
  'data-testid': testId
}) => {
  const cardClasses = `
    bg-white rounded-xl border border-vitalgo-dark-lightest p-4
    hover:shadow-md transition-shadow duration-200
    ${compact ? 'p-3' : 'p-4'}
  `;

  const titleClasses = `
    font-semibold text-vitalgo-dark
    ${compact ? 'text-sm' : 'text-base'}
  `;

  const subtitleClasses = `
    text-vitalgo-dark-light
    ${compact ? 'text-xs' : 'text-sm'}
  `;

  const metadataClasses = `
    text-vitalgo-dark-lighter
    ${compact ? 'text-xs' : 'text-xs'}
  `;

  return (
    <div className={cardClasses} data-testid={testId}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Medication Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <MedicationIcon
              size={compact ? 'md' : 'lg'}
              color="primary"
              data-testid={`${testId}-icon`}
            />
          </div>

          {/* Medication Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`${titleClasses} truncate`} title={medication.medicationName}>
              {medication.medicationName}
            </h3>
            <p className={`${subtitleClasses} mt-1`}>
              {formatDosage(medication.dosage)} • {formatFrequency(medication.frequency)}
            </p>
            {medication.prescribedBy && !compact && (
              <p className={`${metadataClasses} mt-1`}>
                Prescrito por: {medication.prescribedBy}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0 ml-3">
          <MedicationStatus
            medication={medication}
            size={compact ? 'sm' : 'md'}
            data-testid={`${testId}-status`}
          />
        </div>
      </div>

      {/* Date Information */}
      {!compact && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center">
              <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={metadataClasses}>
                Inicio: {formatDate(medication.startDate)}
              </span>
            </div>
            {medication.endDate && (
              <div className="flex items-center">
                <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={metadataClasses}>
                  Fin: {formatDate(medication.endDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {medication.notes && !compact && (
        <div className="mb-3">
          <p className={`${subtitleClasses} line-clamp-2`} title={medication.notes}>
            {medication.notes}
          </p>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between">
        {/* Last Updated */}
        <div className="flex items-center">
          <svg className="h-3 w-3 text-vitalgo-dark-lighter mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={metadataClasses}>
            Actualizado: {formatDateShort(medication.updatedAt)}
          </span>
        </div>

        {/* Actions - Using the same pattern from SurgeriesCard that user likes */}
        {showActions && (onEdit || onDelete || onToggleActive) && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(medication)}
                className="inline-flex items-center text-xs font-medium text-vitalgo-green hover:text-vitalgo-green-light transition-colors duration-150"
                data-testid={`${testId}-edit-button`}
              >
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            )}
            {onToggleActive && (
              <button
                onClick={() => onToggleActive(medication.id, !medication.isActive)}
                className={`inline-flex items-center text-xs font-medium transition-colors duration-150 ${
                  medication.isActive
                    ? 'text-orange-600 hover:text-orange-700'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
                data-testid={`${testId}-toggle-button`}
              >
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {medication.isActive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                {medication.isActive ? 'Desactivar' : 'Activar'}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(medication.id)}
                className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-700 transition-colors duration-150"
                data-testid={`${testId}-delete-button`}
              >
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Compact Summary for very small cards */}
      {compact && (
        <div className="mt-2 pt-2 border-t border-vitalgo-dark-lightest">
          <p className={`${metadataClasses} truncate`} title={getMedicationSummary(medication)}>
            {getMedicationSummary(medication)}
          </p>
        </div>
      )}
    </div>
  );
};