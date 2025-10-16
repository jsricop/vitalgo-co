'use client';

import React from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { useTranslations } from 'next-intl';
import { Locale } from '@/i18n/request';

export function LanguageSelector() {
  const { locale, setLocale, isChanging } = useLanguage();
  const t = useTranslations('language');

  const handleLanguageChange = async (newLocale: Locale) => {
    if (newLocale !== locale && !isChanging) {
      await setLocale(newLocale);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value as Locale)}
        disabled={isChanging}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t('selector')}
      >
        <option value="es">🇪🇸 {t('spanish')}</option>
        <option value="en">🇺🇸 {t('english')}</option>
      </select>
      {isChanging && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-md">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
}

// Compact version for mobile or tight spaces
export function LanguageSelectorCompact() {
  const { locale, setLocale, isChanging } = useLanguage();

  const handleLanguageChange = async (newLocale: Locale) => {
    if (newLocale !== locale && !isChanging) {
      await setLocale(newLocale);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => handleLanguageChange('es')}
        disabled={isChanging}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors flex items-center space-x-1.5 ${
          locale === 'es'
            ? 'bg-primary-600 text-white cursor-default'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Español"
        aria-current={locale === 'es' ? 'true' : 'false'}
      >
        <span className="text-base">🇪🇸</span>
        <span>ES</span>
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isChanging}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors flex items-center space-x-1.5 ${
          locale === 'en'
            ? 'bg-primary-600 text-white cursor-default'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="English"
        aria-current={locale === 'en' ? 'true' : 'false'}
      >
        <span className="text-base">🇺🇸</span>
        <span>EN</span>
      </button>
      {isChanging && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
}
