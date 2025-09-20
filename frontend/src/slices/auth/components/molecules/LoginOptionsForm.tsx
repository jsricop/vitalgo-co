/**
 * Login Options Form molecule component
 * Combines remember me checkbox and forgot password link
 */
import React from 'react';
import { RememberMeCheckbox } from '../atoms/RememberMeCheckbox';
// TODO: Temporarily commented out until forgot password page is implemented
// import { ForgotPasswordLink } from '../atoms/ForgotPasswordLink';

interface LoginOptionsFormProps {
  rememberMe: boolean;
  onRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

export const LoginOptionsForm: React.FC<LoginOptionsFormProps> = ({
  rememberMe,
  onRememberMeChange,
  disabled = false,
  'data-testid': testId
}) => {
  return (
    <div className="flex items-center justify-between" data-testid={testId}>
      <RememberMeCheckbox
        id="rememberMe"
        name="rememberMe"
        checked={rememberMe}
        onChange={onRememberMeChange}
        disabled={disabled}
        data-testid="remember-me-checkbox"
      />

      {/* TODO: Temporarily commented out until forgot password page is implemented */}
      {/* <ForgotPasswordLink
        disabled={disabled}
        data-testid="forgot-password-link"
      /> */}
    </div>
  );
};