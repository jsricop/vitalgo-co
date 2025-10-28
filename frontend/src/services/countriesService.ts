/**
 * Countries API Service
 * Fetches country data from the backend API
 */

export interface Country {
  id: number;
  name: string;
  code: string;
  flag_emoji: string | null;
  phone_code: string;
  is_active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch all active countries from the API
 * Countries are returned ordered by ID (Colombia first, then by proximity)
 */
export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${API_URL}/api/countries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cache countries data as it rarely changes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }

    const countries: Country[] = await response.json();
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
}

/**
 * Fetch a specific country by its ISO code
 */
export async function fetchCountryByCode(code: string): Promise<Country | null> {
  try {
    const response = await fetch(`${API_URL}/api/countries/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch country: ${response.statusText}`);
    }

    const country: Country = await response.json();
    return country;
  } catch (error) {
    console.error(`Error fetching country with code ${code}:`, error);
    throw error;
  }
}

/**
 * Convert API country to the format expected by PhoneInputGroup
 */
export function countryToPhoneInputFormat(country: Country) {
  return {
    code: country.code,
    name: country.name,
    dialCode: country.phone_code,
    flag: country.flag_emoji || '',
  };
}
