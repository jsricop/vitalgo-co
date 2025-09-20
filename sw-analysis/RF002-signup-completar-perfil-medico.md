# RF002 - Completar Perfil Médico Integral (/completar-perfil-medico)

**Fecha:** 2025-09-18
**Versión:** 2.0 - **ENHANCED**
**Estado:** Pendiente Implementación
**Prioridad:** **CRÍTICA**

## 1. Descripción General

**Wizard integral de 5 pasos** que permite a los pacientes completar su perfil médico completo con información demográfica, médica básica, seguridad social y antecedentes médicos. **El sistema implementa validación obligatoria en login** para campos críticos, mostrando automáticamente el wizard cuando información esencial está incompleta.

## 2. Objetivo

Recopilar **información médica integral** necesaria para:
- **Atención de emergencias** (información crítica)
- **Gestión de seguridad social** (EPS, seguros)
- **Historial médico completo** (antecedentes opcionales)
- **Cumplimiento regulatorio** (datos demográficos)

## 3. Actores

- **Actor Principal:** Paciente autenticado (nuevo o existente)
- **Actor Secundario:** Sistema VitalGo
- **Actor Externo:** Personal médico y sistemas de salud

## 4. NUEVA Lógica de Validación Obligatoria en Login

### 4.1 Trigger Automático
```
Login Exitoso → Verificar Completitud del Perfil → Mostrar Wizard si Incompleto
```

### 4.2 Campos Obligatorios (No Pueden Estar Vacíos)
**Si CUALQUIERA de estos campos está vacío, el wizard se muestra automáticamente:**

#### Información Personal Crítica:
- ✅ Sexo biológico
- ✅ Género
- ✅ País de nacimiento
- ✅ Departamento de nacimiento (si Colombia)
- ✅ Ciudad de nacimiento
- ✅ Dirección de residencia completa
- ✅ Departamento de residencia
- ✅ Ciudad de residencia

#### Seguridad Social:
- ✅ EPS
- ✅ Ocupación

#### Información Médica Básica:
- ✅ Tipo de sangre
- ✅ Nombre contacto de emergencia
- ✅ Parentesco contacto emergencia
- ✅ Teléfono contacto emergencia

### 4.3 Secciones Opcionales (No Bloquean Login)
- ❌ Antecedentes Médicos (Alergias, Enfermedades, Cirugías, Medicamentos)
- ❌ Antecedentes Ginecológicos (solo mujeres)

## 5. NUEVA Estructura del Wizard (5 Pasos)

### 5.1 Flujo de Login Mejorado
```
1. Usuario ingresa credenciales correctas
2. Sistema valida JWT y obtiene datos de usuario
3. Sistema verifica completitud del perfil médico
4. SI perfil incompleto → Redirigir a /completar-perfil-medico
5. SI perfil completo → Redirigir a /dashboard
```

### 5.2 Navegación del Wizard
1. **Paso 1:** Información Personal Extendida ⭐ **OBLIGATORIO**
2. **Paso 2:** Seguridad Social y Ocupación ⭐ **OBLIGATORIO**
3. **Paso 3:** Información Médica Básica ⭐ **OBLIGATORIO**
4. **Paso 4:** Antecedentes Médicos ❌ **OPCIONAL**
5. **Paso 5:** Antecedentes Ginecológicos ❌ **OPCIONAL** (solo mujeres)

### 5.3 Lógica de Validación
- Navegación entre pasos solo permitida si paso actual es válido
- Campos obligatorios bloquean progreso hasta completarse
- Secciones opcionales pueden saltarse
- Progreso se guarda automáticamente por paso

## 6. NUEVAS Secciones del Formulario

### 6.1 Paso 1: Información Personal Extendida ⭐ **OBLIGATORIO**

#### 6.1.1 Información Demográfica
| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Sexo Biológico** | Radio | Masculino, Femenino, Intersexual | ✅ |
| **Género** | Radio | Masculino, Femenino, No binario, Otro | ✅ |
| **País de Nacimiento** | Select | Lista de países (por defecto Colombia) | ✅ |
| **Departamento de Nacimiento** | Select | 32 departamentos colombianos | ✅ (si Colombia) |
| **Ciudad de Nacimiento** | HybridInput | Lista ciudades + input libre | ✅ |

#### 6.1.2 Información de Residencia
| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Dirección Completa** | Text | Mínimo 10 caracteres | ✅ |
| **Departamento** | Select | 32 departamentos colombianos | ✅ |
| **Ciudad** | HybridInput | Lista ciudades + input libre | ✅ |

### 6.2 Paso 2: Seguridad Social y Ocupación ⭐ **OBLIGATORIO**

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **EPS** | Select | Lista EPS colombianas + "Otra" | ✅ |
| **EPS Especificar** | Text | Solo si selecciona "Otra" | ❌ |
| **Seguros Adicionales** | Text | Seguros privados | ❌ |
| **Plan Complementario** | Select | Prepagadas + "Ninguno" | ❌ |
| **Plan Otro** | Text | Solo si selecciona "Otro" | ❌ |
| **Ocupación** | Text | Profesión actual | ✅ |

**Lista EPS:** Sura, Sanitas, Compensar, Famisanar, Nueva EPS, Salud Total, Coomeva, Cafesalud, Medimás, Coosalud, Otra

### 6.3 Paso 3: Información Médica Básica ⭐ **OBLIGATORIO**

#### 6.3.1 Información Médica
| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Tipo de Sangre** | Radio | O+, O-, A+, A-, B+, B-, AB+, AB- | ✅ |

#### 6.3.2 Contacto de Emergencia
| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Nombre Completo** | Text | Mínimo 5 caracteres | ✅ |
| **Parentesco** | Select | Lista predefinida | ✅ |
| **Teléfono Principal** | Phone | Formato +57 XXX XXX XXXX | ✅ |
| **Teléfono Alternativo** | Phone | Formato internacional | ❌ |

**Opciones Parentesco:** Madre, Padre, Hermano/a, Esposo/a, Hijo/a, Primo/a, Tío/a, Abuelo/a, Amigo/a, Otro

### 6.4 Paso 4: Antecedentes Médicos ❌ **OPCIONAL**

#### 6.4.1 Medicamentos Actuales (NUEVA SECCIÓN)
**Estructura dinámica (agregar/eliminar múltiples):**
| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Nombre Medicamento** | Text | Mínimo 2 caracteres | ✅ |
| **Dosis** | Text | Ej: 50mg, 500mg | ✅ |
| **Frecuencia** | Text | Ej: Cada 8 horas | ✅ |
| **Prescrito por** | Text | Nombre médico | ❌ |
| **Fecha de inicio** | Date | No futura | ❌ |
| **Notas** | Textarea | Máximo 500 caracteres | ❌ |

#### 6.4.2 Alergias (MEJORADAS)

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Alérgeno** | Text | Mínimo 2 caracteres | ✅ |
| **Severidad** | Select | LEVE, MODERADA, SEVERA, CRÍTICA | ✅ |
| **Síntomas** | Text | Máximo 500 caracteres | ❌ |
| **Tratamiento** | Text | Máximo 500 caracteres | ❌ |
| **Fecha diagnóstico** | Date | No futura | ❌ |
| **Notas adicionales** | Textarea | Máximo 1000 caracteres | ❌ |

#### 6.4.3 Enfermedades (MEJORADAS)
| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Nombre enfermedad** | Text | Mínimo 2 caracteres | ✅ |
| **Fecha diagnóstico** | Date | No futura | ✅ |
| **Código CIE-10** | Text | Formato alfanumérico | ❌ |
| **Síntomas** | Text | Máximo 500 caracteres | ❌ |
| **Tratamiento actual** | Text | Máximo 500 caracteres | ❌ |
| **Médico prescriptor** | Text | Máximo 200 caracteres | ❌ |
| **Enfermedad crónica** | Checkbox | Boolean | ❌ |
| **Notas adicionales** | Textarea | Máximo 1000 caracteres | ❌ |

#### 6.4.4 Cirugías (MEJORADAS)
| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **Nombre cirugía** | Text | Mínimo 2 caracteres | ✅ |
| **Fecha cirugía** | Date | No futura | ✅ |
| **Cirujano** | Text | Máximo 200 caracteres | ❌ |
| **Hospital** | Text | Máximo 200 caracteres | ❌ |
| **Descripción** | Textarea | Máximo 1000 caracteres | ❌ |
| **Diagnóstico** | Text | Máximo 500 caracteres | ❌ |
| **Tipo anestesia** | Select | GENERAL, LOCAL, REGIONAL, SEDACIÓN | ❌ |
| **Duración (min)** | Number | 1-1440 minutos | ❌ |
| **Notas adicionales** | Textarea | Máximo 1000 caracteres | ❌ |

### 6.5 Paso 5: Antecedentes Ginecológicos ❌ **OPCIONAL** (Solo Mujeres)

**Condicional:** Solo se muestra si `sexo_biologico === "femenino"`

| Campo | Tipo | Validación | Obligatorio |
|-------|------|------------|-------------|
| **¿Está embarazada?** | Radio | Sí, No | ✅ (solo mujeres) |
| **Semanas embarazo** | Number | 1-42 semanas | ❌ (solo si embarazada) |
| **Fecha última menstruación** | Date | No futura | ❌ |
| **Número embarazos** | Number | 0 o mayor | ❌ |
| **Número partos** | Number | 0 o mayor | ❌ |
| **Número cesáreas** | Number | 0 o mayor | ❌ |
| **Número abortos** | Number | 0 o mayor | ❌ |
| **Método anticonceptivo** | Select | Lista métodos + "Ninguno" | ❌ |

**Métodos Anticonceptivos:** Ninguno, Preservativo, Píldora, DIU, Implante, Inyección, Parche, Anillo, Métodos naturales, Ligadura, Otro

## 7. Validaciones Detalladas

### 7.1 Validaciones de Fechas
- **Fecha de diagnóstico**: No puede ser futura
- **Fecha de cirugía**: No puede ser futura
- **Formato**: YYYY-MM-DD (ISO 8601)
- **Rango**: Entre 1900-01-01 y fecha actual

### 7.2 Validaciones de Severidad (Alergias)
**Opciones disponibles:**
- LEVE - Síntomas menores, no requiere intervención inmediata
- MODERADA - Síntomas notables, requiere atención médica
- SEVERA - Síntomas graves, requiere atención médica urgente
- CRÍTICA - Riesgo de vida, requiere intervención inmediata

### 7.3 Validaciones de Anestesia (Cirugías)
**Opciones disponibles:**
- GENERAL - Anestesia general, paciente inconsciente
- LOCAL - Anestesia local, área específica
- REGIONAL - Anestesia regional (epidural, raquídea)
- SEDACIÓN - Sedación consciente

### 7.4 Validaciones de Campos de Texto
- **Caracteres especiales**: Permitidos en campos descriptivos
- **Longitud máxima**: Validada según especificación por campo
- **Sanitización**: Prevenir XSS en inputs de texto

## 8. Brand Manual Compliance & Interface Elements

### 8.1 BRAND MANUAL COMPLIANCE
**MANDATORY**: Esta página DEBE seguir completamente las especificaciones del `MANUAL_DE_MARCA.md`

#### 8.1.1 Color Scheme (Estricto)
```css
/* USAR ESTOS COLORES OFICIALES EXCLUSIVAMENTE */
--vitalgo-green: #01EF7F        /* Verde principal - Botones principales y progreso */
--vitalgo-green-light: #5AF4AC   /* Verde claro - Hover states y completado */
--vitalgo-green-lighter: #99F9CC /* Verde más claro - Backgrounds sutiles */
--vitalgo-green-lightest: #CCFCE5 /* Verde muy claro - Steps completados */
--vitalgo-dark: #002C41          /* Azul oscuro - Textos principales y headers */
--vitalgo-dark-light: #406171    /* Azul medio - Textos secundarios */
--vitalgo-dark-lighter: #99ABB3  /* Azul claro - Placeholders y disabled */
--vitalgo-dark-lightest: #CCD5D9 /* Azul muy claro - Backgrounds neutros */
```

#### 8.1.2 Typography System (Wizard Specific)
```css
/* TIPOGRAFÍA OFICIAL PARA WIZARD */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
/* Jerarquía específica para wizard */
h1: 2rem (32px) font-bold - Título principal wizard
h2: 1.5rem (24px) font-semibold - Títulos de pasos
h3: 1.25rem (20px) font-medium - Títulos de secciones
body: 1rem (16px) font-normal - Texto general
small: 0.875rem (14px) font-normal - Instrucciones
label: 0.875rem (14px) font-medium - Labels de formulario
button: 0.875rem (14px) font-semibold - Botones de acción
```

#### 8.1.3 Logo & Asset Requirements
```tsx
/* ASSETS OFICIALES OBLIGATORIOS */
Logo Navbar: "/assets/images/logos/vitalgo-logo-horizontal-official.svg"
Logo Icon: "/assets/images/logos/vitalgo-icon-official.svg"
Heart Icon: "/assets/images/icons/vitalgo-heart.svg"
Favicon: "/favicon.ico"
/* Iconografía médica oficial VitalGo */
```

#### 8.1.4 Spacing System (Wizard Layout)
```css
/* SISTEMA DE ESPACIADO WIZARD */
wizard-container: max-w-4xl mx-auto px-4 py-8
step-spacing: space-y-8 (32px entre pasos)
section-spacing: space-y-6 (24px entre secciones)
field-spacing: space-y-4 (16px entre campos)
card-padding: p-6 md:p-8 (24px mobile, 32px desktop)
progress-height: h-2 (8px) para barra de progreso
step-indicator: h-10 w-10 (40x40px) para indicators
```

### 8.2 Navbar Specification (MANDATORY)
**COMPONENT**: `AuthenticatedNavbar` from `/src/shared/components/organisms/AuthenticatedNavbar.tsx`

```tsx
<AuthenticatedNavbar
  user={{
    name: userData.fullName,
    role: "paciente",
    avatar: userData.avatar
  }}
  onLogout={handleLogout}
  className="bg-white border-b border-gray-200"
/>
```

**BRAND FEATURES**:
- VitalGo logo horizontal oficial azul (#002C41)
- Navegación inteligente al dashboard (/dashboard)
- Menú de usuario con dropdown: Perfil, Configuración, Cerrar sesión
- Avatar circular con iniciales del usuario
- Responsive con hamburger menu en mobile
- Altura estándar: h-16 (64px)

### 8.3 Footer Specification (MANDATORY)
**COMPONENT**: `AuthenticatedFooter` from `/src/shared/components/organisms/AuthenticatedFooter.tsx`

```tsx
<AuthenticatedFooter
  className="bg-white border-t border-gray-200"
/>
```

**BRAND FEATURES**:
- Footer simplificado para usuarios autenticados
- Logo footer oficial VitalGo más pequeño
- Enlaces esenciales: Soporte, Privacidad, Términos
- Copyright con año dinámico
- Sin sobrecarga informativa (focus en completar perfil)

### 8.4 Wizard Layout (Brand Compliant)
```tsx
/* CONTENEDOR PRINCIPAL WIZARD */
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest via-white to-vitalgo-dark-lightest">
  <div className="max-w-4xl mx-auto px-4 py-8">
    {/* HEADER WIZARD CON MARCA */}
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <img src="/assets/images/icons/vitalgo-heart.svg"
             alt="VitalGo" className="h-12 w-12" />
      </div>
      <h1 className="text-2xl font-bold text-vitalgo-dark mb-2">
        Completa tu perfil médico
      </h1>
      <p className="text-vitalgo-dark-light">
        Esta información nos ayuda a brindarte la mejor atención en emergencias
      </p>
    </div>

    {/* PROGRESS INDICATOR */}
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-vitalgo-dark">
          Paso {currentStep} de 5
        </span>
        <span className="text-sm text-vitalgo-dark-light">
          {completionPercentage}% completado
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-vitalgo-green h-2 rounded-full transition-all duration-300"
             style={{width: `${completionPercentage}%`}}></div>
      </div>
    </div>
  </div>
</div>
```

### 8.5 Step Indicators (Brand Design)
```tsx
/* INDICADORES DE PASOS */
<div className="flex justify-center items-center space-x-4 mb-8">
  {[1, 2, 3, 4, 5].map((step) => (
    <div key={step} className="flex items-center">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center
                      ${step < currentStep ? 'bg-vitalgo-green text-white' :
                        step === currentStep ? 'bg-vitalgo-green border-2 border-vitalgo-green-light text-white' :
                        'bg-gray-200 text-gray-500'}`}>
        {step < currentStep ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <span className="text-sm font-semibold">{step}</span>
        )}
      </div>
      {step < 5 && (
        <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-vitalgo-green' : 'bg-gray-200'}`} />
      )}
    </div>
  ))}
</div>
```

### 8.6 Form Cards (Brand Styling)
```tsx
/* CARDS DE FORMULARIO */
<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
  {/* HEADER DE SECCIÓN */}
  <div className="flex items-center mb-6">
    <div className="h-8 w-8 bg-vitalgo-green rounded-lg flex items-center justify-center mr-3">
      <HeartIcon className="h-5 w-5 text-white" />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-vitalgo-dark">
        Información Personal
      </h2>
      <p className="text-sm text-vitalgo-dark-light">
        Campos marcados con * son obligatorios
      </p>
    </div>
  </div>

  {/* CAMPOS DEL FORMULARIO */}
  <div className="space-y-4">
    <input className="w-full px-3 py-3 border border-gray-300 rounded-lg
                     focus:border-vitalgo-green focus:ring-2 focus:ring-vitalgo-green/20
                     transition-colors placeholder-vitalgo-dark-lighter" />
  </div>
</div>
```

### 8.7 Dynamic Sections (Medical History)
```tsx
/* SECCIONES DINÁMICAS - ALERGIAS, ENFERMEDADES, CIRUGÍAS */
<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
  {/* HEADER CON CONTADOR */}
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center">
      <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
        <AlertTriangleIcon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-vitalgo-dark">
        Alergias ({allergies.length})
      </h3>
    </div>
    <Button className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white
                      px-4 py-2 rounded-lg text-sm font-medium">
      + Agregar Alergia
    </Button>
  </div>

  {/* LISTA DE ITEMS O ESTADO VACÍO */}
  {allergies.length === 0 ? (
    <div className="text-center py-8 text-vitalgo-dark-light">
      <AlertTriangleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <p>No has agregado alergias aún</p>
      <p className="text-sm">Agregar esta información ayuda en emergencias</p>
    </div>
  ) : (
    <div className="space-y-4">
      {/* Items con brand styling */}
    </div>
  )}
</div>
```

### 8.8 Navigation Buttons (Brand Design)
```tsx
/* NAVEGACIÓN DEL WIZARD */
<div className="flex justify-between items-center pt-8 border-t border-gray-200">
  {/* BOTÓN ANTERIOR */}
  {currentStep > 1 && (
    <Button variant="outline"
            className="border-vitalgo-green text-vitalgo-green hover:bg-vitalgo-green hover:text-white">
      ← Paso anterior
    </Button>
  )}

  <div className="flex space-x-4 ml-auto">
    {/* SALTAR PASO (SOLO SECCIONES OPCIONALES) */}
    {isOptionalStep && (
      <Button variant="ghost"
              className="text-vitalgo-dark-light hover:text-vitalgo-dark">
        Saltar por ahora
      </Button>
    )}

    {/* BOTÓN SIGUIENTE/COMPLETAR */}
    <Button className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white
                      px-8 py-3 rounded-lg font-semibold">
      {isLastStep ? 'Completar perfil' : 'Siguiente paso →'}
    </Button>
  </div>
</div>
```

### 8.9 Form Validation (Brand States)
```tsx
/* ESTADOS DE VALIDACIÓN CON COLORES OFICIALES */
// Estado válido
<div className="border-vitalgo-green bg-vitalgo-green-lightest">
  <CheckCircleIcon className="h-4 w-4 text-vitalgo-green" />
  <span className="text-vitalgo-dark text-sm">Campo completado correctamente</span>
</div>

// Estado error
<div className="border-red-300 bg-red-50">
  <XCircleIcon className="h-4 w-4 text-red-500" />
  <span className="text-red-700 text-sm">Este campo es obligatorio</span>
</div>

// Estado loading
<div className="border-vitalgo-green-light bg-vitalgo-green-lightest">
  <Spinner className="h-4 w-4 text-vitalgo-green animate-spin" />
  <span className="text-vitalgo-dark text-sm">Guardando...</span>
</div>
```

### 8.10 Responsive Design (Manual de Marca)
```css
/* BREAKPOINTS OFICIALES PARA WIZARD */
Mobile: 320px - 767px
- Wizard stack vertical
- Progress indicator simplificado
- Cards full-width con padding reducido
- Botones full-width

Tablet: 768px - 1023px
- Wizard centrado max-width-3xl
- Progress indicator completo
- Cards con sombras moderadas
- Botones con width automático

Desktop: 1024px+
- Wizard centrado max-width-4xl
- Full progress indicator con labels
- Cards con sombras profundas
- Layout horizontal para navegación
```

### 8.11 Accessibility (Manual de Marca)
- **Wizard Navigation**: ARIA labels para navegación de pasos
- **Progress Indicator**: Screen reader announcements
- **Form Labels**: Asociación correcta con elementos
- **Error Messages**: Claros y específicos en español
- **Keyboard Navigation**: Tab order lógico entre pasos
- **Color Contrast**: Ratio 4.5:1 con colores oficiales VitalGo

## 9. Seguridad

### 9.1 Autenticación y Autorización
- Verificación de token JWT válido
- Redirección a login si no autenticado
- Verificación de rol de paciente
- Acceso solo a información propia del usuario

### 9.2 Validaciones de Seguridad
- Sanitización de todos los inputs de texto
- Validación tanto frontend como backend
- Rate limiting: máximo 10 submissions por usuario por hora
- Prevención de ataques XSS en campos descriptivos

### 9.3 Privacidad de Datos Médicos
- Datos médicos encriptados en base de datos
- Logs de acceso a información médica
- Cumplimiento con regulaciones de privacidad médica
- Consentimiento implícito al guardar información

## 10. NUEVA Base de Datos Extendida

### 10.1 Tabla Patients EXTENDIDA
```sql
-- Agregar campos nuevos a tabla patients existente
ALTER TABLE patients ADD COLUMN biological_sex VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN gender VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN birth_country VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN birth_department VARCHAR(100);
ALTER TABLE patients ADD COLUMN birth_city VARCHAR(100);
ALTER TABLE patients ADD COLUMN residence_address TEXT NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN residence_department VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN residence_city VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN eps VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN eps_other VARCHAR(100);
ALTER TABLE patients ADD COLUMN health_insurance VARCHAR(200);
ALTER TABLE patients ADD COLUMN complementary_plan VARCHAR(100);
ALTER TABLE patients ADD COLUMN complementary_plan_other VARCHAR(100);
ALTER TABLE patients ADD COLUMN occupation VARCHAR(200) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN blood_type VARCHAR(5) NOT NULL DEFAULT '';

-- Campos de completitud del perfil
ALTER TABLE patients ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE patients ADD COLUMN profile_completion_date TIMESTAMP;
ALTER TABLE patients ADD COLUMN mandatory_fields_completed BOOLEAN DEFAULT FALSE;
```

### 10.2 NUEVA Tabla Emergency Contacts
```sql
CREATE TABLE patient_emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternative_phone VARCHAR(20),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.3 NUEVA Tabla Current Medications
```sql
CREATE TABLE patient_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    prescribed_by VARCHAR(200),
    start_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.4 NUEVA Tabla Gynecological History
```sql
CREATE TABLE patient_gynecological_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    is_pregnant BOOLEAN DEFAULT FALSE,
    pregnancy_weeks INTEGER,
    last_menstrual_period DATE,
    pregnancies INTEGER DEFAULT 0,
    births INTEGER DEFAULT 0,
    cesareans INTEGER DEFAULT 0,
    abortions INTEGER DEFAULT 0,
    contraceptive_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.5 Tablas Médicas MEJORADAS
```sql
-- Alergias (mejorada)
CREATE TABLE patient_allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    allergen VARCHAR(200) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LEVE', 'MODERADA', 'SEVERA', 'CRÍTICA')),
    symptoms TEXT,
    treatment TEXT,
    diagnosed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enfermedades (mejorada)
CREATE TABLE patient_illnesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    diagnosed_date DATE NOT NULL,
    cie10_code VARCHAR(10),
    symptoms TEXT,
    treatment TEXT,
    prescribed_by VARCHAR(200),
    is_chronic BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cirugías (mejorada)
CREATE TABLE patient_surgeries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    surgery_date DATE NOT NULL,
    surgeon VARCHAR(200),
    hospital VARCHAR(200),
    description TEXT,
    diagnosis TEXT,
    anesthesia_type VARCHAR(20) CHECK (anesthesia_type IN ('GENERAL', 'LOCAL', 'REGIONAL', 'SEDACIÓN')),
    surgery_duration_minutes INTEGER CHECK (surgery_duration_minutes > 0 AND surgery_duration_minutes <= 1440),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10.6 Tablas de Auditoría y Logging (BIGSERIAL IDs)
```sql
-- Logs de completitud del perfil (alta volumetría)
CREATE TABLE profile_completion_logs (
    id BIGSERIAL PRIMARY KEY,                -- Integer optimizado para alto volumen
    patient_id UUID REFERENCES patients(id),
    step_completed INTEGER NOT NULL,
    step_name VARCHAR(100),
    completion_percentage INTEGER,
    fields_completed JSON,
    completion_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    -- Índices optimizados para consultas frecuentes
    INDEX idx_profile_logs_patient_time (patient_id, completion_timestamp DESC),
    INDEX idx_profile_logs_step_time (step_completed, completion_timestamp DESC),
    INDEX idx_profile_logs_session (session_id, completion_timestamp DESC)
);

-- Logs de validación de formularios (debugging interno)
CREATE TABLE form_validation_logs (
    id BIGSERIAL PRIMARY KEY,                -- Debugging y análisis interno
    patient_id UUID REFERENCES patients(id),
    field_name VARCHAR(100) NOT NULL,
    field_value_hash VARCHAR(64),           -- Hash del valor para debugging sin exponer datos
    validation_result BOOLEAN NOT NULL,
    error_message VARCHAR(500),
    validation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    step_number INTEGER,
    form_section VARCHAR(50),
    -- Índices para análisis de validación
    INDEX idx_validation_logs_patient (patient_id, validation_timestamp DESC),
    INDEX idx_validation_logs_field_result (field_name, validation_result, validation_timestamp DESC),
    INDEX idx_validation_logs_step (step_number, validation_timestamp DESC)
);

-- Logs de envío de formularios (métricas de uso)
CREATE TABLE form_submission_logs (
    id BIGSERIAL PRIMARY KEY,                -- Métricas internas de alta frecuencia
    patient_id UUID REFERENCES patients(id),
    step_submitted INTEGER NOT NULL,
    submission_success BOOLEAN NOT NULL,
    processing_time_ms INTEGER,
    error_code VARCHAR(50),
    submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_info JSON,
    -- Índices para análisis de performance
    INDEX idx_submission_logs_patient_time (patient_id, submission_timestamp DESC),
    INDEX idx_submission_logs_success_time (submission_success, submission_timestamp DESC),
    INDEX idx_submission_logs_performance (processing_time_ms, submission_timestamp DESC)
);
```

**Rationale para BIGSERIAL en Logging:**
- **Alto Volumen**: Profile completion genera muchos logs por cada usuario
- **Performance Crítica**: Consultas de análisis requieren máxima velocidad
- **Uso Interno**: Sin exposición en APIs públicas, secuencialidad no es problema
- **Analytics**: Optimización para reportes de completitud y métricas UX

### 10.7 Índices para Performance
```sql
-- Índices para búsquedas frecuentes en entidades principales
CREATE INDEX idx_patients_profile_completion ON patients(profile_completed, mandatory_fields_completed);
CREATE INDEX idx_patients_eps ON patients(eps);
CREATE INDEX idx_patients_blood_type ON patients(blood_type);
CREATE INDEX idx_emergency_contacts_patient ON patient_emergency_contacts(patient_id);
CREATE INDEX idx_medications_patient_active ON patient_medications(patient_id, is_active);

-- Índices adicionales para análisis de completitud
CREATE INDEX idx_patients_completion_date ON patients(profile_completion_date DESC);
CREATE INDEX idx_patients_gender_stats ON patients(biological_sex, gender);
CREATE INDEX idx_allergies_severity ON patient_allergies(severity, patient_id);
CREATE INDEX idx_illnesses_chronic ON patient_illnesses(is_chronic, patient_id);
```

### 10.7 UUID vs Integer ID Strategy

**STRATEGIC APPROACH**: VitalGo utiliza una estrategia híbrida para selección de tipos de ID basada en propósito y performance requirements.

#### 10.7.1 UUID Usage Guidelines
**USAR UUID PARA:**
- **Tablas principales/entidades core**: `users`, `patients`, `medical_records`, `qr_codes`
- **Datos con exposición pública**: APIs públicas, URLs, formularios web
- **Identificadores distribuidos**: Datos que se replican entre sistemas
- **Requisitos de seguridad**: Prevenir enumeración y predicción de IDs

**IMPLEMENTACIÓN EN RF002:**
- `patients.id` → UUID (entidad principal, exposición pública)
- `patient_emergency_contacts.id` → UUID (datos críticos de emergencia)
- `patient_medications.id` → UUID (información médica sensible)
- `patient_gynecological_history.id` → UUID (datos médicos confidenciales)
- `patient_allergies.id` → UUID (información crítica de emergencia)
- `patient_illnesses.id` → UUID (historial médico permanente)
- `patient_surgeries.id` → UUID (registros médicos importantes)

**JUSTIFICACIÓN:**
- Seguridad por no-predicibilidad en APIs públicas
- Prevención de ataques de enumeración médica
- Compatibilidad con sistemas de salud distribuidos
- Estándar para identificadores de pacientes

#### 10.7.2 Integer (BIGSERIAL) Usage Guidelines
**USAR INTEGER PARA:**
- **Tablas de auditoría/logging**: `profile_completion_logs`, `form_submission_logs`, `form_validation_logs`
- **Alta volumetría/frecuencia**: Tablas con miles de inserts diarios
- **Uso interno únicamente**: Sin exposición en APIs públicas
- **Performance crítica**: Consultas complejas con múltiples JOINs

**IMPLEMENTACIÓN EN RF002:**
- `profile_completion_logs.id` → BIGSERIAL (alto volumen, tracking de completitud)
- `form_validation_logs.id` → BIGSERIAL (debugging interno, análisis de errores)
- `form_submission_logs.id` → BIGSERIAL (métricas de uso, performance analytics)

**JUSTIFICACIÓN:**
- Performance superior (4x más rápido) para logs de wizard de alta frecuencia
- Storage efficiency para auditoría de completitud de perfil
- Facilita debugging y análisis de patrones de validación
- Optimización para reportes UX y métricas de conversión
- Orden secuencial natural facilita análisis temporal de completitud

#### 10.7.3 Implementation Matrix for RF002

| Tabla Type | ID Type | Rationale | Performance Impact |
|------------|---------|-----------|-------------------|
| **Patient Entities** | UUID | Medical Data Security | Normal |
| **Medical Records** | UUID | HIPAA/Privacy Compliance | Normal |
| **Emergency Info** | UUID | Critical Access Needs | Normal |
| **Profile Completion Logs** | BIGSERIAL | High Volume Wizard Tracking | High Performance |
| **Form Validation Logs** | BIGSERIAL | Debugging & Error Analysis | High Performance |
| **Form Submission Logs** | BIGSERIAL | UX Metrics & Performance | High Performance |

#### 10.7.4 Medical Data Privacy Considerations
**MEDICAL STANDARD**: Información médica requiere UUIDs por:
- **HIPAA Compliance**: Estándares internacionales de privacidad médica
- **Non-Enumerable**: Prevenir acceso secuencial a registros médicos
- **Cross-System**: Compatibilidad con sistemas hospitalarios
- **Emergency Access**: QR codes y acceso de emergencia seguros

## 11. NUEVOS API Endpoints

### 11.1 Verificación de Completitud del Perfil
**Endpoint:** `GET /api/v1/patients/me/profile-completeness`

**Response Success (200):**
```json
{
  "is_complete": false,
  "mandatory_fields_completed": false,
  "missing_mandatory_fields": [
    "biological_sex",
    "gender",
    "blood_type",
    "emergency_contact_name"
  ],
  "completion_percentage": 65,
  "next_required_step": 1,
  "optional_sections_completed": {
    "medical_history": false,
    "gynecological_history": false
  }
}
```

### 11.2 Actualización del Perfil por Pasos
**Endpoint:** `PUT /api/v1/patients/me/profile/step/{step_number}`

**Step 1 - Información Personal:**
```json
{
  "biological_sex": "femenino",
  "gender": "femenino",
  "birth_country": "Colombia",
  "birth_department": "Antioquia",
  "birth_city": "Medellín",
  "residence_address": "Carrera 45 # 12-34, Apto 501",
  "residence_department": "Antioquia",
  "residence_city": "Medellín"
}
```

**Step 2 - Seguridad Social:**
```json
{
  "eps": "Sura",
  "eps_other": null,
  "health_insurance": "Seguros Bolívar",
  "complementary_plan": "sura",
  "complementary_plan_other": null,
  "occupation": "Ingeniera de Software"
}
```

**Step 3 - Información Médica:**
```json
{
  "blood_type": "O+",
  "emergency_contact": {
    "name": "María González",
    "relationship": "madre",
    "phone": "+573123456789",
    "alternative_phone": "+576012345678"
  }
}
```

### 11.3 Crear Medicamento Actual
**Endpoint:** `POST /api/v1/patients/me/medications`

**Request Body:**
```json
{
  "name": "Losartán",
  "dosage": "50mg",
  "frequency": "Cada 12 horas",
  "prescribed_by": "Dr. Juan Pérez",
  "start_date": "2024-01-15",
  "notes": "Tomar con alimentos"
}
```

### 11.4 Crear/Actualizar Historial Ginecológico
**Endpoint:** `PUT /api/v1/patients/me/gynecological-history`

**Request Body:**
```json
{
  "is_pregnant": false,
  "pregnancy_weeks": null,
  "last_menstrual_period": "2024-09-01",
  "pregnancies": 2,
  "births": 1,
  "cesareans": 1,
  "abortions": 0,
  "contraceptive_method": "diu",
  "notes": "Sin complicaciones"
}
```

### 11.5 Completar Perfil Integral
**Endpoint:** `POST /api/v1/patients/me/profile/complete`

**Request Body:**
```json
{
  "mark_as_completed": true,
  "completion_timestamp": "2024-09-18T10:30:00Z"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Perfil médico completado exitosamente",
  "profile_completed": true,
  "completion_percentage": 100,
  "redirect_url": "/dashboard"
}
```

### 11.6 Endpoints Médicos (Mantenidos)
**Alergias:** `POST /api/v1/patients/me/allergies`
**Enfermedades:** `POST /api/v1/patients/me/illnesses`
**Cirugías:** `POST /api/v1/patients/me/surgeries`

### 11.7 Response Error (400/401/422)
```json
{
    "success": false,
    "message": "Error en validación",
    "errors": {
        "field_name": ["Error específico del campo"]
    }
}
```

## 12. Estructura de Archivos RENOVADA

### 12.1 Frontend (Enhanced Atomic Design)
```
src/slices/medical-profile/components/
├── atoms/
│   ├── ProgressDot.tsx
│   ├── ProgressBar.tsx
│   ├── StepIndicator.tsx
│   ├── BloodTypeSelector.tsx
│   ├── CountrySelector.tsx
│   ├── DepartmentSelector.tsx
│   ├── HybridCityInput.tsx
│   ├── PhoneInput.tsx
│   ├── EPSSelector.tsx
│   ├── RelationshipSelector.tsx
│   ├── ContraceptiveSelector.tsx
│   ├── SeverityBadge.tsx
│   ├── AddEntryButton.tsx
│   └── RemoveEntryButton.tsx
├── molecules/
│   ├── StepHeader.tsx
│   ├── ProgressIndicator.tsx
│   ├── PersonalInfoForm.tsx
│   ├── SocialSecurityForm.tsx
│   ├── MedicalInfoForm.tsx
│   ├── EmergencyContactForm.tsx
│   ├── MedicationEntryForm.tsx
│   ├── AllergyEntryForm.tsx
│   ├── IllnessEntryForm.tsx
│   ├── SurgeryEntryForm.tsx
│   ├── GynecologicalForm.tsx
│   └── ValidationMessage.tsx
├── organisms/
│   ├── Step1PersonalInfo.tsx
│   ├── Step2SocialSecurity.tsx
│   ├── Step3MedicalInfo.tsx
│   ├── Step4MedicalHistory.tsx
│   ├── Step5GynecologicalHistory.tsx
│   ├── WizardNavigation.tsx
│   └── CompletionSummary.tsx
├── templates/
│   └── MedicalProfileWizard.tsx
└── pages/
    └── CompleteMedicalProfilePage.tsx
```

### 12.2 Hooks Especializados
```
src/slices/medical-profile/hooks/
├── useProfileCompletion.ts
├── useWizardNavigation.ts
├── useStepValidation.ts
├── useMedicalHistory.ts
├── useGynecologicalHistory.ts
├── useColombiaCities.ts
└── useEmergencyContact.ts
```

### 12.3 Backend (Hexagonal Architecture Enhanced)
```
backend/slices/medical-profile/
├── domain/
│   ├── entities/
│   │   ├── patient_profile.py
│   │   ├── emergency_contact.py
│   │   ├── medication.py
│   │   ├── gynecological_history.py
│   │   ├── allergy.py (enhanced)
│   │   ├── illness.py (enhanced)
│   │   └── surgery.py (enhanced)
│   ├── models/
│   │   ├── patient_model.py (extended)
│   │   ├── emergency_contact_model.py
│   │   ├── medication_model.py
│   │   ├── gynecological_model.py
│   │   ├── allergy_model.py (enhanced)
│   │   ├── illness_model.py (enhanced)
│   │   └── surgery_model.py (enhanced)
│   └── validators/
│       ├── profile_completeness_validator.py
│       ├── step_validator.py
│       └── mandatory_fields_validator.py
├── application/
│   ├── ports/
│   │   ├── profile_repository.py
│   │   ├── completeness_service.py
│   │   └── validation_service.py
│   └── use_cases/
│       ├── check_profile_completeness.py
│       ├── complete_profile_step.py
│       ├── create_emergency_contact.py
│       ├── create_medication.py
│       ├── update_gynecological_history.py
│       ├── create_allergy.py (enhanced)
│       ├── create_illness.py (enhanced)
│       └── create_surgery.py (enhanced)
└── infrastructure/
    ├── api/
    │   ├── profile_endpoints.py
    │   ├── completeness_endpoints.py
    │   └── medical_history_endpoints.py
    └── persistence/
        ├── profile_repository.py
        └── medical_history_repository.py
```

## 13. Casos de Prueba

### 13.1 Pruebas Funcionales
- ✅ Acceso sin autenticación redirige a login
- ✅ Formulario se carga correctamente para usuario autenticado
- ✅ Agregar/eliminar entradas dinámicamente funciona
- ✅ Validación de campos obligatorios funciona
- ✅ Guardar información médica exitosamente
- ✅ Saltar formulario redirige a dashboard
- ✅ Manejo de errores de API

### 13.2 Pruebas de Validación
- ✅ Fechas futuras son rechazadas
- ✅ Campos obligatorios no pueden estar vacíos
- ✅ Límites de caracteres son respetados
- ✅ Valores de select son validados
- ✅ Duración de cirugía en rango válido

### 13.3 Pruebas de Seguridad
- ✅ XSS prevention en campos de texto
- ✅ Autenticación JWT requerida
- ✅ Rate limiting funcional
- ✅ Sanitización de inputs

### 13.4 Pruebas de Usabilidad
- ✅ Responsividad en dispositivos móviles
- ✅ Accesibilidad (screen readers)
- ✅ Tiempo de carga < 3 segundos
- ✅ Estados de loading y error claros

## 14. Criterios de Aceptación AMPLIADOS

### 14.1 Validación Obligatoria en Login
1. **CA001:** Sistema detecta automáticamente perfiles incompletos en login
2. **CA002:** Usuario con información obligatoria faltante es redirigido al wizard
3. **CA003:** Usuario puede saltarse solo secciones opcionales (Paso 4 y 5)
4. **CA004:** Sistema preserva progreso parcial entre sesiones

### 14.2 Wizard de 5 Pasos
5. **CA005:** Wizard muestra progreso visual claro (dots + barra + porcentaje)
6. **CA006:** Navegación entre pasos solo permitida si paso actual válido
7. **CA007:** Información ginecológica solo se muestra a mujeres
8. **CA008:** Campos geográficos colombianos funcionan correctamente

### 14.3 Validación y UX
9. **CA009:** Validación en tiempo real en todos los campos obligatorios
10. **CA010:** Mensajes de error específicos y útiles
11. **CA011:** Wizard es responsive en móviles y desktop
12. **CA012:** Tiempo de carga < 3 segundos por paso

### 14.4 Integración con Sistema
13. **CA013:** Datos guardados están disponibles inmediatamente en dashboard
14. **CA014:** Información médica disponible para códigos QR de emergencia
15. **CA015:** Perfil completado no vuelve a solicitar información obligatoria

## 15. Dependencias Técnicas

### 15.1 Frontend
- React Hook State management
- Lucide React (iconos)
- Next.js App Router
- JWT authentication
- Custom form components (InputField, SelectField, TextareaField)
- AlertWithIcon component
- Spinner component
- **Componentes Compartidos**:
  - `AuthenticatedNavbar` (navbar para usuarios autenticados)
  - `AuthenticatedFooter` (footer simplificado para usuarios autenticados)

### 15.2 Backend
- FastAPI (framework web)
- SQLAlchemy (ORM)
- JWT authentication middleware
- Pydantic (validaciones)
- UUID generation
- Date validation utilities

## 16. Flujo de Datos

### 16.1 Autenticación
```
Usuario → JWT Token → Verificación Backend → Acceso Autorizado
```

### 16.2 Envío de Información
```
Frontend → 3 API calls paralelas → Validación → Base de Datos → Confirmación
```

### 16.3 Navegación
```
Registro exitoso → /completar-perfil-medico → Completar → /dashboard
                                          → Saltar → /dashboard
```

## 17. Notas de Implementación

### 17.1 Brand Manual Compliance (CRITICAL)
- **OBLIGATORIO**: Seguir completamente el `MANUAL_DE_MARCA.md` sin excepciones
- **Color Migration**: Migrar TODOS los colores genéricos a colores oficiales VitalGo
  ```tsx
  // ✅ CORRECTO - Colores oficiales VitalGo para wizard
  className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white"
  className="text-vitalgo-dark border-vitalgo-green focus:ring-vitalgo-green/20"
  className="bg-vitalgo-green-lightest border-vitalgo-green" // Estado completado

  // ❌ INCORRECTO - Colores genéricos
  className="bg-green-500 hover:bg-green-600 text-white"
  className="text-gray-900 border-green-500 focus:ring-green-500"
  className="bg-green-100 border-green-300" // Estado genérico
  ```
- **Progress Indicators**: Usar colores oficiales VitalGo para barras y steps
- **Asset Usage**: Logos oficiales y iconografía VitalGo únicamente
- **Typography**: Sistema oficial con jerarquía específica para wizard

### 17.2 Component Architecture (Brand Compliant)
- **Navbar**: `AuthenticatedNavbar` from `/src/shared/components/organisms/AuthenticatedNavbar.tsx`
  - Props completos con user data: name, role="paciente", avatar
  - Función onLogout configurada
  - Logo horizontal oficial azul (#002C41)
  - Menú desplegable con opciones oficiales
- **Footer**: `AuthenticatedFooter` from `/src/shared/components/organisms/AuthenticatedFooter.tsx`
  - Footer simplificado para usuarios autenticados
  - Logo footer oficial VitalGo
  - Enlaces esenciales sin sobrecarga informativa

### 17.3 Wizard Layout & Styling (Strict Brand Compliance)
```tsx
// ESTRUCTURA OBLIGATORIA DEL WIZARD
<div className="min-h-screen bg-gradient-to-br from-vitalgo-green-lightest via-white to-vitalgo-dark-lightest">
  <div className="max-w-4xl mx-auto px-4 py-8">
    {/* Header con iconografía oficial */}
    <div className="text-center mb-8">
      <img src="/assets/images/icons/vitalgo-heart.svg" className="h-12 w-12 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-vitalgo-dark">Completa tu perfil médico</h1>
    </div>

    {/* Progress bar con colores oficiales */}
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div className="bg-vitalgo-green h-2 rounded-full transition-all duration-300"></div>
    </div>

    {/* Steps indicator con brand colors */}
    <div className="flex justify-center space-x-4 mb-8">
      {/* Indicators con vitalgo-green para activos/completados */}
    </div>
  </div>
</div>
```

### 17.4 Form Sections & Cards (Brand Guidelines)
- **Card Styling**: `bg-white rounded-xl shadow-lg border border-gray-200`
- **Section Headers**: Icons con backgrounds oficiales VitalGo
- **Form Fields**: Focus states con `focus:border-vitalgo-green focus:ring-vitalgo-green/20`
- **Validation States**: Success con `vitalgo-green-lightest`, errors con red estándar
- **Buttons**: Primary con `bg-vitalgo-green hover:bg-vitalgo-green-light`

### 17.5 Dynamic Medical Sections (Brand Compliant)
- **Add Buttons**: `bg-vitalgo-green hover:bg-vitalgo-green-light` consistente
- **Item Cards**: Border y background con variaciones oficiales VitalGo
- **Delete Actions**: Red estándar para destructive actions
- **Empty States**: Iconografía gris con mensajes motivacionales
- **Counters**: Badges con colores oficiales según tipo de información

### 17.6 Wizard Navigation (Brand Design)
```tsx
// NAVEGACIÓN CON BRAND COMPLIANCE
<div className="flex justify-between items-center pt-8 border-t border-gray-200">
  <Button variant="outline" className="border-vitalgo-green text-vitalgo-green hover:bg-vitalgo-green hover:text-white">
    ← Paso anterior
  </Button>

  <div className="flex space-x-4">
    <Button variant="ghost" className="text-vitalgo-dark-light hover:text-vitalgo-dark">
      Saltar por ahora
    </Button>
    <Button className="bg-vitalgo-green hover:bg-vitalgo-green-light text-white px-8 py-3">
      {isLastStep ? 'Completar perfil' : 'Siguiente paso →'}
    </Button>
  </div>
</div>
```

### 17.7 Responsive Design (Manual de Marca)
- **Mobile First**: Diseño principal para 320px-767px
- **Breakpoints**: Oficiales (640px, 768px, 1024px, 1280px)
- **Wizard Adaptations**:
  - Mobile: Stack vertical, progress simplificado, botones full-width
  - Tablet: Centrado max-width-3xl, progress completo
  - Desktop: max-width-4xl, layout horizontal para navegación
- **Touch Targets**: Mínimo 44px en elementos interactivos

### 17.8 Accessibility & UX (Manual de Marca)
- **Wizard Navigation**: ARIA labels para pasos y progreso
- **Screen Readers**: Announcements de progreso y cambios de paso
- **Keyboard Navigation**: Tab order lógico, navegación con flechas
- **Color Contrast**: Ratio 4.5:1 con colores oficiales VitalGo
- **Error Messages**: Claros, específicos, en español
- **Form Labels**: Asociación correcta con campos

### 17.9 Technical Implementation
- **Mandatory Validation**: Campos obligatorios bloquean progreso
- **Optional Sections**: Pasos 4 y 5 pueden saltarse
- **Auto-save**: Guardar progreso por paso completado
- **Authentication**: JWT verificado en cada request
- **Data Persistence**: Formulario mantiene estado entre navegación
- **API Calls**: Endpoints separados por step para flexibilidad

### 17.10 Performance & Quality (Brand Standards)
- **Asset Optimization**: SVG logos oficiales para mejor rendimiento
- **Lazy Loading**: Componentes de pasos no actuales
- **Animations**: Transiciones suaves con duración estándar (200ms)
- **Progressive Enhancement**: Funcionalidad core sin JavaScript
- **Error Handling**: Graceful degradation con mensajes útiles
- **Testing**: Verificar compliance visual con manual de marca

## 18. Consideraciones Futuras

- **Edición de información**: Endpoints para modificar información existente
- **Historial médico**: Versionado de cambios en información médica
- **Exportación**: PDF con información médica para emergencias
- **Compartir con médicos**: Sistema de permisos para acceso médico
- **Recordatorios**: Notificaciones para completar perfil médico
- **Validación médica**: Integración con códigos CIE-10 oficiales
- **Multimedia**: Subir imágenes de estudios médicos

---

**Documento preparado por:** AI Assistant & Jhonatan Rico & Daniela Quintero
**Revisado por:** [Jhonatan Rico]
**Aprobado por:** [Daniela Quintero]