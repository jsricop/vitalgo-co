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
import { PhoneInputGroup } from '../../../../shared/components/molecules/PhoneInputGroup';
import { Country, getCountryByCode } from '../../../signup/data/countries';
import { splitPhoneInternational, combinePhoneInternational } from '../../utils/phoneUtils';
import { useCountries } from '@/hooks/useCountries';
import type { Country as APICountry } from '@/services/countriesService';
import {
  epsOptions,
  bloodTypeOptions,
  complementaryPlanOptions,
  emergencyContactRelationshipOptions,
  isOtherValueRequired
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
  health_service?: string;  // For non-Colombia residents
  occupation?: string;
  additional_insurance?: string;
  complementary_plan?: string;
  complementary_plan_other?: string;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  // Primary emergency phone
  emergency_contact_phone?: string;
  emergency_contact_country_code?: string;
  emergency_contact_dial_code?: string;
  emergency_contact_phone_number?: string;
  // Alternative emergency phone
  emergency_contact_phone_alt?: string;
  emergency_contact_country_code_alt?: string;
  emergency_contact_dial_code_alt?: string;
  emergency_contact_phone_number_alt?: string;
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

  // Load countries from API
  const { countries: apiCountries, isLoading: countriesLoading, error: countriesError } = useCountries();

  // Convert API countries to format expected by PhoneInputGroup
  const convertedCountries: Country[] = apiCountries.map((country: APICountry) => ({
    code: country.code,
    name: country.name,
    dialCode: country.phone_code,
    flag: country.flag_emoji || '',
  }));

  // Phone field states for separated input
  const [emergencyPhoneCountryCode, setEmergencyPhoneCountryCode] = useState<string>('CO');
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState<string>('');
  const [emergencyPhoneAltCountryCode, setEmergencyPhoneAltCountryCode] = useState<string>('CO');
  const [emergencyPhoneAltNumber, setEmergencyPhoneAltNumber] = useState<string>('');

  // Check if user resides in Colombia
  const residesInColombia = initialData?.residence_country === 'CO' ||
                            initialData?.residence_country === 'Colombia' ||
                            initialData?.residence_country === 'COLOMBIA';

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      console.log('🔍 MedicalInfoEditModal initializing with data:', initialData);

      // Parse primary emergency phone
      let emergencyCountryCode = initialData.emergency_contact_country_code || 'CO';
      let emergencyPhone = initialData.emergency_contact_phone_number || '';

      if (!emergencyPhone && initialData.emergency_contact_phone) {
        const phoneData = splitPhoneInternational(
          initialData.emergency_contact_phone,
          emergencyCountryCode,
          true
        );
        emergencyCountryCode = phoneData.countryCode;
        emergencyPhone = phoneData.phoneNumber;
      }

      // Parse alternative emergency phone
      let emergencyAltCountryCode = initialData.emergency_contact_country_code_alt || 'CO';
      let emergencyAltPhone = initialData.emergency_contact_phone_number_alt || '';

      if (!emergencyAltPhone && initialData.emergency_contact_phone_alt) {
        const phoneData = splitPhoneInternational(
          initialData.emergency_contact_phone_alt,
          emergencyAltCountryCode,
          true
        );
        emergencyAltCountryCode = phoneData.countryCode;
        emergencyAltPhone = phoneData.phoneNumber;
      }

      setFormData({
        eps: initialData.eps || '',
        eps_other: initialData.eps_other || '',
        health_service: initialData.additional_insurance || '',
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

      setEmergencyPhoneCountryCode(emergencyCountryCode);
      setEmergencyPhoneNumber(emergencyPhone);
      setEmergencyPhoneAltCountryCode(emergencyAltCountryCode);
      setEmergencyPhoneAltNumber(emergencyAltPhone);

      setErrors({});
      console.log('✅ MedicalInfoEditModal initialized with emergency phones:', {
        primary: { country: emergencyCountryCode, phone: emergencyPhone },
        alt: { country: emergencyAltCountryCode, phone: emergencyAltPhone }
      });
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

  // Primary emergency phone handlers
  const handleEmergencyCountryChange = (country: Country) => {
    setEmergencyPhoneCountryCode(country.code);
    const newPhoneInternational = combinePhoneInternational(country.code, emergencyPhoneNumber);
    setFormData(prev => ({
      ...prev,
      emergency_contact_phone: newPhoneInternational,
      emergency_contact_country_code: country.code,
      emergency_contact_dial_code: country.dialCode,
      emergency_contact_phone_number: emergencyPhoneNumber
    }));
    if (errors.emergency_contact_phone) {
      setErrors(prev => ({ ...prev, emergency_contact_phone: '' }));
    }
  };

  const handleEmergencyPhoneChange = (newPhoneNumber: string) => {
    setEmergencyPhoneNumber(newPhoneNumber);
    const newPhoneInternational = combinePhoneInternational(emergencyPhoneCountryCode, newPhoneNumber);
    const country = getCountryByCode(emergencyPhoneCountryCode);
    setFormData(prev => ({
      ...prev,
      emergency_contact_phone: newPhoneInternational,
      emergency_contact_phone_number: newPhoneNumber,
      emergency_contact_dial_code: country?.dialCode
    }));
    if (errors.emergency_contact_phone) {
      setErrors(prev => ({ ...prev, emergency_contact_phone: '' }));
    }
  };

  // Alternative emergency phone handlers
  const handleEmergencyAltCountryChange = (country: Country) => {
    setEmergencyPhoneAltCountryCode(country.code);
    const newPhoneInternational = combinePhoneInternational(country.code, emergencyPhoneAltNumber);
    setFormData(prev => ({
      ...prev,
      emergency_contact_phone_alt: newPhoneInternational,
      emergency_contact_country_code_alt: country.code,
      emergency_contact_dial_code_alt: country.dialCode,
      emergency_contact_phone_number_alt: emergencyPhoneAltNumber
    }));
    if (errors.emergency_contact_phone_alt) {
      setErrors(prev => ({ ...prev, emergency_contact_phone_alt: '' }));
    }
  };

  const handleEmergencyPhoneAltChange = (newPhoneNumber: string) => {
    setEmergencyPhoneAltNumber(newPhoneNumber);
    const newPhoneInternational = combinePhoneInternational(emergencyPhoneAltCountryCode, newPhoneNumber);
    const country = getCountryByCode(emergencyPhoneAltCountryCode);
    setFormData(prev => ({
      ...prev,
      emergency_contact_phone_alt: newPhoneInternational,
      emergency_contact_phone_number_alt: newPhoneNumber,
      emergency_contact_dial_code_alt: country?.dialCode
    }));
    if (errors.emergency_contact_phone_alt) {
      setErrors(prev => ({ ...prev, emergency_contact_phone_alt: '' }));
    }
  };

  // Debug log
  console.log('🌎 MedicalInfoEditModal - residence_country:', initialData?.residence_country);
  console.log('🇨🇴 MedicalInfoEditModal - residesInColombia:', residesInColombia);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation - EPS only required for Colombia residents
    if (residesInColombia && !formData.eps) {
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
    } else if (formData.emergency_contact_phone.trim().replace(/[^0-9]/g, '').length < 10) {
      newErrors.emergency_contact_phone = t('validation.phoneInvalid');
    }

    // Optional phone validation
    if (formData.emergency_contact_phone_alt && formData.emergency_contact_phone_alt.trim().replace(/[^0-9]/g, '').length < 10) {
      newErrors.emergency_contact_phone_alt = t('validation.phoneInvalid');
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
      // If user doesn't reside in Colombia, save health_service to additional_insurance field
      const dataToSubmit = { ...formData };
      if (!residesInColombia && formData.health_service) {
        dataToSubmit.additional_insurance = formData.health_service;
      }

      const result = await onSubmit(dataToSubmit);
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
                  {/* EPS field only for Colombia residents */}
                  {residesInColombia ? (
                    <>
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
                    </>
                  ) : (
                    /* Health Service field for non-Colombia residents */
                    <div className="md:col-span-2">
                      <TextAreaField
                        label="Servicio de Salud"
                        value={formData.health_service || ''}
                        onChange={(value) => handleFieldChange('health_service', value)}
                        placeholder="Ingresa tu servicio de salud o seguro médico"
                        error={errors.health_service}
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

                  {/* Show additional insurance only for non-Colombia residents */}
                  {!residesInColombia && (
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
                  )}

                  {/* Complementary plan only for Colombia residents */}
                  {residesInColombia && (
                    <>
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
                    </>
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

                  <div className="md:col-span-2">
                    <SelectField
                      label={t('labels.emergencyRelationship')}
                      value={formData.emergency_contact_relationship || ''}
                      onChange={(value) => handleFieldChange('emergency_contact_relationship', value)}
                      options={emergencyContactRelationshipOptions}
                      placeholder={t('placeholders.emergencyRelationship')}
                      required
                      error={errors.emergency_contact_relationship}
                    />
                  </div>

                  {/* Primary Emergency Phone */}
                  <div className="md:col-span-2">
                    <PhoneInputGroup
                      countryCode={emergencyPhoneCountryCode}
                      phoneNumber={emergencyPhoneNumber}
                      onCountryChange={handleEmergencyCountryChange}
                      onPhoneChange={handleEmergencyPhoneChange}
                      error={errors.emergency_contact_phone}
                      disabled={isFormLoading}
                      data-testid={`${testId}-emergency-phone-group`}
                      countries={convertedCountries.length > 0 ? convertedCountries : undefined}
                    />
                  </div>

                  {/* Alternative Emergency Phone */}
                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {t('labels.emergencyPhoneAlt')}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Teléfono alternativo de contacto (opcional)
                        </p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-vitalgo-dark mb-1">
                            Indicativo <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={emergencyPhoneAltCountryCode}
                            onChange={(e) => {
                              const country = convertedCountries.find(c => c.code === e.target.value);
                              if (country) handleEmergencyAltCountryChange(country);
                            }}
                            disabled={isFormLoading}
                            className="w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:ring-2 transition-colors duration-150 border-vitalgo-dark-lighter focus:ring-vitalgo-green focus:border-vitalgo-green"
                          >
                            {convertedCountries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.flag} {country.dialCode} {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-vitalgo-dark mb-1">
                            Número de teléfono
                          </label>
                          <input
                            type="tel"
                            value={emergencyPhoneAltNumber}
                            onChange={(e) => handleEmergencyPhoneAltChange(e.target.value)}
                            disabled={isFormLoading}
                            placeholder="3001234567"
                            className="w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:ring-2 transition-colors duration-150 border-vitalgo-dark-lighter focus:ring-vitalgo-green focus:border-vitalgo-green"
                            style={{ fontSize: '16px' }}
                          />
                          {errors.emergency_contact_phone_alt && (
                            <p className="mt-1 text-sm text-red-600 font-medium">
                              {errors.emergency_contact_phone_alt}
                            </p>
                          )}
                        </div>
                      </div>
                      {emergencyPhoneAltNumber && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Número completo:
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg flex-shrink-0" role="img">
                                {getCountryByCode(emergencyPhoneAltCountryCode)?.flag || '🏳️'}
                              </span>
                              <span className="font-mono text-sm text-gray-900 flex items-center">
                                <span className="text-blue-600 font-medium">
                                  {getCountryByCode(emergencyPhoneAltCountryCode)?.dialCode || ''}
                                </span>
                                <span className="ml-1">
                                  {emergencyPhoneAltNumber.replace(/\D/g, '')}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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