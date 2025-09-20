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

**COMPONENT**: Utiliza `AuthenticatedNavbar` según especificación completa en **sección 8.2 Navbar Specification**.

**Funcionalidades principales**:
- Logo VitalGo con navegación inteligente al dashboard
- Menú dropdown de usuario: Mi Perfil, Configuración, Cerrar sesión
- Avatar circular con iniciales del usuario
- Responsive con hamburger menu en mobile

**NOTA**: Si se requieren campos adicionales (avatar image, notificaciones badge, etc.), estos deben agregarse al componente padre `AuthenticatedNavbar` en `/src/shared/components/organisms/AuthenticatedNavbar.tsx`, no a implementaciones específicas.

### 6.2 Vista Principal - Secciones del Paciente

#### 6.2.1 Tarjeta de Información Personal EXTENDIDA
| Campo | Origen | Editable |
|-------|--------|----------|
| **Nombre Completo** | Datos de registro | ❌ |
| **Documento** | Datos de registro | ❌ |
| **Fecha de Nacimiento** | Datos de registro | ❌ |
| **Sexo Biológico** | Perfil médico (RF002) | ✅ |
| **Género** | Perfil médico (RF002) | ✅ |
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
| **Tipo de Sangre** | Grupo sanguíneo con RH (O+, A-, etc.) | ✅ |
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

## 8. Brand Manual Compliance & Interface Elements

### 8.1 BRAND MANUAL COMPLIANCE
**MANDATORY**: Esta página DEBE seguir completamente las especificaciones del `MANUAL_DE_MARCA.md`

#### 8.1.1 Color Scheme (Dashboard Specific)
```css
/* USAR ESTOS COLORES OFICIALES EXCLUSIVAMENTE */
--vitalgo-green: #01EF7F        /* Verde principal - Acciones principales */
--vitalgo-green-light: #5AF4AC   /* Verde claro - Hover states en botones */
--vitalgo-green-lighter: #99F9CC /* Verde más claro - Badges de éxito */
--vitalgo-green-lightest: #CCFCE5 /* Verde muy claro - Backgrounds sutiles */
--vitalgo-dark: #002C41          /* Azul oscuro - Headers y títulos principales */
--vitalgo-dark-light: #406171    /* Azul medio - Textos secundarios */
--vitalgo-dark-lighter: #99ABB3  /* Azul claro - Textos descriptivos */
--vitalgo-dark-lightest: #CCD5D9 /* Azul muy claro - Divisores y bordes */

/* COLORES ESPECÍFICOS PARA DASHBOARD MÉDICO */
--medical-emergency: #EF4444     /* Rojo para alergias críticas */
--medical-warning: #F59E0B       /* Amarillo para advertencias */
--medical-info: #3B82F6          /* Azul para información general */
--medical-success: var(--vitalgo-green) /* Verde VitalGo para estados positivos */
```

#### 8.1.2 Typography System (Dashboard)
```css
/* TIPOGRAFÍA OFICIAL PARA DASHBOARD */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
/* Jerarquía específica para dashboard médico */
h1: 2.25rem (36px) font-bold - Título principal dashboard
h2: 1.875rem (30px) font-semibold - Títulos de secciones principales
h3: 1.5rem (24px) font-medium - Títulos de cards
h4: 1.25rem (20px) font-medium - Subtítulos de información
h5: 1.125rem (18px) font-medium - Labels de datos médicos
body: 1rem (16px) font-normal - Texto general
small: 0.875rem (14px) font-normal - Metadatos y timestamps
caption: 0.75rem (12px) font-normal - Notas y detalles
```

#### 8.1.3 Logo & Medical Icons
```tsx
/* ASSETS OFICIALES OBLIGATORIOS PARA DASHBOARD */
Logo Navbar: "/assets/images/logos/vitalgo-logo-horizontal-official.svg"
Logo Icon: "/assets/images/logos/vitalgo-icon-official.svg"
Medical Heart: "/assets/images/icons/vitalgo-heart.svg"
/* Iconografía médica con colores oficiales VitalGo */
```

#### 8.1.4 Spacing System (Dashboard Layout)
```css
/* SISTEMA DE ESPACIADO DASHBOARD */
dashboard-container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
section-spacing: space-y-8 (32px entre secciones principales)
card-spacing: space-y-6 (24px entre cards)
content-spacing: space-y-4 (16px entre elementos de contenido)
card-padding: p-6 lg:p-8 (24px mobile, 32px desktop)
grid-gap: gap-6 (24px entre elementos del grid)
stats-grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

### 8.2 Navbar Specification (MANDATORY)
**COMPONENT**: `AuthenticatedNavbar` from `/src/shared/components/organisms/AuthenticatedNavbar.tsx`

```tsx
<AuthenticatedNavbar
  user={{
    name: user.firstName + " " + user.lastName,
    role: "paciente",
    avatar: user.profilePicture || undefined
  }}
  onLogout={handleLogout}
  className="bg-white border-b border-gray-200 sticky top-0 z-50"
/>
```

**BRAND FEATURES**:
- VitalGo logo horizontal oficial azul (#002C41)
- Navegación inteligente (click logo = dashboard)
- Menú de usuario con dropdown: Mi Perfil, Configuración, Cerrar sesión
- Avatar circular con iniciales si no hay foto
- Responsive con hamburger menu en mobile
- Notificaciones badge con colores oficiales VitalGo
- Sticky positioning para navegación persistente

### 8.3 Footer Specification (MANDATORY)
**COMPONENT**: `AuthenticatedFooter` from `/src/shared/components/organisms/AuthenticatedFooter.tsx`

```tsx
<AuthenticatedFooter
  className="bg-white border-t border-gray-200 mt-16"
/>
```

**BRAND FEATURES**:
- Footer simplificado para usuarios autenticados
- Logo footer oficial VitalGo (tamaño reducido)
- Enlaces esenciales: Soporte, Privacidad, Términos
- Copyright con año dinámico
- Información de contacto mínima
- Sin sobrecarga (focus en gestión médica)

### 8.4 Dashboard Layout (Brand Compliant)
```tsx
/* LAYOUT PRINCIPAL DASHBOARD */
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest via-white to-gray-50">
  <AuthenticatedNavbar {...navbarProps} />

  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* HEADER DASHBOARD CON MARCA */}
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vitalgo-dark">
            Hola, {user.firstName} 👋
          </h1>
          <p className="text-vitalgo-dark-light mt-2">
            Gestiona tu información médica de forma segura
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <img src="/assets/images/icons/vitalgo-heart.svg"
               alt="VitalGo" className="h-12 w-12" />
        </div>
      </div>
    </div>

    {/* GRID DE ESTADÍSTICAS */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Stats cards con colores oficiales */}
    </div>

    {/* SECCIONES MÉDICAS */}
    <div className="space-y-8">
      {/* Medical sections con brand styling */}
    </div>
  </main>

  <AuthenticatedFooter {...footerProps} />
</div>
```

### 8.5 Stats Cards (Brand Design)
```tsx
/* TARJETAS DE ESTADÍSTICAS CON MARCA */
<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-vitalgo-dark-light">
        Medicamentos Actuales
      </p>
      <p className="text-3xl font-bold text-vitalgo-dark mt-2">
        {stats.activeMedications}
      </p>
    </div>
    <div className="h-12 w-12 bg-vitalgo-green rounded-lg flex items-center justify-center">
      <PillIcon className="h-6 w-6 text-white" />
    </div>
  </div>
  <div className="mt-4 flex items-center text-sm">
    <TrendingUpIcon className="h-4 w-4 text-vitalgo-green mr-1" />
    <span className="text-vitalgo-green font-medium">Actualizado hoy</span>
  </div>
</div>
```

### 8.6 Medical Information Cards (Brand Styling)
```tsx
/* CARDS DE INFORMACIÓN MÉDICA */
<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
  {/* HEADER DE SECCIÓN */}
  <div className="px-6 py-4 bg-gradient-to-r from-vitalgo-green-lightest to-white border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-vitalgo-green rounded-lg flex items-center justify-center mr-3">
          <HeartIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-vitalgo-dark">
            Información Médica Básica
          </h3>
          <p className="text-sm text-vitalgo-dark-light">
            Datos críticos para emergencias
          </p>
        </div>
      </div>
      <Button className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white
                        text-sm px-4 py-2 rounded-lg">
        Editar
      </Button>
    </div>
  </div>

  {/* CONTENIDO DE LA CARD */}
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Data items con styling oficial */}
    </div>
  </div>
</div>
```

### 8.7 Dynamic Medical Sections (Allergies, Medications, etc.)
```tsx
/* SECCIONES DINÁMICAS CON CRUD */
<div className="bg-white rounded-xl shadow-lg border border-gray-200">
  {/* HEADER CON CONTADOR Y ACCIONES */}
  <div className="px-6 py-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
          <AlertTriangleIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-vitalgo-dark">
            Alergias ({allergies.length})
          </h3>
          <p className="text-sm text-vitalgo-dark-light">
            Información crítica para emergencias
          </p>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button variant="outline"
                className="border-vitalgo-green text-vitalgo-green hover:bg-vitalgo-green hover:text-white">
          Ver Historial
        </Button>
        <Button className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white">
          + Agregar Alergia
        </Button>
      </div>
    </div>
  </div>

  {/* LISTA O ESTADO VACÍO */}
  <div className="p-6">
    {allergies.length === 0 ? (
      <div className="text-center py-12">
        <AlertTriangleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-vitalgo-dark mb-2">
          No hay alergias registradas
        </h4>
        <p className="text-vitalgo-dark-light mb-6">
          Agregar esta información es crucial para tu seguridad en emergencias
        </p>
        <Button className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white">
          Agregar primera alergia
        </Button>
      </div>
    ) : (
      <div className="space-y-4">
        {/* Lista de items con brand styling */}
      </div>
    )}
  </div>
</div>
```

### 8.8 QR Code Emergency Section (Brand Design)
```tsx
/* SECCIÓN DE EMERGENCIA QR */
<div className="bg-gradient-to-r from-vitalgo-green-lightest via-white to-vitalgo-green-lightest rounded-xl shadow-lg border border-vitalgo-green/20 p-6">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="h-10 w-10 bg-vitalgo-green rounded-lg flex items-center justify-center mr-4">
        <QrCodeIcon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-vitalgo-dark">
          Código QR de Emergencia
        </h3>
        <p className="text-vitalgo-dark-light">
          Acceso rápido a tu información médica en emergencias
        </p>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* QR Code display */}
    <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
      <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
        {/* QR Code SVG */}
      </div>
      <p className="text-sm text-vitalgo-dark-light">
        Generado: {qrCode.generatedAt}
      </p>
    </div>

    {/* QR Actions */}
    <div className="lg:col-span-2 space-y-4">
      <Button className="w-full bg-vitalgo-green hover:bg-vitalgo-green-light text-white">
        Descargar QR Code
      </Button>
      <Button variant="outline" className="w-full border-vitalgo-green text-vitalgo-green">
        Ver Página de Emergencia
      </Button>
      <Button variant="ghost" className="w-full text-vitalgo-dark-light">
        Regenerar Código
      </Button>
    </div>
  </div>
</div>
```

### 8.9 Responsive Design (Manual de Marca)
```css
/* BREAKPOINTS OFICIALES PARA DASHBOARD */
Mobile: 320px - 767px
- Stack vertical de todas las secciones
- Stats cards en grid de 1 columna
- Navegación hamburger
- Padding reducido: px-4 py-6

Tablet: 768px - 1023px
- Stats grid 2 columnas
- Medical cards con layout adaptado
- Sidebar opcional para navegación
- Padding intermedio: px-6 py-8

Desktop: 1024px+
- Full grid layout: stats 4 columnas
- Sidebar de navegación rápida
- Layout de 2-3 columnas para cards médicas
- Padding completo: px-8 py-8
- Max-width 7xl (1280px) centrado
```

### 8.10 Interactive Elements (Brand States)
```tsx
/* ESTADOS INTERACTIVOS CON MARCA */
// Hover states para cards
.medical-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: var(--vitalgo-green);
}

// Botones de acción
<Button className="bg-vitalgo-green hover:bg-vitalgo-green-light active:bg-vitalgo-green/90
                  text-white transition-colors duration-200">

// Loading states
<div className="animate-pulse bg-vitalgo-green-lightest rounded-lg">
  <Spinner className="text-vitalgo-green" />
</div>

// Success notifications
<div className="bg-vitalgo-green-lightest border-vitalgo-green text-vitalgo-dark
               p-4 rounded-lg border-l-4">
  Información actualizada correctamente
</div>
```

### 8.11 Accessibility (Manual de Marca)
- **Navigation**: ARIA labels para todas las secciones médicas
- **Screen Readers**: Descripciones claras de stats y datos médicos
- **Keyboard Navigation**: Tab order lógico entre cards y acciones
- **Color Contrast**: Ratio 4.5:1 con colores oficiales VitalGo
- **Medical Data**: Markup semántico para información crítica
- **Form Controls**: Labels apropiados para modales de edición

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
    id BIGSERIAL PRIMARY KEY,                -- Integer optimizado para auditoría alta volumetría
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSON,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Índices optimizados para consultas de auditoría frecuentes
    INDEX idx_audit_logs_user_time (user_id, created_at DESC),
    INDEX idx_audit_logs_resource (resource_type, resource_id, created_at DESC),
    INDEX idx_audit_logs_action_time (action, created_at DESC)
);
```

**Optimización para Auditoría Médica:**
- **BIGSERIAL ID**: Performance superior para logs de alta frecuencia
- **Compliance**: Orden secuencial natural facilita auditorías
- **Storage**: Reducción ~75% en tamaño de índices vs UUID
- **Query Performance**: Búsquedas por usuario/tiempo 3-4x más rápidas

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

### 10.4 UUID vs Integer ID Strategy

**STRATEGIC APPROACH**: VitalGo utiliza una estrategia híbrida para selección de tipos de ID basada en propósito y performance requirements.

#### 10.4.1 UUID Usage Guidelines
**USAR UUID PARA:**
- **Tablas principales/entidades core**: `users`, `patients`, `medical_records`, `qr_codes`
- **Datos con exposición pública**: APIs públicas, URLs, formularios web
- **Identificadores distribuidos**: Datos que se replican entre sistemas
- **Requisitos de seguridad**: Prevenir enumeración y predicción de IDs

**IMPLEMENTACIÓN EN RF003:**
- `users.id` → UUID (entidad principal, seguridad crítica)
- `patients.id` → UUID (datos médicos, exposición en APIs públicas)
- `emergency_scans.id` → UUID (información de emergencia, cross-system access)
- `user_dashboard_preferences.id` → UUID (datos de usuario, personalización)

**JUSTIFICACIÓN:**
- Seguridad por no-predicibilidad en APIs dashboard
- Prevención de ataques de enumeración de pacientes
- Compatibilidad con sistemas de emergencia distribuidos
- Estándar para identificadores de dashboard público

#### 10.4.2 Integer (BIGSERIAL) Usage Guidelines
**USAR INTEGER PARA:**
- **Tablas de auditoría/logging**: `audit_logs`, `dashboard_activity_logs`
- **Alta volumetría/frecuencia**: Tablas con miles de inserts diarios
- **Uso interno únicamente**: Sin exposición en APIs públicas
- **Performance crítica**: Consultas complejas con múltiples JOINs

**IMPLEMENTACIÓN EN RF003:**
- `audit_logs.id` → BIGSERIAL (alta volumetría, auditoría interna)

**FUTURAS IMPLEMENTACIONES:**
```sql
-- Ejemplos de tablas futuras con Integer IDs
CREATE TABLE dashboard_activity_logs (
    id BIGSERIAL PRIMARY KEY,                -- Alto volumen, métricas internas
    user_id UUID REFERENCES users(id),
    action VARCHAR(100),
    section VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medical_data_access_logs (
    id BIGSERIAL PRIMARY KEY,                -- Compliance logging
    user_id UUID REFERENCES users(id),
    accessed_patient_id UUID REFERENCES patients(id),
    data_type VARCHAR(100),
    access_timestamp TIMESTAMP
);
```

**JUSTIFICACIÓN:**
- Performance superior (4x más rápido) para logs de dashboard
- Storage efficiency para auditoría de alta frecuencia
- Facilitarían reporting y analytics internos
- Optimización para métricas de compliance médico

#### 10.4.3 Implementation Matrix for RF003

| Tabla Type | ID Type | Rationale | Performance Impact |
|------------|---------|-----------|-------------------|
| **User/Patient Entities** | UUID | Dashboard Security | Normal |
| **Medical Data** | UUID | HIPAA/Privacy Compliance | Normal |
| **Emergency Systems** | UUID | Cross-System Access | Normal |
| **Audit/Activity Logs** | BIGSERIAL | High Volume Tracking | High Performance |
| **Dashboard Analytics** | BIGSERIAL | Internal Metrics Only | High Performance |

#### 10.4.4 Dashboard-Specific Considerations
**DASHBOARD REQUIREMENTS**: El dashboard requiere UUIDs para:
- **User Session Security**: Prevenir enumeración de sesiones de usuario
- **Medical Data Privacy**: Cumplimiento con estándares médicos
- **Emergency Access**: QR codes y sistemas de emergencia seguros
- **Cross-Platform**: Integración con sistemas hospitalarios externos

**PERFORMANCE OPTIMIZATION**: Logs y métricas usan BIGSERIAL por:
- **High-Frequency Operations**: Dashboard genera muchos logs de actividad
- **Analytics Queries**: Reportes de usage requieren performance optimizada
- **Compliance Auditing**: Auditorías médicas necesitan consultas rápidas
- **Internal Use Only**: Sin exposición pública, secuencialidad no es problema

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
        "email": "string"
    },
    "medical_basic": {
        "blood_type": "string",
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
├── MedicationSection.tsx (CRUD completo)
├── GynecologicalSection.tsx (CRUD completo - solo mujeres)
├── PersonalInfoSection.tsx (información extendida)
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
- `/emergency/scan/:qr` - Escaneo de emergencia (paramédicos y el mismo usuario puede ver sus datos.)

### 17.2 Redirecciones Post-Login
- **Paciente** → `/dashboard` (vista paciente)
- **Paramédico** → `/dashboard` (vista paramédico)
- **Administrador** → `/dashboard` (vista admin)

### 17.3 Protección de Rutas
- Middleware de autenticación en todas las rutas /dashboard
- Verificación de rol específico por funcionalidad
- Redirección automática a login si no autenticado

## 18. Notas de Implementación

### 18.1 Brand Manual Compliance (CRITICAL)
- **OBLIGATORIO**: Seguir completamente el `MANUAL_DE_MARCA.md` sin excepciones
- **Color Migration**: Migrar TODOS los colores genéricos a colores oficiales VitalGo
  ```tsx
  // ✅ CORRECTO - Colores oficiales VitalGo para dashboard
  className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white"
  className="text-vitalgo-dark border-vitalgo-green/20"
  className="bg-vitalgo-green-lightest border-vitalgo-green" // Stats success
  className="bg-gradient-to-r from-vitalgo-green-lightest via-white to-vitalgo-green-lightest"

  // ❌ INCORRECTO - Colores genéricos
  className="bg-green-500 hover:bg-green-600 text-white"
  className="text-gray-900 border-green-200"
  className="bg-green-100 border-green-300" // Stats genérico
  className="bg-gradient-to-r from-green-100 to-blue-100" // Gradientes genéricos
  ```
- **Medical Colors**: Usar colores específicos para información médica crítica
- **Asset Usage**: Logos oficiales e iconografía médica VitalGo únicamente
- **Typography**: Sistema oficial con jerarquía específica para dashboard médico

### 18.2 Component Architecture (Brand Compliant)
- **Navbar**: `AuthenticatedNavbar` from `/src/shared/components/organisms/AuthenticatedNavbar.tsx`
  - Props completos: user data (name, role, avatar), onLogout function
  - Logo horizontal oficial azul (#002C41)
  - Menú desplegable con opciones: Mi Perfil, Configuración, Cerrar sesión
  - Sticky positioning con z-index apropiado
  - Badge notificaciones con colores oficiales VitalGo
- **Footer**: `AuthenticatedFooter` from `/src/shared/components/organisms/AuthenticatedFooter.tsx`
  - Footer simplificado para usuarios autenticados
  - Logo footer oficial VitalGo (tamaño reducido)
  - Enlaces esenciales sin sobrecarga informativa

### 18.3 Dashboard Layout & Styling (Strict Brand Compliance)
```tsx
// ESTRUCTURA OBLIGATORIA DEL DASHBOARD
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest via-white to-gray-50">
  <AuthenticatedNavbar user={user} onLogout={handleLogout} className="sticky top-0 z-50" />

  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header con iconografía oficial */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-vitalgo-dark">Hola, {user.firstName} 👋</h1>
        <p className="text-vitalgo-dark-light">Gestiona tu información médica de forma segura</p>
      </div>
      <img src="/assets/images/icons/vitalgo-heart.svg" className="h-12 w-12" />
    </div>

    {/* Stats grid con colores oficiales */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Stats cards con bg-white y iconos con bg-vitalgo-green */}
    </div>

    {/* Medical sections con brand styling */}
    <div className="space-y-8">
      {/* Cards con rounded-xl shadow-lg border border-gray-200 */}
    </div>
  </main>

  <AuthenticatedFooter className="mt-16" />
</div>
```

### 18.4 Stats Cards & Medical Cards (Brand Guidelines)
- **Card Styling**: `bg-white rounded-xl shadow-lg border border-gray-200`
- **Hover Effects**: `hover:shadow-xl transition-shadow`
- **Icon Backgrounds**: `bg-vitalgo-green` para iconos principales
- **Text Hierarchy**: `text-vitalgo-dark` para títulos, `text-vitalgo-dark-light` para subtítulos
- **Action Buttons**: `bg-vitalgo-green hover:bg-vitalgo-green-light` consistente
- **Success States**: `text-vitalgo-green` para estados positivos

### 18.5 Medical Data Sections (Brand Compliant)
- **Section Headers**: Gradientes sutiles con `from-vitalgo-green-lightest to-white`
- **Icon Containers**: `bg-vitalgo-green rounded-lg` para iconos de sección
- **Add Buttons**: `bg-vitalgo-green hover:bg-vitalgo-green-light` consistente
- **Empty States**: Iconografía gris con call-to-action en verde oficial
- **Data Cards**: Border y background con variaciones oficiales VitalGo
- **Critical Information**: Destacar alergias críticas con colores de emergencia

### 18.6 QR Code Emergency Section (Special Brand Treatment)
```tsx
// SECCIÓN ESPECIAL QR CON BRANDING DESTACADO
<div className="bg-gradient-to-r from-vitalgo-green-lightest via-white to-vitalgo-green-lightest rounded-xl shadow-lg border border-vitalgo-green/20">
  <div className="p-6">
    {/* Header con icono VitalGo oficial */}
    <div className="flex items-center mb-6">
      <div className="h-10 w-10 bg-vitalgo-green rounded-lg flex items-center justify-center mr-4">
        <QrCodeIcon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-vitalgo-dark">Código QR de Emergencia</h3>
        <p className="text-vitalgo-dark-light">Acceso rápido a tu información médica</p>
      </div>
    </div>
    {/* Grid con QR display y acciones */}
  </div>
</div>
```

### 18.7 Responsive Design (Manual de Marca)
- **Mobile First**: Diseño principal para 320px-767px
- **Breakpoints**: Oficiales (640px, 768px, 1024px, 1280px)
- **Dashboard Adaptations**:
  - Mobile: Stack vertical, stats 1 columna, padding px-4
  - Tablet: Stats 2 columnas, medical cards adaptadas, padding px-6
  - Desktop: Stats 4 columnas, full layout, max-width 7xl, padding px-8
- **Touch Targets**: Mínimo 44px en elementos interactivos
- **Sticky Navigation**: Navbar persistente con z-index apropiado

### 18.8 Accessibility & UX (Manual de Marca)
- **Medical Data**: ARIA labels para información crítica de salud
- **Stats Announcement**: Screen readers anuncian cambios en estadísticas
- **Keyboard Navigation**: Tab order lógico entre cards y acciones CRUD
- **Color Contrast**: Ratio 4.5:1 con colores oficiales VitalGo
- **Form Controls**: Labels apropiados para modales de edición médica
- **Emergency Information**: Markup semántico para datos de emergencia

### 18.9 Technical Implementation
- **Dashboard Multi-Rol**: Un solo componente con lógica condicional (solo pacientes por ahora)
- **Componentes Reutilizables**: AllergySection, IllnessSection, SurgerySection, MedicationSection
- **Estado Global**: Context API para datos de usuario y autenticación
- **Data Fetching**: Lazy loading de datos médicos por sección
- **Auto-refresh**: Actualización automática de stats cada 5 minutos
- **Error Handling**: Graceful degradation con mensajes útiles

### 18.10 Performance & Quality (Brand Standards)
- **Asset Optimization**: SVG logos oficiales para mejor rendimiento
- **Lazy Loading**: Componentes de secciones médicas no visibles
- **Virtual Scrolling**: Para listas grandes de medicamentos/alergias
- **Caching**: Datos médicos en memoria con invalidación inteligente
- **Progressive Enhancement**: Funcionalidad core sin JavaScript
- **Testing**: Verificar compliance visual con manual de marca en todas las resoluciones

### 18.11 Data Security & Medical Compliance
- **Encryption**: Datos médicos encriptados en tránsito y reposo
- **Access Logs**: Auditoría completa de accesos a información médica
- **HIPAA/GDPR**: Cumplimiento con regulaciones de privacidad médica
- **Session Management**: Timeout automático para sesiones inactivas
- **Backup**: Respaldo automático de información médica crítica

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

**Documento preparado por:** AI Assistant & Jhonatan Rico & Daniela Quintero
**Revisado por:** [Jhonatan Rico]
**Aprobado por:** [Daniela Quintero]