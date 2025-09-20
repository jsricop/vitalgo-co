'use client';
/**
 * Patient Signup Form organism component
 */
import React, { useState, useEffect } from 'react';
import { PersonalInfoSection } from '../molecules/PersonalInfoSection';
import { AccountSection } from '../molecules/AccountSection';
import { CheckboxWithLink } from '../atoms/CheckboxWithLink';
import { SubmitButton } from '../atoms/SubmitButton';
import { SignupApiService } from '../../services/signupApi';
import { DocumentType, PatientRegistrationForm, FieldValidationState, RegistrationResponse } from '../../types';
import { Country, getDefaultCountry } from '../../data/countries';

interface PatientSignupFormProps {
  onSuccess: (response: RegistrationResponse) => void;
  onError: (error: string) => void;
  allowedDocumentTypes?: string[]; // Filter document types - if undefined, show all
}

export const PatientSignupForm: React.FC<PatientSignupFormProps> = ({
  onSuccess,
  onError,
  allowedDocumentTypes
}) => {
  // Form state
  const [formData, setFormData] = useState<PatientRegistrationForm>({
    fullName: '',
    documentType: '',
    documentNumber: '',
    phoneInternational: '', // Computed from country + phone
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false
  });

  // New phone fields state
  const [phoneState, setPhoneState] = useState({
    countryCode: getDefaultCountry().code, // Default to Colombia
    dialCode: getDefaultCountry().dialCode,
    phoneNumber: ''
  });

  // Document types
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  // Validation states
  const [validationStates, setValidationStates] = useState<{
    [key: string]: FieldValidationState;
  }>({});

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load document types on mount
  useEffect(() => {
    const loadDocumentTypes = async () => {
      try {
        const types = await SignupApiService.getDocumentTypes();

        // Filter document types if allowedDocumentTypes is provided
        const filteredTypes = allowedDocumentTypes
          ? types.filter(type => allowedDocumentTypes.includes(type.code))
          : types;

        setDocumentTypes(filteredTypes);
      } catch (error) {
        onError('Error cargando tipos de documento');
      }
    };

    loadDocumentTypes();
  }, [onError, allowedDocumentTypes]);

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'phoneNumber') {
      setPhoneState(prev => {
        const newState = { ...prev, phoneNumber: value as string };
        // Update computed phoneInternational field
        const cleanNumber = (value as string).replace(/\D/g, '');
        if (cleanNumber) {
          setFormData(prevForm => ({
            ...prevForm,
            phoneInternational: `${newState.dialCode} ${cleanNumber}`
          }));
        }
        return newState;
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time password confirmation validation
    if (field === 'password' || field === 'confirmPassword') {
      setTimeout(() => {
        const currentPassword = field === 'password' ? (value as string) : formData.password;
        const currentConfirmPassword = field === 'confirmPassword' ? (value as string) : formData.confirmPassword;

        if (currentConfirmPassword) {
          const isValid = currentConfirmPassword === currentPassword;
          setValidationStates(prev => ({
            ...prev,
            confirmPassword: {
              isValidating: false,
              isValid,
              error: null,
              feedback: isValid ? 'Coinciden' : 'No coinciden'
            }
          }));
        }
      }, 0);
    }
  };

  // Handle country change
  const handleCountryChange = (country: Country) => {
    setPhoneState(prev => {
      const newState = {
        ...prev,
        countryCode: country.code,
        dialCode: country.dialCode
      };
      // Update computed phoneInternational field
      const cleanNumber = prev.phoneNumber.replace(/\D/g, '');
      if (cleanNumber) {
        setFormData(prevForm => ({
          ...prevForm,
          phoneInternational: `${country.dialCode} ${cleanNumber}`
        }));
      }
      return newState;
    });
  };

  // Handle field blur validation
  const handleFieldBlur = async (field: string) => {
    const value = formData[field as keyof PatientRegistrationForm];

    // Skip validation for empty optional fields
    if (!value && !isRequiredField(field)) return;

    setValidationStates(prev => ({
      ...prev,
      [field]: { isValidating: true, isValid: null, error: null }
    }));

    try {
      switch (field) {
        case 'fullName':
          validateFullName(value as string);
          break;
        case 'documentNumber':
          if (formData.documentType && value) {
            await validateDocumentNumber(value as string, formData.documentType);
          }
          break;
        case 'email':
          if (value) {
            await validateEmail(value as string);
          }
          break;
        case 'password':
          validatePassword(value as string);
          break;
        case 'confirmPassword':
          validateConfirmPassword(value as string);
          break;
        case 'phone':
          validatePhone(phoneState.phoneNumber, phoneState.countryCode);
          break;
        case 'birthDate':
          validateBirthDate(value as string);
          break;
      }
    } catch (error) {
      setValidationStates(prev => ({
        ...prev,
        [field]: { isValidating: false, isValid: false, error: 'Error de validación' }
      }));
    }
  };

  const isRequiredField = (field: string): boolean => {
    const requiredFields = [
      'fullName', 'documentType', 'documentNumber',
      'phoneInternational', 'birthDate', 'email',
      'password', 'confirmPassword'
    ];
    return requiredFields.includes(field);
  };

  const validateFullName = (name: string) => {
    const words = name.trim().split(/\s+/);
    const isValid = words.length >= 2 && name.length <= 100 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name);

    setValidationStates(prev => ({
      ...prev,
      fullName: {
        isValidating: false,
        isValid,
        error: isValid ? null : 'Debe contener al menos nombre y apellido (solo letras)'
      }
    }));
  };

  const validateDocumentNumber = async (documentNumber: string, documentType: string) => {
    try {
      const result = await SignupApiService.validateDocument(documentNumber, documentType);

      setValidationStates(prev => ({
        ...prev,
        documentNumber: {
          isValidating: false,
          isValid: result.valid,
          error: result.valid ? null : result.error || 'Documento inválido'
        }
      }));
    } catch (error) {
      setValidationStates(prev => ({
        ...prev,
        documentNumber: {
          isValidating: false,
          isValid: false,
          error: 'Error validando documento'
        }
      }));
    }
  };

  const validateEmail = async (email: string) => {
    try {
      const result = await SignupApiService.validateEmail(email);

      setValidationStates(prev => ({
        ...prev,
        email: {
          isValidating: false,
          isValid: result.valid,
          error: result.valid ? null : result.error || 'Email inválido'
        }
      }));
    } catch (error) {
      setValidationStates(prev => ({
        ...prev,
        email: {
          isValidating: false,
          isValid: false,
          error: 'Error validando email'
        }
      }));
    }
  };

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8 && password.length <= 128,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    };

    const isValid = Object.values(checks).every(Boolean);

    setValidationStates(prev => ({
      ...prev,
      password: {
        isValidating: false,
        isValid,
        error: isValid ? null : 'La contraseña no cumple con los requisitos'
      }
    }));
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    const isValid = confirmPassword === formData.password;

    setValidationStates(prev => ({
      ...prev,
      confirmPassword: {
        isValidating: false,
        isValid,
        error: isValid ? null : 'Las contraseñas no coinciden',
        feedback: isValid ? 'Coinciden' : 'No coinciden'
      }
    }));
  };

  const validatePhone = (phoneNumber: string, countryCode: string) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // Validation based on country
    let isValid = false;
    let errorMessage = '';

    if (!cleanNumber) {
      errorMessage = 'Número de teléfono requerido';
    } else {
      // Country-specific validation
      switch (countryCode) {
        case 'CO': // Colombia
          isValid = /^3\d{9}$/.test(cleanNumber);
          errorMessage = isValid ? '' : 'Número móvil colombiano debe empezar con 3 y tener 10 dígitos';
          break;
        case 'US':
        case 'CA': // North America
          isValid = /^\d{10}$/.test(cleanNumber);
          errorMessage = isValid ? '' : 'Número debe tener 10 dígitos';
          break;
        case 'MX': // México
          isValid = /^\d{10}$/.test(cleanNumber);
          errorMessage = isValid ? '' : 'Número mexicano debe tener 10 dígitos';
          break;
        default:
          // Generic validation for other countries
          isValid = cleanNumber.length >= 7 && cleanNumber.length <= 15;
          errorMessage = isValid ? '' : 'Número debe tener entre 7 y 15 dígitos';
      }
    }

    setValidationStates(prev => ({
      ...prev,
      phone: {
        isValidating: false,
        isValid,
        error: isValid ? null : errorMessage
      }
    }));
  };

  const validateBirthDate = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear() -
                ((today.getMonth() < birth.getMonth() ||
                  (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) ? 1 : 0);

    if (age < 18) {
      setErrors(prev => ({ ...prev, birthDate: 'Debe ser mayor de 18 años' }));
    } else if (age > 120) {
      setErrors(prev => ({ ...prev, birthDate: 'Edad inválida' }));
    } else {
      setErrors(prev => ({ ...prev, birthDate: '' }));
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const requiredFieldsValid = [
      formData.fullName,
      formData.documentType,
      formData.documentNumber,
      phoneState.phoneNumber,
      formData.birthDate,
      formData.email,
      formData.password,
      formData.confirmPassword
    ].every(field => field.trim() !== '');

    const acceptancesValid = formData.acceptTerms && formData.acceptPrivacy;

    const validationsValid = Object.values(validationStates).every(
      state => state.isValid !== false
    );

    const noErrors = Object.values(errors).every(error => !error);

    return requiredFieldsValid && acceptancesValid && validationsValid && noErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      onError('Por favor completa todos los campos correctamente');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await SignupApiService.registerPatient(formData);

      if (response.success) {
        onSuccess(response);
      } else {
        onError(response.message || 'Error en el registro');
      }
    } catch (error) {
      onError('Error de conexión. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-testid="patient-signup-form">
      <PersonalInfoSection
        fullName={formData.fullName}
        documentType={formData.documentType}
        documentNumber={formData.documentNumber}
        birthDate={formData.birthDate}
        countryCode={phoneState.countryCode}
        phoneNumber={phoneState.phoneNumber}
        onInputChange={handleInputChange}
        onFieldBlur={handleFieldBlur}
        onCountryChange={handleCountryChange}
        documentTypes={documentTypes}
        validationStates={{
          fullName: validationStates.fullName,
          documentNumber: validationStates.documentNumber,
          phone: validationStates.phone
        }}
        errors={{
          documentType: errors.documentType,
          birthDate: errors.birthDate,
          phone: errors.phone
        }}
      />

      <AccountSection
        email={formData.email}
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        onInputChange={handleInputChange}
        onFieldBlur={handleFieldBlur}
        validationStates={{
          email: validationStates.email,
          password: validationStates.password,
          confirmPassword: validationStates.confirmPassword
        }}
      />

      {/* Legal Section - Enlaces al slice legal */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">Términos Legales</h3>
          <p className="text-sm text-gray-600">
            Acepta nuestros términos y condiciones para completar el registro.
          </p>
        </div>

        <div className="space-y-4">
          <CheckboxWithLink
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
            text="Acepto los"
            linkText="términos y condiciones"
            linkUrl="/terminos-y-condiciones"
            required
            data-testid="acceptTerms-checkbox"
            enableAcceptButton={true}
          />

          <CheckboxWithLink
            id="acceptPrivacy"
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
            text="Acepto la"
            linkText="política de privacidad"
            linkUrl="/politica-de-privacidad"
            required
            data-testid="acceptPrivacy-checkbox"
            enableAcceptButton={true}
          />
        </div>

        <div className="pt-6">
          <SubmitButton
            disabled={!isFormValid()}
            loading={isSubmitting}
            data-testid="submit-button"
          >
            Crear cuenta
          </SubmitButton>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
                data-testid="login-link"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};