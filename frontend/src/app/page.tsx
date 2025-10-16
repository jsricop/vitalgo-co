import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * Root Page Redirect Handler
 *
 * Handles users who navigate to the root URL without a locale prefix.
 * Redirects them to the appropriate locale (/es or /en) based on:
 * 1. Their stored language preference (cookie)
 * 2. Default locale (Spanish) if no preference
 *
 * This is necessary because we use 'always' locale prefix strategy,
 * meaning all URLs must have either /es or /en prefix.
 */
export default async function RootPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';

  // Redirect to the appropriate locale
  redirect(`/${locale}`);
}
