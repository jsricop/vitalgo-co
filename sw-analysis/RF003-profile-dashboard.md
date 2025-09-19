# RF003 - Dashboard de Perfil (/dashboard)

**Fecha:** 2025-09-18
**Versión:** 2.0 - **ENHANCED**
**Estado:** Pendiente Implementación
**Prioridad:** Alta

## 1. Descripción General

Dashboard principal para pacientes que permite a los usuarios autenticados acceder a su **información médica integral personalizada**. El dashboard incluye gestión completa de información médica extendida (datos demográficos, seguridad social, medicamentos actuales, antecedentes ginecológicos), generación de códigos QR de emergencia con información completa, y visualización de historial médico integral.

## 2. Objetivo

Proporcionar una interfaz centralizada que permita a los pacientes gestionar su información médica, generar códigos QR de emergencia, y visualizar su historial médico completo de forma segura y eficiente.

## 3. Actores

- **Actor Principal:** Paciente autenticado
- **Actor Secundario:** Sistema VitalGo
- **Actor Externo:** Personal médico (acceso futuro a información de emergencia)

## 4. Precondiciones

- Usuario debe estar autenticado como paciente (token JWT válido)
- Usuario debe tener perfil de paciente creado
- **Usuario debe tener perfil médico COMPLETO (mandatory_fields_completed = true)**
- Usuario debe tener conexión a internet
- Acceso desde redirección post-login o navegación directa
- **Si perfil incompleto: redirección automática a RF002**

## 5. Flujo Principal

### 5.1 Acceso al Dashboard
1. Paciente navega a /dashboard o es redirigido post-login
2. Sistema verifica autenticación (token JWT)
3. Sistema verifica rol de paciente
4. Sistema carga vista de paciente
5. Sistema muestra navbar con logo VitalGo y menú de usuario

### 5.2 Vista Principal del Paciente MEJORADA
1. **Sistema muestra tarjeta de información personal extendida (incluye datos demográficos)**
2. **Sistema carga secciones de información médica integral:**
   - **Información Básica:** Tipo sangre, factor RH, contacto emergencia
   - **Seguridad Social:** EPS, seguros, ocupación
   - **Medicamentos Actuales:** Lista de medicamentos en uso
   - **Alergias:** Con severidad y tratamientos
   - **Enfermedades:** Con códigos CIE-10 y tratamientos
   - **Cirugías:** Con detalles completos
   - **Antecedentes Ginecológicos:** Solo para mujeres
3. **Paciente puede gestionar (crear, editar, eliminar) toda la información médica**
4. **Sistema muestra historial de códigos QR generados con información completa**
5. **Paciente puede generar nuevos códigos QR de emergencia integrales**
6. **Sistema muestra estadísticas avanzadas del perfil médico**

## 6. Secciones del Dashboard

### 6.1 Navegación Superior

| Elemento | Funcionalidad | Ubicación |
|----------|---------------|-----------|
| **Logo VitalGo** | Redirección a dashboard | Lado izquierdo |
| **Menú Usuario** | Dropdown con opciones de perfil | Lado derecho |
| **Cerrar Sesión** | Logout y redirección a login | Menú dropdown |
| **Configuración** | Acceso a configuración de usuario | Menú dropdown |

### 6.2 Vista Principal - Secciones del Paciente

#### 6.2.1 Tarjeta de Información Personal EXTENDIDA
| Campo | Origen | Editable |
|-------|--------|----------|
| **Nombre Completo** | Datos de registro | ❌ |
| **Documento** | Datos de registro | ❌ |
| **Fecha de Nacimiento** | Datos de registro | ❌ |
| **Sexo Biológico** | Perfil médico (RF002) | ✅ |
| **Género** | Perfil médico (RF002) | ✅ |
| **Teléfono Celular** | Perfil médico (RF002) | ✅ |
| **Email** | Datos de registro | ✅ |
| **Dirección Completa** | Perfil médico (RF002) | ✅ |
| **Ciudad de Residencia** | Perfil médico (RF002) | ✅ |
| **Departamento** | Perfil médico (RF002) | ✅ |
| **País de Nacimiento** | Perfil médico (RF002) | ✅ |
| **EPS** | Perfil médico (RF002) | ✅ |
| **Ocupación** | Perfil médico (RF002) | ✅ |

#### 6.2.2 NUEVA: Sección Información Médica Básica
| Campo | Descripción | Editable |
|-------|-------------|----------|
| **Tipo de Sangre** | Grupo sanguíneo (O+, A-, etc.) | ✅ |
| **Factor RH** | Positivo, Negativo, Desconocido | ✅ |
| **Contacto de Emergencia** | Nombre, parentesco, teléfonos | ✅ |
| **Seguros Adicionales** | Seguros privados | ✅ |
| **Plan Complementario** | Medicina prepagada | ✅ |

#### 6.2.3 NUEVA: Sección Medicamentos Actuales
| Funcionalidad | Descripción |
|---------------|-------------|
| **Lista de Medicamentos** | Medicamentos en uso con dosis y frecuencia |
| **Agregar Medicamento** | Modal para registrar nuevo medicamento |
| **Editar Medicamento** | Modal para modificar medicamento existente |
| **Eliminar Medicamento** | Confirmación y eliminación |
| **Estado Activo/Inactivo** | Toggle para activar/desactivar medicamentos |

#### 6.2.4 Sección Alergias (MEJORADAS)
| Funcionalidad | Descripción |
|---------------|-------------|
| **Lista de Alergias** | Muestra alergias registradas con severidad |
| **Agregar Alergia** | Modal para registrar nueva alergia |
| **Editar Alergia** | Modal para modificar alergia existente |
| **Eliminar Alergia** | Confirmación y eliminación |
| **Estado Vacío** | Mensaje motivacional para agregar primera alergia |

#### 6.2.5 Sección Enfermedades (MEJORADAS)
| Funcionalidad | Descripción |
|---------------|-------------|
| **Lista de Enfermedades** | Muestra enfermedades con estado y fechas |
| **Agregar Enfermedad** | Modal para registrar nueva enfermedad |
| **Editar Enfermedad** | Modal para modificar enfermedad existente |
| **Eliminar Enfermedad** | Confirmación y eliminación |
| **Marcador Crónico** | Badge especial para enfermedades crónicas |

#### 6.2.6 Sección Cirugías (MEJORADAS)
| Funcionalidad | Descripción |
|---------------|-------------|
| **Lista de Cirugías** | Muestra cirugías con fechas y cirujanos |
| **Agregar Cirugía** | Modal para registrar nueva cirugía |
| **Editar Cirugía** | Modal para modificar cirugía existente |
| **Eliminar Cirugía** | Confirmación y eliminación |
| **Detalles Completos** | Hospital, anestesia, duración |

#### 6.2.7 NUEVA: Sección Antecedentes Ginecológicos (Solo Mujeres)
| Funcionalidad | Descripción |
|---------------|-------------|
| **Estado de Embarazo** | Embarazada/No embarazada, semanas |
| **Historial Obstétrico** | Embarazos, partos, cesáreas, abortos |
| **Información Menstrual** | Fecha última menstruación |
| **Método Anticonceptivo** | Método actual utilizado |
| **Editar Información** | Modal para actualizar datos ginecológicos |

### 6.3 Sección de Emergencia QR MEJORADA

#### 6.3.1 Gestión de Códigos QR
| Funcionalidad | Descripción |
|---------------|-------------|
| **Generar QR** | Crear nuevo código QR de emergencia con información integral |
| **Ver QR Actual** | Mostrar código QR vigente con todos los datos médicos |
| **Historial QR** | Lista de códigos generados anteriormente |
| **Descargar QR** | Descargar imagen del código actual |
| **Vista Previa Datos** | Ver qué información médica incluye el QR |

#### 6.3.2 Información de Emergencia
| Campo | Descripción |
|-------|-------------|
| **Estado QR** | Activo, Expirado, Regenerado |
| **Fecha Generación** | Cuándo se creó el código actual |
| **Fecha Expiración** | Cuándo expira el código |
| **Accesos Registrados** | Cuántas veces se ha consultado |

### 6.4 Estadísticas del Perfil

#### 6.4.1 Resumen Médico EXTENDIDO
| Métrica | Descripción |
|---------|-------------|
| **Información Básica** | Tipo sangre, contacto emergencia, EPS |
| **Medicamentos Actuales** | Contador de medicamentos activos |
| **Alergias Registradas** | Contador total por severidad |
| **Enfermedades Activas** | Contador de enfermedades crónicas vs agudas |
| **Cirugías Registradas** | Contador total de cirugías |
| **Antecedentes Ginecológicos** | Estado de completitud (solo mujeres) |
| **Completitud Perfil** | Porcentaje de información integral completa |
| **Última Actualización** | Fecha del último cambio en información médica |

## 7. Validaciones Detalladas

### 7.1 Validaciones de Acceso
- **Autenticación**: Token JWT válido y no expirado
- **Autorización**: Rol apropiado para la funcionalidad solicitada
- **Sesión**: Verificación de sesión activa cada 5 minutos
- **Redirección**: Automática a login si no autenticado

### 7.2 Validaciones de Rol
- **Paciente**: Solo acceso a información propia
- **Seguridad**: Verificación de propiedad de datos médicos
- **Aislamiento**: No acceso a datos de otros pacientes
- **Escalamiento**: Solo funcionalidades de paciente disponibles

### 7.3 Validaciones de Datos Médicos
- **Fechas**: No futuras, formato ISO 8601
- **Campos Obligatorios**: Según especificación RF002
- **Longitud**: Límites por campo según tipo
- **Sanitización**: Prevención XSS en todos los inputs

## 8. Elementos de Interfaz

### 8.1 NavBar
- **Componente**: `AuthenticatedNavbar` del sistema compartido (`/src/shared/components/organisms/AuthenticatedNavbar.tsx`)
- **Configuración**: Muestra logo VitalGo y menú de usuario completo
- Logo horizontal azul VitalGo con navegación inteligente al dashboard
- Menú de usuario con avatar, nombre, rol y opciones (perfil, configuración, logout)
- Responsive design con menú hamburguesa en móvil
- Notificaciones (opcional para futuras versiones)

### 8.2 Layout del Dashboard
- Grid responsive con breakpoints apropiados
- Máximo ancho: 7xl (1280px)
- Padding consistente y espaciado vertical
- Cards con sombras sutiles y bordes redondeados

### 8.3 Componentes Interactivos
- **Tarjetas de Información**: Cards clickeables con datos resumidos
- **Modales**: Overlay para formularios de edición
- **Tablas**: Paginación y filtros para listas grandes
- **Estados de Carga**: Spinners y skeletons durante carga

### 8.4 Iconografía
- **User**: Información personal
- **Activity**: Alergias y signos vitales
- **Shield**: Enfermedades y protección
- **Scissors**: Cirugías
- **Stethoscope**: Médico/Paramédico
- **Settings**: Administración

## 9. Seguridad

### 9.1 Autenticación y Autorización
- Verificación de token JWT en cada request
- Refresh token automático antes de expiración
- Redirección segura a login si no autenticado
- Verificación de rol por funcionalidad

### 9.2 Protección de Datos
- Encriptación de datos médicos sensibles
- Logs de acceso a información médica
- Rate limiting por usuario y endpoint
- Validación de permisos en frontend y backend

### 9.3 Auditoría
- Registro de todas las acciones críticas
- Logs de acceso a información de pacientes
- Tracking de modificaciones de datos
- Alertas de acceso sospechoso

## 10. Modelo de Datos

### 10.1 Usuario Dashboard
```sql
CREATE TABLE user_dashboard_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light',
    dashboard_layout JSON,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.2 Logs de Auditoría
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSON,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.3 Escaneos QR
```sql
CREATE TABLE emergency_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    scanned_by UUID REFERENCES users(id),
    scan_location VARCHAR(200),
    emergency_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 11. API Endpoints

### 11.1 Dashboard Data
**Endpoint:** `GET /api/v1/dashboard/data`

**Response Success (200):**
```json
{
    "user": {
        "id": "uuid",
        "name": "string",
        "role": "PATIENT",
        "email": "string"
    },
    "stats": {
        "role_specific_metrics": "object"
    },
    "recent_activity": ["array"]
}
```

### 11.2 Patient Medical Data INTEGRAL
**Endpoint:** `GET /api/v1/patients/me/medical-summary`

**Response Success (200):**
```json
{
    "personal_info": {
        "full_name": "string",
        "document_number": "string",
        "birth_date": "date",
        "biological_sex": "string",
        "gender": "string",
        "birth_country": "string",
        "birth_city": "string",
        "residence_address": "string",
        "residence_city": "string",
        "residence_department": "string",
        "cell_phone": "string",
        "email": "string"
    },
    "medical_basic": {
        "blood_type": "string",
        "rh_factor": "string",
        "eps": "string",
        "health_insurance": "string",
        "complementary_plan": "string",
        "occupation": "string",
        "emergency_contact": {
            "name": "string",
            "relationship": "string",
            "phone": "string",
            "alternative_phone": "string"
        }
    },
    "current_medications": ["array"],
    "allergies": ["array"],
    "illnesses": ["array"],
    "surgeries": ["array"],
    "gynecological_history": {
        "is_pregnant": "boolean",
        "pregnancy_weeks": "number",
        "last_menstrual_period": "date",
        "pregnancies": "number",
        "births": "number",
        "cesareans": "number",
        "abortions": "number",
        "contraceptive_method": "string"
    }
}
```

### 11.3 Patient QR Code Management
**Endpoint:** `GET /api/v1/patients/me/qr-codes`

**Response Success (200):**
```json
{
    "current_qr": {
        "qr_token": "uuid",
        "generated_at": "timestamp",
        "expires_at": "timestamp",
        "access_count": "number"
    },
    "qr_history": ["array"]
}
```

### 11.4 Patient Profile Statistics EXTENDIDAS
**Endpoint:** `GET /api/v1/patients/me/profile-stats`

**Response Success (200):**
```json
{
    "basic_info_complete": "boolean",
    "total_medications": "number",
    "active_medications": "number",
    "total_allergies": "number",
    "allergies_by_severity": {
        "leve": "number",
        "moderada": "number",
        "severa": "number",
        "critica": "number"
    },
    "total_illnesses": "number",
    "chronic_illnesses": "number",
    "total_surgeries": "number",
    "gynecological_info_complete": "boolean",
    "profile_completeness": "percentage",
    "mandatory_completeness": "percentage",
    "last_updated": "timestamp",
    "qr_codes_generated": "number"
}
```

### 11.5 Emergency Scan Log
**Endpoint:** `POST /api/v1/emergency/scan`

**Request Body:**
```json
{
    "patient_document": "string",
    "emergency_type": "string",
    "location": "string",
    "notes": "string"
}
```

**Response Success (201):**
```json
{
    "success": true,
    "scan_id": "uuid",
    "patient_data": {
        "allergies": ["array"],
        "critical_conditions": ["array"],
        "emergency_contacts": ["array"]
    }
}
```

## 12. Estructura de Archivos

### 12.1 Frontend (Atomic Design)
```
src/slices/dashboard/components/
├── atoms/
│   ├── StatCard.tsx
│   ├── RoleBadge.tsx
│   ├── MetricDisplay.tsx
│   └── LoadingCard.tsx
├── molecules/
│   ├── PersonalInfoCard.tsx
│   ├── StatsGrid.tsx
│   ├── QuickActions.tsx
│   └── RecentActivity.tsx
├── organisms/
│   ├── PatientDashboard.tsx
│   ├── ParamedicDashboard.tsx
│   └── AdminDashboard.tsx
├── templates/
│   └── DashboardLayout.tsx
└── pages/
    └── DashboardPage.tsx
```

### 12.2 Medical Components (Re-usables)
```
src/components/dashboard/
├── AllergySection.tsx (CRUD completo)
├── IllnessSection.tsx (CRUD completo)
├── SurgerySection.tsx (CRUD completo)
└── EmergencyInfo.tsx
```

### 12.3 Backend (Hexagonal Architecture)
```
backend/slices/dashboard/
├── domain/
│   ├── entities/
│   │   ├── dashboard_data.py
│   │   └── user_activity.py
│   └── models/
│       ├── dashboard_model.py
│       └── audit_model.py
├── application/
│   ├── ports/
│   │   └── dashboard_repository.py
│   └── use_cases/
│       ├── get_dashboard_data.py
│       ├── log_user_activity.py
│       └── get_role_metrics.py
└── infrastructure/
    ├── api/
    │   └── dashboard_endpoints.py
    └── persistence/
        └── dashboard_repository.py
```

## 13. Casos de Prueba

### 13.1 Pruebas de Autenticación y Roles
- ✅ Acceso sin autenticación redirige a login
- ✅ Dashboard carga vista correcta según rol de usuario
- ✅ Paciente solo ve información propia
- ✅ Paciente puede generar códigos QR de emergencia
- ✅ Paciente visualiza estadísticas de perfil médico
- ✅ Tokens expirados redirigen a login

### 13.2 Pruebas Funcionales por Rol
- ✅ Paciente puede gestionar información médica (CRUD)
- ✅ Paciente puede visualizar historial de códigos QR generados
- ✅ Paciente puede descargar códigos QR
- ✅ Todos los roles pueden actualizar información personal
- ✅ Navegación entre secciones funciona correctamente

### 13.3 Pruebas de Seguridad
- ✅ Validación de permisos en cada operación
- ✅ Sanitización de inputs en formularios
- ✅ Logs de auditoría se generan correctamente
- ✅ Rate limiting previene abuso de endpoints
- ✅ Datos médicos están encriptados

### 13.4 Pruebas de Usabilidad
- ✅ Responsividad en dispositivos móviles
- ✅ Tiempo de carga < 3 segundos
- ✅ Estados de loading y error son claros
- ✅ Navegación intuitiva entre secciones
- ✅ Accesibilidad para screen readers

## 14. Criterios de Aceptación

1. **CA001:** Usuario autenticado accede a dashboard según su rol
2. **CA002:** Paciente puede gestionar completamente su información médica
3. **CA003:** Paciente puede generar códigos QR de emergencia
4. **CA004:** Paciente puede visualizar estadísticas de su perfil médico
5. **CA005:** Todas las acciones críticas se registran en logs de auditoría
6. **CA006:** Dashboard es responsive en dispositivos móviles y desktop
7. **CA007:** Tiempo de carga inicial no excede 3 segundos
8. **CA008:** Datos médicos sensibles están protegidos y encriptados
9. **CA009:** Navegación es intuitiva y accesible

## 15. Dependencias Técnicas

### 15.1 Frontend
- React Hook State management
- Next.js App Router con middleware de autenticación
- Lucide React (iconos)
- JWT authentication y role-based routing
- Shared components: AllergySection, IllnessSection, SurgerySection
- UI Components: Card, Badge, Button, Modal
- Form components: InputField, SelectField, TextareaField
- **Componentes Compartidos**:
  - `AuthenticatedNavbar` (navbar para usuarios autenticados)
  - `AuthenticatedFooter` (footer simplificado para usuarios autenticados)

### 15.2 Backend
- FastAPI con middleware de autenticación
- SQLAlchemy ORM con modelos de auditoría
- JWT authentication con verificación de roles
- Pydantic para validaciones
- Rate limiting con Redis
- Logging estructurado para auditoría

### 15.3 Seguridad
- Bcrypt para hashing de passwords
- JWT con refresh tokens
- CORS configurado para frontend
- Headers de seguridad (OWASP)
- Encriptación de datos médicos

## 16. Flujo de Datos

### 16.1 Autenticación y Navegación
```
Login → JWT Token → Role Verification → Dashboard Route → Role-Specific View
```

### 16.2 Carga de Datos por Rol
```
Dashboard Load → API Call Based on Role → Data Processing → UI Rendering
```

### 16.3 Operaciones CRUD (Pacientes)
```
User Action → Modal Form → Validation → API Call → DB Update → UI Refresh
```

### 16.4 Auditoría
```
Critical Action → Log Creation → DB Insert → Admin Dashboard Display
```

## 17. Navegación y Rutas

### 17.1 Rutas Principales
- `/dashboard` - Dashboard principal (requiere autenticación)
- `/dashboard/profile` - Configuración de perfil
- `/dashboard/settings` - Configuración de usuario
- `/emergency/scan/:qr` - Escaneo de emergencia (paramédicos)

### 17.2 Redirecciones Post-Login
- **Paciente** → `/dashboard` (vista paciente)
- **Paramédico** → `/dashboard` (vista paramédico)
- **Administrador** → `/dashboard` (vista admin)

### 17.3 Protección de Rutas
- Middleware de autenticación en todas las rutas /dashboard
- Verificación de rol específico por funcionalidad
- Redirección automática a login si no autenticado

## 18. Notas de Implementación

- **Navbar Compartido**: Usar `AuthenticatedNavbar` del sistema de componentes compartidos en `/src/shared/components/organisms/AuthenticatedNavbar.tsx`
- **Footer Compartido**: Usar `AuthenticatedFooter` del sistema de componentes compartidos en `/src/shared/components/organisms/AuthenticatedFooter.tsx`
- **Dashboard Multi-Rol**: Un solo componente con lógica condicional por rol
- **Componentes Reutilizables**: AllergySection, IllnessSection, SurgerySection
- **Estado Global**: Context API para datos de usuario y autenticación
- **Optimización**: Lazy loading de datos médicos y caching en memoria
- **Responsive Design**: Mobile-first approach con breakpoints definidos
- **Accesibilidad**: ARIA labels, navegación por teclado, contraste apropiado
- **Performance**: Virtual scrolling para listas grandes de datos

## 19. Consideraciones Futuras

- **Notificaciones Push**: Alertas de emergencia para paramédicos
- **Chat en Tiempo Real**: Comunicación entre roles
- **Dashboard Personalizable**: Widgets arrastrables por usuario
- **Reportes**: Exportación de datos médicos en PDF
- **Multi-idioma**: Soporte para inglés y español
- **Integración**: APIs externas para códigos CIE-10
- **Geolocación**: Tracking de emergencias por ubicación
- **Inteligencia Artificial**: Sugerencias basadas en patrones médicos

---

**Documento preparado por:** AI Assistant
**Revisado por:** [Pendiente]
**Aprobado por:** [Pendiente]