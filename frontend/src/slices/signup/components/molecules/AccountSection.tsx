/**
 * Account Section molecule component
 */
import React from 'react';
import { TextInput } from '../atoms/TextInput';
import { PasswordInput } from '../atoms/PasswordInput';
import { FieldValidationState } from '../../types';

interface AccountSectionProps {
  email: string;
  password: string;
  confirmPassword: string;
  onInputChange: (field: string, value: string) => void;
  onFieldBlur: (field: string) => void;
  validationStates: {
    email?: FieldValidationState;
    password?: FieldValidationState;
    confirmPassword?: FieldValidationState;
  };
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  email,
  password,
  confirmPassword,
  onInputChange,
  onFieldBlur,
  validationStates
}) => {
  return (
    <div className="space-y-6" data-testid="account-section">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Información de la Cuenta</h3>
        <p className="text-sm text-gray-600">
          Configura tu email y contraseña para acceder a la plataforma.
        </p>
      </div>

      <div className="space-y-6">
        <TextInput
          id="email"
          name="email"
          label="Correo electrónico"
          placeholder="Ej: juan.perez@email.com"
          value={email}
          onChange={(e) => onInputChange('email', e.target.value)}
          onBlur={() => onFieldBlur('email')}
          validation={validationStates.email}
          required
          maxLength={255}
          data-testid="email-input"
        />

        <PasswordInput
          id="password"
          name="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => onInputChange('password', e.target.value)}
          onBlur={() => onFieldBlur('password')}
          showStrengthIndicator
          required
          data-testid="password-input"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          onBlur={() => onFieldBlur('confirmPassword')}
          required
          data-testid="confirmPassword-input"
        />

        {validationStates.confirmPassword?.error && (
          <p className="text-sm text-red-600" data-testid="confirmPassword-error">
            {validationStates.confirmPassword.error}
          </p>
        )}
      </div>
    </div>
  );
};