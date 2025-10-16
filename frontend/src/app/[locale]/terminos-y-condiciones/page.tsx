/**
 * Next.js App Router page for /terminos-y-condiciones
 */
import TermsPage from '@/slices/legal/components/pages/TermsPage';

export default function Page() {
  return <TermsPage />;
}

export const metadata = {
  title: 'Términos y Condiciones | VitalGo',
  description: 'Términos y condiciones de uso de la plataforma VitalGo',
};