/**
 * Personal Info Section molecule component
 */
import React from 'react';
import { TextInput } from '../atoms/TextInput';
import { DocumentTypeSelect } from '../atoms/DocumentTypeSelect';
import { DateInput } from '../atoms/DateInput';
import { DocumentType, FieldValidationState } from '../../types';

interface PersonalInfoSectionProps {
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  phoneInternational: string;
  onInputChange: (field: string, value: string) => void;
  onFieldBlur: (field: string) => void;
  documentTypes: DocumentType[];
  validationStates: {
    fullName?: FieldValidationState;
    documentNumber?: FieldValidationState;
    phoneInternational?: FieldValidationState;
  };
  errors: {
    documentType?: string;
    birthDate?: string;
  };
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  fullName,
  documentType,
  documentNumber,
  birthDate,
  phoneInternational,
  onInputChange,
  onFieldBlur,
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

        <TextInput
          id="phoneInternational"
          name="phoneInternational"
          label="Teléfono"
          placeholder="Ej: +57 300 123 4567"
          value={phoneInternational}
          onChange={(e) => onInputChange('phoneInternational', e.target.value)}
          onBlur={() => onFieldBlur('phoneInternational')}
          validation={validationStates.phoneInternational}
          required
          maxLength={20}
          data-testid="phone-input"
        />

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