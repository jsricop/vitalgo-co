'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { setUserLocale } from '@/i18n/locale';
import { Locale } from '@/i18n/request';
import { apiClient } from '@/shared/services/apiClient';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Sync locale state with URL when initialLocale changes (after navigation)
  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  const setLocale = useCallback(async (newLocale: Locale) => {
    if (newLocale === locale || isChanging) return;

    try {
      setIsChanging(true);

      // 1. Update cookie (for SSR and immediate effect)
      await setUserLocale(newLocale);

      // 2. Update database for authenticated users (best effort)
      try {
        // Check if user is authenticated by checking localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
          await apiClient.put('/profile/language', {
            preferred_language: newLocale
          });
        }
      } catch (error) {
        // Silently fail database update - cookie is still set
        console.warn('Failed to update language in database:', error);
      }

      // 3. Update local state
      setLocaleState(newLocale);

      // 4. Navigate to update URL with new locale
      // Both locales now have prefixes: /es and /en
      // Simply construct the URL with the new locale prefix
      // pathname is localized without prefix (e.g., '/dashboard')
      const targetUrl = `/${newLocale}${pathname}`;
      window.location.href = targetUrl;
    } catch (error) {
      console.error('Failed to change language:', error);
      setIsChanging(false);
    }
  }, [locale, isChanging, router, pathname]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isChanging }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
