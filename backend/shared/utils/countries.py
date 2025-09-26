"""
Country utilities for VitalGo
Provides country code mappings, flag emojis, and display names for the signup and profile systems
"""

from typing import Dict, List, Optional

# Country code to name mapping (Spanish names for Colombia-focused app)
COUNTRY_MAPPING: Dict[str, str] = {
    'CO': 'Colombia',
    'US': 'Estados Unidos',
    'CA': 'Canadá',
    'MX': 'México',
    'AR': 'Argentina',
    'BR': 'Brasil',
    'CL': 'Chile',
    'PE': 'Perú',
    'EC': 'Ecuador',
    'VE': 'Venezuela',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivia',
    'CR': 'Costa Rica',
    'PA': 'Panamá',
    'GT': 'Guatemala',
    'HN': 'Honduras',
    'SV': 'El Salvador',
    'NI': 'Nicaragua',
    'CU': 'Cuba',
    'DO': 'República Dominicana',
    'ES': 'España',
    'FR': 'Francia',
    'DE': 'Alemania',
    'IT': 'Italia',
    'GB': 'Reino Unido',
    'NL': 'Países Bajos',
    'BE': 'Bélgica',
    'CH': 'Suiza',
    'AT': 'Austria',
    'PT': 'Portugal',
    'IE': 'Irlanda',
    'SE': 'Suecia',
    'NO': 'Noruega',
    'DK': 'Dinamarca',
    'FI': 'Finlandia',
    'IS': 'Islandia',
    'PL': 'Polonia',
    'CZ': 'República Checa',
    'SK': 'Eslovaquia',
    'HU': 'Hungría',
    'RO': 'Rumania',
    'BG': 'Bulgaria',
    'HR': 'Croacia',
    'SI': 'Eslovenia',
    'EE': 'Estonia',
    'LV': 'Letonia',
    'LT': 'Lituania',
    'JP': 'Japón',
    'KR': 'Corea del Sur',
    'CN': 'China',
    'IN': 'India',
    'AU': 'Australia',
    'NZ': 'Nueva Zelanda',
}

# Country flag emojis
COUNTRY_FLAGS: Dict[str, str] = {
    'CO': '🇨🇴',
    'US': '🇺🇸',
    'CA': '🇨🇦',
    'MX': '🇲🇽',
    'AR': '🇦🇷',
    'BR': '🇧🇷',
    'CL': '🇨🇱',
    'PE': '🇵🇪',
    'EC': '🇪🇨',
    'VE': '🇻🇪',
    'UY': '🇺🇾',
    'PY': '🇵🇾',
    'BO': '🇧🇴',
    'CR': '🇨🇷',
    'PA': '🇵🇦',
    'GT': '🇬🇹',
    'HN': '🇭🇳',
    'SV': '🇸🇻',
    'NI': '🇳🇮',
    'CU': '🇨🇺',
    'DO': '🇩🇴',
    'ES': '🇪🇸',
    'FR': '🇫🇷',
    'DE': '🇩🇪',
    'IT': '🇮🇹',
    'GB': '🇬🇧',
    'NL': '🇳🇱',
    'BE': '🇧🇪',
    'CH': '🇨🇭',
    'AT': '🇦🇹',
    'PT': '🇵🇹',
    'IE': '🇮🇪',
    'SE': '🇸🇪',
    'NO': '🇳🇴',
    'DK': '🇩🇰',
    'FI': '🇫🇮',
    'IS': '🇮🇸',
    'PL': '🇵🇱',
    'CZ': '🇨🇿',
    'SK': '🇸🇰',
    'HU': '🇭🇺',
    'RO': '🇷🇴',
    'BG': '🇧🇬',
    'HR': '🇭🇷',
    'SI': '🇸🇮',
    'EE': '🇪🇪',
    'LV': '🇱🇻',
    'LT': '🇱🇹',
    'JP': '🇯🇵',
    'KR': '🇰🇷',
    'CN': '🇨🇳',
    'IN': '🇮🇳',
    'AU': '🇦🇺',
    'NZ': '🇳🇿',
}

# Organized countries list for dropdowns (Colombia first, then Latin America, then others)
COUNTRIES_LIST: List[Dict[str, str]] = [
    # Colombia first (default)
    {'code': 'CO', 'name': 'Colombia', 'flag': '🇨🇴'},

    # Latin America
    {'code': 'AR', 'name': 'Argentina', 'flag': '🇦🇷'},
    {'code': 'BO', 'name': 'Bolivia', 'flag': '🇧🇴'},
    {'code': 'BR', 'name': 'Brasil', 'flag': '🇧🇷'},
    {'code': 'CL', 'name': 'Chile', 'flag': '🇨🇱'},
    {'code': 'CR', 'name': 'Costa Rica', 'flag': '🇨🇷'},
    {'code': 'CU', 'name': 'Cuba', 'flag': '🇨🇺'},
    {'code': 'DO', 'name': 'República Dominicana', 'flag': '🇩🇴'},
    {'code': 'EC', 'name': 'Ecuador', 'flag': '🇪🇨'},
    {'code': 'SV', 'name': 'El Salvador', 'flag': '🇸🇻'},
    {'code': 'GT', 'name': 'Guatemala', 'flag': '🇬🇹'},
    {'code': 'HN', 'name': 'Honduras', 'flag': '🇭🇳'},
    {'code': 'MX', 'name': 'México', 'flag': '🇲🇽'},
    {'code': 'NI', 'name': 'Nicaragua', 'flag': '🇳🇮'},
    {'code': 'PA', 'name': 'Panamá', 'flag': '🇵🇦'},
    {'code': 'PY', 'name': 'Paraguay', 'flag': '🇵🇾'},
    {'code': 'PE', 'name': 'Perú', 'flag': '🇵🇪'},
    {'code': 'UY', 'name': 'Uruguay', 'flag': '🇺🇾'},
    {'code': 'VE', 'name': 'Venezuela', 'flag': '🇻🇪'},

    # North America
    {'code': 'US', 'name': 'Estados Unidos', 'flag': '🇺🇸'},
    {'code': 'CA', 'name': 'Canadá', 'flag': '🇨🇦'},

    # Europe (alphabetical by Spanish name)
    {'code': 'AT', 'name': 'Austria', 'flag': '🇦🇹'},
    {'code': 'BE', 'name': 'Bélgica', 'flag': '🇧🇪'},
    {'code': 'BG', 'name': 'Bulgaria', 'flag': '🇧🇬'},
    {'code': 'HR', 'name': 'Croacia', 'flag': '🇭🇷'},
    {'code': 'DK', 'name': 'Dinamarca', 'flag': '🇩🇰'},
    {'code': 'SI', 'name': 'Eslovenia', 'flag': '🇸🇮'},
    {'code': 'SK', 'name': 'Eslovaquia', 'flag': '🇸🇰'},
    {'code': 'ES', 'name': 'España', 'flag': '🇪🇸'},
    {'code': 'EE', 'name': 'Estonia', 'flag': '🇪🇪'},
    {'code': 'FI', 'name': 'Finlandia', 'flag': '🇫🇮'},
    {'code': 'FR', 'name': 'Francia', 'flag': '🇫🇷'},
    {'code': 'DE', 'name': 'Alemania', 'flag': '🇩🇪'},
    {'code': 'HU', 'name': 'Hungría', 'flag': '🇭🇺'},
    {'code': 'IE', 'name': 'Irlanda', 'flag': '🇮🇪'},
    {'code': 'IS', 'name': 'Islandia', 'flag': '🇮🇸'},
    {'code': 'IT', 'name': 'Italia', 'flag': '🇮🇹'},
    {'code': 'LV', 'name': 'Letonia', 'flag': '🇱🇻'},
    {'code': 'LT', 'name': 'Lituania', 'flag': '🇱🇹'},
    {'code': 'NO', 'name': 'Noruega', 'flag': '🇳🇴'},
    {'code': 'NL', 'name': 'Países Bajos', 'flag': '🇳🇱'},
    {'code': 'PL', 'name': 'Polonia', 'flag': '🇵🇱'},
    {'code': 'PT', 'name': 'Portugal', 'flag': '🇵🇹'},
    {'code': 'GB', 'name': 'Reino Unido', 'flag': '🇬🇧'},
    {'code': 'CZ', 'name': 'República Checa', 'flag': '🇨🇿'},
    {'code': 'RO', 'name': 'Rumania', 'flag': '🇷🇴'},
    {'code': 'SE', 'name': 'Suecia', 'flag': '🇸🇪'},
    {'code': 'CH', 'name': 'Suiza', 'flag': '🇨🇭'},

    # Asia & Pacific
    {'code': 'AU', 'name': 'Australia', 'flag': '🇦🇺'},
    {'code': 'CN', 'name': 'China', 'flag': '🇨🇳'},
    {'code': 'KR', 'name': 'Corea del Sur', 'flag': '🇰🇷'},
    {'code': 'IN', 'name': 'India', 'flag': '🇮🇳'},
    {'code': 'JP', 'name': 'Japón', 'flag': '🇯🇵'},
    {'code': 'NZ', 'name': 'Nueva Zelanda', 'flag': '🇳🇿'},
]


def get_country_name(country_code: str) -> str:
    """Get country name from country code"""
    return COUNTRY_MAPPING.get(country_code.upper(), "País Desconocido")


def get_country_flag(country_code: str) -> str:
    """Get flag emoji from country code"""
    return COUNTRY_FLAGS.get(country_code.upper(), "🏳️")


def get_country_display(country_code: str) -> str:
    """Get country display string with flag and name"""
    flag = get_country_flag(country_code)
    name = get_country_name(country_code)
    return f"{flag} {name}"


def is_valid_country_code(country_code: str) -> bool:
    """Check if country code is valid"""
    return country_code.upper() in COUNTRY_MAPPING


def get_countries_for_dropdown() -> List[Dict[str, str]]:
    """Get countries list formatted for dropdown components"""
    return COUNTRIES_LIST


def find_country_by_name(name: str) -> Optional[Dict[str, str]]:
    """Find country by name (case insensitive search)"""
    name_lower = name.lower()
    for country in COUNTRIES_LIST:
        if country['name'].lower() == name_lower:
            return country
    return None


def get_default_country() -> Dict[str, str]:
    """Get default country (Colombia)"""
    return {'code': 'CO', 'name': 'Colombia', 'flag': '🇨🇴'}