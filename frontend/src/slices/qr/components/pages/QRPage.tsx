/**
 * QR Page Component
 * Main page for authenticated patients to view and download their QR code
 */
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { QRCard } from '../molecules/QRCard';
import { useQRGeneration } from '../../hooks/useQRGeneration';
import { PatientNavbar } from '@/shared/components/organisms/PatientNavbar';
import { MinimalFooter } from '@/shared/components/organisms/MinimalFooter';

interface QRPageProps {
  'data-testid'?: string;
}

export function QRPage({ 'data-testid': testId }: QRPageProps) {
  const t = useTranslations('qr');
  const { qrData, isLoading, error, generateQR, downloadQR, clearError } = useQRGeneration();

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const handleRetry = () => {
    clearError();
    generateQR();
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" data-testid={testId}>
        <PatientNavbar />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('error.title')}</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-vitalgo-green text-white px-6 py-3 rounded-md hover:bg-vitalgo-green/90 transition-colors"
                >
                  {t('error.retry')}
                </button>
              </div>
            </div>
          </div>
        </main>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-testid={testId}>
      <PatientNavbar />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* QR Card */}
          <QRCard
            qrData={qrData || undefined}
            isLoading={isLoading}
            onDownload={downloadQR}
            data-testid="qr-card"
          />

          {/* Information Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('howItWorks.title')}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('howItWorks.scan.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('howItWorks.scan.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🏥</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('howItWorks.access.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('howItWorks.access.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🚨</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('howItWorks.emergency.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('howItWorks.emergency.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MinimalFooter />
    </div>
  );
}