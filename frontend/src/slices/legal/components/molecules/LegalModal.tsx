'use client';
/**
 * Legal Modal molecule component - combines Modal with legal content
 */
import React from 'react';
import { Modal } from '../atoms/Modal';
import { TermsContent } from '../atoms/TermsContent';
import { PrivacyContent } from '../atoms/PrivacyContent';

export type LegalDocumentType = 'terms' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: LegalDocumentType;
  'data-testid'?: string;
  onAccept?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  documentType,
  'data-testid': testId = 'legal-modal',
  onAccept
}) => {
  const getTitle = () => {
    switch (documentType) {
      case 'terms':
        return 'Términos y Condiciones';
      case 'privacy':
        return 'Política de Privacidad';
      default:
        return 'Documento Legal';
    }
  };

  const getContent = () => {
    switch (documentType) {
      case 'terms':
        return <TermsContent />;
      case 'privacy':
        return <PrivacyContent />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      data-testid={testId}
      onAccept={onAccept}
    >
      {getContent()}
    </Modal>
  );
};