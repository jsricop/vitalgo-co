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

## 8. Elementos de Interfaz

### 8.1 Layout Principal
- **Fondo**: Gradiente gris claro con patrones sutiles
- **Contenedor**: Card centrado con sombra y backdrop blur
- **Responsive**: Adaptable a móviles y desktop
- **Accesibilidad**: Labels apropiados y navegación por teclado

### 8.2 Header de Página
- **Logo VitalGo**: Horizontal azul, enlazado a homepage
- **Título**: "Bienvenido de vuelta" (h1)
- **Subtítulo**: "Accede a tu información médica de forma segura"

### 8.3 Formulario de Login
- **Card**: Fondo blanco semi-transparente con borde
- **Título**: "Iniciar Sesión" centrado
- **Campos**: InputField con labels y estados de error
- **Botón**: Full width, color VitalGo green, con spinner de loading

### 8.4 Enlaces y Acciones
- **"¿Olvidaste tu contraseña?"**: Enlace a recuperación
- **"Regístrate como paciente"**: Enlace a RF001
- **"Acceso de Emergencia QR"**: Botón de emergencia (RF004)

### 8.5 Estados Visuales
- **Loading**: Spinner en botón con texto "Iniciando sesión..."
- **Error**: AlertWithIcon rojo con mensaje específico
- **Success**: Redirección inmediata (sin mensaje)

## 9. Seguridad

### 9.1 Validaciones de Seguridad
- Rate limiting: máximo 5 intentos por IP por 15 minutos
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

### 10.3 Tabla Login Attempts (Seguridad)
```sql
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255),
    ip_address INET NOT NULL,
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    failure_reason VARCHAR(100)
);
```

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

- **Navbar Compartido**: Usar `PublicNavbar` del sistema de componentes compartidos en `/src/shared/components/organisms/PublicNavbar.tsx`
- **Footer Compartido**: Usar `PublicFooter` del sistema de componentes compartidos en `/src/shared/components/organisms/PublicFooter.tsx`
- **Enfoque Solo Pacientes**: Eliminar referencias a paramédicos/admin del código de referencia
- **Integración JWT**: Usar misma estrategia de tokens que otros RFs
- **LocalStorage**: Consistente con patrones existentes (access_token, user_data, user_role)
- **Rate Limiting**: Implementar tanto en frontend como backend
- **Responsive Design**: Mobile-first approach para accesibilidad
- **Accesibilidad**: ARIA labels, navegación por teclado, contraste apropiado
- **Performance**: Lazy loading de componentes no críticos
- **Error Handling**: Manejo graceful de errores de red y API

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

## 20. Consideraciones Futuras

- **Autenticación de Dos Factores (2FA)**: SMS o aplicación authenticator
- **Login Social**: Google, Facebook, Apple ID
- **Biometría**: Huella digital, Face ID para móviles
- **SSO**: Single Sign-On con sistemas hospitalarios
- **Recuperación de Cuenta**: Proceso completo de reset de contraseña
- **Notificaciones**: Alertas de login desde dispositivos nuevos
- **Sesiones Múltiples**: Gestión de sesiones concurrentes
- **Geolocalización**: Detección de logins sospechosos por ubicación

---

**Documento preparado por:** AI Assistant
**Revisado por:** [Pendiente]
**Aprobado por:** [Pendiente]