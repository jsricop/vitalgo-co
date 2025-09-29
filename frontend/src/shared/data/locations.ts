/**
 * Location data constants for address and birth information forms
 */

export const COUNTRIES = [
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Perú', label: 'Perú' },
  { value: 'Brasil', label: 'Brasil' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Uruguay', label: 'Uruguay' },
  { value: 'Paraguay', label: 'Paraguay' },
  { value: 'Bolivia', label: 'Bolivia' },
  { value: 'Estados Unidos', label: 'Estados Unidos' },
  { value: 'México', label: 'México' },
  { value: 'España', label: 'España' },
  { value: 'Francia', label: 'Francia' },
  { value: 'Italia', label: 'Italia' },
  { value: 'Reino Unido', label: 'Reino Unido' },
  { value: 'Alemania', label: 'Alemania' },
  { value: 'Canadá', label: 'Canadá' },
  { value: 'Otro', label: 'Otro' }
];

export const COLOMBIA_DEPARTMENTS = [
  { value: 'Amazonas', label: 'Amazonas' },
  { value: 'Antioquia', label: 'Antioquia' },
  { value: 'Arauca', label: 'Arauca' },
  { value: 'Atlántico', label: 'Atlántico' },
  { value: 'Bolívar', label: 'Bolívar' },
  { value: 'Boyacá', label: 'Boyacá' },
  { value: 'Caldas', label: 'Caldas' },
  { value: 'Caquetá', label: 'Caquetá' },
  { value: 'Casanare', label: 'Casanare' },
  { value: 'Cauca', label: 'Cauca' },
  { value: 'Cesar', label: 'Cesar' },
  { value: 'Chocó', label: 'Chocó' },
  { value: 'Córdoba', label: 'Córdoba' },
  { value: 'Cundinamarca', label: 'Cundinamarca' },
  { value: 'Guainía', label: 'Guainía' },
  { value: 'Guaviare', label: 'Guaviare' },
  { value: 'Huila', label: 'Huila' },
  { value: 'La Guajira', label: 'La Guajira' },
  { value: 'Magdalena', label: 'Magdalena' },
  { value: 'Meta', label: 'Meta' },
  { value: 'Nariño', label: 'Nariño' },
  { value: 'Norte de Santander', label: 'Norte de Santander' },
  { value: 'Putumayo', label: 'Putumayo' },
  { value: 'Quindío', label: 'Quindío' },
  { value: 'Risaralda', label: 'Risaralda' },
  { value: 'San Andrés y Providencia', label: 'San Andrés y Providencia' },
  { value: 'Santander', label: 'Santander' },
  { value: 'Sucre', label: 'Sucre' },
  { value: 'Tolima', label: 'Tolima' },
  { value: 'Valle del Cauca', label: 'Valle del Cauca' },
  { value: 'Vaupés', label: 'Vaupés' },
  { value: 'Vichada', label: 'Vichada' },
  { value: 'Bogotá D.C.', label: 'Bogotá D.C.' }
];

// Major cities for each department - simplified for main cities
export const COLOMBIA_CITIES_BY_DEPARTMENT: Record<string, Array<{value: string, label: string}>> = {
  'Bogotá D.C.': [
    { value: 'Bogotá', label: 'Bogotá' }
  ],
  'Antioquia': [
    { value: 'Medellín', label: 'Medellín' },
    { value: 'Bello', label: 'Bello' },
    { value: 'Itagüí', label: 'Itagüí' },
    { value: 'Envigado', label: 'Envigado' },
    { value: 'Rionegro', label: 'Rionegro' },
    { value: 'Otro', label: 'Otro' }
  ],
  'Valle del Cauca': [
    { value: 'Cali', label: 'Cali' },
    { value: 'Palmira', label: 'Palmira' },
    { value: 'Buenaventura', label: 'Buenaventura' },
    { value: 'Tulua', label: 'Tulua' },
    { value: 'Otro', label: 'Otro' }
  ],
  'Atlántico': [
    { value: 'Barranquilla', label: 'Barranquilla' },
    { value: 'Soledad', label: 'Soledad' },
    { value: 'Malambo', label: 'Malambo' },
    { value: 'Otro', label: 'Otro' }
  ],
  'Santander': [
    { value: 'Bucaramanga', label: 'Bucaramanga' },
    { value: 'Floridablanca', label: 'Floridablanca' },
    { value: 'Girón', label: 'Girón' },
    { value: 'Otro', label: 'Otro' }
  ],
  'Cundinamarca': [
    { value: 'Soacha', label: 'Soacha' },
    { value: 'Chía', label: 'Chía' },
    { value: 'Zipaquirá', label: 'Zipaquirá' },
    { value: 'Facatativá', label: 'Facatativá' },
    { value: 'Otro', label: 'Otro' }
  ]
};

// For departments not listed above, provide a generic "Otro" option
export const getCitiesForDepartment = (department: string): Array<{value: string, label: string}> => {
  return COLOMBIA_CITIES_BY_DEPARTMENT[department] || [
    { value: 'Otro', label: 'Otro' }
  ];
};