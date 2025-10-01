/**
 * Hook for QR code generation and management
 */
import { useState, useCallback } from 'react';
import { QRData } from '../types';
import { qrService } from '../services/qrService';

interface UseQRGenerationReturn {
  qrData: QRData | null;
  isLoading: boolean;
  error: string | null;
  generateQR: () => Promise<void>;
  downloadQR: () => void;
  clearError: () => void;
}

export function useQRGeneration(): UseQRGenerationReturn {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQR = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await qrService.generateQRCode();
      setQrData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating QR code');
      console.error('QR generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadQR = useCallback(() => {
    if (qrData?.emergencyUrl) {
      // Generate QR from canvas element (created by QRCodeCanvas component)
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL();
        const link = document.createElement('a');
        link.download = 'vitalgo-qr.png';
        link.href = url;
        link.click();
      }
    }
  }, [qrData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    qrData,
    isLoading,
    error,
    generateQR,
    downloadQR,
    clearError,
  };
}