import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LanguageProvider } from '@/shared/contexts/LanguageContext';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { Locale } from '@/i18n/request';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params before accessing properties (Next.js 15 requirement)
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LanguageProvider initialLocale={locale as Locale}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LanguageProvider>
    </NextIntlClientProvider>
  );
}
