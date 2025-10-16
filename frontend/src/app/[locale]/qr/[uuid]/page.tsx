/**
 * QR Code Landing Route
 * Public route that QR codes point to: /qr/[uuid]
 * Handles smart authentication routing for emergency access
 */

import { QRLandingPage } from '@/slices/emergency_access/components/organisms/QRLandingPage';

interface QRCodePageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function QRCodePage({ params }: QRCodePageProps) {
  const { uuid } = await params;

  return <QRLandingPage qrCode={uuid} />;
}
