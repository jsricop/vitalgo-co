/**
 * QR Page Component
 * Main page for authenticated patients to view and download their QR code
 */
'use client';

import { useEffect } from 'react';
import { QRCard } from '../molecules/QRCard';
import { useQRGeneration } from '../../hooks/useQRGeneration';
import { PatientNavbar } from '@/shared/components/organisms/PatientNavbar';
import { MinimalFooter } from '@/shared/components/organisms/MinimalFooter';

interface QRPageProps {
  'data-testid'?: string;
}

export function QRPage({ 'data-testid': testId }: QRPageProps) {
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar QR</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-vitalgo-green text-white px-6 py-3 rounded-md hover:bg-vitalgo-green/90 transition-colors"
                >
                  Reintentar
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

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Código QR</h1>
            <p className="text-gray-600">
              Tu código QR personal para acceso de emergencia médica
            </p>
          </div>

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
              ¿Cómo funciona tu código QR?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-900 mb-2">Escanea</h3>
                <p className="text-sm text-gray-600">
                  Personal médico puede escanear tu QR con cualquier dispositivo
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🏥</div>
                <h3 className="font-semibold text-gray-900 mb-2">Acceso Inmediato</h3>
                <p className="text-sm text-gray-600">
                  Obtienen acceso instantáneo a tu información médica crítica
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🚨</div>
                <h3 className="font-semibold text-gray-900 mb-2">Emergencias</h3>
                <p className="text-sm text-gray-600">
                  Información vital: alergias, medicamentos, contactos de emergencia
                </p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-500 text-xl mr-3">🔒</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Información Segura</h3>
                <p className="text-sm text-blue-700">
                  Tu QR código solo muestra información médica esencial para emergencias.
                  Los datos personales sensibles están protegidos.
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