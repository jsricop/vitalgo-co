/**
 * QR Page - Authenticated route for patients to view their QR code
 */
import { AuthGuard } from '@/shared/components/guards/AuthGuard';
import { QRPage } from '@/slices/qr/components/pages/QRPage';

export default function QRPageRoute() {
  return (
    <AuthGuard>
      <QRPage data-testid="qr-page" />
    </AuthGuard>
  );
}