/**
 * MedicationCard molecule component
 * VitalGo brand-compliant card for displaying individual medication information
 */
'use client';

import React from 'react';
import { MedicationCardProps } from '../../types';
import { MedicationIcon } from '../atoms/MedicationIcon';
import { MedicationStatus } from '../atoms/MedicationStatus';
import { MedicationActions } from '../atoms/MedicationActions';
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

        {/* Actions */}
        {showActions && (onEdit || onDelete || onToggleActive) && (
          <div className="flex-shrink-0">
            <MedicationActions
              medication={medication}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              size={compact ? 'sm' : 'md'}
              layout={compact ? 'icons' : 'horizontal'}
              data-testid={`${testId}-actions`}
            />
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