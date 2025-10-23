/**
 * MedicalInfoEditModal molecule component
 * Modal for editing medical patient information (RF002 Medical Information)
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PersonalPatientInfo, PersonalPatientUpdate } from '../../types/personalInfo';
import { SelectField } from '../atoms/SelectField';
import { TextAreaField } from '../atoms/TextAreaField';
import { RadioButtonField } from '../atoms/RadioButtonField';
import {
  epsOptions,
  bloodTypeOptions,
  complementaryPlanOptions,
  emergencyContactRelationshipOptions,
  isOtherValueRequired,
  validatePhoneNumber
} from '../../data/medicalData';

interface MedicalInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PersonalPatientInfo | null;
  onSubmit: (data: PersonalPatientUpdate) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
  'data-testid'?: string;
}

interface MedicalFormData {
  eps?: string;
  eps_other?: string;
  occupation?: string;
  additional_insurance?: string;
  complementary_plan?: string;
  complementary_plan_other?: string;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact_phone_alt?: string;
}

export const MedicalInfoEditModal: React.FC<MedicalInfoEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
  'data-testid': testId = 'medical-info-edit-modal'
}) => {
  const t = useTranslations('profile.forms');
  const tCommon = useTranslations('common');
  const [formData, setFormData] = useState<MedicalFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      console.log('🔍 MedicalInfoEditModal initializing with data:', initialData);

      setFormData({
        eps: initialData.eps || '',
        eps_other: initialData.eps_other || '',
        occupation: initialData.occupation || '',
        additional_insurance: initialData.additional_insurance || '',
        complementary_plan: initialData.complementary_plan || '',
        complementary_plan_other: initialData.complementary_plan_other || '',
        blood_type: initialData.blood_type || '',
        emergency_contact_name: initialData.emergency_contact_name || '',
        emergency_contact_relationship: initialData.emergency_contact_relationship || '',
        emergency_contact_phone: initialData.emergency_contact_phone || '',
        emergency_contact_phone_alt: initialData.emergency_contact_phone_alt || ''
      });

      setErrors({});
      console.log('✅ MedicalInfoEditModal initialized');
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

  const handleFieldChange = (field: keyof MedicalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.eps) {
      newErrors.eps = t('validation.epsRequired');
    }

    if (formData.eps === 'OTRO' && !formData.eps_other) {
      newErrors.eps_other = t('validation.epsOtherSpecify');
    }

    if (!formData.occupation) {
      newErrors.occupation = t('validation.occupationRequired');
    }

    if (!formData.blood_type) {
      newErrors.blood_type = t('validation.bloodTypeRequired');
    }

    if (!formData.emergency_contact_name) {
      newErrors.emergency_contact_name = t('validation.emergencyNameRequired');
    }

    if (!formData.emergency_contact_relationship) {
      newErrors.emergency_contact_relationship = t('validation.emergencyRelationshipRequired');
    }

    if (!formData.emergency_contact_phone) {
      newErrors.emergency_contact_phone = t('validation.emergencyPhoneRequired');
    } else if (!validatePhoneNumber(formData.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = t('validation.phoneFormat');
    }

    // Optional phone validation
    if (formData.emergency_contact_phone_alt && !validatePhoneNumber(formData.emergency_contact_phone_alt)) {
      newErrors.emergency_contact_phone_alt = t('validation.phoneFormat');
    }

    if (formData.complementary_plan === 'OTRO' && !formData.complementary_plan_other) {
      newErrors.complementary_plan_other = t('validation.complementaryPlanSpecify');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        onClose();
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Error submitting medical info:', error);
      setErrors({ general: t('messages.errorUpdate') });
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
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
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
                {t('modals.editMedicalInfo')}
              </h3>
              <button
                type="button"
                className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-vitalgo-green"
                onClick={onClose}
                data-testid="modal-close-button"
              >
                <span className="sr-only">{tCommon('close')}</span>
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
              {t('sectionDescriptions.completeMedicalInfo')}
            </p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 pb-4">
            <div className="space-y-6">
              {/* Section 1: Seguridad Social y Ocupación */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-medium text-vitalgo-dark mb-4 flex items-center">
                  <div className="w-6 h-6 bg-vitalgo-green/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-vitalgo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  {t('sectionTitles.socialSecurityOccupation')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label={t('labels.eps')}
                    value={formData.eps || ''}
                    onChange={(value) => handleFieldChange('eps', value)}
                    options={epsOptions}
                    placeholder={t('placeholders.selectEps')}
                    required
                    error={errors.eps}
                  />

                  {isOtherValueRequired(formData.eps || '') && (
                    <div className="md:col-span-2">
                      <TextAreaField
                        label={t('labels.epsOther')}
                        value={formData.eps_other || ''}
                        onChange={(value) => handleFieldChange('eps_other', value)}
                        placeholder={t('placeholders.epsOther')}
                        required
                        error={errors.eps_other}
                        rows={2}
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <TextAreaField
                      label={t('labels.occupation')}
                      value={formData.occupation || ''}
                      onChange={(value) => handleFieldChange('occupation', value)}
                      placeholder={t('placeholders.occupation')}
                      required
                      error={errors.occupation}
                      rows={2}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextAreaField
                      label={t('labels.additionalInsurance')}
                      value={formData.additional_insurance || ''}
                      onChange={(value) => handleFieldChange('additional_insurance', value)}
                      placeholder={t('placeholders.additionalInsurance')}
                      error={errors.additional_insurance}
                      rows={2}
                    />
                  </div>

                  <SelectField
                    label={t('labels.complementaryPlan')}
                    value={formData.complementary_plan || ''}
                    onChange={(value) => handleFieldChange('complementary_plan', value)}
                    options={complementaryPlanOptions}
                    placeholder={t('placeholders.complementaryPlan')}
                    error={errors.complementary_plan}
                  />

                  {isOtherValueRequired(formData.complementary_plan || '') && (
                    <TextAreaField
                      label={t('labels.complementaryPlanOther')}
                      value={formData.complementary_plan_other || ''}
                      onChange={(value) => handleFieldChange('complementary_plan_other', value)}
                      placeholder={t('placeholders.complementaryPlanOther')}
                      required
                      error={errors.complementary_plan_other}
                      rows={2}
                    />
                  )}
                </div>
              </div>

              {/* Section 2: Información Médica */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-medium text-vitalgo-dark mb-4 flex items-center">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  {t('sectionTitles.medicalInfo')}
                </h4>
                <div>
                  <RadioButtonField
                    label={t('labels.bloodType')}
                    name="blood_type"
                    value={formData.blood_type || ''}
                    onChange={(value) => handleFieldChange('blood_type', value)}
                    options={bloodTypeOptions}
                    required
                    error={errors.blood_type}
                  />
                </div>
              </div>

              {/* Section 3: Contacto de Emergencia */}
              <div>
                <h4 className="text-lg font-medium text-vitalgo-dark mb-4 flex items-center">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  {t('sectionTitles.emergencyContact')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <TextAreaField
                      label={t('labels.emergencyName')}
                      value={formData.emergency_contact_name || ''}
                      onChange={(value) => handleFieldChange('emergency_contact_name', value)}
                      placeholder={t('placeholders.emergencyName')}
                      required
                      error={errors.emergency_contact_name}
                      rows={2}
                    />
                  </div>

                  <SelectField
                    label={t('labels.emergencyRelationship')}
                    value={formData.emergency_contact_relationship || ''}
                    onChange={(value) => handleFieldChange('emergency_contact_relationship', value)}
                    options={emergencyContactRelationshipOptions}
                    placeholder={t('placeholders.emergencyRelationship')}
                    required
                    error={errors.emergency_contact_relationship}
                  />

                  <div></div>

                  <TextAreaField
                    label={t('labels.emergencyPhone')}
                    value={formData.emergency_contact_phone || ''}
                    onChange={(value) => handleFieldChange('emergency_contact_phone', value)}
                    placeholder={t('placeholders.emergencyPhone')}
                    required
                    error={errors.emergency_contact_phone}
                    rows={1}
                  />

                  <TextAreaField
                    label={t('labels.emergencyPhoneAlt')}
                    value={formData.emergency_contact_phone_alt || ''}
                    onChange={(value) => handleFieldChange('emergency_contact_phone_alt', value)}
                    placeholder={t('placeholders.emergencyPhoneAlt')}
                    error={errors.emergency_contact_phone_alt}
                    rows={1}
                  />
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
                  {t('buttons.saving')}
                </div>
              ) : (
                t('buttons.saveMedicalInfo')
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
              onClick={onClose}
              disabled={isFormLoading}
              data-testid={`${testId}-cancel-button`}
            >
              {t('buttons.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};