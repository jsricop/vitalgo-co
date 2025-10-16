/**
 * Next.js App Router page for /politica-de-privacidad
 */
import PrivacyPage from '@/slices/legal/components/pages/PrivacyPage';

export default function Page() {
  return <PrivacyPage />;
}

export const metadata = {
  title: 'Política de Privacidad | VitalGo',
  description: 'Política de privacidad y protección de datos de VitalGo',
};