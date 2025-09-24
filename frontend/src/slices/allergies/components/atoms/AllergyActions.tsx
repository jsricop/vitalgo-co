/**
 * AllergyActions atom component
 * VitalGo brand-compliant action buttons for allergy operations
 */
'use client';

import React, { useState } from 'react';
import { Allergy } from '../../types';

interface AllergyActionsProps {
  allergy: Allergy;
  onEdit?: (allergy: Allergy) => void;
  onDelete?: (id: number) => void;
  size?: 'sm' | 'md';
  layout?: 'horizontal' | 'vertical' | 'dropdown' | 'icons';
  isLoading?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const AllergyActions: React.FC<AllergyActionsProps> = ({
  allergy,
  onEdit,
  onDelete,
  size = 'md',
  layout = 'horizontal',
  isLoading = false,
  className = '',
  'data-testid': testId
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  const handleEdit = () => {
    if (onEdit && !isLoading) {
      onEdit(allergy);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && !isLoading) {
      onDelete(allergy.id);
    }
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  // Base button classes following VitalGo design system
  const baseButtonClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
  `;

  const editButtonClasses = `
    ${baseButtonClasses}
    text-vitalgo-dark bg-white border border-vitalgo-dark-lighter
    hover:bg-gray-50 focus:ring-vitalgo-green
  `;

  const deleteButtonClasses = `
    ${baseButtonClasses}
    text-red-600 bg-white border border-red-200
    hover:bg-red-50 focus:ring-red-500
  `;

  const dropdownButtonClasses = `
    ${baseButtonClasses}
    text-vitalgo-dark bg-white border border-vitalgo-dark-lighter
    hover:bg-gray-50 focus:ring-vitalgo-green
  `;

  if (layout === 'dropdown') {
    return (
      <div className={`relative ${className}`} data-testid={testId}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isLoading}
          className={dropdownButtonClasses}
          aria-label="Opciones de la alergia"
          data-testid={`${testId}-dropdown-trigger`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>

        {showDropdown && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-vitalgo-dark-lightest py-2 z-20">
              {onEdit && (
                <button
                  onClick={() => {
                    handleEdit();
                    setShowDropdown(false);
                  }}
                  disabled={isLoading}
                  className="flex items-center w-full px-4 py-2 text-sm text-vitalgo-dark hover:bg-gray-50"
                  data-testid={`${testId}-edit`}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => {
                    handleDeleteClick();
                    setShowDropdown(false);
                  }}
                  disabled={isLoading}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  data-testid={`${testId}-delete`}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  if (layout === 'icons') {
    return (
      <>
        <div className={`flex items-center space-x-1 ${className}`} data-testid={testId}>
          {onEdit && (
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="p-1.5 text-vitalgo-dark hover:text-vitalgo-green hover:bg-vitalgo-green/10 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-vitalgo-green/50 disabled:opacity-50"
              aria-label={`Editar ${allergy.allergen}`}
              title="Editar alergia"
              data-testid={`${testId}-edit`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDeleteClick}
              disabled={isLoading}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
              aria-label={`Eliminar ${allergy.allergen}`}
              title="Eliminar alergia"
              data-testid={`${testId}-delete`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-vitalgo-dark">
                    ¿Eliminar alergia?
                  </h3>
                </div>
              </div>

              <p className="text-vitalgo-dark-light mb-6">
                ¿Estás seguro de que deseas eliminar la alergia a <strong>{allergy.allergen}</strong>?
                Esta acción no se puede deshacer.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm font-medium text-vitalgo-dark bg-white border border-vitalgo-dark-lighter rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-vitalgo-green"
                  data-testid={`${testId}-cancel-delete`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  data-testid={`${testId}-confirm-delete`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const containerClasses = layout === 'vertical' ? 'flex flex-col space-y-2' : 'flex items-center space-x-2';

  return (
    <>
      <div className={`${containerClasses} ${className}`} data-testid={testId}>
        {onEdit && (
          <button
            onClick={handleEdit}
            disabled={isLoading}
            className={editButtonClasses}
            aria-label={`Editar ${allergy.allergen}`}
            data-testid={`${testId}-edit`}
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
        )}

        {onDelete && (
          <button
            onClick={handleDeleteClick}
            disabled={isLoading}
            className={deleteButtonClasses}
            aria-label={`Eliminar ${allergy.allergen}`}
            data-testid={`${testId}-delete`}
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-vitalgo-dark">
                  ¿Eliminar alergia?
                </h3>
              </div>
            </div>

            <p className="text-vitalgo-dark-light mb-6">
              ¿Estás seguro de que deseas eliminar la alergia a <strong>{allergy.allergen}</strong>?
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-vitalgo-dark bg-white border border-vitalgo-dark-lighter rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-vitalgo-green"
                data-testid={`${testId}-cancel-delete`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                data-testid={`${testId}-confirm-delete`}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};