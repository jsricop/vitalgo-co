# RF000 - Login de Paciente (/login)

**Fecha:** 2025-09-18
**Versión:** 2.0 - **ENHANCED**
**Estado:** Pendiente Implementación
**Prioridad:** Crítica

## 1. Descripción General

Página de autenticación que permite a los pacientes registrados acceder al sistema VitalGo mediante email y contraseña. **INCLUYE VALIDACIÓN OBLIGATORIA DE PERFIL MÉDICO** que redirige automáticamente al wizard de completar perfil si la información crítica está incompleta. La página incluye validaciones de seguridad, manejo de errores, y redirección inteligente basada en completitud del perfil.

## 2. Objetivo

Proporcionar un mecanismo de autenticación seguro y eficiente que permita a los pacientes registrados acceder a su información médica y funcionalidades del sistema, garantizando la protección de credenciales y el cumplimiento con estándares de seguridad.

## 3. Actores

- **Actor Principal:** Paciente registrado
- **Actor Secundario:** Sistema VitalGo
- **Actor Externo:** Servicio de autenticación JWT

## 4. Precondiciones

- Usuario debe tener cuenta registrada en el sistema (RF001)
- Usuario debe tener conexión a internet
- Usuario debe acceder desde navegador web compatible
- Credenciales deben estar vigentes (no bloqueadas)

## 5. Flujo Principal

### 5.1 Acceso a la página
1. Usuario navega a `/login` directamente o desde enlace
2. Sistema muestra página de login con formulario
3. Sistema carga logo VitalGo y elementos de interfaz

### 5.2 Completar credenciales
1. Usuario ingresa email en campo correspondiente
2. Usuario ingresa contraseña (con opción mostrar/ocultar)
3. Usuario puede marcar checkbox "Recordarme" (opcional)
4. Sistema valida formato de campos en tiempo real

### 5.3 Envío y autenticación
1. Usuario hace clic en "Iniciar Sesión"
2. Sistema valida campos obligatorios en frontend
3. Sistema envía credenciales a API de autenticación
4. Sistema procesa respuesta del servidor
5. **Si es exitoso: almacena token JWT y VERIFICA COMPLETITUD DEL PERFIL**
6. **Si perfil incompleto: redirige a /completar-perfil-medico (RF002)**
7. **Si perfil completo: redirige a /dashboard (RF003)**
8. Si falla: muestra mensaje de error y permite reintentar

### 5.4 NUEVA: Validación de Completitud del Perfil
1. **Después de login exitoso, sistema verifica perfil médico**
2. **Sistema consulta endpoint GET /api/v1/patients/me/profile-completeness**
3. **Si mandatory_fields_completed = false → Redirige a wizard (RF002)**
4. **Si mandatory_fields_completed = true → Redirige a dashboard (RF003)**
5. **Sistema preserva contexto de redirección para UX fluida**

## 6. Campos del Formulario

### 6.1 Credenciales de Acceso

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Email** | Email | Regex RFC 5322, formato válido | ✅ |
| **Contraseña** | Password | Mínimo 1 carácter | ✅ |
| **Recordarme** | Checkbox | Boolean | ❌ |

## 7. Validaciones Detalladas

### 7.1 Email
- Validación con regex: `/\S+@\S+\.\S+/`
- Conversión automática a minúsculas
- Mensaje de error: "Ingresa un email válido"
- Limpieza de espacios en blanco

### 7.2 Contraseña
- Campo obligatorio (no validación de política en login)
- Funcionalidad mostrar/ocultar con iconos Eye/EyeOff
- Mensaje de error: "La contraseña es requerida"
- Sin límites de longitud en login

### 7.3 Recordarme
- Checkbox opcional para persistencia de sesión
- Extiende duración del token JWT
- Estado visual claro (marcado/desmarcado)

## 8. Brand Manual Compliance & Interface Elements

### 8.1 BRAND MANUAL COMPLIANCE
**MANDATORY**: Esta página DEBE seguir completamente las especificaciones del `MANUAL_DE_MARCA.md`

#### 8.1.1 Color Scheme (Estricto)
```css
/* USAR ESTOS COLORES OFICIALES EXCLUSIVAMENTE */
--vitalgo-green: #01EF7F        /* Verde principal oficial - Botones principales */
--vitalgo-green-light: #5AF4AC   /* Verde claro oficial - Hover states */
--vitalgo-green-lighter: #99F9CC /* Verde más claro oficial - Backgrounds sutiles */
--vitalgo-dark: #002C41          /* Azul oscuro principal oficial - Textos y headers */
--vitalgo-dark-light: #406171    /* Azul medio oficial - Textos secundarios */
```

#### 8.1.2 Typography Requirements
```css
/* TIPOGRAFÍA OFICIAL */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
/* Tamaños según manual de marca */
h1: 2.5rem (40px) - Títulos principales
h2: 2rem (32px) - Subtítulos
body: 1rem (16px) - Texto principal
small: 0.875rem (14px) - Textos auxiliares
```

#### 8.1.3 Logo Requirements
```tsx
/* LOGOS OFICIALES OBLIGATORIOS */
Logo Principal: "/assets/images/logos/vitalgo-logo-horizontal-official.svg"
Logo Alternativo: "/assets/images/logos/vitalgo-logo-official.svg"
Favicon: "/favicon.ico"
/* NUNCA usar logos genéricos o modificados */
```

#### 8.1.4 Spacing System (4px Base)
```css
/* SISTEMA DE ESPACIADO OFICIAL */
padding: 1rem (16px), 1.5rem (24px), 2rem (32px), 3rem (48px)
margin: 0.5rem (8px), 1rem (16px), 2rem (32px)
border-radius: 0.5rem (8px), 0.75rem (12px) - según manual
```

### 8.2 Navbar Specification (MANDATORY)
**COMPONENT**: `PublicNavbar` from `/src/shared/components/organisms/PublicNavbar.tsx`

```tsx
<PublicNavbar
  showBackButton={false}
  className="bg-white border-b border-gray-200"
/>
```

**FEATURES**:
- VitalGo logo horizontal oficial (color azul #002C41)
- Navegación inteligente al homepage (/)
- Responsive design con breakpoints del manual de marca
- ARIA labels apropiados para accesibilidad
- Altura fija: 64px (h-16) según especificación

### 8.3 Footer Specification (MANDATORY)
**COMPONENT**: `PublicFooter` from `/src/shared/components/organisms/PublicFooter.tsx`

```tsx
<PublicFooter
  whatsappNumber="+573001234567"
  className="bg-white border-t border-gray-200"
/>
```

**FEATURES**:
- Información completa de la empresa VitalGo
- Enlaces legales: Términos y Condiciones, Política de Privacidad
- Soporte: WhatsApp, LinkedIn, contacto
- Selector de idioma (es/en)
- Copyright con año dinámico
- Logo footer oficial VitalGo

### 8.4 Layout Principal
- **Fondo**: Gradiente oficial con colores VitalGo según MANUAL_DE_MARCA.md
- **Contenedor**: Card centrado con `shadow-lg` y `rounded-xl` (12px)
- **Responsive**: Mobile-first según breakpoints oficiales (640px, 768px, 1024px)
- **Accesibilidad**: WCAG 2.1 AA compliance según manual de marca

### 8.5 Formulario de Login
- **Card Background**: `bg-white` con `border border-gray-200`
- **Border Radius**: `rounded-xl` (12px) según manual de marca
- **Título**: `text-2xl font-bold text-vitalgo-dark` - "Iniciar Sesión"
- **Input Fields**: `border-gray-300 focus:border-vitalgo-green focus:ring-vitalgo-green`
- **Labels**: `text-sm font-medium text-vitalgo-dark-light`

### 8.6 Botones y Estados (Brand Compliant)
```tsx
/* BOTÓN PRINCIPAL - Color oficial VitalGo */
<Button className="w-full bg-vitalgo-green hover:bg-vitalgo-green-light text-white font-medium py-3 px-4 rounded-lg transition-colors">
  Iniciar Sesión
</Button>

/* ENLACES - Colores oficiales */
<Link className="text-vitalgo-green hover:text-vitalgo-green-light transition-colors">
  ¿Olvidaste tu contraseña?
</Link>
```

### 8.7 Estados Visuales
- **Loading**: Spinner con `text-vitalgo-green` y texto "Iniciando sesión..."
- **Error**: `AlertWithIcon` con `bg-red-50 border-red-200 text-red-800`
- **Success**: Redirección inmediata con transición suave
- **Focus States**: Ring azul `ring-2 ring-vitalgo-green ring-opacity-50`

### 8.8 Responsive Design (Manual de Marca)
```css
/* BREAKPOINTS OFICIALES */
Mobile: 320px - 767px (design principal)
Tablet: 768px - 1023px
Desktop: 1024px - 1279px
Desktop XL: 1280px+

/* ADAPTACIONES ESPECÍFICAS */
Mobile: padding-4, text-lg, full-width buttons
Tablet: padding-6, text-xl, centered layout
Desktop: padding-8, text-2xl, max-width-md centered
```

### 8.9 Accessibility Compliance (Manual de Marca)
- **Color Contrast**: 4.5:1 ratio minimum (texto normal)
- **Focus Indicators**: Visible ring 2px con color contrastante
- **Screen Readers**: ARIA labels en español e inglés
- **Keyboard Navigation**: Tab order lógico
- **Touch Targets**: Mínimo 44px altura en mobile

## 9. Seguridad

### 9.1 Validaciones de Seguridad
- **Rate Limiting Híbrido**:
  - Por usuario: máximo 5 intentos fallidos (tabla users.failed_login_attempts)
  - Por IP: máximo 10 intentos por IP por 15 minutos (tabla login_attempts)
  - Bloqueo temporal: locked_until en tabla users para bloqueos inmediatos
- **Auditoría Completa**: Registro de todos los intentos en login_attempts para compliance
- Validación CSRF token
- Sanitización de inputs
- Headers de seguridad apropiados

### 9.2 Autenticación JWT
- Token almacenado en localStorage con key `access_token`
- Datos de usuario en localStorage con key `user_data`
- Rol de usuario en localStorage con key `user_role`
- Expiración automática de tokens

### 9.3 Manejo de Errores
- Mensajes genéricos para evitar enumeración de usuarios
- Log de intentos fallidos con IP y timestamp
- Bloqueo temporal después de múltiples fallos
- No exposición de información del sistema

### 9.4 Protección de Credenciales
- HTTPS obligatorio en producción
- No almacenamiento de contraseñas en frontend
- Limpieza de campos después de errores
- Logout automático por inactividad

## 10. Modelo de Datos

### 10.1 Estructura de Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}
```

### 10.2 Estructura de Login Response
```typescript
interface LoginResponse {
  success: boolean;
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'patient';
  };
  expires_in: number;
}
```

### 10.3 Sistema Híbrido de Tracking de Login Attempts

**ENFOQUE HÍBRIDO**: El sistema utiliza dos mecanismos complementarios para el tracking de intentos de login:

#### 10.3.1 Tabla Users (Tracking Activo - RF001)
```sql
-- Campos en tabla users para seguridad en tiempo real
failed_login_attempts INTEGER DEFAULT 0,     -- Contador actual para rate limiting
locked_until TIMESTAMP NULL                  -- Bloqueo temporal de cuenta
```

**Propósito**:
- Rate limiting en tiempo real
- Bloqueo inmediato de cuentas
- Decisiones de seguridad rápidas

#### 10.3.2 Tabla Login Attempts (Auditoría Completa)
```sql
CREATE TABLE login_attempts (
    id BIGSERIAL PRIMARY KEY,                -- Integer optimizado para alta performance
    email VARCHAR(255),
    ip_address INET NOT NULL,
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    failure_reason VARCHAR(100),
    -- Campos adicionales para correlación
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    geolocation JSON,
    -- Índices optimizados para consultas frecuentes
    INDEX idx_login_attempts_email_time (email, attempted_at DESC),
    INDEX idx_login_attempts_ip_time (ip_address, attempted_at DESC),
    INDEX idx_login_attempts_user_time (user_id, attempted_at DESC)
);
```

**Rationale para Integer ID:**
- **Performance**: BIGSERIAL es 4x más rápido que UUID para alta volumetría
- **Storage**: Reduce espacio de índices en ~75% para tablas de auditoría
- **Seguridad**: No hay exposición pública, por lo que secuencialidad no es problema
- **Volume**: Tabla de alta frecuencia requiere máxima optimización

**Propósito**:
- Auditoría completa para compliance médico
- Análisis de patrones de seguridad
- Investigación forense
- Tracking de IP y dispositivos

#### 10.3.3 Flujo de Trabajo Híbrido

**En cada intento de login:**

1. **Registro completo** → `login_attempts` table
2. **Si falla**: Incrementar `failed_login_attempts` en users table
3. **Si excede límite**: Establecer `locked_until` en users table
4. **Si éxito**: Reset `failed_login_attempts = 0` en users table

**Para rate limiting:**
- Consulta rápida: `SELECT failed_login_attempts, locked_until FROM users WHERE email = ?`

**Para auditoría:**
- Consulta completa: `SELECT * FROM login_attempts WHERE email = ? ORDER BY attempted_at DESC`

### 10.4 UUID vs Integer ID Strategy

**STRATEGIC APPROACH**: VitalGo utiliza una estrategia híbrida para selección de tipos de ID basada en propósito y performance requirements.

#### 10.4.1 UUID Usage Guidelines
**USAR UUID PARA:**
- **Tablas principales/entidades core**: `users`, `patients`, `medical_records`, `qr_codes`
- **Datos con exposición pública**: APIs públicas, URLs, formularios web
- **Identificadores distribuidos**: Datos que se replican entre sistemas
- **Requisitos de seguridad**: Prevenir enumeración y predicción de IDs

**JUSTIFICACIÓN:**
- Seguridad por no-predicibilidad
- Prevención de ataques de enumeración
- Compatibilidad con sistemas distribuidos
- Estándar para identificadores públicos

#### 10.4.2 Integer (BIGSERIAL) Usage Guidelines
**USAR INTEGER PARA:**
- **Tablas de auditoría/logging**: `login_attempts`, `audit_logs`, `emergency_access_logs`
- **Alta volumetría/frecuencia**: Tablas con miles de inserts diarios
- **Uso interno únicamente**: Sin exposición en APIs públicas
- **Performance crítica**: Consultas complejas con múltiples JOINs

**JUSTIFICACIÓN:**
- Performance superior (4x más rápido en consultas complejas)
- Storage efficiency (75% menos espacio en índices)
- Optimización de memoria para alta volumetría
- Facilita debugging y troubleshooting

#### 10.4.3 Implementation Matrix

| Tabla Type | ID Type | Rationale | Performance Impact |
|------------|---------|-----------|-------------------|
| **Core Entities** | UUID | Security, Public APIs | Normal |
| **Audit/Logs** | BIGSERIAL | High Volume, Internal | High Performance |
| **Relations** | Mixed | FK matching parent table | Optimized |
| **Session/Temp** | BIGSERIAL | Short-lived, Internal | High Performance |

#### 10.4.4 Migration Strategy
**EXISTING TABLES**: Implementar BIGSERIAL. Los esquemas aún no tienen datos de los usuarios
**NEW AUDIT TABLES**: Implementar BIGSERIAL desde inicio
**MIXED APPROACHES**: Permitidas con justificación clara

## 11. API Endpoints

### 11.1 Autenticación de Usuario MEJORADA
**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
    "email": "string",
    "password": "string",
    "remember_me": "boolean"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "access_token": "jwt_token_string",
    "refresh_token": "refresh_token_string",
    "user": {
        "id": "uuid",
        "email": "string",
        "first_name": "string",
        "last_name": "string",
        "role": "patient",
        "profile_completed": false,
        "mandatory_fields_completed": false
    },
    "expires_in": 3600,
    "redirect_url": "/completar-perfil-medico"
}
```

### 11.1.2 NUEVO: Verificar Completitud Post-Login
**Endpoint:** `GET /api/v1/patients/me/profile-completeness`
**Headers:** `Authorization: Bearer {jwt_token}`

**Response:**
```json
{
    "is_complete": false,
    "mandatory_fields_completed": false,
    "missing_mandatory_fields": ["biological_sex", "blood_type", "emergency_contact_name"],
    "completion_percentage": 45,
    "next_required_step": 1,
    "redirect_url": "/completar-perfil-medico"
}
```

**Response Error (401):**
```json
{
    "success": false,
    "message": "Email o contraseña incorrectos",
    "attempts_remaining": 4
}
```

**Response Error (429):**
```json
{
    "success": false,
    "message": "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos",
    "retry_after": 900
}
```

### 11.2 Validación de Token
**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response Success (200):**
```json
{
    "id": "uuid",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "role": "patient",
    "is_verified": true
}
```

### 11.3 Logout
**Endpoint:** `POST /api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Logout exitoso"
}
```

## 12. Estructura de Archivos

### 12.1 Frontend (Atomic Design)
```
src/slices/auth/components/
├── atoms/
│   ├── PasswordToggle.tsx
│   ├── RememberCheckbox.tsx
│   ├── LoginButton.tsx
│   └── AuthLink.tsx
├── molecules/
│   └── LoginForm.tsx
├── organisms/
│   ├── LoginCard.tsx
│   └── EmergencyAccess.tsx
├── templates/
│   └── LoginLayout.tsx
└── pages/
    └── LoginPage.tsx
```

### 12.2 Backend (Hexagonal Architecture)
```
backend/slices/auth/
├── domain/
│   ├── entities/
│   │   ├── user_session.py
│   │   └── login_attempt.py
│   └── models/
│       ├── user_model.py
│       └── login_attempt_model.py
├── application/
│   ├── ports/
│   │   ├── auth_repository.py
│   │   └── token_service.py
│   └── use_cases/
│       ├── authenticate_user.py
│       ├── validate_token.py
│       └── logout_user.py
└── infrastructure/
    ├── api/
    │   └── auth_endpoints.py
    └── persistence/
        └── auth_repository.py
```

## 13. Casos de Prueba

### 13.1 Pruebas Funcionales
- ✅ Login exitoso con credenciales válidas
- ✅ Redirección automática a dashboard después de login
- ✅ Manejo de credenciales incorrectas
- ✅ Validación de formato de email
- ✅ Funcionalidad mostrar/ocultar contraseña
- ✅ Checkbox "Recordarme" funcional
- ✅ Enlaces de navegación funcionan correctamente

### 13.2 Pruebas de Seguridad
- ✅ Rate limiting después de intentos fallidos
- ✅ Validación CSRF token
- ✅ Sanitización de inputs maliciosos
- ✅ Protección contra ataques de fuerza bruta
- ✅ Logout automático por inactividad
- ✅ No exposición de información sensible en errores

### 13.3 Pruebas de Usabilidad
- ✅ Responsividad en dispositivos móviles
- ✅ Accesibilidad (screen readers)
- ✅ Tiempo de carga < 2 segundos
- ✅ Estados de loading claros y útiles
- ✅ Mensajes de error comprensibles

### 13.4 Pruebas de Integración
- ✅ Integración con RF001 (enlace a registro)
- ✅ Integración con RF003 (redirección a dashboard)
- ✅ Integración con RF004 (acceso de emergencia)
- ✅ Persistencia de sesión funcional
- ✅ Tokens JWT válidos y funcionales

## 14. Criterios de Aceptación

1. **CA001:** Usuario puede acceder a página de login desde cualquier parte del sistema
2. **CA002:** Validación de email funciona en tiempo real con feedback visual
3. **CA003:** Login exitoso redirige automáticamente a dashboard del paciente
4. **CA004:** Mensajes de error son claros y útiles sin exponer información sensible
5. **CA005:** Rate limiting previene ataques de fuerza bruta
6. **CA006:** Checkbox "Recordarme" extiende duración de sesión apropiadamente
7. **CA007:** Enlaces de navegación funcionan correctamente (registro, recuperación, emergencia)
8. **CA008:** Página es responsive y accesible en todos los dispositivos
9. **CA009:** Estados de loading proporcionan feedback apropiado al usuario

## 15. Dependencias Técnicas

### 15.1 Frontend
- React Hook State para manejo de formulario
- Next.js Router para navegación
- LocalStorage para persistencia de tokens
- Lucide React para iconografía (Eye, EyeOff, ArrowRight)
- **Componentes Compartidos**:
  - `PublicNavbar` (navbar para usuarios no autenticados)
  - `PublicFooter` (footer completo con enlaces legales, soporte y redes sociales)
  - `InputField`, `AlertWithIcon`, `Spinner`

### 15.2 Backend
- FastAPI para endpoints de autenticación
- JWT (python-jose) para generación de tokens
- bcrypt para verificación de contraseñas
- SQLAlchemy para logs de intentos de login
- Rate limiting con Redis

### 15.3 Seguridad
- HTTPS en producción
- Headers de seguridad (HSTS, CSP, etc.)
- CORS configurado apropiadamente
- Validación de tokens en middleware

## 16. Flujo de Datos

### 16.1 Autenticación Exitosa
```
Usuario → Credenciales → Validación Frontend → API Call → Verificación BD → JWT Generation → LocalStorage → Dashboard
```

### 16.2 Autenticación Fallida
```
Usuario → Credenciales → API Call → Verificación BD → Error Response → UI Error → Rate Limiting Update
```

### 16.3 Validación de Sesión
```
Página Load → Check LocalStorage → Validate Token → API Call → Token Valid/Invalid → Continue/Redirect Login
```

## 17. Navegación y Rutas

### 17.1 Rutas de Entrada
- `/login` - Acceso directo a login
- Redirección automática desde páginas protegidas
- Enlaces desde homepage y otros formularios

### 17.2 Rutas de Salida MEJORADAS
- **Login Exitoso + Perfil Completo** → `/dashboard` (RF003)
- **Login Exitoso + Perfil Incompleto** → `/completar-perfil-medico` (RF002)
- **Registro** → `/signup/paciente` (RF001)
- **Recuperación** → `/forgot-password` (futuro)
- **Emergencia** → `/emergency` (RF004)

### 17.3 Protección de Rutas
- Middleware de autenticación en rutas protegidas
- Redirección automática a login si no autenticado
- Preservación de URL destino para redirección post-login

## 18. Notas de Implementación

### 18.1 Brand Manual Compliance (CRITICAL)
- **OBLIGATORIO**: Seguir completamente el `MANUAL_DE_MARCA.md` sin excepciones
- **Color Migration**: Migrar TODOS los colores genéricos (green-500, blue-600, etc.) a colores oficiales VitalGo
- **Asset Usage**: Usar ÚNICAMENTE logos oficiales desde `/assets/images/logos/`
- **Typography**: Aplicar sistema tipográfico oficial con pesos y tamaños especificados

### 18.2 Component Architecture (Brand Compliant)
- **Navbar**: `PublicNavbar` from `/src/shared/components/organisms/PublicNavbar.tsx`
  - Props: `showBackButton={false}`, sin configuración de usuario
  - Logo horizontal oficial azul (#002C41)
  - Responsive con breakpoints del manual de marca
- **Footer**: `PublicFooter` from `/src/shared/components/organisms/PublicFooter.tsx`
  - Props: `whatsappNumber="+573001234567"`
  - Incluye todas las secciones legales y de soporte
  - Logo footer oficial VitalGo

### 18.3 Styling Requirements (Strict)
```tsx
// ✅ CORRECTO - Colores oficiales VitalGo
<Button className="bg-vitalgo-green hover:bg-vitalgo-green-light">
<h1 className="text-vitalgo-dark font-bold">
<div className="border-vitalgo-green/20">

// ❌ INCORRECTO - Colores genéricos
<Button className="bg-green-500 hover:bg-green-600">
<h1 className="text-gray-900 font-bold">
<div className="border-green-200">
```

### 18.4 Technical Implementation
- **Enfoque Solo Pacientes**: Eliminar referencias a paramédicos/admin del código de referencia
- **Integración JWT**: Usar misma estrategia de tokens que otros RFs
- **LocalStorage**: Consistente con patrones existentes (access_token, user_data, user_role)
- **Sistema Híbrido de Login Attempts**:
  - Usar tabla `users` (failed_login_attempts, locked_until) para rate limiting rápido
  - Usar tabla `login_attempts` para auditoría completa y análisis de seguridad
  - Implementar ambos mecanismos en paralelo para performance + compliance
- **Rate Limiting**: Consulta rápida de usuarios + logging completo de attempts

### 18.5 Responsive & Accessibility (Manual de Marca)
- **Mobile-First**: Design principal optimizado para 320px-767px
- **Breakpoints**: Usar breakpoints oficiales (640px, 768px, 1024px, 1280px)
- **Touch Targets**: Mínimo 44px altura en mobile según manual
- **ARIA Labels**: Implementar en español e inglés
- **Color Contrast**: Cumplir ratio 4.5:1 mínimo
- **Keyboard Navigation**: Tab order lógico y focus states visibles

### 18.6 Performance & Quality
- **Asset Optimization**: SVG logos oficiales para mejor rendimiento
- **Lazy Loading**: Componentes no críticos para carga rápida
- **Error Handling**: Manejo graceful de errores de red y API
- **Testing**: Verificar compliance con manual de marca en todas las resoluciones

## 19. Consideraciones de Seguridad Avanzada

### 19.1 Protección Contra Ataques
- **Brute Force**: Rate limiting progresivo
- **Credential Stuffing**: Detección de patrones sospechosos
- **Session Hijacking**: Tokens con tiempo de vida limitado
- **XSS**: Sanitización estricta de inputs

### 19.2 Cumplimiento y Auditoría
- **Logs de Acceso**: Registro completo de intentos de login
- **Trazabilidad**: Seguimiento de sesiones activas
- **GDPR**: Consentimiento para "Recordarme"
- **Retención**: Políticas de retención de logs

---

**Documento preparado por:** AI Assistant & Jhonatan Rico
**Revisado por:** [Jhonatan Rico]
**Aprobado por:** [Daniela Quintero]