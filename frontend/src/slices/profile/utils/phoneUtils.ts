/**
 * Phone utility functions for profile management
 * Handles splitting and combining phone data between phoneInternational and separated fields
 */
import { getCountryByCode, countries } from '../../signup/data/countries';

/**
 * Split international phone number into country code and phone number
 * NEW: Database-first approach - prioritizes stored country_code over dial code parsing
 */
export function splitPhoneInternational(
  phoneInternational: string,
  databaseCountryCode?: string,
  trustDatabaseCountryCode: boolean = false
): {
  countryCode: string;
  phoneNumber: string;
} {
  // Handle empty phone
  if (!phoneInternational) {
    return {
      countryCode: databaseCountryCode || 'CO',
      phoneNumber: ''
    };
  }

  // STRATEGY 1: Trust database country_code (PREFERRED - fixes the modal issues!)
  if (trustDatabaseCountryCode && databaseCountryCode) {
    const country = getCountryByCode(databaseCountryCode);
    if (country) {
      console.log('🎯 Using database country_code:', databaseCountryCode);

      // Extract phone number using the known country's dial code
      const phoneNumber = extractPhoneNumberForCountry(phoneInternational, country);
      return {
        countryCode: databaseCountryCode,
        phoneNumber
      };
    }
  }

  // STRATEGY 2: Parse dial code (FALLBACK - legacy behavior)
  console.log('⚠️ Falling back to dial code parsing');

  // Remove any non-digit characters for processing
  const digitsOnly = phoneInternational.replace(/\D/g, '');

  // Try to find matching country by dial code
  // Sort countries by dial code length (longest first) to match properly
  const sortedCountries = [...countries]
    .sort((a, b) => b.dialCode.replace(/\D/g, '').length - a.dialCode.replace(/\D/g, '').length);

  for (const country of sortedCountries) {
    const countryDigits = country.dialCode.replace(/\D/g, '');
    if (digitsOnly.startsWith(countryDigits)) {
      return {
        countryCode: country.code,
        phoneNumber: digitsOnly.substring(countryDigits.length)
      };
    }
  }

  // Fallback: assume it's the fallback country
  const fallbackCountry = getCountryByCode(databaseCountryCode || 'CO');
  if (fallbackCountry) {
    const countryDigits = fallbackCountry.dialCode.replace(/\D/g, '');
    if (digitsOnly.startsWith(countryDigits)) {
      return {
        countryCode: fallbackCountry.code,
        phoneNumber: digitsOnly.substring(countryDigits.length)
      };
    }
  }

  // Last resort: return as-is with fallback country
  return {
    countryCode: databaseCountryCode || 'CO',
    phoneNumber: digitsOnly
  };
}

/**
 * Extract phone number for a specific country
 * Handles dial code removal correctly
 */
function extractPhoneNumberForCountry(phoneInternational: string, country: any): string {
  const cleanedPhone = phoneInternational.replace(/\D/g, '');
  const dialCodeDigits = country.dialCode.replace(/\D/g, '');

  // If phone starts with the country's dial code, remove it
  if (cleanedPhone.startsWith(dialCodeDigits)) {
    const phoneNumber = cleanedPhone.substring(dialCodeDigits.length);
    console.log('📞 Extracted phone:', { original: phoneInternational, dialCode: country.dialCode, extracted: phoneNumber });
    return phoneNumber;
  }

  // If it doesn't start with dial code, return the cleaned number as-is
  console.log('📞 Phone doesn\'t match dial code, returning as-is:', cleanedPhone);
  return cleanedPhone;
}

/**
 * Combine country code and phone number into international format
 */
export function combinePhoneInternational(countryCode: string, phoneNumber: string): string {
  if (!countryCode || !phoneNumber) {
    return '';
  }

  const country = getCountryByCode(countryCode);
  if (!country) {
    return phoneNumber;
  }

  // Remove any non-digit characters from phone number
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  return `${country.dialCode}${digitsOnly}`;
}

/**
 * Format phone number for display with flag and dial code
 */
export function formatPhoneDisplay(phoneInternational: string, countryCode: string): string {
  if (!phoneInternational) {
    return 'No disponible';
  }

  const country = getCountryByCode(countryCode);
  if (!country) {
    return phoneInternational;
  }

  const { phoneNumber } = splitPhoneInternational(phoneInternational, countryCode);

  return `${country.flag} ${country.dialCode} ${phoneNumber}`;
}

/**
 * Validate if phone number is complete for a given country
 */
export function isPhoneNumberComplete(countryCode: string, phoneNumber: string): boolean {
  if (!countryCode || !phoneNumber) {
    return false;
  }

  const country = getCountryByCode(countryCode);
  if (!country) {
    return false;
  }

  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check if it meets minimum requirements
  if (country.maxLength) {
    return digitsOnly.length >= Math.min(country.maxLength - 2, 7) &&
           digitsOnly.length <= country.maxLength;
  }

  // General validation: between 7 and 15 digits
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}