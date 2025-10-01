/**
 * Emergency QR Access Page - Public route for emergency medical access
 */
import { EmergencyAccessPage } from '@/slices/qr/components/pages/EmergencyAccessPage';

interface EmergencyQRPageProps {
  params: {
    uuid: string;
  };
}

export default function EmergencyQRPageRoute({ params }: EmergencyQRPageProps) {
  return (
    <EmergencyAccessPage
      qrUuid={params.uuid}
      data-testid="emergency-qr-page"
    />
  );
}