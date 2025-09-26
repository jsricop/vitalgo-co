/**
 * BasicInfoEditModal molecule component
 * Modal for editing basic patient information following VitalGo patterns
 */
'use client';

import React, { useState, useEffect } from 'react';
import { BasicPatientInfo, BasicPatientUpdate } from '../../types';

interface BasicInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: BasicPatientInfo | null;
  onSubmit: (data: BasicPatientUpdate) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
  'data-testid'?: string;
}

export const BasicInfoEditModal: React.FC<BasicInfoEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
  'data-testid': testId = 'basic-info-edit-modal'
}) => {
  const [formData, setFormData] = useState<BasicPatientUpdate>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        documentType: initialData.documentType,
        documentNumber: initialData.documentNumber,
        phoneInternational: initialData.phoneInternational,
        birthDate: initialData.birthDate,
        email: initialData.email,
      });
      setErrors({});
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

  const handleInputChange = (field: keyof BasicPatientUpdate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.documentType?.trim()) {
      newErrors.documentType = 'El tipo de documento es obligatorio';
    }

    if (!formData.documentNumber?.trim()) {
      newErrors.documentNumber = 'El número de documento es obligatorio';
    } else if (formData.documentNumber.trim().length < 6) {
      newErrors.documentNumber = 'El número de documento debe tener al menos 6 caracteres';
    }

    if (!formData.phoneInternational?.trim()) {
      newErrors.phoneInternational = 'El teléfono es obligatorio';
    } else if (formData.phoneInternational.trim().length < 10) {
      newErrors.phoneInternational = 'El teléfono debe tener al menos 10 dígitos';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email debe tener un formato válido';
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

  // VitalGo brand-compliant field classes
  const fieldClasses = (fieldName: string) => `
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
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
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
                Editar Información Básica
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
              Actualiza tu información personal registrada
            </p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 pb-4">
            <div className="space-y-4">
              {/* Name Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className={labelClasses}>
                    Nombres <span className={requiredClasses}>*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={fieldClasses('firstName')}
                    placeholder="Ej: Juan Carlos"
                    disabled={isFormLoading}
                    data-testid={`${testId}-first-name`}
                    style={{ fontSize: '16px' }}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <p className={errorClasses} data-testid={`${testId}-first-name-error`}>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className={labelClasses}>
                    Apellidos <span className={requiredClasses}>*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={fieldClasses('lastName')}
                    placeholder="Ej: García López"
                    disabled={isFormLoading}
                    data-testid={`${testId}-last-name`}
                    style={{ fontSize: '16px' }}
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <p className={errorClasses} data-testid={`${testId}-last-name-error`}>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Document Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Document Type */}
                <div>
                  <label htmlFor="documentType" className={labelClasses}>
                    Tipo de Documento <span className={requiredClasses}>*</span>
                  </label>
                  <select
                    id="documentType"
                    value={formData.documentType || ''}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className={fieldClasses('documentType')}
                    disabled={isFormLoading}
                    data-testid={`${testId}-document-type`}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                  {errors.documentType && (
                    <p className={errorClasses} data-testid={`${testId}-document-type-error`}>
                      {errors.documentType}
                    </p>
                  )}
                </div>

                {/* Document Number */}
                <div>
                  <label htmlFor="documentNumber" className={labelClasses}>
                    Número de Documento <span className={requiredClasses}>*</span>
                  </label>
                  <input
                    type="text"
                    id="documentNumber"
                    value={formData.documentNumber || ''}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    className={fieldClasses('documentNumber')}
                    placeholder="Ej: 12345678"
                    disabled={isFormLoading}
                    data-testid={`${testId}-document-number`}
                    style={{ fontSize: '16px' }}
                    autoComplete="off"
                  />
                  {errors.documentNumber && (
                    <p className={errorClasses} data-testid={`${testId}-document-number-error`}>
                      {errors.documentNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div>
                <label htmlFor="phoneInternational" className={labelClasses}>
                  Teléfono <span className={requiredClasses}>*</span>
                </label>
                <input
                  type="tel"
                  id="phoneInternational"
                  value={formData.phoneInternational || ''}
                  onChange={(e) => handleInputChange('phoneInternational', e.target.value)}
                  className={fieldClasses('phoneInternational')}
                  placeholder="Ej: +57 300 123 4567"
                  disabled={isFormLoading}
                  data-testid={`${testId}-phone`}
                  style={{ fontSize: '16px' }}
                  autoComplete="tel"
                />
                {errors.phoneInternational && (
                  <p className={errorClasses} data-testid={`${testId}-phone-error`}>
                    {errors.phoneInternational}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email <span className={requiredClasses}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={fieldClasses('email')}
                  placeholder="Ej: juan@email.com"
                  disabled={isFormLoading}
                  data-testid={`${testId}-email`}
                  style={{ fontSize: '16px' }}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className={errorClasses} data-testid={`${testId}-email-error`}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className={labelClasses}>
                  Fecha de Nacimiento <span className={requiredClasses}>*</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate || ''}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className={fieldClasses('birthDate')}
                  disabled={isFormLoading}
                  data-testid={`${testId}-birth-date`}
                  style={{ fontSize: '16px' }}
                />
                {errors.birthDate && (
                  <p className={errorClasses} data-testid={`${testId}-birth-date-error`}>
                    {errors.birthDate}
                  </p>
                )}
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
                'Guardar Cambios'
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