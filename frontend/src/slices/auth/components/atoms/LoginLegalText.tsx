'use client';
/**
 * Login Legal Text atom component
 * Shows legal acceptance text with clickable links to terms and privacy modals
 */
import React, { useState } from 'react';
import { LegalModal, LegalDocumentType } from '../../../legal/components/molecules/LegalModal';

interface LoginLegalTextProps {
  'data-testid'?: string;
}

export const LoginLegalText: React.FC<LoginLegalTextProps> = ({
  'data-testid': testId
}) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  return (
    <>
      <div className="text-center mt-4" data-testid={testId}>
        <p className="text-xs text-gray-500">
          Al iniciar sesión, aceptas nuestros{' '}
          <button
            type="button"
            onClick={handleTermsClick}
            className="text-vitalgo-green hover:text-vitalgo-green/80 underline focus:outline-none focus:ring-2 focus:ring-vitalgo-green/20 rounded-sm"
            data-testid={`${testId}-terms-link`}
          >
            Términos y Condiciones
          </button>
          {' '}y{' '}
          <button
            type="button"
            onClick={handlePrivacyClick}
            className="text-vitalgo-green hover:text-vitalgo-green/80 underline focus:outline-none focus:ring-2 focus:ring-vitalgo-green/20 rounded-sm"
            data-testid={`${testId}-privacy-link`}
          >
            Política de Privacidad
          </button>
        </p>
      </div>

      {/* Terms Modal */}
      <LegalModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        documentType="terms"
        data-testid={`${testId}-terms-modal`}
      />

      {/* Privacy Modal */}
      <LegalModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        documentType="privacy"
        data-testid={`${testId}-privacy-modal`}
      />
    </>
  );
};