/**
 * Country data for birthplace selection in Personal Information
 * Simplified from signup countries data, focused on Latin American countries
 */

export interface CountryOption {
  value: string;  // ISO 3166-1 alpha-2 country code
  label: string;  // Full country name in Spanish
  flag: string;   // Flag emoji
}

export const birthplaceCountries: CountryOption[] = [
  // Latin America (priority countries)
  {
    value: "CO",
    label: "Colombia",
    flag: "🇨🇴"
  },
  {
    value: "MX",
    label: "México",
    flag: "🇲🇽"
  },
  {
    value: "AR",
    label: "Argentina",
    flag: "🇦🇷"
  },
  {
    value: "PE",
    label: "Perú",
    flag: "🇵🇪"
  },
  {
    value: "CL",
    label: "Chile",
    flag: "🇨🇱"
  },
  {
    value: "EC",
    label: "Ecuador",
    flag: "🇪🇨"
  },
  {
    value: "VE",
    label: "Venezuela",
    flag: "🇻🇪"
  },
  {
    value: "BO",
    label: "Bolivia",
    flag: "🇧🇴"
  },
  {
    value: "PY",
    label: "Paraguay",
    flag: "🇵🇾"
  },
  {
    value: "UY",
    label: "Uruguay",
    flag: "🇺🇾"
  },
  {
    value: "PA",
    label: "Panamá",
    flag: "🇵🇦"
  },
  {
    value: "CR",
    label: "Costa Rica",
    flag: "🇨🇷"
  },
  {
    value: "NI",
    label: "Nicaragua",
    flag: "🇳🇮"
  },
  {
    value: "HN",
    label: "Honduras",
    flag: "🇭🇳"
  },
  {
    value: "SV",
    label: "El Salvador",
    flag: "🇸🇻"
  },
  {
    value: "GT",
    label: "Guatemala",
    flag: "🇬🇹"
  },
  {
    value: "BZ",
    label: "Belice",
    flag: "🇧🇿"
  },
  {
    value: "DO",
    label: "República Dominicana",
    flag: "🇩🇴"
  },
  {
    value: "CU",
    label: "Cuba",
    flag: "🇨🇺"
  },
  {
    value: "PR",
    label: "Puerto Rico",
    flag: "🇵🇷"
  },

  // North America
  {
    value: "US",
    label: "Estados Unidos",
    flag: "🇺🇸"
  },
  {
    value: "CA",
    label: "Canadá",
    flag: "🇨🇦"
  },

  // Europe (common)
  {
    value: "ES",
    label: "España",
    flag: "🇪🇸"
  },
  {
    value: "FR",
    label: "Francia",
    flag: "🇫🇷"
  },
  {
    value: "IT",
    label: "Italia",
    flag: "🇮🇹"
  },
  {
    value: "DE",
    label: "Alemania",
    flag: "🇩🇪"
  },
  {
    value: "GB",
    label: "Reino Unido",
    flag: "🇬🇧"
  },

  // Asia (common)
  {
    value: "JP",
    label: "Japón",
    flag: "🇯🇵"
  },
  {
    value: "CN",
    label: "China",
    flag: "🇨🇳"
  },
  {
    value: "IN",
    label: "India",
    flag: "🇮🇳"
  },
  {
    value: "KR",
    label: "Corea del Sur",
    flag: "🇰🇷"
  }
];

export const getCountryByCode = (code: string): CountryOption | undefined => {
  return birthplaceCountries.find(country => country.value === code);
};

export const getDefaultCountry = (): CountryOption => {
  return birthplaceCountries[0]; // Colombia as default
};

export const searchCountries = (searchTerm: string): CountryOption[] => {
  const term = searchTerm.toLowerCase();
  return birthplaceCountries.filter(country =>
    country.label.toLowerCase().includes(term) ||
    country.value.toLowerCase().includes(term)
  );
};

// Residence countries - same as birthplace countries for now
export const residenceCountries: CountryOption[] = birthplaceCountries;