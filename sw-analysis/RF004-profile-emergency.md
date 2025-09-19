# RF004 - Páginas de Emergencia (/emergency y /emergency/{qr_code})

**Fecha:** 2025-09-18
**Versión:** 2.0 - **ENHANCED**
**Estado:** Pendiente Implementación
**Prioridad:** Crítica

## 1. Descripción General

Sistema de emergencia médica que incluye dos páginas principales: una página para generar y gestionar códigos QR de emergencia (/emergency) y otra para acceder a **información médica integral crítica** mediante escaneo QR (/emergency/{qr_code}). El sistema permite acceso público a **información médica completa y extendida** para cualquier persona que escanee el código QR, incluyendo datos demográficos, seguridad social, medicamentos actuales, y antecedentes ginecológicos.

## 2. Objetivo

Facilitar el acceso rápido a **información médica integral** durante emergencias, permitiendo que cualquier persona (especialmente personal médico de emergencia) pueda acceder inmediatamente a **datos vitales completos del paciente** incluyendo:
- **Información demográfica** (sexo, género, edad, residencia)
- **Información médica básica** (tipo de sangre, factor RH, EPS, contactos de emergencia)
- **Medicamentos actuales** (dosis, frecuencia, prescriptor)
- **Alergias críticas** (severidad, síntomas, tratamientos)
- **Enfermedades** (crónicas, tratamientos actuales, códigos CIE-10)
- **Cirugías** (detalles completos, anestesia, hospitales)
- **Antecedentes ginecológicos** (embarazo, condiciones especiales)

Todo mediante códigos QR, garantizando la disponibilidad de información integral que puede salvar vidas.

## 3. Actores

- **Actor Principal:** Cualquier persona con acceso al código QR (especialmente personal médico)
- **Actor Secundario:** Paciente (propietario del QR)
- **Actor Externo:** Sistema de ambulancias y hospitales

## 4. Precondiciones

### 4.1 Página de Generación QR (/emergency)
- Usuario debe estar autenticado como paciente
- **Usuario debe tener perfil médico COMPLETO (mandatory_fields_completed = true)**
- Usuario debe tener conexión a internet
- **Si perfil incompleto: redirección automática a RF002**

### 4.2 Página de Acceso QR (/emergency/{qr_code})
- Código QR debe ser válido y no expirado
- Sin autenticación requerida para acceso público
- Información básica de emergencia siempre disponible

## 5. Flujo Principal

### 5.1 Generación de Código QR (/emergency)
1. Paciente autenticado navega a /emergency
2. Sistema verifica autenticación y rol de paciente
3. Sistema carga o genera código QR con información del paciente
4. Usuario puede descargar, compartir o regenerar código QR
5. Sistema muestra instrucciones de uso para emergencias

### 5.2 Acceso Público de Emergencia INTEGRAL (/emergency/{qr_code})
1. Cualquier persona escanea código QR o accede por URL
2. Sistema valida código QR (existencia y expiración)
3. **Sistema muestra información médica integral de emergencia:**
   - **Información Personal Básica:** Nombre, edad, sexo biológico, género
   - **Información de Ubicación:** Ciudad y departamento de residencia
   - **Información Médica Crítica:** Tipo de sangre, factor RH
   - **Seguridad Social:** EPS, seguros, plan complementario
   - **Contacto de Emergencia:** Nombre completo, parentesco, teléfonos (principal y alternativo)
   - **Medicamentos Actuales:** Lista completa con dosis, frecuencia, prescriptor
   - **Alergias:** Todas las alergias con severidad, síntomas y tratamientos
   - **Enfermedades:** Historial completo con fechas, códigos CIE-10, tratamientos actuales, estado crónico
   - **Cirugías:** Historial quirúrgico completo con fechas, cirujanos, hospitales, anestesia, duración
   - **Antecedentes Ginecológicos:** Estado de embarazo, historial obstétrico, información menstrual (solo mujeres)
   - **Ocupación:** Profesión actual del paciente
4. Sistema registra acceso anónimo para estadísticas

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
| **Información Médica Crítica** | Tipo de sangre, factor RH, ocupación |
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

## 8. Elementos de Interfaz

### 8.1 NavBar
- **Componente**: `MinimalNavbar` del sistema compartido (`/src/shared/components/organisms/MinimalNavbar.tsx`)
- **Configuración**: Para página `/emergency` usar `backText="Volver al Dashboard"`, `backUrl="/dashboard"`
- **Configuración**: Para páginas públicas QR usar `backText="Volver al Inicio"`, `backUrl="/"`
- Logo horizontal azul VitalGo con navegación inteligente
- Diseño minimalista apropiado para situaciones de emergencia

### 8.2 Página de Generación QR (/emergency)
- **Header**: Título con icono de QR y descripción
- **Card Principal**: Visualización del código QR con información
- **Botones de Acción**: Descargar, compartir, ver página, regenerar
- **Instrucciones**: Guía paso a paso para uso en emergencias
- **Gradient Background**: Fondo verde claro que transmite seguridad

### 8.3 Página de Acceso QR - Vista Pública
- **Header de Emergencia**: Fondo rojo con texto "EMERGENCIA MÉDICA"
- **Card de Información Crítica**: Datos básicos del paciente
- **Alergias Críticas**: Destacadas en rojo con iconos de alerta
- **Sección de Acceso**: Botón para autenticación de paramédico
- **Gradient Background**: Fondo rojo claro para urgencia

### 8.4 Página de Acceso QR - Vista Completa
- **Header de Éxito**: Fondo verde con "ACCESO AUTORIZADO"
- **Layout en Grid**: Información personal + historial médico
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

### 10.2 Tabla Emergency_Access_Logs
```sql
CREATE TABLE emergency_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID REFERENCES qr_codes(id),
    accessed_by_user_id UUID REFERENCES users(id),
    access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('PUBLIC', 'AUTHENTICATED')),
    user_role VARCHAR(20),
    ip_address INET NOT NULL,
    user_agent TEXT,
    access_granted BOOLEAN DEFAULT TRUE,
    access_reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

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

## 11. API Endpoints

### 11.1 Generar Código QR
**Endpoint:** `POST /api/v1/qr/generate`

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
**Endpoint:** `GET /api/v1/qr/emergency/{qr_token}`

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
            "rh_factor": "string",
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
**Endpoint:** `GET /api/v1/qr/emergency/{qr_token}/validate`

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
**Endpoint:** `GET /api/v1/qr/verify-ownership/{qr_token}`

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
**Endpoint:** `DELETE /api/v1/qr/{qr_token}`

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

- **Navbar Compartido**: Usar `MinimalNavbar` del sistema de componentes compartidos en `/src/shared/components/organisms/MinimalNavbar.tsx`
- **Footer Compartido**: Usar `MinimalFooter` del sistema de componentes compartidos en `/src/shared/components/organisms/MinimalFooter.tsx`
- **Acceso Dual**: Misma página sirve contenido público y autenticado
- **Performance Crítico**: Carga rápida esencial para emergencias
- **Mobile First**: Optimización para dispositivos móviles (uso común en ambulancias)
- **Offline Capability**: Caché de información crítica para áreas sin conexión
- **Accesibilidad**: Alto contraste y navegación clara para situaciones de estrés
- **Internacionalización**: Preparado para múltiples idiomas
- **Escalabilidad**: Diseñado para alto volumen de accesos simultáneos

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

---

**Documento preparado por:** AI Assistant
**Revisado por:** [Pendiente]
**Aprobado por:** [Pendiente]