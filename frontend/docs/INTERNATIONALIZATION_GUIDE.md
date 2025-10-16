# VitalGo Internationalization Guide

> **Last Updated:** October 2025
> **Version:** 1.0
> **Status:** Active Development

## Table of Contents

1. [Introduction](#introduction)
2. [Why Internationalization Matters](#why-internationalization-matters)
3. [Supported Languages](#supported-languages)
4. [Technical Setup](#technical-setup)
5. [Translation File Structure](#translation-file-structure)
6. [Best Practices](#best-practices)
7. [Implementation Patterns](#implementation-patterns)
8. [Common Scenarios](#common-scenarios)
9. [Testing Guidelines](#testing-guidelines)
10. [Code Review Checklist](#code-review-checklist)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

VitalGo is a multilingual healthcare platform serving users across multiple countries. To ensure accessibility and user satisfaction, all user-facing text must be internationalized using the `next-intl` library integrated with Next.js 15.

### Core Principle

**NEVER hardcode user-facing text in components.** All text visible to users must come from translation files.

---

## Why Internationalization Matters

### User Impact
- **Accessibility:** Users can interact with the platform in their preferred language
- **User Experience:** Proper localization builds trust and improves usability
- **Market Expansion:** Enables entry into new markets without code changes

### Business Impact
- **Scalability:** Adding new languages requires only translation files, not code changes
- **Compliance:** Meets regulatory requirements for multilingual healthcare platforms
- **Maintenance:** Centralized translation management reduces bugs and inconsistencies

---

## Supported Languages

### Currently Active
- **Spanish (es):** Primary language - Colombian Spanish
- **English (en):** Secondary language - US English

### Planned (Future)
- Portuguese (pt) - Brazilian Portuguese
- French (fr) - Canadian French

---

## Technical Setup

### Dependencies

```json
{
  "next-intl": "^3.x.x"
}
```

### Configuration Files

#### `/i18n.ts` - Main configuration
```typescript
export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es';
```

#### `/middleware.ts` - Locale routing
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always'
});
```

#### `/messages/` - Translation files
- `/messages/en.json` - English translations
- `/messages/es.json` - Spanish translations

### URL Structure

VitalGo uses the `always` locale prefix strategy:

- ✅ `/es/login` - Spanish login page
- ✅ `/en/login` - English login page
- ❌ `/login` - Invalid (must include locale)

---

## Translation File Structure

### Organization Principles

Translation keys are organized by **feature/slice**:

```json
{
  "common": { ... },        // Shared across all features
  "auth": { ... },          // Authentication slice
  "signup": { ... },        // Signup slice
  "profile": { ... },       // Profile slice
  "medications": { ... },   // Medications slice
  "dashboard": { ... },     // Dashboard slice
  // etc.
}
```

### Naming Conventions

#### Top-Level Namespaces
- `common` - Buttons, labels, actions shared across features
- `nav` - Navigation items
- `errors` - Global error messages
- `validation` - Form validation messages
- `[sliceName]` - Feature-specific translations

#### Key Naming Patterns

**Use camelCase** for translation keys:

```json
{
  "loginTitle": "Log In",           // ✅ Correct
  "login-title": "Log In",          // ❌ Wrong - no hyphens
  "login_title": "Log In"           // ❌ Wrong - no underscores
}
```

**Group related translations**:

```json
{
  "auth": {
    "loginTitle": "Log In",
    "loginSubtitle": "Access your account",
    "validation": {
      "emailRequired": "Email is required",
      "emailInvalid": "Enter a valid email"
    }
  }
}
```

### Example Translation Structure

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "loading": "Loading...",
    "termsAndConditions": "Terms and Conditions",
    "privacyPolicy": "Privacy Policy"
  },
  "auth": {
    "loginTitle": "Log In",
    "loginButton": "Log In",
    "loggingIn": "Logging in...",
    "emailPlaceholder": "your@email.com",
    "validation": {
      "emailRequired": "Email is required",
      "passwordRequired": "Password is required"
    }
  }
}
```

---

## Best Practices

### 1. Never Hardcode User-Facing Text

❌ **Bad:**
```tsx
<button>Save Changes</button>
<p>Error: Invalid email address</p>
```

✅ **Good:**
```tsx
<button>{t('common.save')}</button>
<p>{t('validation.invalidEmail')}</p>
```

### 2. Always Use the Translation Hook

For **client components**:
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('auth');
  return <h1>{t('loginTitle')}</h1>;
}
```

For **server components**:
```tsx
import { getTranslations } from 'next-intl/server';

export async function MyServerComponent() {
  const t = await getTranslations('auth');
  return <h1>{t('loginTitle')}</h1>;
}
```

### 3. Use Multiple Translation Hooks for Different Namespaces

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const tValidation = useTranslations('validation');

  return (
    <form>
      <h1>{tAuth('loginTitle')}</h1>
      <button>{tCommon('submit')}</button>
      <p className="error">{tValidation('emailRequired')}</p>
    </form>
  );
}
```

### 4. Keep Translations Consistent

Maintain consistent terminology across the application:

```json
{
  "common": {
    "save": "Save",      // Use everywhere
    "cancel": "Cancel"   // Use everywhere
  }
}
```

Don't create duplicates:
```json
{
  "profile": {
    "saveButton": "Save",     // ❌ Duplicate
    "saveChanges": "Save"     // ❌ Duplicate
  }
}
```

### 5. Handle Interpolated Values

Use placeholders for dynamic content:

```json
{
  "welcome": "Welcome, {name}!",
  "itemsCount": "You have {count} items",
  "retryAfter": "Try again in {minutes} minutes"
}
```

Usage:
```tsx
const t = useTranslations('common');

<p>{t('welcome', { name: user.firstName })}</p>
<p>{t('itemsCount', { count: items.length })}</p>
<p>{t('retryAfter', { minutes: 5 })}</p>
```

### 6. Use `.replace()` for Complex Interpolation

For complex scenarios where next-intl interpolation isn't sufficient:

```tsx
const message = t('retryAfterMinutes').replace('{minutes}', minutes.toString());
```

---

## Implementation Patterns

### Pattern 1: Client Component Translation

```tsx
'use client';
import { useTranslations } from 'next-intl';

interface MyComponentProps {
  'data-testid'?: string;
}

export function MyComponent({ 'data-testid': testId }: MyComponentProps) {
  const t = useTranslations('myNamespace');

  return (
    <div data-testid={testId}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('actionButton')}</button>
    </div>
  );
}
```

### Pattern 2: Form with Validation Messages

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function LoginForm() {
  const tAuth = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setError(tValidation('emailRequired'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(tValidation('emailInvalid'));
      return false;
    }
    setError('');
    return true;
  };

  return (
    <form>
      <label>{tAuth('email')}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => validateEmail(email)}
        placeholder={tAuth('emailPlaceholder')}
      />
      {error && <p className="error">{error}</p>}
      <button>{tAuth('loginButton')}</button>
    </form>
  );
}
```

### Pattern 3: Dynamic Select Options

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function SeveritySelect() {
  const t = useTranslations('allergies');

  return (
    <select>
      <option value="">{t('selectSeverity')}</option>
      <option value="mild">{t('severityMild')}</option>
      <option value="moderate">{t('severityModerate')}</option>
      <option value="severe">{t('severitySevere')}</option>
    </select>
  );
}
```

Translation file:
```json
{
  "allergies": {
    "selectSeverity": "Select severity",
    "severityMild": "Mild",
    "severityModerate": "Moderate",
    "severitySevere": "Severe"
  }
}
```

### Pattern 4: Error Handling

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function DataFetcher() {
  const tErrors = useTranslations('errors');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      setError(tErrors('networkError'));
    }
  };

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchData}>{tErrors('retry')}</button>
      </div>
    );
  }

  return <div>...</div>;
}
```

---

## Common Scenarios

### Scenario 1: Dates and Times

Use `Intl.DateTimeFormat` with locale:

```tsx
'use client';
import { useLocale } from 'next-intl';

export function DateDisplay({ date }: { date: string }) {
  const locale = useLocale();

  const formatted = new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return <span>{formatted}</span>;
}
```

### Scenario 2: Currency

```tsx
'use client';
import { useLocale } from 'next-intl';

export function PriceDisplay({ amount }: { amount: number }) {
  const locale = useLocale();

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'COP' // Colombian Peso
  }).format(amount);

  return <span>{formatted}</span>;
}
```

### Scenario 3: Pluralization

Use next-intl's rich text formatting:

```json
{
  "itemsCount": "{count, plural, =0 {No items} one {# item} other {# items}}"
}
```

```tsx
<p>{t('itemsCount', { count: items.length })}</p>
```

### Scenario 4: Links and Rich Text

For text with embedded links:

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function LegalText() {
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');

  return (
    <p>
      {tAuth('legalAcceptance')}{' '}
      <a href="/terms">{tCommon('termsAndConditions')}</a>
      {' '}{tCommon('and')}{' '}
      <a href="/privacy">{tCommon('privacyPolicy')}</a>
    </p>
  );
}
```

Result in English: "By logging in, you accept our Terms and Conditions and Privacy Policy"
Result in Spanish: "Al iniciar sesión, aceptas nuestros Términos y Condiciones y Política de Privacidad"

### Scenario 5: Loading States

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function LoadingButton({ isLoading }: { isLoading: boolean }) {
  const t = useTranslations('common');

  return (
    <button disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner />
          {t('loading')}
        </>
      ) : (
        t('save')
      )}
    </button>
  );
}
```

---

## Testing Guidelines

### Pre-Deployment Checklist

1. **Test Both Locales**
   - Visit `/es/[page]` - verify all Spanish text displays correctly
   - Visit `/en/[page]` - verify all English text displays correctly

2. **Language Switcher**
   - Click language switcher on each page
   - Verify state persists across navigation
   - Check URL updates to correct locale

3. **Forms and Validation**
   - Submit forms with errors
   - Verify validation messages appear in correct language
   - Check error states in both languages

4. **Edge Cases**
   - Missing translation keys (should show key name or fallback)
   - Long text (verify UI doesn't break)
   - Special characters (ñ, á, é, í, ó, ú, ü)

### Browser Testing

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)
- Mobile browsers

### Console Warnings

Watch for next-intl warnings:
```
⚠️ Missing translation key: auth.missingKey
```

Fix by adding the key to translation files.

---

## Code Review Checklist

### For Reviewers

When reviewing PRs, verify:

- [ ] No hardcoded Spanish or English strings in JSX
- [ ] All client components using translations have `'use client'` directive
- [ ] `useTranslations` imported from `next-intl`
- [ ] Translation keys follow camelCase naming convention
- [ ] All translation keys exist in **both** `en.json` and `es.json`
- [ ] Translations are in correct namespace
- [ ] No duplicate translation keys across namespaces
- [ ] Placeholders used correctly for dynamic content
- [ ] Date/time/currency formatting uses proper locale
- [ ] No console warnings about missing keys

### For Developers

Before submitting PR:

- [ ] Test page in both `/es` and `/en` routes
- [ ] Add translation keys to both language files
- [ ] Run `npm run type-check` to verify no TypeScript errors
- [ ] Check browser console for translation warnings
- [ ] Verify language switcher works on your pages
- [ ] Update this guide if introducing new patterns

---

## Troubleshooting

### Issue: "Missing translation key" warning

**Problem:** Console shows `Missing translation key: auth.loginTitle`

**Solution:**
1. Check if key exists in translation file
2. Verify spelling matches exactly
3. Ensure key exists in both `en.json` and `es.json`

### Issue: Translation not updating

**Problem:** Changed translation file but text doesn't update

**Solution:**
1. Restart development server (`npm run dev`)
2. Clear Next.js cache: `rm -rf .next`
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

### Issue: "useTranslations is not a function"

**Problem:** Hook not working in component

**Solution:**
1. Add `'use client'` directive at top of file
2. Import from correct package: `next-intl` (not `next-intl/server`)
3. Ensure component is not async (use `getTranslations` for server components)

### Issue: Metadata exports error in client component

**Problem:** "Attempted to call metadata() from the server but metadata is on the client"

**Solution:**
Move metadata to the parent page.tsx (server component):

```tsx
// app/[locale]/mypage/page.tsx (SERVER COMPONENT)
export const metadata = { title: 'My Page' };

export default function Page() {
  return <MyClientComponent />;
}

// components/MyClientComponent.tsx (CLIENT COMPONENT)
'use client';
export function MyClientComponent() {
  const t = useTranslations();
  // ...
}
```

### Issue: Language switcher not persisting

**Problem:** Language resets on navigation

**Solution:**
Verify middleware is configured correctly in `middleware.ts` and uses `localePrefix: 'always'`.

---

## Additional Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js 15 Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

---

## Changelog

### Version 1.0 - October 2025
- Initial guide creation
- Documented current setup (Spanish/English)
- Added best practices and common patterns
- Established code review checklist

---

**Questions or suggestions?** Update this guide and submit a PR.
