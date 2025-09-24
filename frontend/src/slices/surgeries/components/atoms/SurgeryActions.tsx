/**
 * SurgeryActions atom component
 * VitalGo brand-compliant action buttons for surgery cards
 */
'use client';

import React, { useState } from 'react';
import { Surgery } from '../../types';

interface SurgeryActionsProps {
  surgery: Surgery;
  onEdit?: (surgery: Surgery) => void;
  onDelete?: (id: number) => void;
  size?: 'sm' | 'md';
  layout?: 'horizontal' | 'icons';
  'data-testid'?: string;
}

export const SurgeryActions: React.FC<SurgeryActionsProps> = ({
  surgery,
  onEdit,
  onDelete,
  size = 'md',
  layout = 'horizontal',
  'data-testid': testId
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-xs',
      icon: 'h-3 w-3',
    },
    md: {
      button: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4',
    },
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(surgery);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(surgery.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (layout === 'icons') {
    return (
      <div className="flex items-center space-x-1" data-testid={testId}>
        {onEdit && (
          <button
            onClick={handleEdit}
            className={`inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors duration-150 ${sizeClasses[size].button}`}
            title="Editar cirugía"
          >
            <svg className={sizeClasses[size].icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className={`inline-flex items-center justify-center rounded-lg border border-red-300 bg-white hover:bg-red-50 text-red-600 transition-colors duration-150 ${sizeClasses[size].button}`}
            title="Eliminar cirugía"
          >
            <svg className={sizeClasses[size].icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Eliminar Cirugía
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar la cirugía <strong>{surgery.procedureName}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-150"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2" data-testid={testId}>
      {onEdit && (
        <button
          onClick={handleEdit}
          className={`inline-flex items-center font-medium text-vitalgo-green hover:text-vitalgo-green-light transition-colors duration-150 ${sizeClasses[size].button}`}
        >
          <svg className={`${sizeClasses[size].icon} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
      )}
      {onDelete && (
        <button
          onClick={handleDeleteClick}
          className={`inline-flex items-center font-medium text-red-600 hover:text-red-700 transition-colors duration-150 ${sizeClasses[size].button}`}
        >
          <svg className={`${sizeClasses[size].icon} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Eliminar Cirugía
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la cirugía <strong>{surgery.procedureName}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-150"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};