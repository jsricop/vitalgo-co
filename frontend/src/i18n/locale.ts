'use server';

import { cookies } from 'next/headers';
import { Locale } from './request';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return (cookieStore.get(COOKIE_NAME)?.value as Locale) || 'es';
}

export async function setUserLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 31536000 // 1 year
  });
}
