# VitalGo Internationalization (i18n) Architecture

**Document Purpose:** Architectural decisions and patterns for internationalization
**Created:** October 2025
**Status:** Architecture Reference
**Scope:** Multi-language support framework

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Design Decisions](#design-decisions)
4. [Data Flow](#data-flow)
5. [File Structure](#file-structure)
6. [Translation Management](#translation-management)
7. [Routing Strategy](#routing-strategy)
8. [State Management](#state-management)
9. [Backend Integration](#backend-integration)
10. [Patterns & Best Practices](#patterns--best-practices)
11. [Performance Considerations](#performance-considerations)
12. [SEO & Accessibility](#seo--accessibility)
13. [Testing Strategy](#testing-strategy)
14. [Adding New Languages](#adding-new-languages)
15. [Migration Guide](#migration-guide)

---

## Architecture Overview

### Principles

VitalGo's internationalization architecture is built on these core principles:

1. **User-Centric:** Language preference follows the user across sessions
2. **Server-First:** Translations rendered server-side for optimal performance
3. **Type-Safe:** Full TypeScript support with compile-time validation
4. **Extensible:** Easy to add new languages without code changes
5. **SEO-Friendly:** Proper URL structure and meta tags per language
6. **Accessible:** ARIA labels and semantic HTML in all languages

### Supported Languages

| Language | Code | Status | Default | URL Prefix |
|----------|------|--------|---------|------------|
| Spanish | `es` | ✅ Active | ✅ Yes | None |
| English | `en` | ✅ Active | ❌ No | `/en` |
| Portuguese | `pt` | 🔄 Planned | ❌ No | `/pt` |
| French | `fr` | 🔄 Planned | ❌ No | `/fr` |

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│           USER INTERACTION LAYER                │
│  - Language Selector Component                  │
│  - Navbar (Public + Authenticated)              │
│  - Visual feedback during language switch       │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         PRESENTATION LAYER (Frontend)           │
│  - next-intl hooks (useTranslations)            │
│  - Translation files (es.json, en.json)         │
│  - Dynamic content rendering                    │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         STATE MANAGEMENT LAYER                  │
│  - LanguageContext (React Context)              │
│  - Locale state management                      │
│  - Cookie-based persistence                     │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         ROUTING LAYER (Middleware)              │
│  - next-intl middleware                         │
│  - Locale detection                             │
│  - URL prefix handling                          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         API COMMUNICATION LAYER                 │
│  - Unified apiClient                            │
│  - Language preference API endpoint             │
│  - JWT with user preferences                    │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         PERSISTENCE LAYER (Backend)             │
│  - PostgreSQL: users.preferred_language         │
│  - Cookie: NEXT_LOCALE                          │
│  - JWT payload: language info                   │
└─────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Libraries

#### next-intl (v3.x)
**Why chosen:**
- Native Next.js 15 App Router support
- Server Components and RSC compatible
- TypeScript-first with type inference
- Minimal configuration overhead
- Active development and community

**Alternatives considered:**
- ❌ `react-i18next`: Primarily client-side, complex SSR setup
- ❌ `react-intl`: Less Next.js integration
- ❌ Custom solution: High maintenance burden

#### Dependencies

```json
{
  "dependencies": {
    "next-intl": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.19.16"
  }
}
```

### Backend Stack

- **Python 3.11+** with Pydantic v2
- **FastAPI** for RESTful APIs
- **PostgreSQL 15+** for persistence
- **SQLAlchemy 2.x** for ORM

---

## Design Decisions

### Decision 1: URL Strategy - "as-needed" Locale Prefix

**Decision:** Spanish (default) has no prefix, other languages use prefix

**Rationale:**
- Spanish is the primary market (Colombia)
- Clean URLs for majority of users: `/dashboard`
- English users get explicit prefix: `/en/dashboard`
- SEO-friendly for Spanish-speaking regions
- Easy to identify non-default languages

**Alternative considered:**
- ❌ Always prefix: `/es/dashboard` and `/en/dashboard`
  - Pros: Explicit, consistent
  - Cons: Breaking change for existing URLs, SEO impact

**Implementation:**
```typescript
// next-intl routing config
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed' // Key decision
});
```

### Decision 2: Cookie-based Locale Persistence

**Decision:** Store locale in server-side cookie `NEXT_LOCALE`

**Rationale:**
- Works for both authenticated and unauthenticated users
- Server-side rendering compatible
- No flash of wrong language on page load
- Survives browser refresh
- HTTP-only option available for security

**Alternative considered:**
- ❌ localStorage only:
  - Pros: Client-side only
  - Cons: Not accessible in SSR, flash of content
- ❌ Query parameters:
  - Pros: Explicit in URL
  - Cons: Cluttered URLs, not sticky

**Implementation:**
```typescript
// Server action for cookie management
export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale);
}
```

### Decision 3: Dual Persistence (Cookie + Database)

**Decision:** Store in both cookie and database for authenticated users

**Rationale:**
- **Cookie:** Immediate effect, works offline, SSR compatible
- **Database:** Persistent across devices, part of user profile
- Graceful degradation for unauthenticated users
- Seamless experience on multi-device usage

**Flow:**
```
Language Change
    │
    ├─→ Update Cookie (immediate UI update)
    │
    └─→ API Call to Database (if authenticated)
```

**Implementation:**
```typescript
const setLocale = async (newLocale: Locale) => {
  // 1. Update cookie (client + server)
  await setUserLocale(newLocale);

  // 2. Update database (authenticated only)
  try {
    await apiClient.put('/profile/language', {
      preferred_language: newLocale
    });
  } catch {
    // Fallback: cookie-only for unauthenticated
  }

  // 3. Navigate to new locale
  router.replace(`/${newLocale}${pathname}`);
};
```

### Decision 4: Server-Side Translation Loading

**Decision:** Load translations at build time, serve via SSR

**Rationale:**
- Zero client-side bundle impact for translations
- Instant translation rendering (no loading state)
- Better SEO (crawlers see translated content)
- Reduced Time to Interactive (TTI)

**Alternative considered:**
- ❌ Client-side lazy loading:
  - Pros: Smaller initial bundle
  - Cons: Flash of untranslated content, SEO impact

**Implementation:**
```typescript
// Server-side translation loading
export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

### Decision 5: Namespace-Based Translation Files

**Decision:** Single JSON file per language with nested namespaces

**Rationale:**
- Simple to manage (2 files vs 20+ files)
- Easy to compare translations side-by-side
- Better for translation tools (Crowdin, Lokalise)
- Reduced file system overhead

**Structure:**
```json
{
  "common": { "save": "Save", "cancel": "Cancel" },
  "nav": { "dashboard": "Dashboard" },
  "medications": { "title": "Medications" }
}
```

**Alternative considered:**
- ❌ Separate file per namespace:
  ```
  messages/
  ├── es/
  │   ├── common.json
  │   ├── nav.json
  │   └── medications.json
  ```
  - Pros: Lazy loading per namespace
  - Cons: More files to manage, harder to compare

### Decision 6: TypeScript Type Safety

**Decision:** Leverage next-intl's type inference for translation keys

**Rationale:**
- Compile-time validation of translation keys
- Autocomplete for translation keys
- Catch missing translations before runtime
- Better developer experience

**Implementation:**
```typescript
// Typed translation hook
const t = useTranslations('medications');

// ✅ TypeScript knows these keys exist
t('title');
t('addMedication');

// ❌ TypeScript error: Key doesn't exist
t('nonExistentKey'); // Type error
```

---

## Data Flow

### Language Change Flow (Authenticated User)

```
┌─────────────────────────────────────────────────────────┐
│  1. User clicks language selector (ES → EN)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. LanguageContext.setLocale('en')                     │
│     - Update local state                                │
│     - Set isChanging = true                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Server Action: setUserLocale('en')                  │
│     - Update NEXT_LOCALE cookie                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. API Call: PUT /api/profile/language                 │
│     - Headers: Authorization: Bearer {JWT}              │
│     - Body: { preferred_language: 'en' }                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. Backend: Update users.preferred_language = 'en'     │
│     - Validate language code                            │
│     - Update database                                   │
│     - Return success response                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  6. Frontend: Navigate to /en/dashboard                 │
│     - router.replace('/en/dashboard')                   │
│     - router.refresh()                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  7. Next.js Middleware: Detect locale from URL          │
│     - Parse /en prefix                                  │
│     - Set locale = 'en'                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  8. Server Component: Load English translations         │
│     - import('../../messages/en.json')                  │
│     - Render with English content                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  9. Client: Page rendered in English                    │
│     - Update UI language                                │
│     - Set isChanging = false                            │
└─────────────────────────────────────────────────────────┘
```

### Login Flow with Language Preference

```
┌─────────────────────────────────────────────────────────┐
│  1. User logs in with credentials                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. Backend: Validate credentials                       │
│     - Check email/password                              │
│     - Fetch user from database                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Backend: Generate JWT with user data                │
│     - Include preferred_language in response            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. Frontend: Receive login response                    │
│     {                                                   │
│       "user": {                                         │
│         "id": "uuid",                                   │
│         "preferred_language": "en"                      │
│       }                                                 │
│     }                                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. Frontend: Set cookie to match user preference       │
│     - setUserLocale(user.preferred_language)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  6. Frontend: Redirect to appropriate locale            │
│     - If 'en': redirect to /en/dashboard               │
│     - If 'es': redirect to /dashboard                  │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

### Frontend Structure

```
frontend/
├── messages/                      # Translation files
│   ├── es.json                    # Spanish (default)
│   └── en.json                    # English
│
├── src/
│   ├── i18n/                      # Internationalization config
│   │   ├── request.ts             # Server-side i18n config
│   │   ├── routing.ts             # Routing configuration
│   │   └── locale.ts              # Locale utilities (cookies)
│   │
│   ├── middleware.ts              # Next.js middleware (language routing)
│   │
│   ├── app/
│   │   ├── layout.tsx             # Root layout with i18n providers
│   │   ├── page.tsx               # Home page (Spanish)
│   │   ├── [locale]/              # Localized routes
│   │   │   ├── layout.tsx         # (Optional) Locale-specific layout
│   │   │   └── ...pages           # Localized pages
│   │   └── ...                    # Other routes
│   │
│   └── shared/
│       ├── contexts/
│       │   └── LanguageContext.tsx    # Language state management
│       │
│       └── components/
│           ├── atoms/
│           │   └── LanguageSelector.tsx   # Language switcher UI
│           │
│           └── organisms/
│               ├── PublicNavbar.tsx      # With language selector
│               └── PatientNavbar.tsx     # With language selector
│
├── scripts/
│   └── validate-translations.js   # Translation validation script
│
└── next.config.js                 # Next.js config with next-intl plugin
```

### Backend Structure

```
backend/
├── slices/
│   ├── auth/
│   │   └── application/
│   │       └── dto/
│   │           └── user_dto.py    # UserResponseDto with preferred_language
│   │
│   ├── profile/
│   │   └── infrastructure/
│   │       └── api/
│   │           └── profile_endpoints.py   # Language preference endpoint
│   │
│   └── signup/
│       └── domain/
│           └── models/
│               └── user_model.py  # User model with preferred_language
│
├── alembic/
│   └── versions/
│       └── YYYYMMDD_add_user_language_preference.py
│
└── shared/
    └── database/
        └── database.py            # Database configuration
```

---

## Translation Management

### Translation File Format

**Format:** Nested JSON with namespaces

**Example (`messages/es.json`):**
```json
{
  "common": {
    "loading": "Cargando...",
    "save": "Guardar",
    "cancel": "Cancelar"
  },
  "medications": {
    "title": "Medicamentos",
    "addMedication": "Agregar Medicamento",
    "fields": {
      "name": "Nombre del Medicamento",
      "dosage": "Dosis"
    }
  }
}
```

### Translation Key Naming Conventions

**Rules:**
1. Use camelCase for keys: `addMedication` not `add_medication`
2. Use semantic names: `title` not `heading1`
3. Group related keys in namespaces
4. Keep depth to max 3 levels
5. Avoid duplication across namespaces

**Examples:**

✅ **Good:**
```json
{
  "medications": {
    "title": "Medications",
    "actions": {
      "add": "Add Medication",
      "edit": "Edit Medication"
    }
  }
}
```

❌ **Bad:**
```json
{
  "medications_title": "Medications",
  "medications_add_button": "Add Medication",
  "medications_edit_button_text": "Edit"
}
```

### Translation Parameters

**Syntax:** Use curly braces `{paramName}`

**Example:**
```json
{
  "welcome": "Welcome, {name}!",
  "itemCount": "You have {count} {count, plural, one {item} other {items}}"
}
```

**Usage:**
```typescript
const t = useTranslations('common');

<p>{t('welcome', { name: user.name })}</p>
// Output: "Welcome, John!"

<p>{t('itemCount', { count: 5 })}</p>
// Output: "You have 5 items"
```

### Pluralization

**next-intl** supports ICU MessageFormat pluralization:

```json
{
  "medicationCount": "{count, plural, =0 {No medications} one {# medication} other {# medications}}"
}
```

**Usage:**
```typescript
<p>{t('medicationCount', { count: 0 })}</p>   // "No medications"
<p>{t('medicationCount', { count: 1 })}</p>   // "1 medication"
<p>{t('medicationCount', { count: 5 })}</p>   // "5 medications"
```

### Translation Validation

**Script:** `scripts/validate-translations.js`

**Checks:**
- ✅ All keys in Spanish exist in English
- ✅ No empty translation values
- ✅ Consistent parameter usage
- ✅ Valid JSON structure

**Usage:**
```bash
npm run validate:translations
```

**CI/CD Integration:**
```yaml
# .github/workflows/ci.yml
- name: Validate translations
  run: npm run validate:translations
```

---

## Routing Strategy

### URL Patterns

| Language | Route Example | URL |
|----------|---------------|-----|
| Spanish (default) | Dashboard | `/dashboard` |
| English | Dashboard | `/en/dashboard` |
| Spanish | Profile | `/profile` |
| English | Profile | `/en/profile` |

### Middleware Configuration

**File:** `frontend/src/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - API routes (/api/*)
  // - Next.js internals (/_next/*)
  // - Static files (*.png, *.jpg, etc.)
  matcher: ['/', '/(es|en)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)']
};
```

### Routing Configuration

**File:** `frontend/src/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // No prefix for Spanish, /en for English
});

// Export localized navigation utilities
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

### Programmatic Navigation

**Client Components:**
```typescript
import { useRouter } from 'next/navigation';

function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    // Automatic locale prefix handling
    router.push('/dashboard');
    // Spanish: navigates to /dashboard
    // English: navigates to /en/dashboard
  };
}
```

**Server Components:**
```typescript
import { redirect } from 'next/navigation';

async function ServerAction() {
  // Automatic locale prefix
  redirect('/dashboard');
}
```

---

## State Management

### Language Context

**Purpose:** Global language state accessible throughout the app

**Implementation:**
```typescript
// LanguageContext.tsx
interface LanguageContextType {
  locale: Locale;              // Current language ('es' | 'en')
  setLocale: (locale: Locale) => Promise<void>;  // Change language
  isChanging: boolean;         // Loading state during switch
}
```

**Provider Placement:**
```typescript
// app/layout.tsx
export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <LanguageProvider initialLocale={locale}>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Usage in Components:**
```typescript
import { useLanguage } from '@/shared/contexts/LanguageContext';

function MyComponent() {
  const { locale, setLocale, isChanging } = useLanguage();

  return (
    <button
      onClick={() => setLocale('en')}
      disabled={isChanging}
    >
      Switch to English
    </button>
  );
}
```

### Cookie Management

**Server-side cookie operations:**
```typescript
// i18n/locale.ts
'use server';
import { cookies } from 'next/headers';

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'es';
}

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale);
}
```

**Why server actions:**
- Cookies only accessible on server in Next.js App Router
- Secure HTTP-only cookies possible
- SSR compatibility

---

## Backend Integration

### Database Schema

**Table:** `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_language VARCHAR(5) NOT NULL DEFAULT 'es',  -- NEW FIELD
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_preferred_language ON users(preferred_language);
```

### API Endpoint

**Endpoint:** `PUT /api/profile/language`

**Request:**
```json
{
  "preferred_language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Language preference updated to 'en'",
  "preferred_language": "en"
}
```

**Implementation Pattern:**

```python
@router.put("/language", response_model=LanguageUpdateResponseDto)
async def update_language_preference(
    language_data: LanguagePreferenceDto,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate language code
    if language_data.preferred_language not in ['es', 'en']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid language code"
        )

    # Update user preference
    current_user.preferred_language = language_data.preferred_language
    db.commit()
    db.refresh(current_user)

    return LanguageUpdateResponseDto(
        success=True,
        message=f"Language preference updated to '{language_data.preferred_language}'",
        preferred_language=current_user.preferred_language
    )
```

### Integration with Unified Auth

**Following UNIFIED_AUTH_MIGRATION.md pattern:**

```typescript
// Frontend: Use apiClient for language updates
import { apiClient } from '@/shared/services/apiClient';

async function updateLanguagePreference(language: 'es' | 'en') {
  const response = await apiClient.put('/profile/language', {
    preferred_language: language
  });
  return response.data;
}
```

**Benefits:**
- ✅ Automatic JWT injection
- ✅ Consistent error handling
- ✅ Unified logging
- ✅ Type-safe requests

---

## Patterns & Best Practices

### Pattern 1: Translation Hook in Client Components

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function MedicationCard({ medication }: Props) {
  const t = useTranslations('medications');
  const tCommon = useTranslations('common');

  return (
    <div>
      <h3>{medication.name}</h3>
      <p>{t('dosage')}: {medication.dosage}</p>
      <button>{tCommon('edit')}</button>
      <button>{tCommon('delete')}</button>
    </div>
  );
}
```

**Best Practices:**
- ✅ Import at component level, not globally
- ✅ Use specific namespaces (`medications`, not `all`)
- ✅ Separate common translations (`tCommon`)
- ✅ Use semantic keys (`dosage`, not `dosage_label`)

### Pattern 2: Translation in Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('welcome', { name: 'User' })}</p>
    </div>
  );
}
```

**Key Differences:**
- `getTranslations` (async) for server components
- `useTranslations` (sync) for client components

### Pattern 3: Dynamic Date Formatting

```typescript
import { useLocale } from 'next-intl';

export function DateDisplay({ date }: { date: Date }) {
  const locale = useLocale();

  const formatted = date.toLocaleDateString(
    locale === 'es' ? 'es-CO' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  return <span>{formatted}</span>;
}

// Spanish: "15 de octubre de 2025"
// English: "October 15, 2025"
```

### Pattern 4: Form Validation with Translations

```typescript
'use client';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export function MedicationForm() {
  const t = useTranslations('medications');
  const tErrors = useTranslations('errors');

  const { register, formState: { errors } } = useForm({
    defaultValues: { medicationName: '' }
  });

  return (
    <form>
      <input
        {...register('medicationName', {
          required: tErrors('required'),
          minLength: {
            value: 3,
            message: tErrors('minLength', { min: 3 })
          }
        })}
      />
      {errors.medicationName && (
        <span className="error">{errors.medicationName.message}</span>
      )}
    </form>
  );
}
```

### Pattern 5: Conditional Rendering by Locale

```typescript
import { useLocale } from 'next-intl';

export function ConditionalContent() {
  const locale = useLocale();

  return (
    <div>
      {locale === 'es' && (
        <p>Contenido específico para Colombia</p>
      )}
      {locale === 'en' && (
        <p>International content</p>
      )}
    </div>
  );
}
```

**Warning:** Use sparingly, prefer translation files

---

## Performance Considerations

### Bundle Size Impact

**Analysis:**
- Translation files loaded at build time
- No runtime bundle impact
- Separate bundles per locale
- Only active locale loaded

**Measurements:**
```bash
# Before i18n
Page                              Size     First Load JS
┌ ○ /dashboard                   15.2 kB        123 kB

# After i18n (Spanish)
┌ ○ /dashboard                   15.3 kB        124 kB  (+1 kB)

# After i18n (English)
┌ ○ /en/dashboard                15.3 kB        124 kB  (+1 kB)
```

**Impact:** < 1% bundle size increase

### Server-Side Rendering Performance

**Optimizations:**
- Translation files cached at build time
- No API calls for translations
- Instant rendering with localized content

**Measurements:**
- SSR time: +5-10ms (translation loading)
- TTFB (Time to First Byte): No significant impact
- LCP (Largest Contentful Paint): Improved (no client-side loading)

### Language Switching Performance

**Flow timing:**
```
User clicks language selector
  │
  ├─ Update cookie: ~5ms
  ├─ API call to backend: ~50-100ms
  ├─ Navigate to new URL: ~10ms
  └─ Re-render with new locale: ~20-30ms

Total: ~85-145ms
```

**Optimizations:**
- Optimistic UI updates (show new language before API response)
- Parallel cookie + API update
- Cached translation files

---

## SEO & Accessibility

### SEO Optimizations

#### 1. Hreflang Tags

**Implementation:**
```typescript
// app/layout.tsx
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    alternates: {
      canonical: locale === 'es' ? 'https://vitalgo.co/dashboard' : 'https://vitalgo.co/en/dashboard',
      languages: {
        'es-CO': 'https://vitalgo.co/dashboard',
        'en-US': 'https://vitalgo.co/en/dashboard',
        'x-default': 'https://vitalgo.co/dashboard'
      }
    }
  };
}
```

#### 2. Localized Metadata

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      locale: locale === 'es' ? 'es_CO' : 'en_US',
      title: t('ogTitle'),
      description: t('ogDescription')
    }
  };
}
```

#### 3. Sitemap Generation

```xml
<!-- sitemap.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://vitalgo.co/dashboard</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://vitalgo.co/dashboard"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://vitalgo.co/en/dashboard"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://vitalgo.co/dashboard"/>
  </url>
</urlset>
```

### Accessibility

#### 1. Language Attribute

```typescript
// app/layout.tsx
export default async function RootLayout({ children }) {
  const locale = await getLocale();

  return <html lang={locale}>{/* ... */}</html>;
}
```

#### 2. ARIA Labels

```typescript
export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div role="group" aria-label="Language selector">
      <button
        onClick={() => setLocale('es')}
        aria-pressed={locale === 'es'}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
      <button
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
```

#### 3. Screen Reader Announcements

```typescript
export function LanguageSelector() {
  const [announcement, setAnnouncement] = useState('');

  const handleChange = async (locale: Locale) => {
    await setLocale(locale);
    setAnnouncement(
      locale === 'es'
        ? 'Idioma cambiado a Español'
        : 'Language changed to English'
    );
  };

  return (
    <>
      {/* Language buttons */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
```

---

## Testing Strategy

### Unit Tests

**Test translation hooks:**
```typescript
import { renderHook } from '@testing-library/react';
import { useTranslations } from 'next-intl';

test('should return translated text', () => {
  const { result } = renderHook(() => useTranslations('common'));
  expect(result.current('save')).toBe('Save');
});
```

**Test language context:**
```typescript
test('should change language', async () => {
  const { result } = renderHook(() => useLanguage());
  await act(() => result.current.setLocale('en'));
  expect(result.current.locale).toBe('en');
});
```

### Integration Tests

**Test language switching flow:**
```typescript
test('should switch language and persist preference', async () => {
  render(<App />);

  // Initial language
  expect(screen.getByText('Mi Perfil')).toBeInTheDocument();

  // Switch to English
  fireEvent.click(screen.getByText('EN'));

  // Wait for navigation
  await waitFor(() => {
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  // Verify API was called
  expect(apiClient.put).toHaveBeenCalledWith('/profile/language', {
    preferred_language: 'en'
  });
});
```

### E2E Tests (Playwright)

**Test complete user journey:**
```typescript
test('language preference persists across sessions', async ({ page, context }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Switch to English
  await page.click('button:has-text("EN")');
  await expect(page).toHaveURL('/en/dashboard');

  // Close and reopen browser
  await page.close();
  const newPage = await context.newPage();
  await newPage.goto('/dashboard');

  // Should redirect to English
  await expect(newPage).toHaveURL('/en/dashboard');
});
```

### Translation Validation Tests

**Automated validation:**
```javascript
// scripts/validate-translations.test.js
test('all Spanish keys exist in English', () => {
  const esKeys = getKeys(esTranslations);
  const enKeys = getKeys(enTranslations);

  const missing = esKeys.filter(key => !enKeys.includes(key));
  expect(missing).toHaveLength(0);
});

test('no empty translation values', () => {
  const emptyInEs = findEmptyValues(esTranslations);
  const emptyInEn = findEmptyValues(enTranslations);

  expect(emptyInEs).toHaveLength(0);
  expect(emptyInEn).toHaveLength(0);
});
```

---

## Adding New Languages

### Step-by-Step Guide

#### Step 1: Add Translation File

```bash
# Create new translation file
cp frontend/messages/en.json frontend/messages/pt.json

# Translate all keys to Portuguese
# ... manual translation or use translation service
```

#### Step 2: Update Routing Configuration

```typescript
// frontend/src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['es', 'en', 'pt'],  // Add 'pt'
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});
```

#### Step 3: Update Type Definitions

```typescript
// frontend/src/i18n/locale.ts
export type Locale = 'es' | 'en' | 'pt';  // Add 'pt'
```

#### Step 4: Update Backend Validation

```python
# backend/slices/auth/application/dto/user_dto.py
class SupportedLanguage(str, Enum):
    SPANISH = 'es'
    ENGLISH = 'en'
    PORTUGUESE = 'pt'  # Add new language

@field_validator('preferred_language')
@classmethod
def validate_language(cls, v: str) -> str:
    if v not in ['es', 'en', 'pt']:  # Add 'pt'
        return 'es'
    return v
```

#### Step 5: Update API Endpoint

```python
# backend/slices/profile/infrastructure/api/profile_endpoints.py
if language_data.preferred_language not in ['es', 'en', 'pt']:  # Add 'pt'
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid language code. Supported values: 'es', 'en', 'pt'"
    )
```

#### Step 6: Update Language Selector

```typescript
// frontend/src/shared/components/atoms/LanguageSelector.tsx
export function LanguageSelector() {
  return (
    <div>
      <button onClick={() => setLocale('es')}>ES</button>
      <button onClick={() => setLocale('en')}>EN</button>
      <button onClick={() => setLocale('pt')}>PT</button>  {/* Add button */}
    </div>
  );
}
```

#### Step 7: Update Middleware

```typescript
// frontend/src/middleware.ts
export const config = {
  matcher: ['/', '/(es|en|pt)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)']
  //                     ^^^ Add 'pt'
};
```

#### Step 8: Test New Language

```bash
# Validate translations
npm run validate:translations

# Test locally
npm run dev

# Navigate to
http://localhost:3000/pt/dashboard
```

#### Step 9: Update Documentation

Update these files:
- `docs/TRANSLATE.md` (this file)
- `docs/TYPES.md`
- `docs/APIS.md`
- `docs/DEV.md`

---

## Migration Guide

### For Existing Projects

If you're adding i18n to an existing VitalGo instance:

#### Phase 1: Preparation

1. **Audit hardcoded strings:**
```bash
# Find hardcoded Spanish strings
grep -r "\"[A-ZÁÉÍÓÚÑ]" frontend/src --include="*.tsx"
```

2. **Create translation spreadsheet:**
| Component | Spanish | English | Key |
|-----------|---------|---------|-----|
| LoginForm | Iniciar Sesión | Sign In | auth.login |
| Dashboard | Panel de Control | Dashboard | nav.dashboard |

3. **Install dependencies:**
```bash
npm install next-intl
```

#### Phase 2: Infrastructure Setup

1. Create directory structure
2. Configure next-intl
3. Add middleware
4. Update root layout

#### Phase 3: Component Migration

**Priority order:**
1. Navigation components (highest visibility)
2. Auth flow (critical path)
3. Dashboard (high traffic)
4. Medical data slices (core functionality)
5. Static pages (lowest priority)

**Migration pattern per component:**
```typescript
// Before
export function Component() {
  return <h1>Medicamentos</h1>;
}

// After
'use client';
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('medications');
  return <h1>{t('title')}</h1>;
}
```

#### Phase 4: Testing

1. Unit test each migrated component
2. Integration test language switching
3. E2E test complete user journeys
4. Validate all translation keys exist

#### Phase 5: Deployment

1. Deploy backend with language column
2. Run database migration
3. Deploy frontend with translations
4. Monitor for missing translation errors

---

## Conclusion

This architecture provides:

✅ **Scalability:** Easy to add new languages
✅ **Performance:** Server-side rendering with minimal overhead
✅ **Developer Experience:** Type-safe, intuitive API
✅ **User Experience:** Seamless language switching
✅ **Maintainability:** Centralized translation management
✅ **SEO:** Proper localization for search engines
✅ **Accessibility:** Full ARIA support

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Next Review:** After adding third language
**Maintainer:** VitalGo Engineering Team
