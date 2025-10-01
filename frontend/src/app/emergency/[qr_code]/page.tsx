/**
 * Emergency Access Page Route
 * Dynamic route for paramedic emergency access: /emergency/[qr_code]
 * Protected by ParamedicAuthGuard - requires user_type='paramedic'
 */

import { ParamedicAuthGuard } from '@/slices/emergency_access/components/atoms/ParamedicAuthGuard';
import { EmergencyAccessPage } from '@/slices/emergency_access/components/organisms/EmergencyAccessPage';

interface EmergencyPageProps {
  params: {
    qr_code: string;
  };
}

export default function EmergencyPage({ params }: EmergencyPageProps) {
  return (
    <ParamedicAuthGuard>
      <EmergencyAccessPage qrCode={params.qr_code} />
    </ParamedicAuthGuard>
  );
}
