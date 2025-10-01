/**
 * QR Code Image Atom Component
 * Displays QR code using QRCodeCanvas with fallback and loading states
 */
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeImageProps {
  qrImageBase64?: string;
  emergencyUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  'data-testid'?: string;
}

export function QRCodeImage({
  qrImageBase64,
  emergencyUrl,
  size = 'md',
  isLoading = false,
  'data-testid': testId
}: QRCodeImageProps) {
  const sizeMap = {
    sm: 128,
    md: 192,
    lg: 256
  };

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  if (isLoading) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gray-100 rounded-lg flex items-center justify-center`}
        data-testid={testId}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vitalgo-green"></div>
      </div>
    );
  }

  if (!emergencyUrl && !qrImageBase64) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300`}
        data-testid={testId}
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">📱</div>
          <p className="text-sm">QR no generado</p>
        </div>
      </div>
    );
  }

  // Prefer emergencyUrl (new implementation) over qrImageBase64 (legacy)
  if (emergencyUrl) {
    return (
      <div
        className={`${sizeClasses[size]} bg-white p-4 rounded-lg flex items-center justify-center`}
        data-testid={testId}
      >
        <QRCodeCanvas
          value={emergencyUrl}
          size={sizeMap[size]}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: '/assets/images/logos/QR_Logo.png',
            height: sizeMap[size] * 0.2,
            width: sizeMap[size] * 0.2,
            excavate: true
          }}
        />
      </div>
    );
  }

  // Legacy base64 support
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center`}
      data-testid={testId}
    >
      <img
        src={`data:image/png;base64,${qrImageBase64}`}
        alt="Código QR de VitalGo"
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
}