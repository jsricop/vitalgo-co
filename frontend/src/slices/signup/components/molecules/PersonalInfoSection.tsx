/**
 * Personal Info Section molecule component
 */
import React from 'react';
import { TextInput } from '../atoms/TextInput';
import { DocumentTypeSelect } from '../atoms/DocumentTypeSelect';
import { DateInput } from '../atoms/DateInput';
import { PhoneInputGroup } from './PhoneInputGroup';
import { DocumentType, FieldValidationState } from '../../types';
import { Country } from '../../data/countries';

interface PersonalInfoSectionProps {
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  // New phone fields
  countryCode: string;
  phoneNumber: string;
  onInputChange: (field: string, value: string) => void;
  onFieldBlur: (field: string) => void;
  onCountryChange: (country: Country) => void;
  documentTypes: DocumentType[];
  validationStates: {
    fullName?: FieldValidationState;
    documentNumber?: FieldValidationState;
    phone?: FieldValidationState;
  };
  errors: {
    documentType?: string;
    birthDate?: string;
    phone?: string;
  };
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  fullName,
  documentType,
  documentNumber,
  birthDate,
  countryCode,
  phoneNumber,
  onInputChange,
  onFieldBlur,
  onCountryChange,
  documentTypes,
  validationStates,
  errors
}) => {
  return (
    <div className="space-y-6" data-testid="personal-info-section">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
        <p className="text-sm text-gray-600">
          Ingresa tu información personal básica para crear tu cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <TextInput
            id="fullName"
            name="fullName"
            label="Nombre completo"
            placeholder="Ej: Juan Carlos Pérez García"
            value={fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            onBlur={() => onFieldBlur('fullName')}
            validation={validationStates.fullName}
            required
            maxLength={100}
            data-testid="fullName-input"
          />
        </div>

        <DocumentTypeSelect
          id="documentType"
          name="documentType"
          label="Tipo de documento"
          value={documentType}
          onChange={(e) => onInputChange('documentType', e.target.value)}
          onBlur={() => onFieldBlur('documentType')}
          documentTypes={documentTypes}
          required
          data-testid="documentType-select"
        />

        <TextInput
          id="documentNumber"
          name="documentNumber"
          label="Número de documento"
          placeholder="Ej: 12345678"
          value={documentNumber}
          onChange={(e) => onInputChange('documentNumber', e.target.value)}
          onBlur={() => onFieldBlur('documentNumber')}
          validation={validationStates.documentNumber}
          required
          maxLength={20}
          data-testid="documentNumber-input"
        />

        <div className="md:col-span-2">
          <PhoneInputGroup
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onCountryChange={onCountryChange}
            onPhoneChange={(value) => onInputChange('phoneNumber', value)}
            onPhoneBlur={() => onFieldBlur('phone')}
            validation={validationStates.phone}
            error={errors.phone}
            data-testid="phone-input-group"
          />
        </div>

        <DateInput
          id="birthDate"
          name="birthDate"
          label="Fecha de nacimiento"
          value={birthDate}
          onChange={(e) => onInputChange('birthDate', e.target.value)}
          onBlur={() => onFieldBlur('birthDate')}
          error={errors.birthDate}
          required
          data-testid="birthDate-input"
        />
      </div>

      {errors.documentType && (
        <p className="text-sm text-red-600" data-testid="documentType-error">
          {errors.documentType}
        </p>
      )}
    </div>
  );
};