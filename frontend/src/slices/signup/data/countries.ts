/**
 * Country data with flag emojis for phone number input
 * Focused on Latin American countries and common international ones
 */

export interface Country {
  code: string;        // ISO 3166-1 alpha-2 country code
  name: string;        // Full country name
  dialCode: string;    // International dialing code
  flag: string;        // Flag emoji
  phoneFormat?: string; // Visual format pattern (# = digit)
  maxLength?: number;   // Maximum phone number length
}

export const countries: Country[] = [
  // Latin America (priority countries)
  {
    code: "CO",
    name: "Colombia",
    dialCode: "+57",
    flag: "🇨🇴",
    phoneFormat: "### ### ####",
    maxLength: 10
  },
  {
    code: "MX",
    name: "México",
    dialCode: "+52",
    flag: "🇲🇽",
    phoneFormat: "## #### ####",
    maxLength: 10
  },
  {
    code: "AR",
    name: "Argentina",
    dialCode: "+54",
    flag: "🇦🇷",
    phoneFormat: "## #### ####",
    maxLength: 10
  },
  {
    code: "PE",
    name: "Perú",
    dialCode: "+51",
    flag: "🇵🇪",
    phoneFormat: "### ### ###",
    maxLength: 9
  },
  {
    code: "CL",
    name: "Chile",
    dialCode: "+56",
    flag: "🇨🇱",
    phoneFormat: "# #### ####",
    maxLength: 9
  },
  {
    code: "EC",
    name: "Ecuador",
    dialCode: "+593",
    flag: "🇪🇨",
    phoneFormat: "## ### ####",
    maxLength: 9
  },
  {
    code: "VE",
    name: "Venezuela",
    dialCode: "+58",
    flag: "🇻🇪",
    phoneFormat: "### ### ####",
    maxLength: 10
  },
  {
    code: "BO",
    name: "Bolivia",
    dialCode: "+591",
    flag: "🇧🇴",
    phoneFormat: "# ### ####",
    maxLength: 8
  },
  {
    code: "PY",
    name: "Paraguay",
    dialCode: "+595",
    flag: "🇵🇾",
    phoneFormat: "### ### ###",
    maxLength: 9
  },
  {
    code: "UY",
    name: "Uruguay",
    dialCode: "+598",
    flag: "🇺🇾",
    phoneFormat: "## ### ###",
    maxLength: 8
  },
  {
    code: "PA",
    name: "Panamá",
    dialCode: "+507",
    flag: "🇵🇦",
    phoneFormat: "#### ####",
    maxLength: 8
  },
  {
    code: "CR",
    name: "Costa Rica",
    dialCode: "+506",
    flag: "🇨🇷",
    phoneFormat: "#### ####",
    maxLength: 8
  },
  {
    code: "NI",
    name: "Nicaragua",
    dialCode: "+505",
    flag: "🇳🇮",
    phoneFormat: "#### ####",
    maxLength: 8
  },
  {
    code: "HN",
    name: "Honduras",
    dialCode: "+504",
    flag: "🇭🇳",
    phoneFormat: "#### ####",
    maxLength: 8
  },
  {
    code: "SV",
    name: "El Salvador",
    dialCode: "+503",
    flag: "🇸🇻",
    phoneFormat: "#### ####",
    maxLength: 8
  },
  {
    code: "GT",
    name: "Guatemala",
    dialCode: "+502",
    flag: "🇬🇹",
    phoneFormat: "#### ####",
    maxLength: 8
  },
  {
    code: "BZ",
    name: "Belice",
    dialCode: "+501",
    flag: "🇧🇿",
    phoneFormat: "### ####",
    maxLength: 7
  },
  {
    code: "DO",
    name: "República Dominicana",
    dialCode: "+1",
    flag: "🇩🇴",
    phoneFormat: "(###) ###-####",
    maxLength: 10
  },
  {
    code: "CU",
    name: "Cuba",
    dialCode: "+53",
    flag: "🇨🇺",
    phoneFormat: "#### ####",
    maxLength: 8
  },
  {
    code: "PR",
    name: "Puerto Rico",
    dialCode: "+1",
    flag: "🇵🇷",
    phoneFormat: "(###) ###-####",
    maxLength: 10
  },

  // North America
  {
    code: "US",
    name: "Estados Unidos",
    dialCode: "+1",
    flag: "🇺🇸",
    phoneFormat: "(###) ###-####",
    maxLength: 10
  },
  {
    code: "CA",
    name: "Canadá",
    dialCode: "+1",
    flag: "🇨🇦",
    phoneFormat: "(###) ###-####",
    maxLength: 10
  },

  // Europe (common)
  {
    code: "ES",
    name: "España",
    dialCode: "+34",
    flag: "🇪🇸",
    phoneFormat: "### ### ###",
    maxLength: 9
  },
  {
    code: "FR",
    name: "Francia",
    dialCode: "+33",
    flag: "🇫🇷",
    phoneFormat: "## ## ## ## ##",
    maxLength: 10
  },
  {
    code: "IT",
    name: "Italia",
    dialCode: "+39",
    flag: "🇮🇹",
    phoneFormat: "### ### ####",
    maxLength: 10
  },
  {
    code: "DE",
    name: "Alemania",
    dialCode: "+49",
    flag: "🇩🇪",
    phoneFormat: "#### #######",
    maxLength: 11
  },
  {
    code: "GB",
    name: "Reino Unido",
    dialCode: "+44",
    flag: "🇬🇧",
    phoneFormat: "#### ### ####",
    maxLength: 10
  },

  // Asia (common)
  {
    code: "JP",
    name: "Japón",
    dialCode: "+81",
    flag: "🇯🇵",
    phoneFormat: "##-####-####",
    maxLength: 10
  },
  {
    code: "CN",
    name: "China",
    dialCode: "+86",
    flag: "🇨🇳",
    phoneFormat: "### #### ####",
    maxLength: 11
  },
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    phoneFormat: "##### #####",
    maxLength: 10
  },
  {
    code: "KR",
    name: "Corea del Sur",
    dialCode: "+82",
    flag: "🇰🇷",
    phoneFormat: "##-####-####",
    maxLength: 10
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countries.find(country => country.dialCode === dialCode);
};

export const getDefaultCountry = (): Country => {
  return countries[0]; // Colombia as default
};

export const searchCountries = (searchTerm: string): Country[] => {
  const term = searchTerm.toLowerCase();
  return countries.filter(country =>
    country.name.toLowerCase().includes(term) ||
    country.dialCode.includes(term) ||
    country.code.toLowerCase().includes(term)
  );
};