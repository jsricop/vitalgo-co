# RF004 - Páginas de Emergencia (/emergency y /emergency/{qr_code})

**Fecha:** 2025-09-18
**Versión:** 2.0 - **ENHANCED**
**Estado:** Pendiente Implementación
**Prioridad:** Crítica

## 1. Descripción General

Sistema de emergencia médica que incluye dos páginas principales: una página para generar y gestionar códigos QR de emergencia (/emergency) y otra para acceder a **información médica integral crítica** mediante escaneo QR (/emergency/{qr_code}). **Por el momento, SOLO el paciente propietario del QR puede acceder** a su información médica completa y extendida, incluyendo datos demográficos, seguridad social, medicamentos actuales, y antecedentes ginecológicos.

## 2. Objetivo

Facilitar el acceso rápido a **información médica integral** durante emergencias. **ACTUALMENTE: Solo el paciente propietario puede acceder a su información QR.** El sistema está diseñado para futuro acceso de personal médico de emergencia a **datos vitales completos del paciente** incluyendo:
- **Información demográfica** (sexo, género, edad, residencia)
- **Información médica básica** (tipo de sangre con RH, EPS, contactos de emergencia)
- **Medicamentos actuales** (dosis, frecuencia, prescriptor)
- **Alergias críticas** (severidad, síntomas, tratamientos)
- **Enfermedades** (crónicas, tratamientos actuales, códigos CIE-10)
- **Cirugías** (detalles completos, anestesia, hospitales)
- **Antecedentes ginecológicos** (embarazo, condiciones especiales)

Todo mediante códigos QR, garantizando la disponibilidad de información integral que puede salvar vidas.

## 3. Actores

- **Actor Principal ACTUAL:** Paciente (propietario del QR) - ÚNICO con acceso autorizado
- **Actor Futuro:** Personal médico de emergencia con acceso al código QR
- **Actor Externo Futuro:** Sistema de ambulancias y hospitales

**RESTRICCIÓN ACTUAL**: Solo el paciente propietario puede acceder a su información QR.

## 4. Precondiciones

### 4.1 Página de Generación QR (/emergency)
- Usuario debe estar autenticado como paciente
- **Usuario debe tener perfil médico COMPLETO (mandatory_fields_completed = true)**
- Usuario debe tener conexión a internet
- **Si perfil incompleto: redirección automática a RF002**

### 4.2 Página de Acceso QR (/emergency/{qr_code})
- Código QR debe ser válido y no expirado
- **ACTUALMENTE: Usuario debe estar autenticado como propietario del QR**
- **Solo el paciente propietario puede acceder a su información**
- **Futuro: Sin autenticación requerida para acceso público de emergencia**

## 5. Flujo Principal

### 5.1 Generación de Código QR (/emergency)
1. Paciente autenticado navega a /emergency
2. Sistema verifica autenticación y rol de paciente
3. Sistema carga o genera código QR con información del paciente
4. Usuario puede descargar, compartir o regenerar código QR
5. Sistema muestra instrucciones de uso para emergencias

### 5.2 Acceso de Emergencia ACTUAL - Solo Propietario (/emergency/{qr_code})
1. **ACTUALMENTE: Solo el paciente propietario puede acceder mediante autenticación**
2. Sistema valida código QR (existencia y expiración)
3. **Sistema verifica que el usuario autenticado es el propietario del QR**
4. **Sistema muestra información médica integral de emergencia del propietario:**
   - **Información Personal Básica:** Nombre, edad, sexo biológico, género
   - **Información de Ubicación:** Ciudad y departamento de residencia
   - **Información Médica Crítica:** Tipo de sangre con RH
   - **Seguridad Social:** EPS, seguros, plan complementario
   - **Contacto de Emergencia:** Nombre completo, parentesco, teléfonos (principal y alternativo)
   - **Medicamentos Actuales:** Lista completa con dosis, frecuencia, prescriptor
   - **Alergias:** Todas las alergias con severidad, síntomas y tratamientos
   - **Enfermedades:** Historial completo con fechas, códigos CIE-10, tratamientos actuales, estado crónico
   - **Cirugías:** Historial quirúrgico completo con fechas, cirujanos, hospitales, anestesia, duración
   - **Antecedentes Ginecológicos:** Estado de embarazo, historial obstétrico, información menstrual (solo mujeres)
   - **Ocupación:** Profesión actual del paciente
5. **Sistema registra acceso del propietario para estadísticas**

**FUTURO: Acceso Público de Emergencia**
- Cualquier persona podrá escanear código QR sin autenticación
- Personal médico tendrá acceso inmediato a información crítica
- Sistema registrará accesos anónimos para auditoría

## 6. Páginas y Secciones

### 6.1 Página de Generación QR (/emergency)

#### 6.1.1 Información del Paciente
| Campo | Origen | Editable |
|-------|--------|----------|
| **Nombre Completo** | API de usuario | ❌ |
| **Código QR Generado** | API de generación QR | ❌ |
| **Fecha de Generación** | API de generación QR | ❌ |
| **URL de Emergencia** | Generada automáticamente | ❌ |

#### 6.1.2 Acciones Disponibles
| Acción | Funcionalidad |
|--------|---------------|
| **Descargar QR** | Descarga imagen PNG del código QR |
| **Compartir URL** | Copia URL de emergencia al portapapeles |
| **Ver Página** | Abre página de emergencia en nueva pestaña |
| **Generar Nuevo** | Invalida QR actual y genera uno nuevo |

#### 6.1.3 Instrucciones de Uso
| Paso | Descripción |
|------|-------------|
| **1. Guardar Código** | Descargar imagen o guardar URL |
| **2. Emergencia** | Mostrar código a personal médico o de emergencia |
| **3. Acceso Completo** | Toda la información médica está disponible para emergencias |

### 6.2 Página de Acceso QR (/emergency/{qr_code})

#### 6.2.1 Vista Integral de Emergencia (Acceso Público) EXTENDIDA
| Sección | Información Mostrada |
|---------|---------------------|
| **Datos Personales Básicos** | Nombre completo, edad, sexo biológico, género |
| **Ubicación** | Ciudad y departamento de residencia, país de nacimiento |
| **Información Médica Crítica** | Tipo de sangre con RH, ocupación |
| **Seguridad Social** | EPS, seguros adicionales, plan complementario |
| **Contacto de Emergencia** | Nombre completo, parentesco, teléfono principal y alternativo |
| **Medicamentos Actuales** | Lista completa con nombre, dosis, frecuencia, prescriptor, fecha inicio |
| **Alergias** | Todas las alergias con alérgeno, severidad, síntomas, tratamientos, fecha diagnóstico |
| **Enfermedades** | Historial completo con nombre, fecha diagnóstico, código CIE-10, síntomas, tratamiento actual, médico prescriptor, estado crónico |
| **Cirugías** | Historial quirúrgico con nombre, fecha, cirujano, hospital, descripción, diagnóstico, tipo anestesia, duración |
| **Antecedentes Ginecológicos** | Estado embarazo (semanas), historial obstétrico (embarazos, partos, cesáreas, abortos), fecha última menstruación, método anticonceptivo (solo mujeres) |
| **Información Adicional** | Notas médicas relevantes para emergencias |

## 7. Validaciones Detalladas

### 7.1 Validaciones de Código QR
- **Existencia**: Código debe existir en la base de datos
- **Expiración**: Código no debe estar expirado (365 días)
- **Formato**: UUID válido en URL
- **Estado**: Código debe estar activo (no invalidado)

### 7.2 Validaciones de Acceso
- **Acceso Público**: Sin autenticación requerida
- **Propietario QR**: Pacientes pueden generar y gestionar sus códigos QR
- **Información Completa**: Toda la información médica disponible públicamente en emergencias
- **Rate Limiting**: Control de accesos para prevenir abuso

### 7.3 Validaciones de Seguridad
- **Rate Limiting**: Máximo 50 accesos por IP por hora
- **Logs de Auditoría**: Registro de todos los accesos
- **Datos Sensibles**: Información personal limitada en vista pública
- **HTTPS**: Obligatorio para todas las URLs de emergencia

## 8. Brand Manual Compliance & Emergency Interface Elements

### 8.1 BRAND MANUAL COMPLIANCE (EMERGENCY SPECIFIC)
**MANDATORY**: Estas páginas DEBEN seguir las especificaciones del `MANUAL_DE_MARCA.md` adaptadas para emergencias médicas

#### 8.1.1 Emergency Color Scheme (Critical Situations)
```css
/* COLORES OFICIALES VITALGO PARA EMERGENCIAS */
--vitalgo-green: #01EF7F        /* Verde principal - QR generación y éxito */
--vitalgo-green-light: #5AF4AC   /* Verde claro - Estados completados */
--vitalgo-green-lightest: #CCFCE5 /* Verde muy claro - Backgrounds seguros */
--vitalgo-dark: #002C41          /* Azul oscuro - Textos y headers */
--vitalgo-dark-light: #406171    /* Azul medio - Información médica */

/* COLORES DE EMERGENCIA MÉDICA */
--emergency-critical: #DC2626    /* Rojo crítico - Alergias severas */
--emergency-warning: #EA580C     /* Naranja advertencia - Información importante */
--emergency-urgent: #EF4444      /* Rojo urgente - Headers de emergencia */
--emergency-success: var(--vitalgo-green) /* Verde VitalGo - Acceso exitoso */
--emergency-background: #FEF2F2  /* Fondo claro de emergencia */
```

#### 8.1.2 Typography (Emergency Optimized)
```css
/* TIPOGRAFÍA PARA EMERGENCIAS - MÁXIMA LEGIBILIDAD */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
/* Tamaños aumentados para situaciones de estrés */
h1: 2.5rem (40px) font-bold - Headers de emergencia
h2: 2rem (32px) font-semibold - Títulos de sección crítica
h3: 1.5rem (24px) font-medium - Subtítulos importantes
h4: 1.25rem (20px) font-medium - Labels de datos médicos
body: 1.125rem (18px) font-normal - Texto principal (aumentado)
small: 1rem (16px) font-normal - Metadatos (aumentado)
emergency-text: 1.5rem (24px) font-bold - Información crítica
```

#### 8.1.3 Emergency Assets & Icons
```tsx
/* ASSETS PARA SITUACIONES DE EMERGENCIA */
Logo Emergency: "/assets/images/logos/vitalgo-logo-horizontal-official.svg"
Logo Icon: "/assets/images/logos/vitalgo-icon-official.svg"
Emergency Heart: "/assets/images/icons/vitalgo-heart.svg"
/* Iconografía médica con alta visibilidad */
```

#### 8.1.4 Emergency Spacing (High Contrast)
```css
/* ESPACIADO PARA EMERGENCIAS - MÁXIMA CLARIDAD */
emergency-container: max-w-4xl mx-auto px-6 py-8
critical-spacing: space-y-8 (32px entre elementos críticos)
section-spacing: space-y-6 (24px entre secciones)
data-spacing: space-y-4 (16px entre datos médicos)
card-padding: p-6 md:p-10 (padding aumentado para emergencias)
touch-targets: min-h-12 (48px mínimo para dispositivos móviles)
```

### 8.2 QR Generation Page Navbar (/emergency) - MANDATORY
**COMPONENT**: `MinimalNavbar` from `/src/shared/components/organisms/MinimalNavbar.tsx`

```tsx
<MinimalNavbar
  backText="Volver al Dashboard"
  backUrl="/dashboard"
  showLogo={true}
  className="bg-white border-b border-gray-200"
/>
```

**BRAND FEATURES**:
- VitalGo logo horizontal oficial azul (#002C41)
- Navegación back con hover `text-vitalgo-green`
- Diseño minimalista para focus en QR generation
- Responsive con touch targets apropiados
- Sin elementos distractores (emergencias requieren simplicidad)

### 8.3 Public QR Access Navbar - NO NAVBAR
**CONFIGURACIÓN**: Las páginas públicas QR (/emergency/{qr_code}) **NO DEBEN** tener navbar

**RATIONALE**:
- Máxima velocidad de carga en emergencias
- Sin distracciones para personal médico
- Focus total en información médica crítica
- Optimización para dispositivos móviles de ambulancias

### 8.4 Footer Specification
**QR Generation**: `MinimalFooter` from `/src/shared/components/organisms/MinimalFooter.tsx`
**Public QR Access**: **NO FOOTER** para máxima velocidad

### 8.5 QR Generation Page Layout (/emergency)
```tsx
/* PÁGINA DE GENERACIÓN QR - BRAND COMPLIANT */
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest via-white to-green-50">
  <MinimalNavbar backText="Volver al Dashboard" backUrl="/dashboard" showLogo={true} />

  <main className="max-w-4xl mx-auto px-6 py-8">
    {/* HEADER CON ICONOGRAFÍA OFICIAL */}
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 bg-vitalgo-green rounded-xl flex items-center justify-center">
          <QrCodeIcon className="h-10 w-10 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-vitalgo-dark mb-2">
        Código QR de Emergencia
      </h1>
      <p className="text-lg text-vitalgo-dark-light">
        Acceso rápido a tu información médica en situaciones críticas
      </p>
    </div>

    {/* CARD PRINCIPAL QR */}
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-vitalgo-green-lightest to-white p-6 border-b">
        <h2 className="text-xl font-semibold text-vitalgo-dark">Tu código QR personal</h2>
        <p className="text-vitalgo-dark-light">Información médica disponible las 24 horas</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-8 mb-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                {/* QR Code SVG */}
              </div>
            </div>
            <p className="text-sm text-vitalgo-dark-light">
              Generado: {qrData.generatedAt}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button className="w-full bg-vitalgo-green hover:bg-vitalgo-green-light text-white py-3">
              📱 Descargar QR Code
            </Button>
            <Button variant="outline" className="w-full border-vitalgo-green text-vitalgo-green py-3">
              👁️ Ver Página de Emergencia
            </Button>
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 py-3">
              🔄 Regenerar Código
            </Button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <MinimalFooter />
</div>
```

### 8.6 Public QR Access Layout (Emergency Optimized)
```tsx
/* PÁGINA PÚBLICA QR - MÁXIMA VELOCIDAD Y CLARIDAD */
<div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
  {/* NO NAVBAR - Máxima velocidad */}

  <main className="max-w-4xl mx-auto px-6 py-4">
    {/* HEADER DE EMERGENCIA CRÍTICO */}
    <div className="bg-gradient-to-r from-emergency-urgent to-emergency-critical rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-center">
        <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mr-4">
          <img src="/assets/images/icons/vitalgo-heart.svg" className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            🚨 EMERGENCIA MÉDICA
          </h1>
          <p className="text-red-100 text-lg">
            Información médica crítica - VitalGo
          </p>
        </div>
      </div>
    </div>

    {/* INFORMACIÓN CRÍTICA INMEDIATA */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Datos Básicos */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-emergency-urgent p-6">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 bg-vitalgo-green rounded-lg flex items-center justify-center mr-3">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-vitalgo-dark">Datos del Paciente</h2>
        </div>
        {/* Patient data con typography aumentada */}
      </div>

      {/* Alergias Críticas */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-emergency-critical p-6">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 bg-emergency-critical rounded-lg flex items-center justify-center mr-3">
            <AlertTriangleIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-emergency-critical">⚠️ ALERGIAS CRÍTICAS</h2>
        </div>
        {/* Critical allergies con máxima visibilidad */}
      </div>
    </div>

    {/* INFORMACIÓN MÉDICA COMPLETA */}
    <div className="space-y-6">
      {/* Secciones médicas con brand styling adaptado para emergencias */}
    </div>

    {/* FOOTER MÍNIMO CON MARCA */}
    <div className="text-center mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-center mb-2">
        <img src="/assets/images/logos/vitalgo-icon-official.svg" className="h-6 w-6 mr-2" />
        <span className="text-vitalgo-dark font-medium">VitalGo</span>
      </div>
      <p className="text-sm text-gray-500">Información médica verificada</p>
    </div>
  </main>
</div>
```

### 8.7 Medical Information Cards (Emergency Styling)
```tsx
/* CARDS MÉDICAS PARA EMERGENCIAS */
<div className="bg-white rounded-xl shadow-lg border-l-4 border-vitalgo-green p-6">
  <div className="flex items-center mb-4">
    <div className="h-10 w-10 bg-vitalgo-green rounded-lg flex items-center justify-center mr-4">
      <HeartIcon className="h-6 w-6 text-white" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-vitalgo-dark">Información Médica Básica</h3>
      <p className="text-vitalgo-dark-light">Datos críticos para atención</p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Data items con typography aumentada para emergencias */}
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-600">Tipo de Sangre</p>
      <p className="text-xl font-bold text-emergency-critical">{patient.bloodType}</p>
    </div>
  </div>
</div>

/* ALERGIAS CRÍTICAS - MÁXIMA VISIBILIDAD */
<div className="bg-white rounded-xl shadow-lg border-l-4 border-emergency-critical p-6">
  <div className="flex items-center mb-4">
    <div className="h-10 w-10 bg-emergency-critical rounded-lg flex items-center justify-center mr-4">
      <AlertTriangleIcon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-bold text-emergency-critical">
      ⚠️ ALERGIAS CRÍTICAS
    </h3>
  </div>

  {criticalAllergies.map(allergy => (
    <div key={allergy.id} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold text-emergency-critical">{allergy.allergen}</h4>
        <span className="bg-emergency-critical text-white px-3 py-1 rounded-full text-sm font-bold">
          {allergy.severity}
        </span>
      </div>
      <p className="text-gray-700 font-medium">{allergy.symptoms}</p>
      <p className="text-gray-600 text-sm mt-2">Tratamiento: {allergy.treatment}</p>
    </div>
  ))}
</div>
```

### 8.8 Responsive Design (Emergency Optimized)
```css
/* BREAKPOINTS PARA EMERGENCIAS */
Mobile: 320px - 767px (dispositivos de ambulancia)
- Layout stack vertical completo
- Typography aumentada: text-lg base
- Touch targets mínimo 48px
- Padding reducido pero legible
- QR code 200x200px mínimo

Tablet: 768px - 1023px (tablets médicas)
- Grid 2 columnas para información crítica
- QR code 250x250px
- Typography estándar aumentada
- Spacing optimizado para lectura rápida

Desktop: 1024px+ (computadoras hospitalarias)
- Layout completo con sidebar opcional
- QR code 300x300px
- Typography máxima para pantallas grandes
- Grid 3 columnas para información completa
```

### 8.9 Emergency States & Interactions
```tsx
/* ESTADOS PARA EMERGENCIAS */
// Estado crítico (alergias severas)
<div className="bg-emergency-background border-2 border-emergency-critical rounded-lg p-4">
  <div className="flex items-center">
    <AlertTriangleIcon className="h-6 w-6 text-emergency-critical mr-2 animate-pulse" />
    <span className="text-emergency-critical font-bold text-lg">INFORMACIÓN CRÍTICA</span>
  </div>
</div>

// Estado de éxito (datos cargados)
<div className="bg-vitalgo-green-lightest border-2 border-vitalgo-green rounded-lg p-4">
  <div className="flex items-center">
    <CheckCircleIcon className="h-6 w-6 text-vitalgo-green mr-2" />
    <span className="text-vitalgo-dark font-medium">Información médica verificada</span>
  </div>
</div>

// Estado de carga (optimizado para emergencias)
<div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
  <Spinner className="h-8 w-8 text-vitalgo-green mx-auto mb-4 animate-spin" />
  <p className="text-gray-600 font-medium">Cargando información médica...</p>
</div>
```

### 8.10 Accessibility (Emergency Critical)
- **High Contrast**: Colores de máximo contraste para situaciones de estrés
- **Large Text**: Typography aumentada para lectura rápida
- **Touch Targets**: Mínimo 48px para dispositivos móviles de emergencia
- **Screen Readers**: ARIA labels específicos para información médica crítica
- **Keyboard Navigation**: Tab order optimizado para datos más importantes
- **Emergency Announcements**: Screen readers priorizan información crítica

### 8.11 Performance (Emergency Critical)
- **Sub-2 Second Load**: Carga inicial menor a 2 segundos
- **Critical CSS**: Inline crítico para información médica inmediata
- **Image Optimization**: SVG logos para carga instantánea
- **No JavaScript**: Funcionalidad core sin dependencias JS
- **CDN**: Assets servidos desde CDN global
- **Caching**: Headers apropiados para emergencias recurrentes
- **Cards Organizadas**: Separación clara por tipo de información
- **Badges de Estado**: Colores para severidades y estados
- **Footer de Auditoría**: Timestamp de consulta

### 8.4 Iconografía Específica
- **QrCode**: Generación y códigos QR
- **Heart**: Emergencia médica y VitalGo
- **AlertTriangle**: Alergias críticas y advertencias
- **Shield**: Seguridad y protección de datos
- **Unlock/Lock**: Estados de autenticación
- **User**: Información personal
- **Activity**: Enfermedades y signos vitales
- **Scissors**: Cirugías

## 9. Seguridad

### 9.1 Acceso Público Controlado
- Información limitada a datos críticos de emergencia
- Sin datos sensibles (documento, teléfono personal)
- Rate limiting por IP para prevenir abuso
- Logs de todos los accesos públicos

### 9.2 Seguridad de Acceso Público
- Rate limiting por IP para prevenir abuso
- Logs de accesos para auditoría y estadísticas
- Información médica completa disponible para emergencias
- Sin barreras de autenticación que puedan retrasar atención médica

### 9.3 Protección de Códigos QR
- Expiración automática después de 365 días
- Invalidación de códigos anteriores al generar nuevos
- URLs únicas e impredecibles (UUID)
- Encriptación de URLs de emergencia

### 9.4 Auditoría y Monitoreo
- Log de cada acceso con IP, timestamp, usuario
- Alertas de accesos múltiples sospechosos
- Reportes de uso para administradores
- Cumplimiento con regulaciones médicas

## 10. Modelo de Datos

### 10.1 Tabla QR_Codes
```sql
CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    qr_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    qr_image_url TEXT,
    access_url TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 10.1.1 Rationale: Esquema Híbrido - Campo `qr_code` en patients + Tabla QR_CODES

**DECISIÓN ARQUITECTURAL**: VitalGo utiliza un **esquema híbrido** que combina:
- **Campo `qr_code` en tabla `patients`**: QR code directo del paciente (simple, acceso rápido)
- **Tabla `qr_codes`**: Gestión avanzada de QRs de emergencia (completa, auditable)

**¿POR QUÉ HÍBRIDO y NO SOLO campo `qr_code` en patients?**

**LIMITACIONES del campo `qr_code` único:**
1. **Un solo QR por paciente**: Campo simple solo permite 1 QR activo
2. **Sin historial**: No se puede rastrear QRs anteriores o regeneraciones
3. **Sin expiración granular**: Difícil manejar diferentes fechas de expiración
4. **Sin métricas**: Imposible trackear uso, accesos, o estadísticas de emergencia
5. **Sin invalidación segura**: No se puede invalidar QR anterior al generar nuevo
6. **Sin configuración específica**: Todos los QRs tendrían misma configuración

**VENTAJAS del esquema HÍBRIDO:**

##### 1. **Doble Funcionalidad: Simple + Avanzada**
```sql
-- Campo patients.qr_code: Acceso rápido y directo
patients.qr_code = "simple-qr-token"  -- Para funcionalidades básicas

-- Tabla qr_codes: Gestión completa de emergencia
patient_id: uuid-123
├── qr_token: abc-123 (expirado, inactivo)
├── qr_token: def-456 (invalidado manualmente)
└── qr_token: ghi-789 (activo, actual) ← patients.qr_code apunta aquí
```

##### 2. **Relación y Sincronización: patients.qr_code ↔ qr_codes**

**CONCEPTO CLAVE**: `patients.qr_code` siempre contiene el **QR ACTIVO ACTUAL**

```sql
-- RELACIÓN ESTRUCTURAL
patients.qr_code = qr_codes.qr_token WHERE qr_codes.is_active = TRUE

-- EJEMPLO DE ESTADO:
patients.qr_code = "ghi-789"  -- QR activo actual

qr_codes table:
├── qr_token: "abc-123" (is_active: false, expires_at: 2024-12-01)
├── qr_token: "def-456" (is_active: false, expires_at: 2025-01-15)
└── qr_token: "ghi-789" (is_active: true,  expires_at: 2025-12-31) ← ACTUAL
```

**FLUJO DE GENERACIÓN DE NUEVO QR:**

```sql
-- PASO 1: Usuario solicita generar nuevo QR
POST /api/v1/emergency/qr/generate

-- PASO 2: Sistema ejecuta transacción atómica
BEGIN TRANSACTION;

  -- 2.1: Marcar QR anterior como inactivo
  UPDATE qr_codes
  SET is_active = FALSE, updated_at = NOW()
  WHERE patient_id = ? AND is_active = TRUE;

  -- 2.2: Crear nuevo QR en tabla qr_codes
  INSERT INTO qr_codes (
    patient_id,
    qr_token,
    expires_at,
    is_active
  ) VALUES (
    ?,
    gen_random_uuid(),
    NOW() + INTERVAL '365 days',
    TRUE
  ) RETURNING qr_token;

  -- 2.3: Actualizar campo patients.qr_code con nuevo token
  UPDATE patients
  SET qr_code = [nuevo_qr_token], updated_at = NOW()
  WHERE id = ?;

COMMIT;
```

##### 3. **Escenarios de Flujo Completos**

**ESCENARIO 1: Primera Generación de QR**
```sql
-- Estado inicial: Paciente sin QR
patients.qr_code = NULL
qr_codes table: (vacía para este paciente)

-- Después de generar primer QR:
patients.qr_code = "abc-123"
qr_codes:
└── qr_token: "abc-123" (is_active: true, primera vez)
```

**ESCENARIO 2: Regeneración Manual**
```sql
-- Estado antes: Un QR activo
patients.qr_code = "abc-123"
qr_codes:
└── qr_token: "abc-123" (is_active: true)

-- Paciente regenera → Estado después:
patients.qr_code = "def-456"  -- ACTUALIZADO
qr_codes:
├── qr_token: "abc-123" (is_active: false) ← DESACTIVADO
└── qr_token: "def-456" (is_active: true)  ← NUEVO ACTIVO
```

**ESCENARIO 3: Expiración Automática**
```sql
-- QR actual expira por tiempo
-- TRIGGER automático detecta expiración:

-- Estado antes:
patients.qr_code = "abc-123"
qr_codes:
└── qr_token: "abc-123" (is_active: true, expires_at: 2024-12-01) ← EXPIRADO

-- Sistema ejecuta auto-generación:
patients.qr_code = "ghi-789"  -- AUTO-ACTUALIZADO
qr_codes:
├── qr_token: "abc-123" (is_active: false, expired: true)
└── qr_token: "ghi-789" (is_active: true, expires_at: 2025-12-01)
```

**ESCENARIO 4: Invalidación por Seguridad**
```sql
-- Paciente reporta QR comprometido
-- Admin o sistema invalida QR:

UPDATE qr_codes
SET is_active = FALSE, invalidated_reason = 'SECURITY_BREACH'
WHERE qr_token = ? AND patient_id = ?;

-- Generar nuevo QR inmediatamente:
-- (Mismo flujo que regeneración manual)
```

##### 4. **Constraints y Validaciones de Integridad**

```sql
-- CONSTRAINTS para mantener integridad del esquema híbrido:

-- 1. Solo un QR activo por paciente en qr_codes
CREATE UNIQUE INDEX idx_qr_codes_patient_active
ON qr_codes (patient_id) WHERE is_active = TRUE;

-- 2. El campo patients.qr_code debe existir en qr_codes si no es NULL
ALTER TABLE patients
ADD CONSTRAINT fk_patients_qr_code_exists
FOREIGN KEY (qr_code) REFERENCES qr_codes(qr_token);

-- 3. Validación: patients.qr_code debe apuntar al QR activo
CREATE OR REPLACE FUNCTION validate_patient_qr_code_consistency()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar que el QR en patients.qr_code sea el activo en qr_codes
  IF NEW.qr_code IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM qr_codes
      WHERE qr_token = NEW.qr_code
      AND patient_id = NEW.id
      AND is_active = TRUE
    ) THEN
      RAISE EXCEPTION 'patients.qr_code debe apuntar al QR activo en qr_codes';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_patient_qr_code
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION validate_patient_qr_code_consistency();
```

##### 5. **Consultas de Acceso Optimizadas**

```sql
-- CONSULTA RÁPIDA: Obtener QR actual del paciente
SELECT qr_code FROM patients WHERE id = ?;
-- Performance: O(1) - acceso directo al campo

-- CONSULTA COMPLETA: Obtener información detallada del QR actual
SELECT p.qr_code, qc.expires_at, qc.usage_count, qc.generated_at
FROM patients p
JOIN qr_codes qc ON p.qr_code = qc.qr_token
WHERE p.id = ? AND qc.is_active = TRUE;

-- CONSULTA HISTÓRICA: Obtener todos los QRs del paciente
SELECT qr_token, is_active, expires_at, generated_at, usage_count
FROM qr_codes
WHERE patient_id = ?
ORDER BY generated_at DESC;

-- CONSULTA DE EMERGENCIA: Validar QR y obtener datos del paciente
SELECT p.*, qc.usage_count, qc.last_accessed
FROM qr_codes qc
JOIN patients p ON qc.patient_id = p.id
WHERE qc.qr_token = ? AND qc.is_active = TRUE AND qc.expires_at > NOW();
```

##### 6. **Auditoría y Compliance Médico**
```sql
-- Histórico completo de códigos QR
generated_at, expires_at, usage_count, last_accessed
-- Esencial para auditorías médicas y HIPAA compliance
```

##### 4. **Métricas y Analytics**
- **Usage tracking**: Cuántas veces se accede cada QR
- **Performance**: Tiempo entre generación y primer acceso
- **Seguridad**: Detección de accesos anómalos o múltiples
- **UX**: Análisis de patrones de regeneración

##### 5. **Configuración Flexible**
```sql
-- Diferentes tipos de QR en el futuro
qr_type: 'emergency' | 'medical_sharing' | 'appointment'
expires_at: Custom expiration per QR
access_level: 'public' | 'medical_only' | 'family'
```

##### 6. **Escalabilidad y Futuras Funcionalidades**
- **QRs temporales**: Para citas médicas específicas
- **QRs familiares**: Acceso limitado para familiares
- **QRs médicos**: Para compartir con doctores específicos
- **QRs de emergencia**: Con diferentes niveles de información

##### 7. **Integridad de Datos**
```sql
-- Constraints y validaciones específicas
UNIQUE(qr_token)                    -- Tokens únicos globalmente
CHECK(expires_at > generated_at)    -- Lógica de expiración
INDEX(patient_id, is_active)        -- Performance queries
```

##### 8. **Backup y Recovery**
- **Rollback**: Reactivar QR anterior si hay problemas
- **Emergency access**: Múltiples QRs de respaldo
- **Data consistency**: Transacciones atómicas para generación

**COMPARACIÓN: Solo Campo vs Solo Tabla vs HÍBRIDO (VitalGo):**

| Aspecto | Solo `qr_code` en patients | Solo Tabla QR_CODES | **HÍBRIDO VitalGo** |
|---------|---------------------------|-------------------|-------------------|
| **QRs simultáneos** | 1 solo | Múltiples | ✅ **Múltiples + Current** |
| **Historial** | ❌ No | ✅ Completo | ✅ **Completo** |
| **Acceso rápido** | ✅ Directo | ⚠️ JOIN required | ✅ **Directo + Detallado** |
| **Expiración** | ❌ Manual | ✅ Granular | ✅ **Automática** |
| **Métricas** | ❌ No | ✅ Detalladas | ✅ **Detalladas** |
| **Auditoría** | ❌ Básica | ✅ Completa | ✅ **Completa** |
| **Regeneración** | ❌ Sobrescribe | ✅ Histórico | ✅ **Histórico + Sync** |
| **Performance simple** | ✅ Óptimo | ❌ Complejo | ✅ **Óptimo básico** |
| **Performance avanzado** | ❌ Limitado | ✅ Optimizado | ✅ **Optimizado** |
| **Escalabilidad** | ❌ Limitada | ✅ Infinita | ✅ **Infinita** |
| **Complejidad** | ✅ Simple | ❌ Alta | ⚠️ **Media** |

**VENTAJAS ÚNICAS del HÍBRIDO:**
- **Best of Both Worlds**: Performance simple + Funcionalidad completa
- **Backward Compatibility**: Código existente sigue funcionando
- **Progressive Enhancement**: Funcionalidades avanzadas cuando se necesiten
- **Graceful Degradation**: Si falla tabla compleja, campo simple mantiene funcionalidad básica

**CONCLUSIÓN**:
Para VitalGo, el esquema **HÍBRIDO** es **óptimo** porque:
1. **Mantiene simplicidad** para operaciones básicas (patients.qr_code)
2. **Habilita complejidad** para emergencias médicas (qr_codes)
3. **Maximiza performance** para ambos casos de uso
4. **Cumple compliance médico** sin sacrificar usabilidad

### 10.2 Tabla Emergency_Access_Logs
```sql
CREATE TABLE emergency_access_logs (
    id BIGSERIAL PRIMARY KEY,                -- Integer optimizado para logs de emergencia
    qr_code_id UUID REFERENCES qr_codes(id),
    accessed_by_user_id UUID REFERENCES users(id),
    access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('PUBLIC', 'AUTHENTICATED')),
    user_role VARCHAR(20),
    ip_address INET NOT NULL,
    user_agent TEXT,
    access_granted BOOLEAN DEFAULT TRUE,
    access_reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Índices optimizados para consultas de emergencia y auditoría
    INDEX idx_emergency_logs_qr_time (qr_code_id, created_at DESC),
    INDEX idx_emergency_logs_ip_time (ip_address, created_at DESC),
    INDEX idx_emergency_logs_access_type (access_type, created_at DESC),
    INDEX idx_emergency_logs_user_time (accessed_by_user_id, created_at DESC)
);
```

**Optimización para Emergencias Médicas:**
- **BIGSERIAL ID**: Performance crítica para logs de acceso de emergencia
- **Rapid Response**: Consultas rápidas esenciales en situaciones médicas críticas
- **High Volume**: Optimización para múltiples accesos simultáneos de emergencia
- **Audit Trail**: Orden secuencial facilita investigación forense de accesos

### 10.3 Tabla Emergency_Contact_Info
```sql
CREATE TABLE emergency_contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    contact_name VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.4 UUID vs Integer ID Strategy

**STRATEGIC APPROACH**: VitalGo utiliza una estrategia híbrida para selección de tipos de ID basada en propósito y performance requirements.

#### 10.4.1 UUID Usage Guidelines
**USAR UUID PARA:**
- **Tablas principales/entidades core**: `users`, `patients`, `medical_records`, `qr_codes`
- **Datos con exposición pública**: APIs públicas, URLs, formularios web
- **Identificadores distribuidos**: Datos que se replican entre sistemas
- **Requisitos de seguridad**: Prevenir enumeración y predicción de IDs

**IMPLEMENTACIÓN EN RF004:**
- `qr_codes.id` → UUID (seguridad crítica, exposición pública)
- `qr_codes.qr_token` → UUID (identificador público de emergencia)
- `emergency_contact_info.id` → UUID (información médica crítica)
- `patients.id` → UUID (entidad principal, datos médicos)

**JUSTIFICACIÓN:**
- Seguridad por no-predicibilidad en URLs de emergencia públicas
- Prevención de ataques de enumeración de códigos QR
- Compatibilidad con sistemas de emergencia hospitalarios
- Estándar para identificadores de emergencia médica

#### 10.4.2 Integer (BIGSERIAL) Usage Guidelines
**USAR INTEGER PARA:**
- **Tablas de auditoría/logging**: `emergency_access_logs`, `qr_usage_analytics`
- **Alta volumetría/frecuencia**: Tablas con miles de inserts diarios
- **Uso interno únicamente**: Sin exposición en APIs públicas
- **Performance crítica**: Consultas complejas con múltiples JOINs

**IMPLEMENTACIÓN EN RF004:**
- `emergency_access_logs.id` → BIGSERIAL (alta volumetría, auditoría interna)

**FUTURAS IMPLEMENTACIONES:**
```sql
-- Ejemplos de tablas futuras con Integer IDs
CREATE TABLE qr_usage_analytics (
    id BIGSERIAL PRIMARY KEY,                -- Analytics interno de uso QR
    qr_code_id UUID REFERENCES qr_codes(id),
    access_timestamp TIMESTAMP,
    response_time_ms INTEGER,
    user_agent_category VARCHAR(50),
    access_source VARCHAR(100)
);

CREATE TABLE emergency_response_logs (
    id BIGSERIAL PRIMARY KEY,                -- Logs de respuesta de emergencia
    emergency_access_log_id BIGSERIAL REFERENCES emergency_access_logs(id),
    response_team VARCHAR(100),
    response_time_minutes INTEGER,
    outcome VARCHAR(200)
);
```

**JUSTIFICACIÓN:**
- Performance crítica (4x más rápido) para logs de emergencia
- Storage efficiency para auditoría de alta frecuencia de emergencias
- Optimización para analytics de uso de QR codes
- Facilita reporting de emergencias médicas

#### 10.4.3 Implementation Matrix for RF004

| Tabla Type | ID Type | Rationale | Performance Impact |
|------------|---------|-----------|-------------------|
| **QR Codes/Emergency** | UUID | Public Security | Normal |
| **Medical Contact Data** | UUID | Emergency Access Needs | Normal |
| **Patient Medical Info** | UUID | HIPAA/Privacy Compliance | Normal |
| **Access/Usage Logs** | BIGSERIAL | High Volume Emergency Tracking | High Performance |
| **Analytics/Metrics** | BIGSERIAL | Internal Emergency Analytics | High Performance |

#### 10.4.4 Emergency-Specific Considerations
**EMERGENCY REQUIREMENTS**: El sistema de emergencias requiere UUIDs para:
- **Public QR Access**: URLs de emergencia accesibles públicamente sin autenticación
- **Security in Crisis**: Prevenir enumeración durante situaciones de emergencia
- **Cross-Hospital Systems**: Compatibilidad con sistemas hospitalarios distribuidos
- **Medical Privacy**: Cumplimiento con estándares médicos en emergencias

**EMERGENCY PERFORMANCE**: Logs usan BIGSERIAL por:
- **Critical Response Time**: Emergencias requieren logging ultra-rápido
- **High-Frequency Access**: QR codes pueden ser accedidos múltiples veces simultáneamente
- **Emergency Analytics**: Análisis post-emergencia requiere consultas rápidas
- **Compliance Auditing**: Auditorías médicas de emergencia necesitan performance optimizada

**BALANCE CRÍTICO**:
- **QR Tokens**: UUID para seguridad pública → Acceso de emergencia seguro
- **Access Logs**: BIGSERIAL para performance → Registro rápido durante crisis
- **Emergency Data**: UUID para privacidad → Protección de datos médicos
- **Analytics**: BIGSERIAL para reportes → Mejora continua del sistema de emergencias

## 11. API Endpoints

### 11.1 Generar Código QR
**Endpoint:** `POST /api/v1/emergency/qr/generate`

**Request Body:**
```json
{
    "expires_in_days": 365
}
```

**Response Success (201):**
```json
{
    "success": true,
    "qr_token": "uuid",
    "qr_image": "base64_or_url",
    "access_url": "http://localhost:3000/emergency/{qr_token}",
    "expires_at": "2025-12-31T23:59:59Z",
    "previous_qr_invalidated": true
}
```

### 11.2 Acceso Público de Emergencia INTEGRAL
**Endpoint:** `GET /api/v1/emergency/qr/{qr_token}`

**Response Success (200):**
```json
{
    "patient": {
        "personal_info": {
            "full_name": "string",
            "age": "number",
            "biological_sex": "string",
            "gender": "string",
            "birth_country": "string",
            "birth_city": "string",
            "residence_address": "string",
            "residence_city": "string",
            "residence_department": "string",
            "occupation": "string"
        },
        "medical_basic": {
            "blood_type": "string",
            "eps": "string",
            "health_insurance": "string",
            "complementary_plan": "string"
        },
        "emergency_contact": {
            "name": "string",
            "relationship": "string",
            "phone": "string",
            "alternative_phone": "string"
        }
    },
    "current_medications": [
        {
            "name": "string",
            "dosage": "string",
            "frequency": "string",
            "prescribed_by": "string",
            "start_date": "date",
            "notes": "string"
        }
    ],
    "allergies": [
        {
            "allergen": "string",
            "severity": "string",
            "symptoms": "string",
            "treatment": "string",
            "diagnosed_date": "date",
            "notes": "string"
        }
    ],
    "illnesses": [
        {
            "name": "string",
            "diagnosed_date": "date",
            "cie10_code": "string",
            "symptoms": "string",
            "treatment": "string",
            "prescribed_by": "string",
            "is_chronic": "boolean",
            "notes": "string"
        }
    ],
    "surgeries": [
        {
            "name": "string",
            "surgery_date": "date",
            "surgeon": "string",
            "hospital": "string",
            "description": "string",
            "diagnosis": "string",
            "anesthesia_type": "string",
            "surgery_duration_minutes": "number",
            "notes": "string"
        }
    ],
    "gynecological_history": {
        "is_pregnant": "boolean",
        "pregnancy_weeks": "number",
        "last_menstrual_period": "date",
        "pregnancies": "number",
        "births": "number",
        "cesareans": "number",
        "abortions": "number",
        "contraceptive_method": "string",
        "notes": "string"
    },
    "access_timestamp": "timestamp"
}
```

### 11.3 Validación Rápida de QR
**Endpoint:** `GET /api/v1/emergency/qr/{qr_token}/validate`

**Response Success (200):**
```json
{
    "valid": true,
    "patient_name": "string",
    "expires_at": "timestamp",
    "has_critical_info": true,
    "critical_alerts": [
        "Alergia crítica a penicilina",
        "Diabetes tipo 1",
        "Embarazada - 32 semanas"
    ]
}
```

**Response Error (404/410):**
```json
{
    "valid": false,
    "error": "QR_NOT_FOUND",
    "message": "Código QR no encontrado o expirado"
}
```

### 11.4 Verificar Propiedad de QR
**Endpoint:** `GET /api/v1/emergency/qr/verify-ownership/{qr_token}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response Success (200):**
```json
{
    "isOwner": true,
    "qr_token": "uuid",
    "patient_id": "uuid"
}
```

### 11.5 Invalidar Código QR
**Endpoint:** `DELETE /api/v1/emergency/qr/{qr_token}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Código QR invalidado exitosamente",
    "invalidated_at": "timestamp"
}
```

## 12. Estructura de Archivos

### 12.1 Frontend (Atomic Design)
```
src/slices/emergency/components/
├── atoms/
│   ├── QRCodeDisplay.tsx
│   ├── EmergencyBadge.tsx
│   ├── SeverityBadge.tsx
│   └── AccessButton.tsx
├── molecules/
│   ├── QRActions.tsx
│   ├── PatientBasicInfo.tsx
│   ├── EmergencyLoginForm.tsx
│   └── CriticalAllergies.tsx
├── organisms/
│   ├── QRGeneratorCard.tsx
│   ├── EmergencyInfoCard.tsx
│   ├── MedicalHistorySection.tsx
│   └── AuthenticationSection.tsx
├── templates/
│   ├── QRGeneratorLayout.tsx
│   └── EmergencyAccessLayout.tsx
└── pages/
    ├── EmergencyQRPage.tsx
    └── EmergencyAccessPage.tsx
```

### 12.2 Páginas Principales
```
src/app/
├── emergency/
│   ├── page.tsx                    # /emergency (generación QR)
│   └── [qrCode]/
│       └── page.tsx               # /emergency/{qr_code} (acceso)
└── qr-code/
    └── page.tsx                   # Alias para /emergency
```

### 12.3 Backend (Hexagonal Architecture)
```
backend/slices/emergency/
├── domain/
│   ├── entities/
│   │   ├── qr_code.py
│   │   ├── emergency_access.py
│   │   └── emergency_contact.py
│   └── models/
│       ├── qr_model.py
│       ├── access_log_model.py
│       └── emergency_contact_model.py
├── application/
│   ├── ports/
│   │   ├── qr_repository.py
│   │   └── emergency_repository.py
│   └── use_cases/
│       ├── generate_qr_code.py
│       ├── get_public_emergency_data.py
│       ├── get_complete_emergency_data.py
│       └── log_emergency_access.py
└── infrastructure/
    ├── api/
    │   └── emergency_endpoints.py
    └── persistence/
        ├── qr_repository.py
        └── emergency_repository.py
```

## 13. Casos de Prueba

### 13.1 Pruebas de Generación QR
- ✅ Paciente autenticado puede generar código QR
- ✅ Código QR anterior se invalida al generar nuevo
- ✅ Imagen QR se descarga correctamente
- ✅ URL de emergencia es accesible
- ✅ Código expira después de 365 días

### 13.2 Pruebas de Acceso Público
- ✅ Cualquier persona puede acceder con QR válido
- ✅ Información crítica se muestra sin autenticación
- ✅ Datos sensibles no se exponen en vista pública
- ✅ QR expirado muestra error apropiado
- ✅ QR inválido muestra error de no encontrado

### 13.3 Pruebas de Acceso Público
- ✅ Cualquier persona puede acceder a información de emergencia
- ✅ Información médica completa se muestra sin autenticación
- ✅ Accesos se registran en logs para estadísticas
- ✅ Pacientes pueden generar y gestionar sus QR codes
- ✅ Rate limiting previene abuso del sistema

### 13.4 Pruebas de Seguridad
- ✅ Rate limiting previene abuso de accesos
- ✅ Tokens JWT inválidos no permiten acceso completo
- ✅ Logs de auditoría capturan todos los accesos
- ✅ Información se encripta en tránsito (HTTPS)
- ✅ URLs de emergencia son impredecibles

## 14. Criterios de Aceptación

1. **CA001:** Paciente puede generar y gestionar código QR de emergencia
2. **CA002:** Cualquier persona puede acceder a información básica con QR válido
3. **CA003:** Cualquier persona puede acceder a información médica completa para emergencias
4. **CA004:** Información crítica (alergias, tipo sangre) es inmediatamente visible
5. **CA005:** Todos los accesos se registran para auditoría
6. **CA006:** Sistema funciona sin conexión a internet (información cacheada)
7. **CA007:** Páginas cargan en menos de 2 segundos (crítico para emergencias)
8. **CA008:** Interfaz es clara y usable en situaciones de estrés
9. **CA009:** Códigos QR expiran automáticamente por seguridad

## 15. Dependencias Técnicas

### 15.1 Frontend
- Next.js App Router con rutas dinámicas `[qrCode]`
- React Hook State para gestión de autenticación
- LocalStorage para tokens y datos de usuario
- Fetch API para llamadas a endpoints de emergencia
- Lucide React para iconografía médica
- Clipboard API para compartir URLs
- **Componentes Compartidos**:
  - `MinimalNavbar` (navbar simplificado para emergencias)
  - `MinimalFooter` (footer esencial solo con enlaces legales básicos)

### 15.2 Backend
- FastAPI con endpoints públicos y autenticados
- SQLAlchemy para modelos de QR y logs
- Rate limiting con Redis para prevenir abuso
- UUID para tokens únicos de QR
- Rate limiting con Redis
- Logging estructurado para auditoría

### 15.3 Servicios Externos
- QR Server API para generación de imágenes QR
- Servicios de geolocalización (futuro)
- APIs de hospitales y EPS (futuro)
- Servicios de notificación push (futuro)

## 16. Flujo de Datos

### 16.1 Generación de QR
```
Paciente → Autenticación → Generar QR → Invalidar Anterior → Crear Nuevo → Mostrar QR
```

### 16.2 Acceso de Emergencia Público
```
Escaneo QR → Validar Token → Cargar Datos Básicos → Mostrar Información Crítica
```

### 16.3 Acceso de Emergencia Completo
```
Escaneo QR → Validar QR → Cargar Datos Completos → Registrar Acceso Anónimo
```

### 16.4 Auditoría
```
Cada Acceso → Log de Auditoría → Base de Datos → Dashboard Admin → Reportes
```

## 17. Navegación y Rutas

### 17.1 Rutas Principales
- `/emergency` - Generación y gestión de códigos QR (requiere paciente autenticado)
- `/emergency/{qr_token}` - Acceso a información de emergencia (público/autenticado)
- `/qr-code` - Alias para `/emergency` (compatibilidad)

### 17.2 Redirecciones
- QR inválido → Página de error con opción de ir a inicio
- QR expirado → Página de error con instrucciones para regenerar
- Sin autenticación en `/emergency` → Redirección a login

### 17.3 Estados de URL
- **QR Válido**: Carga información de emergencia
- **QR Expirado**: Error 410 - Gone
- **QR No Encontrado**: Error 404 - Not Found
- **QR Invalidado**: Error 410 - Gone (fue invalidado manualmente)

## 18. Notas de Implementación

### 18.1 Brand Manual Compliance (EMERGENCY CRITICAL)
- **OBLIGATORIO**: Seguir `MANUAL_DE_MARCA.md` adaptado para emergencias médicas
- **Emergency Color Migration**: Migrar colores genéricos a sistema de emergencia VitalGo
  ```tsx
  // ✅ CORRECTO - Colores oficiales VitalGo para emergencias
  className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white" // QR generation
  className="bg-emergency-critical text-white" // Alergias críticas
  className="bg-gradient-to-r from-emergency-urgent to-emergency-critical" // Headers emergencia
  className="text-vitalgo-dark border-vitalgo-green" // Información médica estándar

  // ❌ INCORRECTO - Colores genéricos para emergencias
  className="bg-green-500 hover:bg-green-600" // QR genérico
  className="bg-red-500 text-white" // Emergencia genérica
  className="bg-gradient-to-r from-red-500 to-red-600" // Gradientes genéricos
  className="text-gray-900 border-green-500" // Información médica genérica
  ```
- **Emergency Typography**: Tamaños aumentados para situaciones de estrés
- **Asset Usage**: Logos oficiales VitalGo incluso en situaciones de emergencia
- **Performance Priority**: Velocidad > estética (pero manteniendo brand consistency)

### 18.2 Component Architecture (Emergency Specific)
- **QR Generation Navbar**: `MinimalNavbar` from `/src/shared/components/organisms/MinimalNavbar.tsx`
  - Props: `backText="Volver al Dashboard"`, `backUrl="/dashboard"`, `showLogo={true}`
  - Logo horizontal oficial azul (#002C41)
  - Diseño minimalista sin distracciones
- **Public QR Access**: **NO NAVBAR** para máxima velocidad de carga
- **QR Generation Footer**: `MinimalFooter` from `/src/shared/components/organisms/MinimalFooter.tsx`
- **Public QR Access**: **NO FOOTER** para performance crítico

### 18.3 Emergency Layout & Styling (Critical Brand Compliance)
```tsx
// QR GENERATION PAGE - ESTRUCTURA OBLIGATORIA
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest via-white to-green-50">
  <MinimalNavbar backText="Volver al Dashboard" backUrl="/dashboard" showLogo={true} />

  <main className="max-w-4xl mx-auto px-6 py-8">
    {/* Header con iconografía oficial VitalGo */}
    <div className="text-center mb-8">
      <div className="h-16 w-16 bg-vitalgo-green rounded-xl flex items-center justify-center mx-auto mb-4">
        <QrCodeIcon className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-vitalgo-dark">Código QR de Emergencia</h1>
    </div>

    {/* QR Card con brand styling */}
    <div className="bg-white rounded-xl shadow-xl border border-gray-200">
      <div className="bg-gradient-to-r from-vitalgo-green-lightest to-white p-6 border-b">
        <h2 className="text-xl font-semibold text-vitalgo-dark">Tu código QR personal</h2>
      </div>
    </div>
  </main>

  <MinimalFooter />
</div>

// PUBLIC QR ACCESS - ESTRUCTURA OPTIMIZADA
<div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
  {/* NO NAVBAR - Performance crítico */}

  <main className="max-w-4xl mx-auto px-6 py-4">
    {/* Emergency header con branding VitalGo */}
    <div className="bg-gradient-to-r from-emergency-urgent to-emergency-critical rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-center">
        <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mr-4">
          <img src="/assets/images/icons/vitalgo-heart.svg" className="h-8 w-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">🚨 EMERGENCIA MÉDICA</h1>
      </div>
    </div>

    {/* Medical info con brand colors para máxima legibilidad */}
  </main>

  {/* Footer mínimo con marca VitalGo */}
  <div className="text-center mt-8 pt-6 border-t border-gray-200">
    <img src="/assets/images/logos/vitalgo-icon-official.svg" className="h-6 w-6 mx-auto mb-2" />
    <span className="text-vitalgo-dark font-medium">VitalGo</span>
  </div>
</div>
```

### 18.4 Emergency Medical Cards (Brand Guidelines)
- **Critical Information**: Border izquierdo con `border-l-4 border-vitalgo-green`
- **Emergency Alerts**: Background `bg-emergency-background border-emergency-critical`
- **Typography Aumentada**: Text sizes aumentados para emergencias
- **Icon Containers**: `bg-vitalgo-green` para información estándar, `bg-emergency-critical` para alergias
- **Action Buttons**: `bg-vitalgo-green hover:bg-vitalgo-green-light` consistente

### 18.5 Critical Information Display (Emergency Optimized)
```tsx
// ALERGIAS CRÍTICAS - MÁXIMA VISIBILIDAD CON BRAND
<div className="bg-white rounded-xl shadow-lg border-l-4 border-emergency-critical p-6">
  <div className="flex items-center mb-4">
    <div className="h-10 w-10 bg-emergency-critical rounded-lg flex items-center justify-center mr-4">
      <AlertTriangleIcon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-bold text-emergency-critical">⚠️ ALERGIAS CRÍTICAS</h3>
  </div>
  {/* Allergies con emergency colors pero manteniendo consistencia VitalGo */}
</div>

// INFORMACIÓN MÉDICA BÁSICA - BRAND COMPLIANT
<div className="bg-white rounded-xl shadow-lg border-l-4 border-vitalgo-green p-6">
  <div className="flex items-center mb-4">
    <div className="h-10 w-10 bg-vitalgo-green rounded-lg flex items-center justify-center mr-4">
      <HeartIcon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-bold text-vitalgo-dark">Información Médica Básica</h3>
  </div>
  {/* Medical data con colores oficiales VitalGo */}
</div>
```

### 18.6 QR Code Generation (Brand Integration)
- **QR Display Area**: Background `bg-gray-50` con border `border-gray-200`
- **QR Actions**: Botones con iconos y colores oficiales VitalGo
- **Download Button**: `bg-vitalgo-green hover:bg-vitalgo-green-light`
- **Secondary Actions**: `border-vitalgo-green text-vitalgo-green` para outline
- **QR Metadata**: Typography con colores `text-vitalgo-dark-light`

### 18.7 Responsive Design (Emergency Optimized)
- **Mobile First**: Diseño principal para dispositivos de ambulancia (320px-767px)
- **Emergency Breakpoints**: Optimizados para tablets médicas y computadoras hospitalarias
- **Touch Targets**: Mínimo 48px para dispositivos móviles en emergencias
- **Typography Scaling**: Aumentada en todos los breakpoints para lectura bajo estrés
- **QR Code Sizing**: Responsive pero siempre legible (200px-300px)

### 18.8 Performance & Emergency Optimization
- **Critical Path**: Información médica carga primero, branding después
- **Inline CSS**: Critical CSS inline para headers de emergencia
- **Asset Optimization**: SVG logos oficiales para carga instantánea
- **No JavaScript Fallback**: Funcionalidad core funciona sin JS
- **CDN**: Assets VitalGo servidos desde CDN global
- **Caching Strategy**: Headers optimizados pero permitiendo updates de emergencia

### 18.9 Accessibility (Emergency Critical)
- **High Contrast**: Ratio mínimo 7:1 para información crítica
- **Emergency Typography**: Fonts aumentados para legibilidad bajo estrés
- **ARIA Emergency**: Labels específicos para información médica crítica
- **Screen Reader Priority**: Información crítica anunciada primero
- **Keyboard Emergency**: Tab order optimizado para datos más importantes
- **Touch Accessibility**: Targets aumentados para dispositivos de emergencia

### 18.10 Security & Medical Compliance
- **Public Access Design**: Información médica expuesta intencionalmente para emergencias
- **Audit Logging**: Todos los accesos registrados con metadata
- **Data Encryption**: Información en tránsito encriptada (HTTPS obligatorio)
- **Rate Limiting**: Protección contra abuso manteniendo acceso de emergencia
- **Medical Privacy**: Balance entre privacidad y acceso de emergencia
- **Compliance**: HIPAA/GDPR considerations para acceso público médico

### 18.11 Brand Consistency in Emergencies
- **Logo Presence**: Mantener iconografía VitalGo incluso en situaciones críticas
- **Color Hierarchy**: Colores de emergencia complementan, no reemplazan, brand colors
- **Typography**: Brand font stack mantenido con sizing emergencia
- **Asset Integrity**: Usar únicamente assets oficiales VitalGo
- **Brand Recognition**: Mantener identidad VitalGo para confianza en emergencias

## 19. Consideraciones Especiales

### 19.1 Emergencias Médicas
- **Tiempo de Respuesta**: Menos de 2 segundos para carga inicial
- **Información Crítica**: Tipo de sangre y alergias siempre visibles
- **Acceso sin Barreras**: Información básica sin requerir autenticación
- **Claridad Visual**: Colores y tipografía optimizados para situaciones de estrés

### 19.2 Protección de Privacidad
- **Datos Mínimos**: Solo información crítica en acceso público
- **Consentimiento Implícito**: Paciente acepta al generar QR
- **Retención de Logs**: 7 años para cumplimiento legal
- **Anonimización**: Datos personales anonimizados en reportes

### 19.3 Cumplimiento Regulatorio
- **GDPR**: Derecho al olvido y portabilidad de datos
- **HIPAA**: Protección de información médica
- **Ley de Datos Personales**: Cumplimiento legislación local
- **Auditorías**: Trazabilidad completa de accesos

## 20. Consideraciones Futuras

- **Integración Hospitalaria**: APIs con sistemas de hospitales
- **Geolocalización**: Tracking de ambulancias y ubicación de emergencias
- **Notificaciones Push**: Alertas a contactos de emergencia
- **IA Predictiva**: Análisis de patrones para mejorar tiempos de respuesta
- **Blockchain**: Inmutabilidad de registros médicos críticos
- **IoT Integration**: Sensores médicos y dispositivos wearables
- **Realidad Aumentada**: Overlay de información médica para personal de emergencia
- **Multi-idioma**: Soporte completo para comunidades internacionales

## 21. Playwright Testing Strategy (DEV_CONTEXT Compliance)

### 21.1 Data TestID Requirements (MANDATORY)

**CRITICAL**: Todos los elementos de emergencia DEBEN incluir `data-testid` siguiendo el patrón `emergency-component-element`:

#### 21.1.1 QR Generation Page TestIDs (/emergency)
| Elemento | data-testid | Descripción |
|----------|-------------|-------------|
| **Main container** | `emergency-qr-generator` | Main QR generation page |
| **Page header** | `emergency-header` | Emergency page header |
| **QR card container** | `emergency-qr-card` | QR code display card |
| **Current QR display** | `emergency-current-qr` | Active QR code image |
| **QR metadata** | `emergency-qr-metadata` | QR info (date, status) |
| **Generate new QR** | `emergency-generate-qr-button` | Create new QR button |
| **Download QR** | `emergency-download-qr-button` | Download QR image |
| **Share QR URL** | `emergency-share-url-button` | Copy URL to clipboard |
| **View QR page** | `emergency-view-page-button` | Open QR page in new tab |
| **QR instructions** | `emergency-instructions` | Usage instructions |
| **QR URL display** | `emergency-qr-url-display` | Emergency URL text |
| **QR status** | `emergency-qr-status` | Active/Expired status |
| **QR expiration** | `emergency-qr-expiration` | Expiration date |

#### 21.1.2 Emergency Access Page TestIDs (/emergency/{qr_code})
| Elemento | data-testid | Descripción |
|----------|-------------|-------------|
| **Main container** | `emergency-access-page` | Main emergency access page |
| **Emergency header** | `emergency-access-header` | Emergency page header |
| **Patient info section** | `emergency-patient-info` | Basic patient information |
| **Patient name** | `emergency-patient-name` | Patient full name |
| **Patient age** | `emergency-patient-age` | Patient age display |
| **Patient sex** | `emergency-patient-sex` | Biological sex display |
| **Patient blood type** | `emergency-patient-blood-type` | Blood type display |
| **Loading state** | `emergency-loading` | Loading spinner/skeleton |
| **Error message** | `emergency-error-message` | Error display |
| **QR expired message** | `emergency-qr-expired` | Expired QR error |
| **QR not found message** | `emergency-qr-not-found` | Invalid QR error |

#### 21.1.3 Medical Information Sections TestIDs
| Sección | data-testid | Descripción |
|---------|-------------|-------------|
| **Critical allergies** | `emergency-critical-allergies` | Critical allergies section |
| **Allergy item** | `emergency-allergy-item-{id}` | Individual allergy |
| **Allergy name** | `emergency-allergy-name-{id}` | Allergen name |
| **Allergy severity** | `emergency-allergy-severity-{id}` | Severity indicator |
| **Allergy severity badge** | `emergency-allergy-badge-{id}` | Severity badge |
| **Current medications** | `emergency-medications` | Medications section |
| **Medication item** | `emergency-medication-item-{id}` | Individual medication |
| **Medication name** | `emergency-medication-name-{id}` | Medication name |
| **Medication dosage** | `emergency-medication-dosage-{id}` | Dosage info |
| **Medication frequency** | `emergency-medication-frequency-{id}` | Frequency info |

#### 21.1.4 Emergency Contact Information TestIDs
| Campo | data-testid | Descripción |
|-------|-------------|-------------|
| **Emergency contact section** | `emergency-contact-info` | Emergency contact section |
| **Contact name** | `emergency-contact-name` | Emergency contact name |
| **Contact relationship** | `emergency-contact-relationship` | Relationship to patient |
| **Contact phone** | `emergency-contact-phone` | Primary phone number |
| **Contact alt phone** | `emergency-contact-alt-phone` | Alternative phone |
| **Call primary button** | `emergency-call-primary-button` | Call primary number |
| **Call alt button** | `emergency-call-alt-button` | Call alternative number |

#### 21.1.5 Medical History Sections TestIDs
| Sección | data-testid | Descripción |
|---------|-------------|-------------|
| **Medical basic info** | `emergency-medical-basic` | Basic medical info section |
| **EPS info** | `emergency-eps-info` | EPS information |
| **Health insurance** | `emergency-health-insurance` | Insurance info |
| **Medical conditions** | `emergency-medical-conditions` | Illnesses section |
| **Condition item** | `emergency-condition-item-{id}` | Individual condition |
| **Condition name** | `emergency-condition-name-{id}` | Condition name |
| **Condition chronic badge** | `emergency-condition-chronic-{id}` | Chronic indicator |
| **Surgeries section** | `emergency-surgeries` | Surgeries section |
| **Surgery item** | `emergency-surgery-item-{id}` | Individual surgery |
| **Surgery name** | `emergency-surgery-name-{id}` | Surgery name |
| **Surgery date** | `emergency-surgery-date-{id}` | Surgery date |
| **Surgery hospital** | `emergency-surgery-hospital-{id}` | Hospital info |

#### 21.1.6 Gynecological Information TestIDs (Conditional)
| Campo | data-testid | Descripción |
|-------|-------------|-------------|
| **Gynecological section** | `emergency-gynecological-info` | Gynecological info section |
| **Pregnancy status** | `emergency-pregnancy-status` | Current pregnancy status |
| **Pregnancy weeks** | `emergency-pregnancy-weeks` | Pregnancy weeks if applicable |
| **Pregnancy alert** | `emergency-pregnancy-alert` | Pregnancy warning/alert |
| **Last period** | `emergency-last-period` | Last menstrual period |
| **Obstetric history** | `emergency-obstetric-history` | Birth history |
| **Contraceptive method** | `emergency-contraceptive-method` | Current contraceptive |

#### 21.1.7 Authentication & Access TestIDs
| Elemento | data-testid | Descripción |
|----------|-------------|-------------|
| **Auth required message** | `emergency-auth-required` | Authentication needed message |
| **Login button** | `emergency-login-button` | Login to access button |
| **Owner access message** | `emergency-owner-access` | Owner-only access message |
| **Public access message** | `emergency-public-access` | Public access available message |
| **Access logged message** | `emergency-access-logged` | Access recorded notice |

#### 21.1.8 Navigation & Actions TestIDs
| Elemento | data-testid | Descripción |
|----------|-------------|-------------|
| **Back to dashboard** | `emergency-back-dashboard` | Return to dashboard |
| **Minimal navbar** | `emergency-minimal-navbar` | Simplified navigation |
| **Emergency footer** | `emergency-minimal-footer` | Emergency footer |
| **Share options** | `emergency-share-options` | Sharing options |
| **Print button** | `emergency-print-button` | Print emergency info |
| **Download PDF** | `emergency-download-pdf` | Download as PDF |

#### 21.1.9 Status & Alerts TestIDs
| Estado | data-testid | Descripción |
|--------|-------------|-------------|
| **Critical alert** | `emergency-critical-alert` | Critical medical alert |
| **Warning alert** | `emergency-warning-alert` | Medical warning |
| **Info alert** | `emergency-info-alert` | Information notice |
| **Success message** | `emergency-success-message` | Success confirmation |
| **QR valid indicator** | `emergency-qr-valid` | Valid QR indicator |
| **QR invalid indicator** | `emergency-qr-invalid` | Invalid QR indicator |
| **Last accessed info** | `emergency-last-accessed` | Last access timestamp |

### 21.2 Emergency QR Generation Structure with TestIDs

```tsx
<div data-testid="emergency-qr-generator" className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest via-white to-green-50">

  <MinimalNavbar data-testid="emergency-minimal-navbar" backText="Volver al Dashboard" backUrl="/dashboard" showLogo={true} />

  <main className="max-w-4xl mx-auto px-6 py-8">

    {/* Emergency Header */}
    <div data-testid="emergency-header" className="text-center mb-8">
      <div className="h-16 w-16 bg-vitalgo-green rounded-xl flex items-center justify-center mx-auto mb-4">
        <QrCodeIcon className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-vitalgo-dark">Código QR de Emergencia</h1>
      <p className="text-vitalgo-dark-light mt-2">
        Genera tu código QR personal para emergencias médicas
      </p>
    </div>

    {/* QR Card */}
    <div data-testid="emergency-qr-card" className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">

      <div className="bg-gradient-to-r from-vitalgo-green-lightest to-white p-6 border-b">
        <h2 className="text-xl font-semibold text-vitalgo-dark">Tu código QR personal</h2>
        <p className="text-vitalgo-dark-light">Comparte este código para acceso de emergencia</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* QR Display */}
          <div className="flex flex-col items-center">
            {currentQR ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <QRCodeSVG
                  data-testid="emergency-current-qr"
                  value={`${window.location.origin}/emergency/${currentQR.token}`}
                  size={250}
                />
                <div data-testid="emergency-qr-metadata" className="mt-4 text-center">
                  <p data-testid="emergency-qr-status" className={`text-sm font-medium ${
                    currentQR.isActive ? 'text-vitalgo-green' : 'text-red-600'
                  }`}>
                    {currentQR.isActive ? '✅ Activo' : '❌ Expirado'}
                  </p>
                  <p data-testid="emergency-qr-expiration" className="text-xs text-vitalgo-dark-light">
                    Expira: {formatDate(currentQR.expiresAt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-center justify-center h-64">
                <div className="text-center">
                  <QrCodeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-vitalgo-dark-light">No hay código QR generado</p>
                </div>
              </div>
            )}
          </div>

          {/* QR Actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-vitalgo-dark mb-2">
                URL de Emergencia
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p data-testid="emergency-qr-url-display" className="text-sm text-vitalgo-dark break-all">
                  {currentQR ? `${window.location.origin}/emergency/${currentQR.token}` : 'Genera un código QR primero'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                data-testid="emergency-generate-qr-button"
                onClick={generateNewQR}
                className="w-full bg-vitalgo-green hover:bg-vitalgo-green-light text-white"
                disabled={generating}
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                {currentQR ? 'Generar Nuevo QR' : 'Generar Código QR'}
              </Button>

              {currentQR && (
                <>
                  <Button
                    data-testid="emergency-download-qr-button"
                    onClick={downloadQR}
                    variant="outline"
                    className="w-full border-vitalgo-green text-vitalgo-green hover:bg-vitalgo-green hover:text-white"
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Descargar QR
                  </Button>

                  <Button
                    data-testid="emergency-share-url-button"
                    onClick={shareURL}
                    variant="outline"
                    className="w-full border-vitalgo-green text-vitalgo-green hover:bg-vitalgo-green hover:text-white"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Copiar URL
                  </Button>

                  <Button
                    data-testid="emergency-view-page-button"
                    onClick={() => window.open(`/emergency/${currentQR.token}`, '_blank')}
                    variant="outline"
                    className="w-full border-vitalgo-green text-vitalgo-green hover:bg-vitalgo-green hover:text-white"
                  >
                    <ExternalLinkIcon className="h-4 w-4 mr-2" />
                    Ver Página de Emergencia
                  </Button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* Instructions */}
    <div data-testid="emergency-instructions" className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Instrucciones de Uso</h3>
      <div className="space-y-3 text-blue-800">
        <div className="flex items-start">
          <span className="bg-blue-100 text-blue-900 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
          <p>Descarga la imagen del código QR o guarda la URL de emergencia</p>
        </div>
        <div className="flex items-start">
          <span className="bg-blue-100 text-blue-900 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
          <p>Coloca el código QR en un lugar visible (billetera, teléfono, nevera)</p>
        </div>
        <div className="flex items-start">
          <span className="bg-blue-100 text-blue-900 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
          <p>En caso de emergencia, cualquier persona puede escanear el código para acceder a tu información médica</p>
        </div>
        <div className="flex items-start">
          <span className="bg-blue-100 text-blue-900 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
          <p>El código QR expira automáticamente cada año por seguridad</p>
        </div>
      </div>
    </div>

  </main>

  <MinimalFooter data-testid="emergency-minimal-footer" />

</div>
```

### 21.3 Emergency Access Structure with TestIDs

```tsx
<div data-testid="emergency-access-page" className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">

  {/* Emergency Header - No Navbar for Performance */}
  <div data-testid="emergency-access-header" className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 shadow-lg">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center">
        <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mr-4">
          <img src="/assets/images/icons/vitalgo-heart.svg" className="h-8 w-8" alt="VitalGo" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">🚨 EMERGENCIA MÉDICA</h1>
          <p className="text-red-100">Información crítica del paciente</p>
        </div>
      </div>
    </div>
  </div>

  <main className="max-w-4xl mx-auto px-6 py-8">

    {loading ? (
      <div data-testid="emergency-loading" className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando información de emergencia...</p>
      </div>
    ) : error ? (
      <div data-testid="emergency-error-message" className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
        {error.includes('expired') ? (
          <div data-testid="emergency-qr-expired">
            <h3 className="font-bold">⏰ Código QR Expirado</h3>
            <p>Este código QR ha expirado. Solicita al paciente que genere uno nuevo.</p>
          </div>
        ) : (
          <div data-testid="emergency-qr-not-found">
            <h3 className="font-bold">❌ Código QR No Válido</h3>
            <p>Este código QR no existe o no es válido.</p>
          </div>
        )}
      </div>
    ) : (
      <div className="space-y-6">

        {/* Patient Basic Information */}
        <div data-testid="emergency-patient-info" className="bg-white rounded-xl shadow-lg border-l-4 border-vitalgo-green p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-vitalgo-green rounded-lg flex items-center justify-center mr-4">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-vitalgo-dark">Información del Paciente</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nombre</label>
              <p data-testid="emergency-patient-name" className="text-lg font-semibold text-vitalgo-dark">
                {patientData.personal_info.full_name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Edad</label>
              <p data-testid="emergency-patient-age" className="text-lg font-semibold text-vitalgo-dark">
                {patientData.personal_info.age} años
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Sexo</label>
              <p data-testid="emergency-patient-sex" className="text-lg font-semibold text-vitalgo-dark">
                {patientData.personal_info.biological_sex}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Tipo de Sangre</label>
              <p data-testid="emergency-patient-blood-type" className="text-lg font-semibold text-red-600">
                {patientData.medical_basic.blood_type || 'No definido'}
              </p>
            </div>
          </div>
        </div>

        {/* Critical Allergies */}
        {patientData.allergies && patientData.allergies.length > 0 && (
          <div data-testid="emergency-critical-allergies" className="bg-white rounded-xl shadow-lg border-l-4 border-red-600 p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-red-600">⚠️ ALERGIAS CRÍTICAS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientData.allergies.map((allergy, index) => (
                <div
                  key={index}
                  data-testid={`emergency-allergy-item-${index}`}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 data-testid={`emergency-allergy-name-${index}`} className="font-bold text-red-900">
                      {allergy.allergen}
                    </h4>
                    <span
                      data-testid={`emergency-allergy-badge-${index}`}
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        allergy.severity === 'CRÍTICA'
                          ? 'bg-red-600 text-white'
                          : allergy.severity === 'MODERADA'
                          ? 'bg-orange-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      <span data-testid={`emergency-allergy-severity-${index}`}>{allergy.severity}</span>
                    </span>
                  </div>
                  {allergy.symptoms && (
                    <p className="text-sm text-red-800">{allergy.symptoms}</p>
                  )}
                  {allergy.treatment && (
                    <p className="text-sm text-red-700 mt-1"><strong>Tratamiento:</strong> {allergy.treatment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Medications */}
        {patientData.current_medications && patientData.current_medications.length > 0 && (
          <div data-testid="emergency-medications" className="bg-white rounded-xl shadow-lg border-l-4 border-blue-600 p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <PillIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-blue-600">💊 MEDICAMENTOS ACTUALES</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientData.current_medications.map((medication, index) => (
                <div
                  key={index}
                  data-testid={`emergency-medication-item-${index}`}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <h4 data-testid={`emergency-medication-name-${index}`} className="font-bold text-blue-900">
                    {medication.name}
                  </h4>
                  <p data-testid={`emergency-medication-dosage-${index}`} className="text-sm text-blue-800">
                    <strong>Dosis:</strong> {medication.dosage}
                  </p>
                  <p data-testid={`emergency-medication-frequency-${index}`} className="text-sm text-blue-800">
                    <strong>Frecuencia:</strong> {medication.frequency}
                  </p>
                  {medication.prescribed_by && (
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>Prescrito por:</strong> {medication.prescribed_by}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div data-testid="emergency-contact-info" className="bg-white rounded-xl shadow-lg border-l-4 border-green-600 p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <PhoneIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-green-600">📞 CONTACTO DE EMERGENCIA</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 data-testid="emergency-contact-name" className="font-bold text-green-900 text-lg">
                {patientData.emergency_contact.name}
              </h4>
              <p data-testid="emergency-contact-relationship" className="text-green-800">
                {patientData.emergency_contact.relationship}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Button
                  data-testid="emergency-call-primary-button"
                  onClick={() => window.open(`tel:${patientData.emergency_contact.phone}`)}
                  className="bg-green-600 hover:bg-green-700 text-white mr-3"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
                <span data-testid="emergency-contact-phone" className="text-green-900 font-medium">
                  {patientData.emergency_contact.phone}
                </span>
              </div>
              {patientData.emergency_contact.alternative_phone && (
                <div className="flex items-center">
                  <Button
                    data-testid="emergency-call-alt-button"
                    onClick={() => window.open(`tel:${patientData.emergency_contact.alternative_phone}`)}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white mr-3"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Alt
                  </Button>
                  <span data-testid="emergency-contact-alt-phone" className="text-green-800">
                    {patientData.emergency_contact.alternative_phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Conditions */}
        {patientData.illnesses && patientData.illnesses.length > 0 && (
          <div data-testid="emergency-medical-conditions" className="bg-white rounded-xl shadow-lg border-l-4 border-purple-600 p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <ActivityIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-purple-600">🏥 CONDICIONES MÉDICAS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientData.illnesses.map((condition, index) => (
                <div
                  key={index}
                  data-testid={`emergency-condition-item-${index}`}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 data-testid={`emergency-condition-name-${index}`} className="font-bold text-purple-900">
                      {condition.name}
                    </h4>
                    {condition.is_chronic && (
                      <span
                        data-testid={`emergency-condition-chronic-${index}`}
                        className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                      >
                        CRÓNICA
                      </span>
                    )}
                  </div>
                  {condition.cie10_code && (
                    <p className="text-sm text-purple-700"><strong>CIE-10:</strong> {condition.cie10_code}</p>
                  )}
                  {condition.treatment && (
                    <p className="text-sm text-purple-800 mt-1"><strong>Tratamiento:</strong> {condition.treatment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gynecological Information (if applicable) */}
        {patientData.gynecological_history && patientData.personal_info.biological_sex === 'femenino' && (
          <div data-testid="emergency-gynecological-info" className="bg-white rounded-xl shadow-lg border-l-4 border-pink-600 p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-pink-600 rounded-lg flex items-center justify-center mr-4">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-pink-600">🤱 INFORMACIÓN GINECOLÓGICA</h2>
            </div>

            {patientData.gynecological_history.is_pregnant && (
              <div data-testid="emergency-pregnancy-alert" className="bg-pink-100 border border-pink-300 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircleIcon className="h-6 w-6 text-pink-600 mr-3" />
                  <div>
                    <h4 className="font-bold text-pink-900">⚠️ EMBARAZO EN CURSO</h4>
                    <p data-testid="emergency-pregnancy-status" className="text-pink-800">
                      Embarazada
                      {patientData.gynecological_history.pregnancy_weeks && (
                        <span data-testid="emergency-pregnancy-weeks"> - {patientData.gynecological_history.pregnancy_weeks} semanas</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {patientData.gynecological_history.last_menstrual_period && (
                <div>
                  <label className="block font-medium text-pink-700">Última Menstruación</label>
                  <p data-testid="emergency-last-period" className="text-pink-900">
                    {formatDate(patientData.gynecological_history.last_menstrual_period)}
                  </p>
                </div>
              )}
              {patientData.gynecological_history.contraceptive_method && (
                <div>
                  <label className="block font-medium text-pink-700">Método Anticonceptivo</label>
                  <p data-testid="emergency-contraceptive-method" className="text-pink-900">
                    {patientData.gynecological_history.contraceptive_method}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    )}

    {/* Access Logged Notice */}
    <div data-testid="emergency-access-logged" className="mt-8 bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600">
        <span data-testid="emergency-last-accessed">Acceso registrado: {new Date().toLocaleString()}</span> •
        Esta consulta ha sido registrada para fines de auditoría médica
      </p>
    </div>

  </main>

  {/* Minimal Footer with VitalGo Branding */}
  <div data-testid="emergency-minimal-footer" className="text-center mt-8 pt-6 border-t border-gray-200">
    <img src="/assets/images/logos/vitalgo-icon-official.svg" className="h-6 w-6 mx-auto mb-2" alt="VitalGo" />
    <span className="text-vitalgo-dark font-medium">VitalGo</span>
    <p className="text-xs text-gray-500 mt-1">Sistema de emergencias médicas</p>
  </div>

</div>
```

### 21.4 E2E Test Scenarios (Playwright)

#### 21.4.1 QR Generation Flow Tests
```typescript
// tests/emergency-qr-generation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('RF004 - Emergency QR Generation', () => {

  test('emergency-qr-generation-authenticated-patient', async ({ page }) => {
    // Login as patient
    await page.goto('/login');
    await page.getByTestId('auth-email-input').fill('patient@test.com');
    await page.getByTestId('auth-password-input').fill('password123');
    await page.getByTestId('auth-login-submit').click();

    // Navigate to emergency QR generation
    await page.goto('/emergency');
    await expect(page.getByTestId('emergency-qr-generator')).toBeVisible();

    // Verify header and instructions
    await expect(page.getByTestId('emergency-header')).toBeVisible();
    await expect(page.getByTestId('emergency-header')).toContainText('Código QR de Emergencia');
    await expect(page.getByTestId('emergency-instructions')).toBeVisible();

    // Generate QR code
    await page.getByTestId('emergency-generate-qr-button').click();

    // Verify QR code appears
    await expect(page.getByTestId('emergency-current-qr')).toBeVisible();
    await expect(page.getByTestId('emergency-qr-status')).toContainText('Activo');
    await expect(page.getByTestId('emergency-qr-url-display')).toContainText('/emergency/');

    // Verify action buttons are available
    await expect(page.getByTestId('emergency-download-qr-button')).toBeVisible();
    await expect(page.getByTestId('emergency-share-url-button')).toBeVisible();
    await expect(page.getByTestId('emergency-view-page-button')).toBeVisible();
  });

  test('emergency-qr-requires-authentication', async ({ page }) => {
    // Try to access emergency page without authentication
    await page.goto('/emergency');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
    await expect(page.getByTestId('auth-login-form')).toBeVisible();
  });

  test('emergency-qr-requires-complete-profile', async ({ page }) => {
    // Mock incomplete profile
    await page.route('**/api/v1/profile/me/completeness', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          is_complete: false,
          mandatory_fields_completed: false,
          completion_percentage: 60
        })
      });
    });

    // Login and try to access emergency
    await page.goto('/login');
    // ... login process
    await page.goto('/emergency');

    // Should redirect to profile completion
    await expect(page).toHaveURL('/profile/complete');
    await expect(page.getByTestId('profile-complete-wizard')).toBeVisible();
  });

  test('emergency-qr-download-functionality', async ({ page }) => {
    await page.goto('/emergency');
    // ... generate QR

    // Test download functionality
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('emergency-download-qr-button').click();
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(/vitalgo.*qr.*\.png$/i);
  });

  test('emergency-qr-share-url-functionality', async ({ page }) => {
    await page.goto('/emergency');
    // ... generate QR

    // Mock clipboard API
    await page.evaluate(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: async (text) => {
            window.clipboardText = text;
          }
        }
      });
    });

    // Test share URL
    await page.getByTestId('emergency-share-url-button').click();

    // Verify URL was copied to clipboard
    const clipboardText = await page.evaluate(() => window.clipboardText);
    expect(clipboardText).toContain('/emergency/');
  });

  test('emergency-qr-regenerate-invalidates-previous', async ({ page }) => {
    await page.goto('/emergency');

    // Generate first QR
    await page.getByTestId('emergency-generate-qr-button').click();
    const firstQRUrl = await page.getByTestId('emergency-qr-url-display').textContent();

    // Generate new QR
    await page.getByTestId('emergency-generate-qr-button').click();
    const secondQRUrl = await page.getByTestId('emergency-qr-url-display').textContent();

    // URLs should be different
    expect(firstQRUrl).not.toBe(secondQRUrl);

    // First QR should be invalidated (test by trying to access it)
    const firstQRToken = firstQRUrl?.split('/emergency/')[1];
    if (firstQRToken) {
      await page.goto(`/emergency/${firstQRToken}`);
      await expect(page.getByTestId('emergency-qr-expired')).toBeVisible();
    }
  });
});
```

#### 21.4.2 Emergency Access Flow Tests
```typescript
test.describe('RF004 - Emergency Access', () => {

  test('emergency-access-valid-qr-shows-patient-info', async ({ page }) => {
    // Mock valid QR response
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          patient: {
            personal_info: {
              full_name: 'Juan Carlos Pérez',
              age: 35,
              biological_sex: 'masculino',
              residence_address: 'Carrera 45 #12-34'
            },
            medical_basic: {
              blood_type: 'O+',
              eps: 'Sura'
            },
            emergency_contact: {
              name: 'María Pérez',
              relationship: 'esposa',
              phone: '+573123456789',
              alternative_phone: '+573098765432'
            }
          },
          current_medications: [
            {
              name: 'Losartán',
              dosage: '50mg',
              frequency: 'Una vez al día',
              prescribed_by: 'Dr. García'
            }
          ],
          allergies: [
            {
              allergen: 'Penicilina',
              severity: 'CRÍTICA',
              symptoms: 'Anafilaxis',
              treatment: 'Epinefrina inmediata'
            }
          ]
        })
      });
    });

    await page.goto('/emergency/test-qr-token');

    // Verify page loads and shows emergency header
    await expect(page.getByTestId('emergency-access-page')).toBeVisible();
    await expect(page.getByTestId('emergency-access-header')).toContainText('EMERGENCIA MÉDICA');

    // Verify patient basic info
    await expect(page.getByTestId('emergency-patient-info')).toBeVisible();
    await expect(page.getByTestId('emergency-patient-name')).toContainText('Juan Carlos Pérez');
    await expect(page.getByTestId('emergency-patient-age')).toContainText('35 años');
    await expect(page.getByTestId('emergency-patient-sex')).toContainText('masculino');
    await expect(page.getByTestId('emergency-patient-blood-type')).toContainText('O+');

    // Verify critical allergies section
    await expect(page.getByTestId('emergency-critical-allergies')).toBeVisible();
    await expect(page.getByTestId('emergency-allergy-item-0')).toBeVisible();
    await expect(page.getByTestId('emergency-allergy-name-0')).toContainText('Penicilina');
    await expect(page.getByTestId('emergency-allergy-severity-0')).toContainText('CRÍTICA');
    await expect(page.getByTestId('emergency-allergy-badge-0')).toHaveClass(/bg-red-600/);

    // Verify medications section
    await expect(page.getByTestId('emergency-medications')).toBeVisible();
    await expect(page.getByTestId('emergency-medication-item-0')).toBeVisible();
    await expect(page.getByTestId('emergency-medication-name-0')).toContainText('Losartán');
    await expect(page.getByTestId('emergency-medication-dosage-0')).toContainText('50mg');

    // Verify emergency contact
    await expect(page.getByTestId('emergency-contact-info')).toBeVisible();
    await expect(page.getByTestId('emergency-contact-name')).toContainText('María Pérez');
    await expect(page.getByTestId('emergency-contact-relationship')).toContainText('esposa');
    await expect(page.getByTestId('emergency-contact-phone')).toContainText('+573123456789');
    await expect(page.getByTestId('emergency-contact-alt-phone')).toContainText('+573098765432');

    // Verify access logged
    await expect(page.getByTestId('emergency-access-logged')).toBeVisible();
    await expect(page.getByTestId('emergency-last-accessed')).toBeVisible();
  });

  test('emergency-access-expired-qr-shows-error', async ({ page }) => {
    // Mock expired QR response
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 410,
        contentType: 'application/json',
        body: JSON.stringify({
          valid: false,
          error: 'QR_EXPIRED',
          message: 'Código QR expirado'
        })
      });
    });

    await page.goto('/emergency/expired-qr-token');

    // Verify error message displays
    await expect(page.getByTestId('emergency-error-message')).toBeVisible();
    await expect(page.getByTestId('emergency-qr-expired')).toBeVisible();
    await expect(page.getByTestId('emergency-qr-expired')).toContainText('Código QR Expirado');
  });

  test('emergency-access-invalid-qr-shows-not-found', async ({ page }) => {
    // Mock invalid QR response
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          valid: false,
          error: 'QR_NOT_FOUND',
          message: 'Código QR no encontrado'
        })
      });
    });

    await page.goto('/emergency/invalid-qr-token');

    // Verify not found error
    await expect(page.getByTestId('emergency-error-message')).toBeVisible();
    await expect(page.getByTestId('emergency-qr-not-found')).toBeVisible();
    await expect(page.getByTestId('emergency-qr-not-found')).toContainText('Código QR No Válido');
  });

  test('emergency-access-call-functionality', async ({ page }) => {
    // Mock QR with emergency contact
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          patient: {
            emergency_contact: {
              name: 'Contact Person',
              phone: '+573123456789',
              alternative_phone: '+573098765432'
            }
          }
        })
      });
    });

    await page.goto('/emergency/test-qr-token');

    // Test call buttons
    await expect(page.getByTestId('emergency-call-primary-button')).toBeVisible();
    await expect(page.getByTestId('emergency-call-alt-button')).toBeVisible();

    // Verify tel: links
    await expect(page.getByTestId('emergency-call-primary-button')).toHaveAttribute('href', undefined); // Button doesn't have href, uses onClick
    // Verify click would trigger tel: link
    await page.getByTestId('emergency-call-primary-button').click();
  });

  test('emergency-access-pregnancy-alert-for-females', async ({ page }) => {
    // Mock pregnant female patient
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          patient: {
            personal_info: { biological_sex: 'femenino' },
            gynecological_history: {
              is_pregnant: true,
              pregnancy_weeks: 32
            }
          }
        })
      });
    });

    await page.goto('/emergency/test-qr-token');

    // Verify gynecological section and pregnancy alert
    await expect(page.getByTestId('emergency-gynecological-info')).toBeVisible();
    await expect(page.getByTestId('emergency-pregnancy-alert')).toBeVisible();
    await expect(page.getByTestId('emergency-pregnancy-status')).toContainText('Embarazada');
    await expect(page.getByTestId('emergency-pregnancy-weeks')).toContainText('32 semanas');
  });

  test('emergency-access-no-gynecological-for-males', async ({ page }) => {
    // Mock male patient
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          patient: {
            personal_info: { biological_sex: 'masculino' }
          }
        })
      });
    });

    await page.goto('/emergency/test-qr-token');

    // Gynecological section should not be visible
    await expect(page.getByTestId('emergency-gynecological-info')).not.toBeVisible();
  });
});
```

#### 21.4.3 Performance & Emergency Response Tests
```typescript
test.describe('RF004 - Emergency Performance & Response', () => {

  test('emergency-access-loads-within-2-seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/emergency/test-qr-token');

    // Wait for critical content to load
    await page.getByTestId('emergency-patient-info').waitFor();
    const loadTime = Date.now() - startTime;

    // Emergency page must load within 2 seconds
    expect(loadTime).toBeLessThan(2000);

    // Verify critical information is immediately visible
    await expect(page.getByTestId('emergency-patient-blood-type')).toBeVisible();
    await expect(page.getByTestId('emergency-contact-info')).toBeVisible();
  });

  test('emergency-access-works-without-javascript', async ({ page }) => {
    // Disable JavaScript
    await page.setJavaScriptEnabled(false);
    await page.goto('/emergency/test-qr-token');

    // Basic content should still be visible
    await expect(page.getByTestId('emergency-access-header')).toBeVisible();
    // Note: Some features may not work without JS, but critical info should display
  });

  test('emergency-access-mobile-responsive', async ({ page }) => {
    // Test mobile viewport (ambulance tablet size)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/emergency/test-qr-token');

    // Verify mobile layout
    await expect(page.getByTestId('emergency-access-page')).toBeVisible();
    await expect(page.getByTestId('emergency-patient-info')).toBeVisible();

    // Emergency contact buttons should be touch-friendly
    const callButton = page.getByTestId('emergency-call-primary-button');
    const buttonBox = await callButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Minimum touch target
  });

  test('emergency-critical-info-high-contrast', async ({ page }) => {
    await page.goto('/emergency/test-qr-token');

    // Verify high contrast for critical information
    const criticalAllergies = page.getByTestId('emergency-critical-allergies');
    await expect(criticalAllergies).toHaveClass(/border-red-600/);

    const bloodType = page.getByTestId('emergency-patient-blood-type');
    await expect(bloodType).toHaveClass(/text-red-600/);

    // Verify emergency header has strong contrast
    const emergencyHeader = page.getByTestId('emergency-access-header');
    await expect(emergencyHeader).toHaveClass(/from-red-600/);
  });

  test('emergency-loading-state-optimization', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/v1/emergency/qr/*', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ patient: { personal_info: { full_name: 'Test' } } })
        });
      }, 1500);
    });

    await page.goto('/emergency/test-qr-token');

    // Loading state should be visible immediately
    await expect(page.getByTestId('emergency-loading')).toBeVisible();
    await expect(page.getByTestId('emergency-loading')).toContainText('Cargando información de emergencia');

    // Content should appear after loading
    await expect(page.getByTestId('emergency-patient-info')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('emergency-loading')).not.toBeVisible();
  });
});
```

#### 21.4.4 Security & Access Control Tests
```typescript
test.describe('RF004 - Security & Access Control', () => {

  test('emergency-qr-tokens-are-unpredictable', async ({ page }) => {
    await page.goto('/emergency');

    // Generate multiple QR codes and verify tokens are random
    const tokens = [];

    for (let i = 0; i < 3; i++) {
      await page.getByTestId('emergency-generate-qr-button').click();
      const url = await page.getByTestId('emergency-qr-url-display').textContent();
      const token = url?.split('/emergency/')[1];
      if (token) {
        tokens.push(token);
      }
    }

    // Verify all tokens are different and follow UUID pattern
    expect(new Set(tokens).size).toBe(tokens.length); // All unique
    tokens.forEach(token => {
      expect(token).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i);
    });
  });

  test('emergency-access-logs-are-recorded', async ({ page }) => {
    // Mock successful access
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          patient: { personal_info: { full_name: 'Test Patient' } },
          access_timestamp: new Date().toISOString()
        })
      });
    });

    await page.goto('/emergency/test-qr-token');

    // Verify access logging message is displayed
    await expect(page.getByTestId('emergency-access-logged')).toBeVisible();
    await expect(page.getByTestId('emergency-access-logged')).toContainText('Acceso registrado');
    await expect(page.getByTestId('emergency-access-logged')).toContainText('auditoría médica');
  });

  test('emergency-rate-limiting-protection', async ({ page }) => {
    // Mock rate limiting response
    await page.route('**/api/v1/emergency/qr/*', route => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Demasiados accesos. Intenta nuevamente en unos minutos.'
        })
      });
    });

    await page.goto('/emergency/test-qr-token');

    // Should show rate limiting error
    await expect(page.getByTestId('emergency-error-message')).toBeVisible();
    await expect(page.getByTestId('emergency-error-message')).toContainText('Demasiados accesos');
  });

  test('emergency-https-required', async ({ page }) => {
    // Verify that emergency pages require HTTPS in production
    // This test would be environment-specific

    // For now, verify that the page loads over secure connection
    const response = await page.goto('/emergency/test-qr-token');
    expect(response?.url()).toMatch(/^https:\/\//);
  });
});
```

#### 21.4.5 Cross-RF Integration Tests
```typescript
test.describe('RF004 - Cross-RF Integration', () => {

  test('emergency-qr-generation-requires-complete-profile', async ({ page }) => {
    // Test integration with RF002 (profile completion)
    // Mock incomplete profile
    await page.route('**/api/v1/profile/me/completeness', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          is_complete: false,
          mandatory_fields_completed: false,
          missing_mandatory_fields: ['emergency_contact_name', 'blood_type']
        })
      });
    });

    await page.goto('/emergency');

    // Should redirect to profile completion
    await expect(page).toHaveURL('/profile/complete');
    await expect(page.getByTestId('profile-complete-wizard')).toBeVisible();
  });

  test('emergency-qr-reflects-dashboard-data', async ({ page }) => {
    // Test integration with RF003 (dashboard)
    // Mock dashboard data
    await page.route('**/api/v1/dashboard/data', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { bloodType: 'AB+' },
          medications: [
            { id: 1, name: 'Insulin', isActive: true }
          ],
          allergies: [
            { id: 1, name: 'Shellfish', severity: 'CRITICAL' }
          ]
        })
      });
    });

    // Generate QR from dashboard
    await page.goto('/dashboard');
    await page.getByTestId('dashboard-generate-qr-button').click();

    // Access the QR page
    const qrUrl = await page.getByTestId('dashboard-qr-url-display').textContent();
    const qrToken = qrUrl?.split('/emergency/')[1];

    if (qrToken) {
      await page.goto(`/emergency/${qrToken}`);

      // Verify data matches dashboard
      await expect(page.getByTestId('emergency-patient-blood-type')).toContainText('AB+');
      await expect(page.getByTestId('emergency-medication-name-0')).toContainText('Insulin');
      await expect(page.getByTestId('emergency-allergy-name-0')).toContainText('Shellfish');
    }
  });

  test('emergency-navigation-from-signup-flow', async ({ page }) => {
    // Test integration with RF001 (signup)
    // Complete signup process
    await page.goto('/signup/paciente');
    // ... complete signup
    // ... complete profile (RF002)
    // Should be able to access emergency QR generation

    await page.goto('/emergency');
    await expect(page.getByTestId('emergency-qr-generator')).toBeVisible();
  });
});
```

---

**Documento preparado por:** AI Assistant & Jhonatan Rico & Daniela Quintero
**Revisado por:** [Jhonatan Rico]
**Aprobado por:** [Daniela Quintero]