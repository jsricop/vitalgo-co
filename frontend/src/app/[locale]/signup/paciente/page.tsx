/**
 * Next.js App Router page for /signup/paciente
 */
import { getTranslations } from 'next-intl/server';
import PatientSignupPage from '@/slices/signup/components/pages/PatientSignupPage';

export default function Page() {
  return <PatientSignupPage />;
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'signup.page' });

  return {
    title: `${t('title')} | VitalGo`,
    description: t('subtitle')
  };
}