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
- ✅ Teléfono celular

#### Seguridad Social:
- ✅ EPS
- ✅ Ocupación

#### Información Médica Básica:
- ✅ Tipo de sangre
- ✅ Factor RH
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
| **Teléfono Celular** | Phone | Formato +57 XXX XXX XXXX | ✅ |

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
| **Factor RH** | Radio | Positivo, Negativo, Desconocido | ✅ |

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

## 8. Elementos de Interfaz

### 8.1 NavBar
- **Componente**: `AuthenticatedNavbar` del sistema compartido (`/src/shared/components/organisms/AuthenticatedNavbar.tsx`)
- **Configuración**: Muestra logo VitalGo y menú de usuario autenticado
- Logo horizontal azul VitalGo con navegación inteligente al dashboard
- Menú desplegable de usuario con perfil y logout
- Fondo blanco con borde inferior

### 8.2 Formulario
- Diseño centrado y responsive (max-width: 4xl)
- **Secciones expandibles**: Cards separadas por tipo de información
- **Interfaz dinámica**: Botones "Agregar" para nuevas entradas
- **Estado vacío**: Mensajes informativos cuando no hay entradas
- **Eliminación**: Botón X en cada entrada para eliminar

### 8.3 Botones y Acciones
- **"Agregar [Tipo]"**: Agrega nueva entrada de alergia/enfermedad/cirugía
- **"Guardar Información"**: Procesa y guarda toda la información
- **"Completar Después"**: Salta el formulario y va al dashboard
- **Íconos**: Heart (VitalGo), Activity (alergias), Shield (enfermedades), Calendar (cirugías)

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
ALTER TABLE patients ADD COLUMN cell_phone VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN eps VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN eps_other VARCHAR(100);
ALTER TABLE patients ADD COLUMN health_insurance VARCHAR(200);
ALTER TABLE patients ADD COLUMN complementary_plan VARCHAR(100);
ALTER TABLE patients ADD COLUMN complementary_plan_other VARCHAR(100);
ALTER TABLE patients ADD COLUMN occupation VARCHAR(200) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN blood_type VARCHAR(5) NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN rh_factor VARCHAR(10) NOT NULL DEFAULT '';

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

### 10.6 Índices para Performance
```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_patients_profile_completion ON patients(profile_completed, mandatory_fields_completed);
CREATE INDEX idx_patients_eps ON patients(eps);
CREATE INDEX idx_patients_blood_type ON patients(blood_type);
CREATE INDEX idx_emergency_contacts_patient ON patient_emergency_contacts(patient_id);
CREATE INDEX idx_medications_patient_active ON patient_medications(patient_id, is_active);
```

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
  "residence_city": "Medellín",
  "cell_phone": "+573123456789"
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
  "rh_factor": "positivo",
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

- **Navbar Compartido**: Usar `AuthenticatedNavbar` del sistema de componentes compartidos en `/src/shared/components/organisms/AuthenticatedNavbar.tsx`
- **Footer Compartido**: Usar `AuthenticatedFooter` del sistema de componentes compartidos en `/src/shared/components/organisms/AuthenticatedFooter.tsx`
- **Formulario opcional**: Usuario puede completar parcialmente o saltarse
- **Múltiples entradas**: Interfaz dinámica para agregar/eliminar información
- **Validación progresiva**: Solo campos obligatorios bloquean el envío
- **Guardado por secciones**: 3 endpoints separados para flexibilidad
- **Autenticación obligatoria**: Verificar JWT en cada request
- **Responsive design**: Optimizar para móviles (uso común en emergencias)
- **Accesibilidad**: Importante para usuarios con discapacidades
- **Performance**: Lazy loading de componentes para carga rápida

## 18. Consideraciones Futuras

- **Edición de información**: Endpoints para modificar información existente
- **Historial médico**: Versionado de cambios en información médica
- **Exportación**: PDF con información médica para emergencias
- **Compartir con médicos**: Sistema de permisos para acceso médico
- **Recordatorios**: Notificaciones para completar perfil médico
- **Validación médica**: Integración con códigos CIE-10 oficiales
- **Multimedia**: Subir imágenes de estudios médicos

---

**Documento preparado por:** AI Assistant
**Revisado por:** [Pendiente]
**Aprobado por:** [Pendiente]