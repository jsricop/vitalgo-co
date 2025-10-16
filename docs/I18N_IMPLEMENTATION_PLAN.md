# VitalGo English Internationalization Implementation Plan

**Document Version:** 1.0
**Created:** October 2025
**Status:** Ready for Implementation
**Estimated Duration:** 12-16 days

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Decision](#architecture-decision)
3. [Phase 1: Database & Backend](#phase-1-database--backend)
4. [Phase 2: Frontend Infrastructure](#phase-2-frontend-infrastructure)
5. [Phase 3: Navbar Integration](#phase-3-navbar-integration)
6. [Phase 4: Update Layout & Routes](#phase-4-update-layout--routes)
7. [Phase 5: Translate All Slices](#phase-5-translate-all-slices)
8. [Phase 6: Update Documentation](#phase-6-update-documentation)
9. [Phase 7: Testing & Validation](#phase-7-testing--validation)
10. [Phase 8: Deployment & Rollout](#phase-8-deployment--rollout)
11. [Implementation Checklist](#implementation-checklist)

---

## Overview

Implement full bilingual support (Spanish/English) for VitalGo with language switching in navbar for both authenticated and unauthenticated users.

### Goals
- ✅ Add language selector to PublicNavbar and PatientNavbar
- ✅ Store user language preference in database
- ✅ Support Spanish (default) and English
- ✅ Follow unified authentication pattern (UNIFIED_AUTH_MIGRATION.md)
- ✅ Maintain backward compatibility
- ✅ Enable easy addition of future languages

### Key Principles
- **Default Spanish:** No breaking changes for existing users
- **Unified Auth Pattern:** Language changes use apiClient
- **Server-Side Support:** Next.js App Router with SSR
- **Type Safety:** Full TypeScript support
- **Zero Breaking Changes:** Gradual rollout possible

---

## Architecture Decision

### Selected Solution: next-intl v3.x

**Rationale:**
1. **Native Next.js 15 Support:** Built for App Router
2. **TypeScript-First:** Full type safety for translations
3. **Server Components:** SSR and RSC compatible
4. **Minimal Configuration:** Follows Next.js conventions
5. **Active Maintenance:** Regular updates and community support

**Alternatives Considered:**
- ❌ react-i18next: Primarily client-side, complex with App Router
- ❌ Custom solution: Reinventing the wheel, maintenance burden
- ❌ next-translate: Less active, limited App Router support

---

## Phase 1: Database & Backend

**Duration:** 1-2 days
**Owner:** Backend Team

### 1.1 Database Migration

**File:** `backend/alembic/versions/YYYYMMDD_HHMMSS_add_user_language_preference.py`

```python
"""Add user language preference

Revision ID: abc123def456
Revises: previous_revision_id
Create Date: 2025-10-XX XX:XX:XX.XXXXXX

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'abc123def456'
down_revision = 'previous_revision_id'
branch_labels = None
depends_on = None

def upgrade():
    """Add preferred_language column to users table"""
    op.add_column('users',
        sa.Column('preferred_language',
                  sa.String(5),
                  nullable=False,
                  server_default='es',
                  comment='User preferred language (es=Spanish, en=English)')
    )

    # Add index for performance
    op.create_index('idx_users_preferred_language',
                    'users',
                    ['preferred_language'],
                    unique=False)

def downgrade():
    """Remove preferred_language column"""
    op.drop_index('idx_users_preferred_language', table_name='users')
    op.drop_column('users', 'preferred_language')
```

**Migration Details:**
- **Column:** `preferred_language` VARCHAR(5)
- **Default:** 'es' (Spanish)
- **Nullable:** NOT NULL (has default)
- **Values:** 'es' | 'en' (extensible for future languages)
- **Index:** Performance optimization for queries

**Testing:**
```bash
# Apply migration
cd backend
poetry run alembic upgrade head

# Verify
poetry run alembic current
docker exec -it vitalgo-postgres-1 psql -U vitalgo_user -d vitalgo_dev -c "\d users"
```

### 1.2 Backend Models Update

**File:** `backend/slices/signup/domain/models/user_model.py`

```python
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from shared.database.database import Base

class User(Base):
    """User model with language preference support"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(String(50), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    # Language preference - NEW FIELD
    preferred_language = Column(String(5), default='es', nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # ... rest of fields

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', language='{self.preferred_language}')>"
```

### 1.3 Backend DTOs Update

**File:** `backend/slices/auth/application/dto/user_dto.py`

```python
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from enum import Enum

class SupportedLanguage(str, Enum):
    """Supported languages enumeration"""
    SPANISH = 'es'
    ENGLISH = 'en'

class UserResponseDto(BaseModel):
    """DTO for user information in responses"""
    id: str = Field(..., description="User's unique identifier")
    email: str = Field(..., description="User's email address")
    first_name: Optional[str] = Field(None, description="User's first name")
    last_name: Optional[str] = Field(None, description="User's last name")
    user_type: str = Field(..., description="Type of user account")
    is_verified: bool = Field(..., description="Whether the user's email is verified")
    profile_completed: bool = Field(..., description="Whether the user has completed their basic profile")
    mandatory_fields_completed: bool = Field(..., description="Whether the user has completed all mandatory fields")
    preferred_language: str = Field(default='es', description="User's preferred language (es|en)")

    @field_validator('preferred_language')
    @classmethod
    def validate_language(cls, v: str) -> str:
        """Validate language code"""
        if v not in ['es', 'en']:
            return 'es'  # Default to Spanish if invalid
        return v

    class Config:
        from_attributes = True

class LanguagePreferenceDto(BaseModel):
    """DTO for updating user language preference"""
    preferred_language: SupportedLanguage = Field(..., description="Preferred language code")

class LanguageUpdateResponseDto(BaseModel):
    """Response DTO for language preference update"""
    success: bool = Field(default=True)
    message: str = Field(..., description="Success message")
    preferred_language: str = Field(..., description="Updated language preference")
```

### 1.4 Backend API Endpoint

**File:** `backend/slices/profile/infrastructure/api/profile_endpoints.py`

Add new endpoint to existing router:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from shared.database.database import get_db
from slices.auth.infrastructure.api.auth_endpoints import get_current_user
from slices.auth.application.dto.user_dto import LanguagePreferenceDto, LanguageUpdateResponseDto
from slices.signup.domain.models.user_model import User

router = APIRouter(prefix="/api/profile", tags=["Profile"])

# ... existing endpoints ...

@router.put("/language", response_model=LanguageUpdateResponseDto)
async def update_language_preference(
    language_data: LanguagePreferenceDto,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user's language preference

    **Authentication Required**

    Updates the authenticated user's preferred language setting.
    Supported languages: 'es' (Spanish), 'en' (English)

    Returns:
        LanguageUpdateResponseDto: Success confirmation with updated language
    """
    try:
        # Validate language value
        if language_data.preferred_language not in ['es', 'en']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid language code. Supported values: 'es', 'en'"
            )

        # Update user's language preference
        current_user.preferred_language = language_data.preferred_language
        db.commit()
        db.refresh(current_user)

        return LanguageUpdateResponseDto(
            success=True,
            message=f"Language preference updated to '{language_data.preferred_language}'",
            preferred_language=current_user.preferred_language
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update language preference: {str(e)}"
        )
```

**API Testing:**
```bash
# Test language update endpoint
curl -X PUT http://localhost:8000/api/profile/language \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preferred_language": "en"}'
```

---

## Phase 2: Frontend Infrastructure

**Duration:** 2-3 days
**Owner:** Frontend Team

### 2.1 Install Dependencies

```bash
cd frontend
npm install next-intl@latest
npm install --save-dev @types/node
```

**package.json updates:**
```json
{
  "dependencies": {
    "next-intl": "^3.22.0",
    // ... existing dependencies
  }
}
```

### 2.2 Create Directory Structure

```bash
# Create translation files directory
mkdir -p frontend/messages

# Create i18n configuration directory
mkdir -p frontend/src/i18n
```

**Resulting structure:**
```
frontend/
├── messages/
│   ├── es.json          # Spanish translations (default)
│   └── en.json          # English translations
├── src/
│   ├── i18n/
│   │   ├── request.ts   # Server-side i18n configuration
│   │   ├── routing.ts   # Routing configuration
│   │   └── locale.ts    # Locale detection utilities
│   └── middleware.ts    # Next.js middleware for language routing
```

### 2.3 Translation Files

**File:** `frontend/messages/es.json`

```json
{
  "common": {
    "loading": "Cargando...",
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "back": "Regresar",
    "search": "Buscar",
    "filter": "Filtrar",
    "export": "Exportar",
    "import": "Importar",
    "close": "Cerrar",
    "confirm": "Confirmar",
    "yes": "Sí",
    "no": "No",
    "error": "Error",
    "success": "Éxito",
    "warning": "Advertencia",
    "info": "Información"
  },
  "nav": {
    "myProfile": "Mi Perfil",
    "dashboard": "Panel de Control",
    "myQR": "Mi QR",
    "medications": "Medicamentos",
    "allergies": "Alergias",
    "surgeries": "Cirugías",
    "illnesses": "Enfermedades",
    "home": "Inicio",
    "about": "Acerca de",
    "contact": "Contacto",
    "help": "Ayuda",
    "faq": "Preguntas Frecuentes"
  },
  "auth": {
    "login": "Iniciar Sesión",
    "logout": "Cerrar Sesión",
    "signup": "Registrarse",
    "email": "Correo Electrónico",
    "password": "Contraseña",
    "confirmPassword": "Confirmar Contraseña",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "rememberMe": "Recordarme",
    "loginButton": "Ingresar",
    "signupButton": "Crear Cuenta",
    "alreadyHaveAccount": "¿Ya tienes cuenta?",
    "dontHaveAccount": "¿No tienes cuenta?"
  },
  "dashboard": {
    "welcome": "Bienvenido",
    "overview": "Resumen",
    "statistics": "Estadísticas",
    "recentActivity": "Actividad Reciente",
    "quickActions": "Acciones Rápidas",
    "activeMedications": "Medicamentos Activos",
    "activeAllergies": "Alergias Activas",
    "surgicalHistory": "Historial Quirúrgico",
    "activeIllnesses": "Enfermedades Activas"
  },
  "profile": {
    "basicInfo": "Información Básica",
    "personalInfo": "Información Personal",
    "medicalInfo": "Información Médica",
    "gynecologicalInfo": "Información Ginecológica",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "documentType": "Tipo de Documento",
    "documentNumber": "Número de Documento",
    "birthDate": "Fecha de Nacimiento",
    "phone": "Teléfono",
    "email": "Correo Electrónico",
    "address": "Dirección",
    "city": "Ciudad",
    "country": "País"
  },
  "medications": {
    "title": "Medicamentos",
    "addMedication": "Agregar Medicamento",
    "editMedication": "Editar Medicamento",
    "deleteMedication": "Eliminar Medicamento",
    "medicationName": "Nombre del Medicamento",
    "dosage": "Dosis",
    "frequency": "Frecuencia",
    "startDate": "Fecha de Inicio",
    "endDate": "Fecha de Fin",
    "prescribedBy": "Prescrito por",
    "notes": "Notas",
    "active": "Activo",
    "inactive": "Inactivo",
    "noMedications": "No hay medicamentos registrados"
  },
  "allergies": {
    "title": "Alergias",
    "addAllergy": "Agregar Alergia",
    "editAllergy": "Editar Alergia",
    "deleteAllergy": "Eliminar Alergia",
    "allergen": "Alérgeno",
    "severityLevel": "Nivel de Severidad",
    "reactionDescription": "Descripción de la Reacción",
    "diagnosisDate": "Fecha de Diagnóstico",
    "notes": "Notas",
    "mild": "Leve",
    "moderate": "Moderada",
    "severe": "Severa",
    "critical": "Crítica",
    "noAllergies": "No hay alergias registradas"
  },
  "surgeries": {
    "title": "Cirugías",
    "addSurgery": "Agregar Cirugía",
    "editSurgery": "Editar Cirugía",
    "deleteSurgery": "Eliminar Cirugía",
    "procedureName": "Nombre del Procedimiento",
    "surgeryDate": "Fecha de Cirugía",
    "hospitalName": "Nombre del Hospital",
    "surgeonName": "Nombre del Cirujano",
    "anesthesiaType": "Tipo de Anestesia",
    "durationHours": "Duración (horas)",
    "notes": "Notas",
    "complications": "Complicaciones",
    "noSurgeries": "No hay cirugías registradas"
  },
  "illnesses": {
    "title": "Enfermedades",
    "addIllness": "Agregar Enfermedad",
    "editIllness": "Editar Enfermedad",
    "deleteIllness": "Eliminar Enfermedad",
    "illnessName": "Nombre de la Enfermedad",
    "diagnosisDate": "Fecha de Diagnóstico",
    "status": "Estado",
    "isChronic": "¿Es Crónica?",
    "treatmentDescription": "Descripción del Tratamiento",
    "cie10Code": "Código CIE-10",
    "diagnosedBy": "Diagnosticado por",
    "notes": "Notas",
    "active": "Activa",
    "inTreatment": "En Tratamiento",
    "cured": "Curada",
    "chronic": "Crónica",
    "noIllnesses": "No hay enfermedades registradas"
  },
  "qr": {
    "title": "Mi Código QR",
    "description": "Código QR para acceso de emergencia",
    "downloadQR": "Descargar QR",
    "printQR": "Imprimir QR",
    "instructions": "Instrucciones de Uso",
    "emergencyAccess": "Acceso de Emergencia"
  },
  "errors": {
    "required": "Este campo es requerido",
    "invalidEmail": "Correo electrónico inválido",
    "passwordMismatch": "Las contraseñas no coinciden",
    "minLength": "Mínimo {min} caracteres",
    "maxLength": "Máximo {max} caracteres",
    "invalidDate": "Fecha inválida",
    "networkError": "Error de conexión",
    "serverError": "Error del servidor",
    "unauthorized": "No autorizado",
    "notFound": "No encontrado"
  },
  "metadata": {
    "title": "VitalGo - Tu Salud Unificada, La Medicina Simplificada",
    "description": "Plataforma líder en salud digital de Colombia. Unifica tu historial médico, reduce tiempos de urgencias 70% con IA, y optimiza la gestión clínica."
  }
}
```

**File:** `frontend/messages/en.json`

```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "import": "Import",
    "close": "Close",
    "confirm": "Confirm",
    "yes": "Yes",
    "no": "No",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information"
  },
  "nav": {
    "myProfile": "My Profile",
    "dashboard": "Dashboard",
    "myQR": "My QR",
    "medications": "Medications",
    "allergies": "Allergies",
    "surgeries": "Surgeries",
    "illnesses": "Illnesses",
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "help": "Help",
    "faq": "Frequently Asked Questions"
  },
  "auth": {
    "login": "Sign In",
    "logout": "Sign Out",
    "signup": "Sign Up",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "forgotPassword": "Forgot your password?",
    "rememberMe": "Remember me",
    "loginButton": "Sign In",
    "signupButton": "Create Account",
    "alreadyHaveAccount": "Already have an account?",
    "dontHaveAccount": "Don't have an account?"
  },
  "dashboard": {
    "welcome": "Welcome",
    "overview": "Overview",
    "statistics": "Statistics",
    "recentActivity": "Recent Activity",
    "quickActions": "Quick Actions",
    "activeMedications": "Active Medications",
    "activeAllergies": "Active Allergies",
    "surgicalHistory": "Surgical History",
    "activeIllnesses": "Active Illnesses"
  },
  "profile": {
    "basicInfo": "Basic Information",
    "personalInfo": "Personal Information",
    "medicalInfo": "Medical Information",
    "gynecologicalInfo": "Gynecological Information",
    "firstName": "First Name",
    "lastName": "Last Name",
    "documentType": "Document Type",
    "documentNumber": "Document Number",
    "birthDate": "Birth Date",
    "phone": "Phone",
    "email": "Email",
    "address": "Address",
    "city": "City",
    "country": "Country"
  },
  "medications": {
    "title": "Medications",
    "addMedication": "Add Medication",
    "editMedication": "Edit Medication",
    "deleteMedication": "Delete Medication",
    "medicationName": "Medication Name",
    "dosage": "Dosage",
    "frequency": "Frequency",
    "startDate": "Start Date",
    "endDate": "End Date",
    "prescribedBy": "Prescribed By",
    "notes": "Notes",
    "active": "Active",
    "inactive": "Inactive",
    "noMedications": "No medications registered"
  },
  "allergies": {
    "title": "Allergies",
    "addAllergy": "Add Allergy",
    "editAllergy": "Edit Allergy",
    "deleteAllergy": "Delete Allergy",
    "allergen": "Allergen",
    "severityLevel": "Severity Level",
    "reactionDescription": "Reaction Description",
    "diagnosisDate": "Diagnosis Date",
    "notes": "Notes",
    "mild": "Mild",
    "moderate": "Moderate",
    "severe": "Severe",
    "critical": "Critical",
    "noAllergies": "No allergies registered"
  },
  "surgeries": {
    "title": "Surgeries",
    "addSurgery": "Add Surgery",
    "editSurgery": "Edit Surgery",
    "deleteSurgery": "Delete Surgery",
    "procedureName": "Procedure Name",
    "surgeryDate": "Surgery Date",
    "hospitalName": "Hospital Name",
    "surgeonName": "Surgeon Name",
    "anesthesiaType": "Anesthesia Type",
    "durationHours": "Duration (hours)",
    "notes": "Notes",
    "complications": "Complications",
    "noSurgeries": "No surgeries registered"
  },
  "illnesses": {
    "title": "Illnesses",
    "addIllness": "Add Illness",
    "editIllness": "Edit Illness",
    "deleteIllness": "Delete Illness",
    "illnessName": "Illness Name",
    "diagnosisDate": "Diagnosis Date",
    "status": "Status",
    "isChronic": "Is Chronic?",
    "treatmentDescription": "Treatment Description",
    "cie10Code": "ICD-10 Code",
    "diagnosedBy": "Diagnosed By",
    "notes": "Notes",
    "active": "Active",
    "inTreatment": "In Treatment",
    "cured": "Cured",
    "chronic": "Chronic",
    "noIllnesses": "No illnesses registered"
  },
  "qr": {
    "title": "My QR Code",
    "description": "QR code for emergency access",
    "downloadQR": "Download QR",
    "printQR": "Print QR",
    "instructions": "Usage Instructions",
    "emergencyAccess": "Emergency Access"
  },
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Invalid email",
    "passwordMismatch": "Passwords do not match",
    "minLength": "Minimum {min} characters",
    "maxLength": "Maximum {max} characters",
    "invalidDate": "Invalid date",
    "networkError": "Connection error",
    "serverError": "Server error",
    "unauthorized": "Unauthorized",
    "notFound": "Not found"
  },
  "metadata": {
    "title": "VitalGo - Your Unified Health, Medicine Simplified",
    "description": "Leading digital health platform in Colombia. Unifies your medical history, reduces emergency times by 70% with AI, and optimizes clinical management."
  }
}
```

### 2.4 i18n Configuration Files

**File:** `frontend/src/i18n/locale.ts`

```typescript
'use server';

import { cookies } from 'next/headers';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export type Locale = 'es' | 'en';

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return (cookieStore.get(LOCALE_COOKIE)?.value as Locale) || 'es';
}

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale);
}
```

**File:** `frontend/src/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from './locale';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

**File:** `frontend/src/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // All supported locales
  locales: ['es', 'en'],

  // Default locale (Spanish)
  defaultLocale: 'es',

  // Use 'as-needed' strategy:
  // - Spanish URLs: /profile (no prefix)
  // - English URLs: /en/profile (with prefix)
  localePrefix: 'as-needed'
});

// Export navigation utilities with i18n support
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

**File:** `frontend/src/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/', '/(es|en)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)']
};
```

### 2.5 Language Context & Storage

**File:** `frontend/src/shared/contexts/LanguageContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useTransition, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '../services/apiClient';
import { setUserLocale } from '@/i18n/locale';

export type Locale = 'es' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale: Locale;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    try {
      // 1. Update backend preference (for authenticated users)
      try {
        await apiClient.put('/profile/language', {
          preferred_language: newLocale
        });
        console.log('✅ Backend language preference updated:', newLocale);
      } catch (error) {
        // User might not be authenticated, continue with client-side update
        console.log('ℹ️ Not authenticated, using client-side locale only');
      }

      // 2. Update server-side cookie
      await setUserLocale(newLocale);

      // 3. Update local state
      setLocaleState(newLocale);

      // 4. Refresh the page with new locale
      startTransition(() => {
        // Construct new path with locale prefix
        const newPath = newLocale === 'es'
          ? pathname.replace(/^\/en/, '') || '/'  // Remove /en prefix for Spanish
          : `/en${pathname}`;  // Add /en prefix for English

        router.replace(newPath);
        router.refresh();
      });
    } catch (error) {
      console.error('❌ Failed to change language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{
      locale,
      setLocale,
      isChanging: isPending
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
```

### 2.6 Language Selector Component

**File:** `frontend/src/shared/components/atoms/LanguageSelector.tsx`

```typescript
'use client';

import { useLanguage } from '../../contexts/LanguageContext';

export function LanguageSelector() {
  const { locale, setLocale, isChanging } = useLanguage();

  const handleLanguageChange = (newLocale: 'es' | 'en') => {
    if (isChanging) return;
    setLocale(newLocale);
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => handleLanguageChange('es')}
        disabled={isChanging}
        aria-label="Cambiar a Español"
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          locale === 'es'
            ? 'bg-vitalgo-green text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        } ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        ES
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isChanging}
        aria-label="Switch to English"
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          locale === 'en'
            ? 'bg-vitalgo-green text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        } ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        EN
      </button>
    </div>
  );
}
```

---

## Phase 3: Navbar Integration

**Duration:** 1 day
**Owner:** Frontend Team

### 3.1 Update PublicNavbar

**File:** `frontend/src/shared/components/organisms/PublicNavbar.tsx`

```typescript
"use client"

import { useTranslations } from 'next-intl';
import { BrandHeader } from "../molecules/BrandHeader"
import { LanguageSelector } from "../atoms/LanguageSelector"

interface PublicNavbarProps {
  showBackButton?: boolean
  backUrl?: string
  backText?: string
  className?: string
  onBackClick?: () => void
  useHistoryBack?: boolean
}

export function PublicNavbar({
  showBackButton = false,
  backUrl = "/",
  backText,  // Will use translation if not provided
  className = "",
  onBackClick,
  useHistoryBack = false
}: PublicNavbarProps) {
  const t = useTranslations('common');

  // Use provided backText or fall back to translation
  const effectiveBackText = backText || t('back');

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <BrandHeader
            isAuthenticated={false}
            showBackButton={showBackButton}
            backUrl={backUrl}
            backText={effectiveBackText}
            onBackClick={onBackClick}
            useHistoryBack={useHistoryBack}
          />

          {/* Language Selector - Right Side */}
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### 3.2 Update PatientNavbar

**File:** `frontend/src/shared/components/organisms/PatientNavbar.tsx`

```typescript
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl'
import Link from "next/link"
import { BrandHeader } from "../molecules/BrandHeader"
import { UserMenu } from "../molecules/UserMenu"
import { MobileMenuToggle } from "../molecules/MobileMenuToggle"
import { LanguageSelector } from "../atoms/LanguageSelector"
import { useAuthUser } from "../../hooks/useAuthUser"

interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface PatientNavbarProps {
  className?: string
  'data-testid'?: string
}

export function PatientNavbar({
  className = "",
  'data-testid': testId
}: PatientNavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoading, logout } = useAuthUser()
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')

  // Navigation items with translations
  const navigationItems: NavigationItem[] = [
    {
      label: t('myProfile'),
      href: "/profile"
    },
    {
      label: t('dashboard'),
      href: "/dashboard"
    },
    {
      label: t('myQR'),
      href: "/qr"
    }
  ]

  const isActiveRoute = (href: string) => {
    if (href === "/profile") {
      return pathname === "/profile"
    }
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    if (href === "/qr") {
      return pathname === "/qr"
    }
    return pathname?.startsWith(href)
  }

  // Show loading state while user data is being loaded
  if (isLoading) {
    return (
      <nav className={`bg-white border-b border-gray-200 ${className}`} data-testid={testId}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BrandHeader isAuthenticated={true} />
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vitalgo-green"></div>
              <span className="text-sm text-gray-600">{tCommon('loading')}</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // If no user data, show minimal navbar (AuthGuard should handle redirects)
  if (!user) {
    return (
      <nav className={`bg-white border-b border-gray-200 ${className}`} data-testid={testId}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BrandHeader isAuthenticated={true} />
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{tCommon('loading')}...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`} data-testid={testId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Brand Header */}
          <div className="flex-shrink-0">
            <BrandHeader isAuthenticated={true} />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="flex-1 ml-8 md:ml-12 lg:ml-16">
            <div className="hidden md:flex space-x-8 justify-center">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md font-medium transition-colors ${
                      isActive
                        ? "text-vitalgo-green bg-vitalgo-green/10"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                    data-testid={`patient-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop User Menu + Language Selector */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <LanguageSelector />
            <UserMenu
              user={user}
              onLogout={logout}
              data-testid="patient-user-menu"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4" data-testid="mobile-menu">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Mobile Language Selector */}
            <div className="px-4 py-2">
              <LanguageSelector />
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-2 mt-2">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md font-medium transition-colors block w-full text-left ${
                        isActive
                          ? "text-vitalgo-green bg-vitalgo-green/10"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      data-testid={`mobile-patient-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile User Menu */}
            <div className="px-4 mt-4">
              <UserMenu
                user={user}
                onLogout={logout}
                data-testid="mobile-patient-user-menu"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
```

---

## Phase 4: Update Layout & Routes

**Duration:** 1 day
**Owner:** Frontend Team

### 4.1 Update Root Layout

**File:** `frontend/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import '../styles/globals.css'
import { AuthProvider } from '../shared/contexts/AuthContext'
import { LanguageProvider } from '../shared/contexts/LanguageContext'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL('https://vitalgo.co'),
    title: t('title'),
    description: t('description'),
    keywords: [
      'VitalGo',
      locale === 'es' ? 'salud digital Colombia' : 'digital health Colombia',
      locale === 'es' ? 'historial médico unificado' : 'unified medical records',
      locale === 'es' ? 'urgencias inteligentes' : 'smart emergencies',
      locale === 'es' ? 'IA médica' : 'medical AI',
      'QR emergency',
      locale === 'es' ? 'expediente médico digital' : 'digital medical records',
      locale === 'es' ? 'telemedicina Colombia' : 'telemedicine Colombia',
      locale === 'es' ? 'gestión hospitalaria' : 'hospital management'
    ],
    authors: [{ name: 'VitalGo' }],
    creator: 'VitalGo',
    publisher: 'VitalGo',
    category: 'Healthcare Technology',
    classification: 'Medical Records Management',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_CO' : 'en_US',
      url: 'https://vitalgo.co',
      title: t('title'),
      description: t('description'),
      siteName: 'VitalGo',
      images: [
        {
          url: '/assets/images/logos/vitalgo-logo-official.png',
          width: 1200,
          height: 630,
          alt: 'VitalGo - ' + (locale === 'es' ? 'Plataforma de Salud Digital' : 'Digital Health Platform'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/assets/images/logos/vitalgo-logo-official.png'],
      creator: '@VitalGoColombia',
    },
    verification: {
      google: 'verification-code-here',
      yandex: 'verification-code-here',
      yahoo: 'verification-code-here',
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.ico' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/site.webmanifest',
  };
}

export function generateViewport() {
  return {
    themeColor: '#01EF7F',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <LanguageProvider initialLocale={locale as 'es' | 'en'}>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### 4.2 Update next.config.js

**File:** `frontend/next.config.js`

```javascript
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['vitalgo-profile-photos.s3.amazonaws.com', 'localhost'],
  },
  // Enable i18n routing
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'vitalgo.co']
    }
  }
};

module.exports = withNextIntl(nextConfig);
```

---

## Phase 5: Translate All Slices

**Duration:** 3-5 days
**Owner:** Frontend Team

### Translation Priority & Estimated Time

| Priority | Slice | Files | Estimated Time |
|----------|-------|-------|----------------|
| 1 | Auth | ~10 files | 4 hours |
| 2 | Dashboard | ~15 files | 6 hours |
| 3 | Profile | ~20 files | 8 hours |
| 4 | Medications | ~13 files | 6 hours |
| 5 | Allergies | ~10 files | 4 hours |
| 6 | Surgeries | ~10 files | 4 hours |
| 7 | Illnesses | ~13 files | 6 hours |
| 8 | QR | ~8 files | 3 hours |
| 9 | Emergency Access | ~10 files | 4 hours |
| 10 | Home/Legal | ~15 files | 6 hours |

**Total:** ~51 hours (6-7 working days with testing)

### Translation Pattern

**Before (Hardcoded Spanish):**
```typescript
// Component without translation
export function MedicationCard({ medication }: Props) {
  return (
    <div>
      <h3>Medicamento: {medication.name}</h3>
      <button>Editar</button>
      <button>Eliminar</button>
    </div>
  );
}
```

**After (With Translations):**
```typescript
// Component with translation
'use client';
import { useTranslations } from 'next-intl';

export function MedicationCard({ medication }: Props) {
  const t = useTranslations('medications');
  const tCommon = useTranslations('common');

  return (
    <div>
      <h3>{t('title')}: {medication.name}</h3>
      <button>{tCommon('edit')}</button>
      <button>{tCommon('delete')}</button>
    </div>
  );
}
```

### Slice-by-Slice Translation Guide

#### 5.1 Auth Slice

**Files to translate:**
- `frontend/src/slices/auth/components/molecules/LoginForm.tsx`
- `frontend/src/slices/auth/pages/LoginPage.tsx`
- `frontend/src/slices/signup/components/molecules/PatientRegistrationForm.tsx`
- `frontend/src/slices/signup/pages/PatientSignupPage.tsx`

**Translation keys added to `es.json` and `en.json`:**
```json
{
  "auth": {
    "loginTitle": "Iniciar Sesión" / "Sign In",
    "signupTitle": "Crear Cuenta" / "Create Account",
    "emailPlaceholder": "ejemplo@correo.com" / "example@email.com",
    "passwordPlaceholder": "Ingresa tu contraseña" / "Enter your password",
    "loginSuccess": "Sesión iniciada exitosamente" / "Login successful",
    "loginError": "Credenciales inválidas" / "Invalid credentials"
  }
}
```

#### 5.2 Dashboard Slice

**Files to translate:**
- `frontend/src/slices/dashboard/components/molecules/StatsCard.tsx`
- `frontend/src/slices/dashboard/components/organisms/DashboardOverview.tsx`
- `frontend/src/slices/dashboard/pages/DashboardPage.tsx`

**Translation keys:**
```json
{
  "dashboard": {
    "welcomeMessage": "Bienvenido, {name}" / "Welcome, {name}",
    "overview": "Resumen General" / "Overview",
    "statistics": "Estadísticas" / "Statistics",
    "recentActivity": "Actividad Reciente" / "Recent Activity"
  }
}
```

#### 5.3 Profile Slice

**Files to translate:**
- `frontend/src/slices/profile/components/organisms/BasicInformationTab.tsx`
- `frontend/src/slices/profile/components/organisms/PersonalInformationTab.tsx`
- `frontend/src/slices/profile/components/organisms/GynecologicalInformationTab.tsx`
- `frontend/src/slices/profile/components/molecules/BasicInfoEditModal.tsx`

**Special Considerations:**
- Date formatting with locale: `date.toLocaleDateString(locale === 'es' ? 'es-CO' : 'en-US')`
- Form validation messages
- Colombian geography data (keep in Spanish, add English labels)

#### 5.4 Medical Data Slices (Medications, Allergies, Surgeries, Illnesses)

**Pattern for all medical slices:**
```typescript
// Example: MedicationCard.tsx
'use client';
import { useTranslations } from 'next-intl';

export function MedicationCard({ medication, onEdit, onDelete }: Props) {
  const t = useTranslations('medications');
  const tCommon = useTranslations('common');

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">
            {medication.medicationName}
          </h3>
          <p className="text-sm text-gray-600">
            {t('dosage')}: {medication.dosage}
          </p>
          <p className="text-sm text-gray-600">
            {t('frequency')}: {medication.frequency}
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(medication)} className="text-blue-600">
            {tCommon('edit')}
          </button>
          <button onClick={() => onDelete(medication.id)} className="text-red-600">
            {tCommon('delete')}
          </button>
        </div>
      </div>
      {medication.notes && (
        <p className="mt-2 text-sm text-gray-500">
          {t('notes')}: {medication.notes}
        </p>
      )}
    </div>
  );
}
```

#### 5.5 QR Slice

**Files to translate:**
- `frontend/src/slices/qr/components/organisms/QRCodeDisplay.tsx`
- `frontend/src/slices/qr/pages/QRPage.tsx`

**Translation keys:**
```json
{
  "qr": {
    "downloadButton": "Descargar QR" / "Download QR",
    "printButton": "Imprimir" / "Print",
    "shareButton": "Compartir" / "Share",
    "instructions": "Instrucciones de uso" / "Usage instructions"
  }
}
```

#### 5.6 Emergency Access Slice

**Files to translate:**
- `frontend/src/slices/emergency_access/components/organisms/EmergencyDataDisplay.tsx`
- `frontend/src/slices/emergency_access/pages/EmergencyAccessPage.tsx`

**Translation keys:**
```json
{
  "emergency": {
    "patientInfo": "Información del Paciente" / "Patient Information",
    "medicalHistory": "Historial Médico" / "Medical History",
    "criticalAllergies": "Alergias Críticas" / "Critical Allergies",
    "activeMedications": "Medicamentos Activos" / "Active Medications"
  }
}
```

### 5.7 Validation Messages

Update form validation to use translations:

```typescript
// Before
const errors = {
  required: "Este campo es requerido",
  minLength: "Mínimo 8 caracteres"
};

// After
'use client';
import { useTranslations } from 'next-intl';

function MyForm() {
  const t = useTranslations('errors');

  const errors = {
    required: t('required'),
    minLength: t('minLength', { min: 8 })
  };
}
```

---

## Phase 6: Update Documentation

**Duration:** 1 day
**Owner:** Documentation Team

### 6.1 Update TYPES.md

**File:** `docs/TYPES.md`

Add new types section:

```markdown
## Internationalization Types

### Backend Types (Python)

#### User Language Preference
\`\`\`python
# In user_model.py
class User(Base):
    preferred_language: str = Column(String(5), default='es', nullable=False)

# In user_dto.py
class UserResponseDto(BaseModel):
    preferred_language: str = Field(default='es')

class LanguagePreferenceDto(BaseModel):
    preferred_language: Literal['es', 'en']
\`\`\`

### Frontend Types (TypeScript)

#### Language Context Types
\`\`\`typescript
type Locale = 'es' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isChanging: boolean;
}

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale: Locale;
}
\`\`\`

#### Translation Hook Types
\`\`\`typescript
// From next-intl
import { useTranslations } from 'next-intl';

// Usage
const t = useTranslations('namespace');
const translatedText = t('key');
const withParams = t('key', { param: value });
\`\`\`

### Type Consistency Rules

1. **Backend**: Language codes always lowercase ('es', 'en')
2. **Frontend**: Locale type enforced by TypeScript (`'es' | 'en'`)
3. **Database**: VARCHAR(5) allows future expansion (e.g., 'pt-BR')
4. **API Responses**: Snake_case `preferred_language` in DTOs
5. **Frontend State**: CamelCase throughout React components
```

### 6.2 Update APIS.md

**File:** `docs/APIS.md`

Add new API endpoint documentation:

```markdown
## Language Preference API

### Update User Language Preference

**Endpoint:** `PUT /api/profile/language`

**Authentication:** Required (JWT Bearer token)

**Description:** Updates the authenticated user's preferred language setting.

**Request Body:**
\`\`\`json
{
  "preferred_language": "en"
}
\`\`\`

**Request Schema:**
| Field | Type | Required | Values | Description |
|-------|------|----------|--------|-------------|
| preferred_language | string | Yes | 'es' \| 'en' | Language code |

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Language preference updated to 'en'",
  "preferred_language": "en"
}
\`\`\`

**Response Schema:**
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Operation success status |
| message | string | Human-readable message |
| preferred_language | string | Updated language code |

**Error Responses:**

**400 Bad Request:**
\`\`\`json
{
  "detail": "Invalid language code. Supported values: 'es', 'en'"
}
\`\`\`

**401 Unauthorized:**
\`\`\`json
{
  "detail": "Authentication required"
}
\`\`\`

**500 Internal Server Error:**
\`\`\`json
{
  "detail": "Failed to update language preference: {error_message}"
}
\`\`\`

**Example cURL:**
\`\`\`bash
curl -X PUT https://vitalgo.co/api/profile/language \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preferred_language": "en"}'
\`\`\`

**Example with apiClient (Frontend):**
\`\`\`typescript
import { apiClient } from '@/shared/services/apiClient';

async function updateLanguage(language: 'es' | 'en') {
  const response = await apiClient.put('/profile/language', {
    preferred_language: language
  });
  return response.data;
}
\`\`\`

### Updated User Endpoints

**GET /api/users/me** - Now includes `preferred_language` field

**Response:**
\`\`\`json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "patient",
  "is_verified": true,
  "profile_completed": true,
  "mandatory_fields_completed": true,
  "preferred_language": "en"
}
\`\`\`

**POST /api/auth/login** - Now returns `preferred_language` in user object

**Response:**
\`\`\`json
{
  "success": true,
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "preferred_language": "es",
    ...
  }
}
\`\`\`
```

### 6.3 Update DB.md

**File:** `docs/DB.md`

Add language preference column to users table:

```markdown
## Users Table

### Schema Update (October 2025)

Added `preferred_language` column for internationalization support.

### Columns

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | User unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED | - | User email address |
| password_hash | VARCHAR(255) | NOT NULL | - | Bcrypt hashed password |
| user_type | VARCHAR(50) | NOT NULL | - | User type (patient/doctor/admin) |
| is_verified | BOOLEAN | NOT NULL | false | Email verification status |
| **preferred_language** | **VARCHAR(5)** | **NOT NULL, INDEXED** | **'es'** | **User language preference** |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | Account creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | Last update timestamp |
| last_login | TIMESTAMP WITH TIME ZONE | NULL | - | Last successful login |

### Indexes

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_preferred_language ON users(preferred_language); -- NEW
\`\`\`

### Migration

**File:** `backend/alembic/versions/YYYYMMDD_HHMMSS_add_user_language_preference.py`

**Changes:**
- Added `preferred_language` column (VARCHAR(5), NOT NULL, DEFAULT 'es')
- Added index on `preferred_language` for query performance
- Existing users automatically set to Spanish ('es')

**Rollback:** Column and index can be safely dropped without data loss

### Supported Values

| Code | Language | Status |
|------|----------|--------|
| es | Spanish (Español) | ✅ Active (default) |
| en | English | ✅ Active |
| pt | Portuguese (Português) | 🔄 Future |
| fr | French (Français) | 🔄 Future |

### Query Examples

\`\`\`sql
-- Get users by language preference
SELECT * FROM users WHERE preferred_language = 'en';

-- Count users per language
SELECT preferred_language, COUNT(*) as user_count
FROM users
GROUP BY preferred_language;

-- Update user language preference
UPDATE users
SET preferred_language = 'en', updated_at = NOW()
WHERE id = 'user_uuid';
\`\`\`
```

### 6.4 Update DEV.md

**File:** `docs/DEV.md`

Add internationalization development patterns:

```markdown
## Internationalization (i18n) Development Patterns

### Overview

VitalGo uses **next-intl** for internationalization with full TypeScript support.

**Supported Languages:**
- Spanish (es) - Default
- English (en)

**Architecture:** See `docs/TRANSLATE.md` for complete architectural decisions.

### Quick Start

#### 1. Using Translations in Components

\`\`\`typescript
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  const tCommon = useTranslations('common');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{tCommon('save')}</button>
    </div>
  );
}
\`\`\`

#### 2. Adding New Translation Keys

**Step 1:** Add to Spanish (`messages/es.json`)
\`\`\`json
{
  "myFeature": {
    "title": "Mi Título",
    "description": "Mi descripción"
  }
}
\`\`\`

**Step 2:** Add to English (`messages/en.json`)
\`\`\`json
{
  "myFeature": {
    "title": "My Title",
    "description": "My description"
  }
}
\`\`\`

**Step 3:** Use in component
\`\`\`typescript
const t = useTranslations('myFeature');
return <h1>{t('title')}</h1>;
\`\`\`

#### 3. Translations with Parameters

\`\`\`json
{
  "welcome": "Bienvenido, {name}" / "Welcome, {name}",
  "itemCount": "Tienes {count} {count, plural, one {item} other {items}}"
}
\`\`\`

\`\`\`typescript
const t = useTranslations('namespace');

// Simple parameter
<p>{t('welcome', { name: user.name })}</p>

// With pluralization
<p>{t('itemCount', { count: items.length })}</p>
\`\`\`

### Development Workflow

#### Creating a New Feature with i18n

1. **Create translation keys** in both `es.json` and `en.json`
2. **Import useTranslations** in your component
3. **Replace hardcoded strings** with translation calls
4. **Test in both languages** using the language selector

#### Testing Translations

\`\`\`bash
# Run development server
npm run dev

# Test Spanish (default)
http://localhost:3000/profile

# Test English
http://localhost:3000/en/profile
\`\`\`

### Common Patterns

#### 1. Date Formatting

\`\`\`typescript
import { useLocale } from 'next-intl';

export function DateDisplay({ date }: { date: Date }) {
  const locale = useLocale();

  const formatted = date.toLocaleDateString(
    locale === 'es' ? 'es-CO' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return <span>{formatted}</span>;
}
\`\`\`

#### 2. Form Validation Messages

\`\`\`typescript
'use client';
import { useTranslations } from 'next-intl';

export function useFormValidation() {
  const t = useTranslations('errors');

  return {
    required: (field: string) => t('required', { field }),
    minLength: (min: number) => t('minLength', { min }),
    maxLength: (max: number) => t('maxLength', { max }),
  };
}
\`\`\`

#### 3. Server Components

\`\`\`typescript
import { getTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await getTranslations('namespace');

  return <h1>{t('title')}</h1>;
}
\`\`\`

### Critical Development Rules

#### ✅ DO:
- ✅ Always add keys to BOTH `es.json` and `en.json`
- ✅ Use `useTranslations` for client components
- ✅ Use `getTranslations` for server components
- ✅ Test both languages before committing
- ✅ Use parameters for dynamic content
- ✅ Follow unified auth pattern for language updates

#### ❌ DON'T:
- ❌ Hardcode user-facing strings
- ❌ Mix hardcoded and translated strings
- ❌ Forget to update both language files
- ❌ Use direct locale checks in components (use translations)
- ❌ Bypass apiClient for language preference updates

### Backend Language Preference

#### Updating User Language

\`\`\`python
# In use case or service
user.preferred_language = 'en'
db.commit()
db.refresh(user)
\`\`\`

#### Querying by Language

\`\`\`python
english_users = db.query(User).filter(User.preferred_language == 'en').all()
\`\`\`

### Troubleshooting

**Problem:** Translations not updating
**Solution:** Restart development server (translation files are cached)

**Problem:** Missing translation key error
**Solution:** Verify key exists in both `es.json` and `en.json`

**Problem:** Wrong language displayed
**Solution:** Check browser cookies, clear `NEXT_LOCALE` cookie

**Problem:** Language toggle not working
**Solution:** Verify middleware is configured correctly, check browser console

### File Structure Reference

\`\`\`
frontend/
├── messages/
│   ├── es.json          # Spanish translations
│   └── en.json          # English translations
├── src/
│   ├── i18n/
│   │   ├── request.ts   # Server-side i18n config
│   │   ├── routing.ts   # Routing configuration
│   │   └── locale.ts    # Locale utilities
│   ├── middleware.ts    # Language routing
│   └── shared/
│       ├── contexts/
│       │   └── LanguageContext.tsx
│       └── components/
│           └── atoms/
│               └── LanguageSelector.tsx
\`\`\`

### Resources

- **Architecture Doc:** `docs/TRANSLATE.md`
- **next-intl Docs:** https://next-intl-docs.vercel.app/
- **Translation Files:** `frontend/messages/`
- **Type Definitions:** `docs/TYPES.md` (Internationalization section)
```

---

## Phase 7: Testing & Validation

**Duration:** 2 days
**Owner:** QA Team

### 7.1 Unit Tests

**File:** `frontend/src/shared/contexts/__tests__/LanguageContext.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../LanguageContext';

// Mock apiClient
jest.mock('../../services/apiClient', () => ({
  apiClient: {
    put: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}));

describe('LanguageContext', () => {
  it('should provide initial locale', () => {
    let contextValue;

    function TestComponent() {
      contextValue = useLanguage();
      return null;
    }

    render(
      <LanguageProvider initialLocale="es">
        <TestComponent />
      </LanguageProvider>
    );

    expect(contextValue.locale).toBe('es');
  });

  it('should change language successfully', async () => {
    const user = userEvent.setup();

    function TestComponent() {
      const { locale, setLocale } = useLanguage();
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <button onClick={() => setLocale('en')}>Change to English</button>
        </div>
      );
    }

    render(
      <LanguageProvider initialLocale="es">
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('es');

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
  });
});
```

### 7.2 Component Tests

**File:** `frontend/src/shared/components/atoms/__tests__/LanguageSelector.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSelector } from '../LanguageSelector';
import { LanguageProvider } from '../../../contexts/LanguageContext';

describe('LanguageSelector', () => {
  it('should render language buttons', () => {
    render(
      <LanguageProvider initialLocale="es">
        <LanguageSelector />
      </LanguageProvider>
    );

    expect(screen.getByText('ES')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should highlight active language', () => {
    render(
      <LanguageProvider initialLocale="es">
        <LanguageSelector />
      </LanguageProvider>
    );

    const esButton = screen.getByText('ES');
    expect(esButton).toHaveClass('bg-vitalgo-green');
  });

  it('should call setLocale on button click', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider initialLocale="es">
        <LanguageSelector />
      </LanguageProvider>
    );

    const enButton = screen.getByText('EN');
    await user.click(enButton);

    // Verify API call was made (check mocked apiClient)
  });
});
```

### 7.3 Integration Tests

**File:** `frontend/e2e/language-switching.spec.ts` (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('should switch language from navbar', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Verify Spanish (default)
    await expect(page.locator('nav')).toContainText('Mi Perfil');
    await expect(page.locator('nav')).toContainText('Panel de Control');

    // Click English button
    await page.click('button:has-text("EN")');

    // Verify English
    await expect(page).toHaveURL('/en/dashboard');
    await expect(page.locator('nav')).toContainText('My Profile');
    await expect(page.locator('nav')).toContainText('Dashboard');
  });

  test('should persist language preference after login', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test.patient@vitalgo.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await page.waitForURL('/dashboard');

    // Switch to English
    await page.click('button:has-text("EN")');
    await expect(page).toHaveURL('/en/dashboard');

    // Refresh page
    await page.reload();

    // Verify still in English
    await expect(page).toHaveURL('/en/dashboard');
    await expect(page.locator('nav')).toContainText('My Profile');
  });

  test('should translate all dashboard elements', async ({ page }) => {
    await page.goto('/dashboard');

    // Switch to English
    await page.click('button:has-text("EN")');

    // Verify translations
    await expect(page.locator('h1')).toContainText('Welcome');
    await expect(page.locator('text=Active Medications')).toBeVisible();
    await expect(page.locator('text=Active Allergies')).toBeVisible();
    await expect(page.locator('text=Surgeries')).toBeVisible();
    await expect(page.locator('text=Active Illnesses')).toBeVisible();
  });
});
```

### 7.4 API Tests

**File:** `backend/tests/test_language_preference.py`

```python
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_update_language_preference_success(authenticated_headers):
    """Test successful language preference update"""
    response = client.put(
        "/api/profile/language",
        json={"preferred_language": "en"},
        headers=authenticated_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["preferred_language"] == "en"
    assert "updated" in data["message"].lower()

def test_update_language_preference_invalid_code(authenticated_headers):
    """Test invalid language code rejection"""
    response = client.put(
        "/api/profile/language",
        json={"preferred_language": "fr"},  # Not supported yet
        headers=authenticated_headers
    )

    assert response.status_code == 400
    assert "Invalid language code" in response.json()["detail"]

def test_update_language_preference_unauthorized():
    """Test unauthorized access is rejected"""
    response = client.put(
        "/api/profile/language",
        json={"preferred_language": "en"}
    )

    assert response.status_code == 401

def test_login_returns_language_preference():
    """Test login response includes preferred_language"""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test.patient@vitalgo.com",
            "password": "TestPassword123!"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert "user" in data
    assert "preferred_language" in data["user"]
    assert data["user"]["preferred_language"] in ["es", "en"]
```

### 7.5 Translation Completeness Validation

**Script:** `frontend/scripts/validate-translations.js`

```javascript
const fs = require('fs');
const path = require('path');

const esTranslations = require('../messages/es.json');
const enTranslations = require('../messages/en.json');

function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
}

const esFlat = flattenObject(esTranslations);
const enFlat = flattenObject(enTranslations);

const esKeys = Object.keys(esFlat);
const enKeys = Object.keys(enFlat);

// Check for missing keys in English
const missingInEn = esKeys.filter(key => !enKeys.includes(key));
if (missingInEn.length > 0) {
  console.error('❌ Missing in en.json:', missingInEn);
  process.exit(1);
}

// Check for extra keys in English (not in Spanish)
const extraInEn = enKeys.filter(key => !esKeys.includes(key));
if (extraInEn.length > 0) {
  console.warn('⚠️ Extra keys in en.json (not in es.json):', extraInEn);
}

// Check for empty translations
const emptyEs = esKeys.filter(key => !esFlat[key] || esFlat[key].trim() === '');
const emptyEn = enKeys.filter(key => !enFlat[key] || enFlat[key].trim() === '');

if (emptyEs.length > 0) {
  console.error('❌ Empty translations in es.json:', emptyEs);
  process.exit(1);
}

if (emptyEn.length > 0) {
  console.error('❌ Empty translations in en.json:', emptyEn);
  process.exit(1);
}

console.log('✅ Translation validation passed!');
console.log(`📊 Total translation keys: ${esKeys.length}`);
console.log(`🇪🇸 Spanish: ${esKeys.length} keys`);
console.log(`🇬🇧 English: ${enKeys.length} keys`);
```

**Add to package.json:**
```json
{
  "scripts": {
    "validate:translations": "node scripts/validate-translations.js"
  }
}
```

---

## Phase 8: Deployment & Rollout

**Duration:** 1 day
**Owner:** DevOps Team

### 8.1 Pre-Deployment Checklist

- [ ] Database migration tested locally
- [ ] All translation keys validated (run `npm run validate:translations`)
- [ ] Backend API endpoint tested with Postman/curl
- [ ] Frontend language switching tested in both languages
- [ ] E2E tests passing for both languages
- [ ] Documentation updated (TYPES.md, APIS.md, DB.md, DEV.md, TRANSLATE.md)
- [ ] Environment variables configured

### 8.2 Environment Configuration

**File:** `.env.production`

```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/vitalgo_prod
DEBUG=False
ALLOWED_ORIGINS=https://vitalgo.co,https://www.vitalgo.co

# Frontend
NEXT_PUBLIC_API_URL=https://vitalgo.co
NEXT_PUBLIC_DEFAULT_LOCALE=es
NEXT_PUBLIC_SUPPORTED_LOCALES=es,en
```

### 8.3 Database Migration in Production

**Step-by-step process:**

```bash
# 1. Backup production database
pg_dump -h production-db-host -U vitalgo_user vitalgo_prod > backup_pre_i18n_$(date +%Y%m%d).sql

# 2. Apply migration
cd backend
poetry run alembic upgrade head

# 3. Verify migration
docker exec -it production-postgres psql -U vitalgo_user -d vitalgo_prod \
  -c "SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name='users' AND column_name='preferred_language';"

# Expected output:
#   column_name      | data_type | column_default
# -------------------+-----------+----------------
#  preferred_language | character varying | 'es'::character varying

# 4. Verify index
docker exec -it production-postgres psql -U vitalgo_user -d vitalgo_prod \
  -c "SELECT indexname FROM pg_indexes WHERE tablename = 'users' AND indexname = 'idx_users_preferred_language';"

# Expected output:
#          indexname
# ------------------------------
#  idx_users_preferred_language

# 5. Check existing users (should all have 'es' as default)
docker exec -it production-postgres psql -U vitalgo_user -d vitalgo_prod \
  -c "SELECT preferred_language, COUNT(*) as user_count FROM users GROUP BY preferred_language;"

# Expected output:
#  preferred_language | user_count
# -------------------+------------
#  es                |         19
```

### 8.4 Deployment Steps

**Backend Deployment:**

```bash
# 1. Deploy backend with new language endpoint
cd backend
docker build -t vitalgo-backend:i18n .
docker tag vitalgo-backend:i18n registry.vitalgo.co/backend:latest
docker push registry.vitalgo.co/backend:latest

# 2. Update production containers
ssh production-server
cd /opt/vitalgo
docker-compose pull backend
docker-compose up -d backend

# 3. Verify endpoint is live
curl -X GET https://vitalgo.co/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.preferred_language'
# Expected: "es"
```

**Frontend Deployment:**

```bash
# 1. Build frontend with translations
cd frontend
npm run build

# 2. Verify build includes translations
ls -la .next/server/app/
# Should see: (en)/ directory for English routes

# 3. Deploy to production
docker build -t vitalgo-frontend:i18n .
docker tag vitalgo-frontend:i18n registry.vitalgo.co/frontend:latest
docker push registry.vitalgo.co/frontend:latest

# 4. Update production
ssh production-server
cd /opt/vitalgo
docker-compose pull frontend
docker-compose up -d frontend

# 5. Verify routes
curl -I https://vitalgo.co/dashboard
curl -I https://vitalgo.co/en/dashboard
# Both should return 200 OK
```

### 8.5 Rollout Strategy

**Phase 1: Canary Deployment (10% of traffic)**
- Duration: 2 hours
- Monitor error logs for translation issues
- Check language switching functionality
- Verify database writes for language preference

**Phase 2: Gradual Rollout (50% of traffic)**
- Duration: 4 hours
- Monitor performance metrics
- Check for any missing translation keys
- Verify API endpoint performance

**Phase 3: Full Deployment (100% of traffic)**
- Duration: Ongoing
- Complete rollout to all users
- Monitor for 24 hours
- Collect user feedback

### 8.6 Monitoring & Alerts

**Metrics to monitor:**

```bash
# Language preference distribution
SELECT preferred_language, COUNT(*) as users
FROM users
GROUP BY preferred_language;

# Language change API calls
SELECT COUNT(*) as language_updates
FROM audit_logs
WHERE endpoint = '/api/profile/language'
AND created_at > NOW() - INTERVAL '24 hours';

# Error rates by language
SELECT locale, COUNT(*) as errors
FROM error_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY locale;
```

**Alert conditions:**
- Error rate > 5% for language switching
- Missing translation key errors
- API endpoint response time > 500ms

### 8.7 Rollback Plan

**If issues are detected:**

```bash
# 1. Rollback frontend
docker-compose pull frontend:pre-i18n
docker-compose up -d frontend

# 2. Rollback backend (if needed)
docker-compose pull backend:pre-i18n
docker-compose up -d backend

# 3. Rollback database (only if critical)
cd backend
poetry run alembic downgrade -1

# This will:
# - Drop idx_users_preferred_language index
# - Drop preferred_language column
# - No data loss (users table intact)
```

### 8.8 Post-Deployment Verification

**Checklist:**

- [ ] Spanish routes working (e.g., /dashboard)
- [ ] English routes working (e.g., /en/dashboard)
- [ ] Language selector appears in navbar
- [ ] Language switching updates URL correctly
- [ ] Language preference persists after refresh
- [ ] Authenticated users see their saved preference
- [ ] New signups default to Spanish
- [ ] All translations display correctly
- [ ] No console errors related to missing keys
- [ ] API endpoint responds successfully
- [ ] Database updates reflect language changes

**Test user journey:**

```bash
# 1. Login as test user
curl -X POST https://vitalgo.co/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test.patient@vitalgo.com", "password": "TestPassword123!"}'

# 2. Extract JWT token from response

# 3. Change language to English
curl -X PUT https://vitalgo.co/api/profile/language \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preferred_language": "en"}'

# 4. Verify in database
docker exec -it production-postgres psql -U vitalgo_user -d vitalgo_prod \
  -c "SELECT email, preferred_language FROM users WHERE email='test.patient@vitalgo.com';"

# Expected:
#           email             | preferred_language
# ---------------------------+-------------------
#  test.patient@vitalgo.com  | en

# 5. Login again and verify language is remembered
curl -X POST https://vitalgo.co/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test.patient@vitalgo.com", "password": "TestPassword123!"}' \
  | jq '.user.preferred_language'

# Expected: "en"
```

---

## Implementation Checklist

### Backend Tasks

- [ ] Create Alembic migration for `preferred_language` column
- [ ] Update User model with language field
- [ ] Update UserResponseDto with language field
- [ ] Create LanguagePreferenceDto
- [ ] Implement `PUT /api/profile/language` endpoint
- [ ] Add language field to login response
- [ ] Add language field to user profile endpoints
- [ ] Write unit tests for language endpoint
- [ ] Write integration tests
- [ ] Update API documentation

### Frontend Infrastructure Tasks

- [ ] Install next-intl package
- [ ] Create messages directory structure
- [ ] Create es.json with Spanish translations
- [ ] Create en.json with English translations
- [ ] Create i18n/request.ts configuration
- [ ] Create i18n/routing.ts configuration
- [ ] Create i18n/locale.ts utilities
- [ ] Create middleware.ts for routing
- [ ] Update next.config.js with next-intl plugin
- [ ] Create LanguageContext
- [ ] Create LanguageSelector component
- [ ] Update root layout with providers

### Component Translation Tasks

- [ ] Update PublicNavbar with translations
- [ ] Update PatientNavbar with translations
- [ ] Translate Auth slice (10 files)
- [ ] Translate Dashboard slice (15 files)
- [ ] Translate Profile slice (20 files)
- [ ] Translate Medications slice (13 files)
- [ ] Translate Allergies slice (10 files)
- [ ] Translate Surgeries slice (10 files)
- [ ] Translate Illnesses slice (13 files)
- [ ] Translate QR slice (8 files)
- [ ] Translate Emergency Access slice (10 files)
- [ ] Translate Home/Legal pages (15 files)

### Testing Tasks

- [ ] Write LanguageContext unit tests
- [ ] Write LanguageSelector component tests
- [ ] Write language switching integration tests
- [ ] Write E2E tests for language persistence
- [ ] Test all slices in both languages
- [ ] Run translation validation script
- [ ] Test API endpoint with Postman
- [ ] Test date formatting in both locales
- [ ] Test form validation messages
- [ ] Verify metadata updates per language

### Documentation Tasks

- [ ] Update TYPES.md with i18n types
- [ ] Update APIS.md with language endpoint
- [ ] Update DB.md with users table changes
- [ ] Update DEV.md with i18n development patterns
- [ ] Create TRANSLATE.md architectural guide
- [ ] Update README.md with i18n features
- [ ] Create migration guide for developers

### Deployment Tasks

- [ ] Configure production environment variables
- [ ] Backup production database
- [ ] Test migration on staging
- [ ] Run migration on production
- [ ] Deploy backend with language endpoint
- [ ] Deploy frontend with translations
- [ ] Verify all routes work (Spanish + English)
- [ ] Monitor error logs
- [ ] Verify language preference persistence
- [ ] Test with real users
- [ ] Prepare rollback plan

---

## Success Criteria

### Functional Requirements
- ✅ Users can switch language from navbar (both authenticated and public)
- ✅ Language preference persists across sessions
- ✅ Language preference stored in database for authenticated users
- ✅ Spanish is default for new users
- ✅ All UI elements translated in both languages
- ✅ URLs reflect language (no prefix for Spanish, /en prefix for English)
- ✅ Metadata (titles, descriptions) localized

### Technical Requirements
- ✅ Zero breaking changes for existing users
- ✅ All API endpoints return language preference
- ✅ Database migration applied successfully
- ✅ Translation files complete (no missing keys)
- ✅ All tests passing in both languages
- ✅ Performance impact < 50ms for language switching
- ✅ Documentation updated

### Quality Requirements
- ✅ TypeScript compilation passes
- ✅ ESLint passes
- ✅ All E2E tests pass
- ✅ Translation validation script passes
- ✅ No console errors
- ✅ Lighthouse score maintained (> 90)

---

## Timeline Summary

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Backend | 1-2 days | - |
| Phase 2: Frontend Infrastructure | 2-3 days | Phase 1 |
| Phase 3: Navbar Integration | 1 day | Phase 2 |
| Phase 4: Layout Updates | 1 day | Phase 2 |
| Phase 5: Slice Translations | 3-5 days | Phase 2, 3 |
| Phase 6: Documentation | 1 day | All phases |
| Phase 7: Testing | 2 days | Phase 1-5 |
| Phase 8: Deployment | 1 day | All phases |

**Total Estimated Duration:** 12-16 working days

---

## Risk Mitigation

### Risk 1: Missing Translation Keys
**Mitigation:**
- Run validation script before deployment
- Implement fallback to Spanish if key missing
- Add console warnings for missing keys

### Risk 2: Performance Impact
**Mitigation:**
- Translation files cached at build time
- Lazy load language files
- Monitor bundle size impact

### Risk 3: Database Migration Issues
**Mitigation:**
- Test migration on staging first
- Backup production database
- Have rollback plan ready
- Use default value for existing users

### Risk 4: SEO Impact
**Mitigation:**
- Proper hreflang tags
- Sitemap includes both languages
- Canonical URLs configured
- Metadata localized

### Risk 5: User Confusion
**Mitigation:**
- Clear visual feedback on language switch
- Tooltip on language selector
- Help documentation in both languages
- Email communication about new feature

---

## Future Enhancements

### Phase 2 (Future)
- Portuguese (pt)
- French (fr)
- Language auto-detection from browser
- Translation management UI
- User-contributed translations
- Right-to-left (RTL) language support

### Phase 3 (Future)
- AI-powered translations
- Voice language selection
- Accessibility improvements
- Translation quality metrics
- A/B testing for translations

---

**Document Status:** ✅ Ready for Implementation
**Last Updated:** October 2025
**Next Review:** After Phase 8 completion
