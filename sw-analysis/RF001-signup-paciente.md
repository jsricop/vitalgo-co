# RF001 - Signup Paciente (/signup/paciente)

**Fecha:** 2025-09-17
**Versión:** 1.0
**Estado:** Pendiente Implementación
**Prioridad:** Alta

## 1. Descripción General

Formulario de registro para pacientes que permite crear una cuenta en el sistema VitalGo, capturando información personal básica y de autenticación necesaria para acceder a los servicios médicos digitales.

## 2. Objetivo

Permitir a los usuarios registrarse como pacientes en la plataforma VitalGo, garantizando la seguridad, integridad y privacidad de los datos médicos desde el momento del registro.

## 3. Actores

- **Actor Principal:** Usuario no registrado (Paciente potencial)
- **Actor Secundario:** Sistema VitalGo
- **Actor Externo:** Servicio de verificación de email

## 4. Precondiciones

- Usuario debe acceder desde la página de inicio
- Usuario debe tener conexión a internet
- Usuario debe tener una dirección de email válida
- Usuario debe ser mayor de edad

## 5. Flujo Principal

### 5.1 Acceso al formulario
1. Usuario hace clic en botón "Soy Paciente" en homepage
2. Sistema redirige a `/signup/paciente`
3. Sistema muestra formulario de registro con navbar

### 5.2 Completar formulario
1. Usuario completa todos los campos obligatorios
2. Sistema valida cada campo al salir del campo (onBlur)
3. Usuario acepta términos y condiciones
4. Usuario acepta política de privacidad
5. Sistema habilita botón "Crear cuenta"

### 5.3 Envío y procesamiento
1. Usuario hace clic en "Crear cuenta"
2. Sistema valida todos los datos
3. Sistema crea usuario en base de datos
4. Sistema realiza auto-login
5. Sistema redirige a completar datos médicos

## 6. Campos del Formulario

### 6.1 Información Personal

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Nombre completo** | Text | Mínimo 2 palabras, máximo 100 caracteres | ✅ |
| **Tipo de documento** | Select | Valores válidos colombianos | ✅ |
| **Número de documento** | Numeric | Único en sistema, formato según tipo | ✅ |
| **Teléfono** | Phone | Formato internacional con código país | ✅ |
| **Fecha de nacimiento** | Date | Mayor de edad, formato dd/mm/yyyy | ✅ |

### 6.2 Información de Cuenta

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Email** | Email | Regex RFC 5322, único en sistema | ✅ |
| **Contraseña** | Password | Cumplir política de seguridad | ✅ |
| **Confirmar contraseña** | Password | Coincidir con contraseña | ✅ |

### 6.3 Aceptaciones Legales

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Términos y condiciones** | Checkbox | Debe estar marcado | ✅ |
| **Política de privacidad** | Checkbox | Debe estar marcado | ✅ |

## 7. Validaciones Detalladas

### 7.1 Nombre Completo
- Mínimo 2 palabras separadas por espacio
- Solo letras, espacios y tildes
- Máximo 100 caracteres
- No números ni caracteres especiales

### 7.2 Tipo de Documento
**Opciones disponibles (Colombia):**
- CC - Cédula de Ciudadanía
- TI - Tarjeta de Identidad (Si se selecciona este no se debe permitir el registro, dado que lo debe hacer el tutor legal. Mostrar alerta y desactivar los botones. Validación solo a nivel de front, en el back se pueden guardar usuarios menores de edad pero desde otro formulario)
- CE - Cédula de Extranjería
- PA - Pasaporte
- RC - Registro Civil (Si se selecciona este no se debe permitir el registro, dado que lo debe hacer el tutor legal. Mostrar alerta y desactivar los botones.Validación solo a nivel de front, en el back se pueden guardar usuarios menores de edad pero desde otro formulario)
- AS - Adulto sin Identificar
- MS - Menor sin Identificar (Si se selecciona este no se debe permitir el registro, dado que lo debe hacer el tutor legal. Mostrar alerta y desactivar los botones.Validación solo a nivel de front, en el back se pueden guardar usuarios menores de edad pero desde otro formulario)

### 7.3 Número de Documento
- Solo números para CC y CE. Alfanumérico para PA.
- Validación de formato según tipo:
  - CC: 8-10 dígitos
  - TI: 8-11 dígitos
  - CE: 6-9 dígitos
  - PA: 6-12 caracteres alfanuméricos
- Único en todo el sistema
- **Validación onBlur**: Verificación de unicidad al salir del campo

### 7.4 Teléfono
- Selector de país con bandera
- Código país automático (+57 para Colombia por defecto)
- Validación de formato según país seleccionado
- Almacenamiento en formato internacional: +573123456789
- Libería sugerida: react-phone-number-input

### 7.5 Fecha de Nacimiento
- Formato dd/mm/yyyy
- Calendar picker
- Edad mínima: 18 años
- Edad máxima: 120 años
- Si es menor de 18 años no se debe permitir el registro, dado que lo debe hacer el tutor legal. Mostrar alerta y desactivar los botones
- No fechas futuras

### 7.6 Email
- Validación con regex RFC 5322
- Único en todo el sistema
- Conversión automática a minúsculas
- **Validación onBlur**: Verificación de unicidad y dominio al salir del campo

### 7.7 Política de Contraseñas
**Requisitos obligatorios:**
- Mínimo 8 caracteres
- Máximo 128 caracteres
- Al menos 1 letra mayúscula
- Al menos 1 letra minúscula
- Al menos 1 número
- Al menos 1 carácter especial: !@#$%^&*()_+-=[]{}|;:,.<>?
- No debe contener el email del usuario
- No debe contener palabras comunes (diccionario)

## 8. Brand Manual Compliance & Interface Elements

### 8.1 BRAND MANUAL COMPLIANCE
**MANDATORY**: Esta página DEBE seguir completamente las especificaciones del `MANUAL_DE_MARCA.md`

#### 8.1.1 Color Scheme (Estricto)
```css
/* USAR ESTOS COLORES OFICIALES EXCLUSIVAMENTE */
--vitalgo-green: #01EF7F        /* Verde principal oficial - Botones principales */
--vitalgo-green-light: #5AF4AC   /* Verde claro oficial - Hover states */
--vitalgo-green-lighter: #99F9CC /* Verde más claro oficial - Estados de validación exitosa */
--vitalgo-green-lightest: #CCFCE5 /* Verde muy claro oficial - Backgrounds sutiles */
--vitalgo-dark: #002C41          /* Azul oscuro principal oficial - Textos y headers */
--vitalgo-dark-light: #406171    /* Azul medio oficial - Textos secundarios */
--vitalgo-dark-lighter: #99ABB3  /* Azul claro oficial - Placeholders */
```

#### 8.1.2 Typography System
```css
/* TIPOGRAFÍA OFICIAL OBLIGATORIA */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
/* Jerarquía según manual de marca */
h1: 2.5rem (40px) font-bold - Título principal página
h2: 2rem (32px) font-semibold - Títulos de sección
h3: 1.5rem (24px) font-medium - Subtítulos
body: 1rem (16px) font-normal - Texto general
small: 0.875rem (14px) font-normal - Textos auxiliares
label: 0.875rem (14px) font-medium - Labels de formulario
```

#### 8.1.3 Logo & Asset Requirements
```tsx
/* ASSETS OFICIALES OBLIGATORIOS */
Logo Principal: "/assets/images/logos/vitalgo-logo-horizontal-official.svg"
Logo Alternativo: "/assets/images/logos/vitalgo-logo-official.svg"
Favicon: "/favicon.ico"
Iconos: "/assets/images/icons/" (usar solo iconos oficiales VitalGo)
```

#### 8.1.4 Spacing System (4px Base)
```css
/* SISTEMA DE ESPACIADO OFICIAL */
form-sections: space-y-6 (24px entre secciones)
form-fields: space-y-4 (16px entre campos)
padding-form: p-6 md:p-8 (24px mobile, 32px desktop)
margin-container: mx-auto max-w-md (contenedor centrado)
border-radius: rounded-xl (12px) para cards principales
border-radius: rounded-lg (8px) para inputs y botones
```

### 8.2 Navbar Specification (MANDATORY)
**COMPONENT**: `PublicNavbar` from `/src/shared/components/organisms/PublicNavbar.tsx`

```tsx
<PublicNavbar
  showBackButton={true}
  backUrl="/"
  backText="Volver al inicio"
  className="bg-white border-b border-gray-200"
/>
```

**BRAND FEATURES**:
- VitalGo logo horizontal oficial azul (#002C41)
- Botón back con color hover `text-vitalgo-green`
- Navegación inteligente al homepage (/)
- Responsive con breakpoints oficiales del manual de marca
- Altura estándar: h-16 (64px)
- ARIA labels en español para accesibilidad

### 8.3 Footer Specification (MANDATORY)
**COMPONENT**: `PublicFooter` from `/src/shared/components/organisms/PublicFooter.tsx`

```tsx
<PublicFooter
  whatsappNumber="+573001234567"
  className="bg-white border-t border-gray-200"
/>
```

**BRAND FEATURES**:
- Logo footer oficial VitalGo
- Enlaces legales: Términos y Condiciones, Política de Privacidad
- Sección de soporte: WhatsApp, LinkedIn, contacto
- Selector de idioma (español/inglés)
- Copyright con año dinámico
- Información completa de la empresa según manual de marca

### 8.4 Form Layout (Brand Compliant)
```tsx
/* CONTENEDOR PRINCIPAL */
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest to-white">
  <div className="max-w-md mx-auto px-4 py-8">
    {/* CARD DEL FORMULARIO */}
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
      {/* HEADER CON MARCA */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-vitalgo-dark mb-2">
          Crear cuenta como paciente
        </h1>
        <p className="text-vitalgo-dark-light">
          Únete a VitalGo y gestiona tu salud digitalmente
        </p>
      </div>
      {/* FORMULARIO */}
    </div>
  </div>
</div>
```

### 8.5 Form Fields (Brand Styling)
```tsx
/* INPUTS OFICIALES */
<input className="w-full px-3 py-3 border border-gray-300 rounded-lg
                 focus:border-vitalgo-green focus:ring-2 focus:ring-vitalgo-green/20
                 transition-colors placeholder-vitalgo-dark-lighter" />

/* LABELS OFICIALES */
<label className="block text-sm font-medium text-vitalgo-dark mb-2">
  Nombre completo <span className="text-red-500">*</span>
</label>

/* SELECT DROPDOWNS */
<select className="w-full px-3 py-3 border border-gray-300 rounded-lg
                  focus:border-vitalgo-green focus:ring-2 focus:ring-vitalgo-green/20
                  bg-white text-vitalgo-dark">
```

### 8.6 Validation States (Brand Colors)
```tsx
/* ESTADO VÁLIDO */
<div className="border-vitalgo-green bg-vitalgo-green-lightest">
  <CheckCircle className="h-4 w-4 text-vitalgo-green" />
</div>

/* ESTADO ERROR */
<div className="border-red-300 bg-red-50">
  <XCircle className="h-4 w-4 text-red-500" />
  <span className="text-red-700">Mensaje de error específico</span>
</div>

/* ESTADO CARGANDO */
<div className="border-vitalgo-green-light">
  <Spinner className="h-4 w-4 text-vitalgo-green animate-spin" />
</div>
```

### 8.7 Buttons & Actions (Brand Compliant)
```tsx
/* BOTÓN PRINCIPAL */
<Button className="w-full bg-vitalgo-green hover:bg-vitalgo-green-light
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  text-white font-medium py-3 px-4 rounded-lg
                  transition-colors duration-200">
  Crear cuenta
</Button>

/* ENLACES */
<Link className="text-vitalgo-green hover:text-vitalgo-green-light
                transition-colors font-medium">
  ¿Ya tienes cuenta? Inicia sesión
</Link>

/* CHECKBOXES LEGALES */
<div className="flex items-start space-x-3">
  <input type="checkbox"
         className="mt-1 h-4 w-4 text-vitalgo-green
                   border-gray-300 rounded focus:ring-vitalgo-green" />
  <label className="text-sm text-vitalgo-dark">
    Acepto los <a href="/terminos" className="text-vitalgo-green hover:underline">
    Términos y Condiciones</a>
  </label>
</div>
```

### 8.8 Responsive Design (Manual de Marca)
```css
/* BREAKPOINTS OFICIALES */
Mobile: 320px - 767px (form full-width con padding 16px)
Tablet: 768px - 1023px (form max-width-lg centrado)
Desktop: 1024px+ (form max-width-md centrado con sombras)

/* ADAPTACIONES MÓVILES */
- Touch targets mínimo 44px altura
- Font-size 16px en inputs (previene zoom iOS)
- Padding reducido en mobile: p-4 vs p-8 desktop
- Botones full-width en mobile
```

### 8.9 Loading & Error States
- **Loading Spinner**: `text-vitalgo-green` con animación oficial
- **Success Messages**: `bg-vitalgo-green-lightest border-vitalgo-green text-vitalgo-dark`
- **Error Messages**: `bg-red-50 border-red-200 text-red-800`
- **Validation Icons**: Colores oficiales VitalGo para estados
- **Enlaces legales**: Abren en nueva pestaña

## 9. Seguridad

### 9.1 Validaciones de Seguridad
- Rate limiting: máximo 3 intentos por IP por hora
- Validación CSRF token
- Sanitización de inputs
- Validación tanto frontend como backend

### 9.2 Almacenamiento Seguro
- Contraseñas hasheadas con bcrypt (salt rounds = 12)
- **UUID separado para QR codes**: `qr_code` field, no expone primary key
- **Renovación de QR**: Campo `qr_code` actualizable sin romper relaciones
- Datos personales encriptados en base de datos
- Log de intentos de registro por IP

### 9.3 Verificación Post-Registro
- **is_verified = TRUE por defecto**: Usuarios pueden acceder inmediatamente
- **Verificación futura**: Cuando se implemente email, se usará API para cambiar estado
- **Seguridad**: Campo is_verified permite bloquear usuarios si es necesario

## 10. Modelo de Datos

### 10.1 Tabla Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL DEFAULT 'patient',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP NULL
);
```

### 10.2 Estrategia de IDs: UUID vs Integer (MANDATORY)

**DIRECTRICES OFICIALES** para selección de tipos de ID en VitalGo:

#### 10.2.1 Usar UUID Para:
✅ **Entidades Principales (Datos Sensibles)**
- `users` table - Expuesto en APIs, sensible por seguridad
- `patients` table - Datos médicos, HIPAA/GDPR compliance
- `qr_codes` table - Acceso público, seguridad por obscuridad
- Cualquier tabla con datos médicos principales

**Beneficios UUID:**
- Imposible enumerar usuarios/pacientes
- Seguridad en APIs públicas
- Cumplimiento regulaciones médicas
- Distribución entre múltiples sistemas

#### 10.2.2 Usar Integer (BIGSERIAL) Para:
✅ **Tablas de Auditoría y Logs (Performance Crítico)**
- `login_attempts` - Alta frecuencia, auditoría interna
- `audit_logs` - Logging general, volumen alto
- `emergency_access_logs` - Emergencias, performance crítico
- Cualquier tabla de logging/auditoría interna

**Beneficios Integer:**
- 4x mejor performance en inserts/queries
- 75% menos espacio en índices
- Orden secuencial natural para auditorías
- Optimización para alta volumetría

#### 10.2.3 Criterios de Decisión:
```
¿Es tabla principal con datos médicos? → UUID
¿Se expone en APIs públicas? → UUID
¿Es tabla de auditoría/logging? → INTEGER
¿Requiere máximo performance? → INTEGER
¿En duda? → UUID (más seguro para plataforma médica)
```

#### 10.2.4 Ejemplos de Implementación:
```sql
-- ✅ CORRECTO: UUID para datos principales
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ...
);

-- ✅ CORRECTO: Integer para auditoría
CREATE TABLE login_attempts (
    id BIGSERIAL PRIMARY KEY,
    ...
);
```

### 10.3 Tabla Patients
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    qr_code UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    document_type_id INTEGER REFERENCES document_types(id),
    document_number VARCHAR(20) UNIQUE NOT NULL,
    phone_international VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    accept_terms BOOLEAN NOT NULL,
    accept_terms_date TIMESTAMP NOT NULL,
    accept_policy BOOLEAN NOT NULL,
    accept_policy_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.3 Tabla Document Types
```sql
CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 10.4 Documentación de Campos de Base de Datos

#### Tabla Users
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| **id** | UUID | Identificador único del usuario | PRIMARY KEY, auto-generado |
| **email** | VARCHAR(255) | Correo electrónico del usuario | UNIQUE, NOT NULL, formato RFC 5322 |
| **password_hash** | VARCHAR(255) | Contraseña hasheada con bcrypt | NOT NULL, salt rounds = 12 |
| **user_type** | VARCHAR(20) | Tipo de usuario en el sistema | DEFAULT 'patient', valores: 'patient', 'doctor', 'admin' |
| **is_verified** | BOOLEAN | Estado de verificación del usuario | DEFAULT TRUE, indica si puede acceder al sistema |
| **created_at** | TIMESTAMP | Fecha y hora de creación del registro | DEFAULT CURRENT_TIMESTAMP |
| **updated_at** | TIMESTAMP | Fecha y hora de última actualización | DEFAULT CURRENT_TIMESTAMP, actualizado automáticamente |
| **last_login** | TIMESTAMP | Fecha y hora del último inicio de sesión | NULL permitido, actualizado en cada login exitoso |
| **failed_login_attempts** | INTEGER | Contador de intentos fallidos de login | DEFAULT 0, se resetea en login exitoso |
| **locked_until** | TIMESTAMP | Fecha hasta cuando la cuenta está bloqueada | NULL permitido, por seguridad tras múltiples intentos fallidos |

#### Tabla Patients
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| **id** | UUID | Identificador único del paciente | PRIMARY KEY, auto-generado, uso interno |
| **qr_code** | UUID | Código QR del paciente | UNIQUE, auto-generado, expuesto en QR codes |
| **user_id** | UUID | Referencia al usuario asociado | FOREIGN KEY → users.id, CASCADE DELETE |
| **full_name** | VARCHAR(100) | Nombre completo del paciente | NOT NULL, mínimo 2 palabras |
| **document_type_id** | INTEGER | Tipo de documento de identidad | FOREIGN KEY → document_types.id |
| **document_number** | VARCHAR(20) | Número de documento de identidad | UNIQUE, NOT NULL, formato según tipo |
| **phone_international** | VARCHAR(20) | Teléfono en formato internacional | NOT NULL, formato +573123456789 |
| **birth_date** | DATE | Fecha de nacimiento del paciente | NOT NULL, debe ser mayor de 18 años |
| **accept_terms** | BOOLEAN | Aceptación de términos y condiciones | NOT NULL, debe ser TRUE para registro |
| **accept_terms_date** | TIMESTAMP | Fecha de aceptación de términos | NOT NULL, timestamp del momento de aceptación |
| **accept_policy** | BOOLEAN | Aceptación de política de privacidad | NOT NULL, debe ser TRUE para registro |
| **accept_policy_date** | TIMESTAMP | Fecha de aceptación de política | NOT NULL, timestamp del momento de aceptación |
| **created_at** | TIMESTAMP | Fecha y hora de creación del registro | DEFAULT CURRENT_TIMESTAMP |
| **updated_at** | TIMESTAMP | Fecha y hora de última actualización | DEFAULT CURRENT_TIMESTAMP, actualizado automáticamente |

#### Tabla Document Types
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| **id** | SERIAL | Identificador único del tipo de documento | PRIMARY KEY, auto-incremental |
| **code** | VARCHAR(5) | Código corto del tipo de documento | UNIQUE, NOT NULL, ej: 'CC', 'CE', 'PA' |
| **name** | VARCHAR(50) | Nombre completo del tipo de documento | NOT NULL, ej: 'Cédula de Ciudadanía' |
| **description** | TEXT | Descripción detallada del tipo de documento | Opcional, información adicional |
| **is_active** | BOOLEAN | Estado activo del tipo de documento | DEFAULT TRUE, para desactivar tipos obsoletos |

#### Datos Iniciales Document Types
```sql
INSERT INTO document_types (code, name, description, is_active) VALUES
('CC', 'Cédula de Ciudadanía', 'Documento de identidad para ciudadanos colombianos mayores de edad', TRUE),
('TI', 'Tarjeta de Identidad', 'Documento para menores de edad (registro solo por tutor legal)', TRUE),
('CE', 'Cédula de Extranjería', 'Documento para extranjeros residentes en Colombia', TRUE),
('PA', 'Pasaporte', 'Documento de identidad internacional', TRUE),
('RC', 'Registro Civil', 'Documento para menores (registro solo por tutor legal)', TRUE),
('AS', 'Adulto sin Identificar', 'Para casos especiales de adultos sin documentación', TRUE),
('MS', 'Menor sin Identificar', 'Para casos especiales de menores (registro solo por tutor legal)', TRUE);
```

## 11. API Endpoints

### 11.1 Registro de Paciente
**Endpoint:** `POST /api/signup/patient`

**Request Body:**
```json
{
    "fullName": "string",
    "documentType": "string",
    "documentNumber": "string",
    "phoneInternational": "string",
    "birthDate": "string (YYYY-MM-DD)",
    "email": "string",
    "password": "string",
    "confirmPassword": "string",
    "acceptTerms": "boolean",
    "acceptPrivacy": "boolean"
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "Cuenta creada exitosamente",
    "userId": "uuid",
    "patientId": "uuid",
    "token": "jwt_token",
    "redirectUrl": "/completar-perfil-medico"
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Error en validación",
    "errors": {
        "email": ["Email ya existe"],
        "documentNumber": ["Documento ya registrado"],
        "password": ["Contraseña no cumple requisitos"]
    }
}
```

## 12. Páginas Legales

### 12.1 Términos y Condiciones
- **URL:** `/terminos-y-condiciones`
- **Slice:** `legal`
- **Archivo:** `src/slices/legal/components/pages/TermsPage.tsx`

### 12.2 Política de Privacidad
- **URL:** `/politica-de-privacidad`
- **Slice:** `legal`
- **Archivo:** `src/slices/legal/components/pages/PrivacyPage.tsx`

## 13. Estructura de Archivos

### 13.1 Frontend (Atomic Design)
```
src/slices/signup/components/
├── atoms/
│   ├── TextInput.tsx
│   ├── PasswordInput.tsx
│   ├── NumberInput.tsx
│   ├── PhoneInput.tsx
│   ├── DateInput.tsx
│   ├── DocumentTypeSelect.tsx
│   ├── CheckboxWithLink.tsx
│   ├── SubmitButton.tsx
│   └── CaptchaField.tsx
├── molecules/
│   ├── PersonalInfoSection.tsx
│   ├── AccountSection.tsx
│   └── AgreementsSection.tsx
├── organisms/
│   └── PatientSignupForm.tsx
├── templates/
│   └── SignupLayout.tsx
└── pages/
    └── PatientSignupPage.tsx
```

### 13.2 Backend (Hexagonal Architecture)
```
backend/slices/signup/
├── domain/
│   ├── entities/
│   │   ├── user.py
│   │   └── patient.py
│   └── models/
│       ├── user_model.py
│       ├── patient_model.py
│       └── document_type_model.py
├── application/
│   ├── ports/
│   │   ├── user_repository.py
│   │   └── email_service.py
│   └── use_cases/
│       └── register_patient.py
└── infrastructure/
    ├── api/
    │   └── patient_signup_endpoint.py
    └── persistence/
        └── user_repository.py
```

## 14. Casos de Prueba

### 14.1 Pruebas Funcionales
- ✅ Registro exitoso con datos válidos
- ✅ Validación de email único (onBlur)
- ✅ Validación de documento único (onBlur)
- ✅ Validación de política de contraseñas (onBlur)
- ✅ Activación de botón solo con checkboxes marcados
- ✅ Auto-login después del registro
- ✅ Loading states durante validaciones asíncronas

### 14.2 Pruebas de Seguridad
- ✅ Rate limiting por IP
- ✅ Validación de CAPTCHA
- ✅ Sanitización de inputs maliciosos
- ✅ Hasheo seguro de contraseñas
- ✅ Validación CSRF

### 14.3 Pruebas de Usabilidad
- ✅ Responsividad en dispositivos móviles
- ✅ Accesibilidad (screen readers)
- ✅ Tiempo de carga < 3 segundos
- ✅ Mensajes de error claros y útiles

## 15. Criterios de Aceptación

1. **CA001:** Usuario puede acceder al formulario desde botón "Soy Paciente"
2. **CA002:** Todos los campos obligatorios deben validarse al salir del campo (onBlur)
3. **CA003:** Botón "Crear cuenta" se habilita solo con checkboxes marcados
4. **CA004:** Sistema crea usuario y paciente exitosamente con datos válidos
5. **CA005:** Usuario es redirigido a completar perfil médico después del registro
6. **CA006:** NavBar permite regresar a página de inicio
7. **CA007:** Enlaces legales funcionan correctamente
8. **CA008:** Formulario es responsive en móviles y desktop
9. **CA009:** Rate limiting previene spam de registros

## 16. Dependencias Técnicas

### 16.1 Frontend
- React Hook Form (manejo de formularios)
- react-phone-number-input (input de teléfono)
- date-fns (manejo de fechas)
- Radix UI (componentes base)
- **Componentes Compartidos**:
  - `PublicNavbar` (navbar para usuarios no autenticados)
  - `PublicFooter` (footer completo con enlaces legales, soporte y redes sociales)

### 16.2 Backend
- FastAPI (framework web)
- SQLAlchemy (ORM)
- bcrypt (hashing contraseñas)
- python-jose (JWT tokens)
- pydantic (validaciones)

## 17. Estrategia de Validación

### 17.1 Validaciones onBlur (Rendimiento)
- **Documento**: Verificación de unicidad solo al salir del campo
- **Email**: Validación de formato + unicidad + dominio al salir del campo
- **Teléfono**: Validación de formato según país al salir del campo
- **Contraseña**: Validación de política al salir del campo
- **Fecha nacimiento**: Cálculo de edad al salir del campo

### 17.2 Estados Visuales
```
Estado neutral → [Usuario sale del campo] → Validando (spinner) → Válido/Error
```

### 17.3 Validaciones Inmediatas (onChange)
- **Solo formato básico**: longitud máxima, caracteres permitidos
- **Sin llamadas API**: Para evitar sobrecarga del sistema
- **Feedback visual**: Indicadores de progreso, no errores

## 18. Notas de Implementación

### 18.1 Brand Manual Compliance (CRITICAL)
- **OBLIGATORIO**: Seguir completamente el `MANUAL_DE_MARCA.md` sin excepciones
- **Color Migration**: Migrar TODOS los colores genéricos a colores oficiales VitalGo
  ```tsx
  // ✅ CORRECTO - Colores oficiales VitalGo
  className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white"
  className="text-vitalgo-dark border-vitalgo-green focus:ring-vitalgo-green"

  // ❌ INCORRECTO - Colores genéricos
  className="bg-green-500 hover:bg-green-600 text-white"
  className="text-gray-900 border-green-500 focus:ring-green-500"
  ```
- **Asset Usage**: Usar ÚNICAMENTE logos oficiales desde `/assets/images/logos/`
- **Typography**: Aplicar sistema tipográfico oficial con stack de fuentes específico

### 18.2 Component Architecture (Brand Compliant)
- **Navbar**: `PublicNavbar` from `/src/shared/components/organisms/PublicNavbar.tsx`
  - Props obligatorios: `showBackButton={true}`, `backUrl="/"`, `backText="Volver al inicio"`
  - Logo horizontal oficial azul (#002C41)
  - Responsive con breakpoints del manual de marca
- **Footer**: `PublicFooter` from `/src/shared/components/organisms/PublicFooter.tsx`
  - Props: `whatsappNumber="+573001234567"`
  - Incluye todas las secciones: legal, soporte, idioma
  - Logo footer oficial VitalGo

### 18.3 Form Styling (Strict Brand Compliance)
```tsx
// ESTRUCTURA OBLIGATORIA DEL FORMULARIO
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest to-white">
  <div className="max-w-md mx-auto px-4 py-8">
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
      {/* Header con brand colors */}
      <h1 className="text-2xl font-bold text-vitalgo-dark text-center mb-6">
        Crear cuenta como paciente
      </h1>
      {/* Form sections con spacing oficial */}
      <div className="space-y-6">
        {/* Campos con colores oficiales */}
        <input className="focus:border-vitalgo-green focus:ring-vitalgo-green/20" />
        <Button className="bg-vitalgo-green hover:bg-vitalgo-green-light" />
      </div>
    </div>
  </div>
</div>
```

### 18.4 Validation & UX (Brand Guidelines)
- **Estados de validación**: Usar colores oficiales VitalGo para éxito (`vitalgo-green-lightest`)
- **Estados de error**: Mantener rojo estándar para errores (`red-50`, `red-500`)
- **Loading states**: Spinner con `text-vitalgo-green`
- **Focus states**: Ring con `ring-vitalgo-green/20`
- **Hover states**: Transiciones con colores oficiales VitalGo

### 18.5 Responsive Design (Manual de Marca)
- **Mobile First**: Diseño principal para 320px-767px según manual
- **Breakpoints**: Usar breakpoints oficiales (640px, 768px, 1024px, 1280px)
- **Touch Targets**: Mínimo 44px altura en mobile
- **Font Size**: 16px en inputs (previene zoom iOS)
- **Spacing**: Usar sistema de 4px base del manual de marca

### 18.6 Accessibility (Manual de Marca Standards)
- **Color Contrast**: Ratio 4.5:1 mínimo (textos normales)
- **ARIA Labels**: Implementar en español para screen readers
- **Keyboard Navigation**: Tab order lógico y focus states visibles
- **Form Labels**: Asociación correcta label-input
- **Error Messages**: Claros y específicos en español

### 18.7 Technical Implementation
- **Validaciones**: Implementar tanto en frontend como backend
- **QR Code Security**: Usar UUID separado `qr_code` (no exponer PK)
- **Rate Limiting**: Configurar a nivel nginx/servidor web
- **Logging**: Implementar auditoría detallada
- **Performance**: Optimizar para carga rápida en móviles

### 18.8 Legal Compliance
- **CRÍTICO**: Campos `acceptTerms` y `acceptPrivacy` con timestamp para cumplimiento legal
- **Términos y Condiciones**: Links a páginas oficiales con styling VitalGo
- **Política de Privacidad**: Accesible desde footer con brand compliance
- **Consentimiento**: Capturar y almacenar con fecha/hora exacta

### 18.9 Future Considerations
- **Internacionalización**: Preparar para i18n manteniendo brand consistency
- **CAPTCHA**: Integrar sin comprometer brand experience
- **Email Verification**: Diseñar con templates VitalGo branded
- **Analytics**: Implementar tracking de conversión de registro

---

**Documento preparado por:** AI Assistant, Jhonatan Rico & Daniela Quintero
**Revisado por:** [Jhonatan Rico]
**Aprobado por:** [Daniela Quintero]