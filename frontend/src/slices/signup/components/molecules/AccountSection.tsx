'use client';
/**
 * Account Section molecule component
 */
import React from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('signup.accountInfo');

  return (
    <div className="space-y-6" data-testid="account-section">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">{t('title')}</h3>
        <p className="text-sm text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        <TextInput
          id="email"
          name="email"
          type="email"
          label={t('fields.email.label')}
          placeholder={t('fields.email.placeholder')}
          value={email}
          onChange={(e) => onInputChange('email', e.target.value)}
          onBlur={() => onFieldBlur('email')}
          validation={validationStates.email}
          required
          maxLength={255}
          autocomplete="email"
          data-testid="email-input"
        />

        <PasswordInput
          id="password"
          name="password"
          label={t('fields.password.label')}
          placeholder={t('fields.password.placeholder')}
          value={password}
          onChange={(e) => onInputChange('password', e.target.value)}
          onBlur={() => onFieldBlur('password')}
          showStrengthIndicator
          required
          autocomplete="new-password"
          data-testid="password-input"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label={t('fields.confirmPassword.label')}
          placeholder={t('fields.confirmPassword.placeholder')}
          value={confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          onBlur={() => onFieldBlur('confirmPassword')}
          required
          autocomplete="new-password"
          data-testid="confirmPassword-input"
        />

        {validationStates.confirmPassword?.feedback && confirmPassword && (
          <p
            className={`text-sm ${
              validationStates.confirmPassword.isValid ? 'text-green-600' : 'text-red-600'
            }`}
            data-testid="confirmPassword-feedback"
          >
            {validationStates.confirmPassword.feedback}
          </p>
        )}

        {validationStates.confirmPassword?.error && !validationStates.confirmPassword?.feedback && (
          <p className="text-sm text-red-600" data-testid="confirmPassword-error">
            {validationStates.confirmPassword.error}
          </p>
        )}
      </div>
    </div>
  );
};