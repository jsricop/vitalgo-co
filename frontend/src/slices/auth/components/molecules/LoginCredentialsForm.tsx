/**
 * Login Credentials Form molecule component
 * Combines email and password inputs for authentication
 */
import React from 'react';
import { LoginEmailInput } from '../atoms/LoginEmailInput';
import { LoginPasswordInput } from '../atoms/LoginPasswordInput';
import { FieldValidationState } from '../../../signup/types';

interface LoginCredentialsFormProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onPasswordBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  emailValidation?: FieldValidationState;
  passwordError?: string;
  disabled?: boolean;
  'data-testid'?: string;
}

export const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onEmailBlur,
  onPasswordBlur,
  emailValidation,
  passwordError,
  disabled = false,
  'data-testid': testId
}) => {
  return (
    <div className="space-y-4" data-testid={testId}>
      <LoginEmailInput
        id="email"
        name="email"
        value={email}
        onChange={onEmailChange}
        onBlur={onEmailBlur}
        validation={emailValidation}
        disabled={disabled}
        data-testid="login-email-input"
      />

      <LoginPasswordInput
        id="password"
        name="password"
        value={password}
        onChange={onPasswordChange}
        onBlur={onPasswordBlur}
        error={passwordError}
        disabled={disabled}
        data-testid="login-password-input"
      />
    </div>
  );
};