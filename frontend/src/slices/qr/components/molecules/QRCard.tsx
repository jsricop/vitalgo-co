/**
 * QR Card Molecule Component
 * Displays QR code with metadata and actions
 */
import { QRCodeImage } from '../atoms/QRCodeImage';
import { DownloadButton } from '../atoms/DownloadButton';
import { EmergencyBadge } from '../atoms/EmergencyBadge';
import { QRData } from '../../types';

interface QRCardProps {
  qrData?: QRData;
  isLoading?: boolean;
  onDownload: () => void;
  'data-testid'?: string;
}

export function QRCard({
  qrData,
  isLoading = false,
  onDownload,
  'data-testid': testId
}: QRCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto"
      data-testid={testId}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mi Código QR</h2>
        <EmergencyBadge />
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <QRCodeImage
          qrImageBase64={qrData?.qrImageBase64}
          emergencyUrl={qrData?.emergencyUrl}
          size="lg"
          isLoading={isLoading}
          data-testid="qr-code-image"
        />
      </div>

      {/* Emergency URL */}
      {qrData?.emergencyUrl && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">URL de emergencia:</p>
          <p className="text-xs text-gray-500 break-all font-mono">
            {qrData.emergencyUrl}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center">
        <DownloadButton
          onClick={onDownload}
          disabled={(!qrData?.qrImageBase64 && !qrData?.emergencyUrl) || isLoading}
          data-testid="download-qr-button"
        />
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>🚨 Mantén este QR código accesible para emergencias médicas</p>
      </div>
    </div>
  );
}