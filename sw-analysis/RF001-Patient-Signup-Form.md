# RF001 - Patient Signup Form

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
2. Sistema valida en tiempo real cada campo
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
- Validación en tiempo real

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
- Verificación de dominio válido

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

## 8. Elementos de Interfaz

### 8.1 NavBar
- Logo horizontal azul VitalGo (lado izquierdo)
- Botón "Volver al inicio" (lado derecho)
- Fondo blanco con borde inferior
- Responsive design

### 8.2 Formulario
- Diseño centrado y responsive
- Campos organizados en secciones lógicas
- Indicadores visuales de campos obligatorios (*)
- Mensajes de error en tiempo real
- Confirmación visual de validación exitosa

### 8.3 Botones y Enlaces
- **"Crear cuenta"**: Habilitado solo con todos los checkboxes marcados
- **"¿Ya tienes cuenta? Inicia sesión"**: Enlace a `/login`
- **Enlaces legales**: Abren en nueva pestaña

## 9. Seguridad

### 9.1 Validaciones de Seguridad
- Rate limiting: máximo 3 intentos por IP por hora
- Validación CSRF token
- Sanitización de inputs
- Validación tanto frontend como backend

### 9.2 Almacenamiento Seguro
- Contraseñas hasheadas con bcrypt (salt rounds = 12)
- UUID para IDs de pacientes (para QR codes)
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

### 10.2 Tabla Patients
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
| **id** | UUID | Identificador único del paciente | PRIMARY KEY, auto-generado, usado en QR codes |
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
│   ├── PatientSignupForm.tsx
│   └── SignupNavbar.tsx
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
- ✅ Validación de email único
- ✅ Validación de documento único
- ✅ Validación de política de contraseñas
- ✅ Activación de botón solo con checkboxes marcados
- ✅ Auto-login después del registro

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
2. **CA002:** Todos los campos obligatorios deben validarse en tiempo real
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
- Google reCAPTCHA v3
- Radix UI (componentes base)

### 16.2 Backend
- FastAPI (framework web)
- SQLAlchemy (ORM)
- bcrypt (hashing contraseñas)
- python-jose (JWT tokens)
- pydantic (validaciones)

## 17. Notas de Implementación

- Implementar validaciones tanto en frontend como backend
- Usar UUIDs para IDs de pacientes (requerido para QR codes)
- Configurar rate limiting a nivel de nginx/servidor web
- Implementar logging detallado para auditoría
- Considerar internacionalización futura (i18n)
- Optimizar rendimiento para carga rápida en móviles
- **CRÍTICO**: Los campos `acceptTerms` y `acceptPrivacy` deben capturarse del frontend y almacenarse con timestamp para cumplimiento legal
- **NOTA**: Implementación básica sin CAPTCHA ni envío de emails por ahora

---

**Documento preparado por:** AI Assistant
**Revisado por:** [Pendiente]
**Aprobado por:** [Pendiente]