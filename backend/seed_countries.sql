-- VitalGo Countries Data Seed Script
-- Inserts country data with flag emojis and phone codes
-- Starting with Colombia and nearby Latin American countries

BEGIN;

-- Insert countries starting with Colombia, then nearby countries, then rest of Americas, then other continents
INSERT INTO countries (name, code, flag_emoji, phone_code, is_active) VALUES
-- Colombia first
('Colombia', 'CO', '🇨🇴', '+57', true),

-- Países limítrofes con Colombia
('Venezuela', 'VE', '🇻🇪', '+58', true),
('Ecuador', 'EC', '🇪🇨', '+593', true),
('Perú', 'PE', '🇵🇪', '+51', true),
('Brasil', 'BR', '🇧🇷', '+55', true),
('Panamá', 'PA', '🇵🇦', '+507', true),

-- Resto de América Central
('Costa Rica', 'CR', '🇨🇷', '+506', true),
('Nicaragua', 'NI', '🇳🇮', '+505', true),
('Honduras', 'HN', '🇭🇳', '+504', true),
('El Salvador', 'SV', '🇸🇻', '+503', true),
('Guatemala', 'GT', '🇬🇹', '+502', true),
('Belice', 'BZ', '🇧🇿', '+501', true),

-- América del Sur
('Argentina', 'AR', '🇦🇷', '+54', true),
('Chile', 'CL', '🇨🇱', '+56', true),
('Uruguay', 'UY', '🇺🇾', '+598', true),
('Paraguay', 'PY', '🇵🇾', '+595', true),
('Bolivia', 'BO', '🇧🇴', '+591', true),
('Guyana', 'GY', '🇬🇾', '+592', true),
('Surinam', 'SR', '🇸🇷', '+597', true),
('Guayana Francesa', 'GF', '🇬🇫', '+594', true),

-- América del Norte
('México', 'MX', '🇲🇽', '+52', true),
('Estados Unidos', 'US', '🇺🇸', '+1', true),
('Canadá', 'CA', '🇨🇦', '+1', true),

-- El Caribe
('Cuba', 'CU', '🇨🇺', '+53', true),
('República Dominicana', 'DO', '🇩🇴', '+1-809', true),
('Haití', 'HT', '🇭🇹', '+509', true),
('Jamaica', 'JM', '🇯🇲', '+1-876', true),
('Puerto Rico', 'PR', '🇵🇷', '+1-787', true),
('Trinidad y Tobago', 'TT', '🇹🇹', '+1-868', true),
('Bahamas', 'BS', '🇧🇸', '+1-242', true),
('Barbados', 'BB', '🇧🇧', '+1-246', true),

-- Europa (principales)
('España', 'ES', '🇪🇸', '+34', true),
('Francia', 'FR', '🇫🇷', '+33', true),
('Italia', 'IT', '🇮🇹', '+39', true),
('Alemania', 'DE', '🇩🇪', '+49', true),
('Reino Unido', 'GB', '🇬🇧', '+44', true),
('Portugal', 'PT', '🇵🇹', '+351', true),
('Países Bajos', 'NL', '🇳🇱', '+31', true),
('Suiza', 'CH', '🇨🇭', '+41', true),
('Bélgica', 'BE', '🇧🇪', '+32', true),
('Suecia', 'SE', '🇸🇪', '+46', true),
('Noruega', 'NO', '🇳🇴', '+47', true),
('Dinamarca', 'DK', '🇩🇰', '+45', true),
('Polonia', 'PL', '🇵🇱', '+48', true),
('Rusia', 'RU', '🇷🇺', '+7', true),

-- Asia (principales)
('China', 'CN', '🇨🇳', '+86', true),
('Japón', 'JP', '🇯🇵', '+81', true),
('Corea del Sur', 'KR', '🇰🇷', '+82', true),
('India', 'IN', '🇮🇳', '+91', true),
('Filipinas', 'PH', '🇵🇭', '+63', true),
('Tailandia', 'TH', '🇹🇭', '+66', true),
('Vietnam', 'VN', '🇻🇳', '+84', true),
('Indonesia', 'ID', '🇮🇩', '+62', true),
('Singapur', 'SG', '🇸🇬', '+65', true),
('Malasia', 'MY', '🇲🇾', '+60', true),
('Israel', 'IL', '🇮🇱', '+972', true),
('Emiratos Árabes Unidos', 'AE', '🇦🇪', '+971', true),
('Arabia Saudita', 'SA', '🇸🇦', '+966', true),
('Turquía', 'TR', '🇹🇷', '+90', true),

-- África (principales)
('Sudáfrica', 'ZA', '🇿🇦', '+27', true),
('Nigeria', 'NG', '🇳🇬', '+234', true),
('Egipto', 'EG', '🇪🇬', '+20', true),
('Kenia', 'KE', '🇰🇪', '+254', true),
('Marruecos', 'MA', '🇲🇦', '+212', true),
('Argelia', 'DZ', '🇩🇿', '+213', true),
('Ghana', 'GH', '🇬🇭', '+233', true),

-- Oceanía
('Australia', 'AU', '🇦🇺', '+61', true),
('Nueva Zelanda', 'NZ', '🇳🇿', '+64', true)

ON CONFLICT (code) DO NOTHING;

COMMIT;

-- Verify insertion
SELECT COUNT(*) as total_countries FROM countries;
SELECT name, code, flag_emoji, phone_code FROM countries ORDER BY id LIMIT 10;
