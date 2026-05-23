# Language Integration Guide

This guide explains how the multi-language system is integrated into FoldForge and how to use it throughout the application.

## Architecture Overview

The language system is built on three main components:

### 1. Language Context (`contexts/LanguageContext.tsx`)

The `LanguageProvider` manages the current language state globally. It automatically detects the language from the URL path on mount and provides:

- **currentLanguage**: The active language code (e.g., 'en', 'es', 'fr')
- **setLanguage(language)**: Function to change the current language
- **t(key)**: Translation function with automatic fallback to English
- **isLoading**: Loading state during initialization

**Features:**
- Automatic language detection from URL pathname
- Safe error handling with console warnings
- Fallback to English if translation key is missing
- URL history management when language changes
- Validation of language codes

### 2. i18n Library (`lib/i18n.ts`)

Core internationalization utilities:

- **SUPPORTED_LANGUAGES**: Map of all supported languages with metadata
- **TRANSLATIONS**: Translation dictionary for all languages
- **getLanguageFromPath()**: Extract language from URL
- **getLocalizedPath()**: Generate language-prefixed URLs
- **t()**: Direct translation function

### 3. Language Switcher Component (`components/LanguageSwitcher.tsx`)

UI component for changing languages:

- Displays current language
- Dropdown menu with all supported languages
- Native language names (e.g., "Español" instead of "Spanish")
- Active language indicator
- Responsive design (desktop and mobile)

## Routing Structure

The application supports both language-prefixed and default English routes:

```
English (default):
  https://foldforge.app/
  https://foldforge.app/pricing
  https://foldforge.app/blog

Spanish:
  https://foldforge.app/es/
  https://foldforge.app/es/pricing
  https://foldforge.app/es/blog

French:
  https://foldforge.app/fr/
  https://foldforge.app/fr/pricing
  https://foldforge.app/fr/blog
```

**Route Matching in App.tsx:**

1. Language-prefixed routes (`/:lang/*`) are checked first
2. Default English routes (`/*`) are checked second
3. Catch-all 404 route handles unmatched paths

This ensures that both `/pricing` and `/es/pricing` work correctly.

## How to Use

### Using the Language Context

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { currentLanguage, setLanguage, t } = useLanguage();

  return (
    <div>
      <p>Current language: {currentLanguage}</p>
      <p>{t('nav.pricing')}</p>
      <button onClick={() => setLanguage('es')}>
        Switch to Spanish
      </button>
    </div>
  );
}
```

### Using the Translation Hook

```tsx
import { useTranslation } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, currentLanguage } = useTranslation();

  return <h1>{t('hero.title')}</h1>;
}
```

### Using Localized Paths

```tsx
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { Link } from 'wouter';

function MyComponent() {
  const { getPath } = useLocalizedPath();

  return (
    <Link href={getPath('/pricing')}>
      Go to Pricing
    </Link>
  );
}
```

### Language Switcher in Components

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

function MyComponent() {
  return (
    <nav>
      <LanguageSwitcher />
    </nav>
  );
}
```

## Adding New Translations

To add new translation keys:

1. **Open `client/src/lib/i18n.ts`**

2. **Add the key to the TRANSLATIONS object for each language:**

```typescript
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // ... existing keys
    'my.new.key': 'English text here',
  },
  es: {
    // ... existing keys
    'my.new.key': 'Texto en español aquí',
  },
  // ... repeat for all languages
};
```

3. **Use in your component:**

```tsx
const { t } = useLanguage();
return <p>{t('my.new.key')}</p>;
```

## Page Load Flow

1. **App mounts** → LanguageProvider initializes
2. **LanguageProvider checks** `window.location.pathname`
3. **Extracts language code** from URL (e.g., `/es/pricing` → `es`)
4. **Sets currentLanguage** state
5. **Router renders** appropriate page component
6. **Components use** `useLanguage()` hook to access translations
7. **User can switch** languages via LanguageSwitcher
8. **URL updates** without page reload using `window.history.pushState`

## Error Handling

The system includes robust error handling:

- **Missing translations**: Falls back to English, logs warning
- **Invalid language codes**: Validates against SUPPORTED_LANGUAGES
- **Path extraction errors**: Defaults to English
- **Context not found**: Throws clear error message
- **URL parsing errors**: Gracefully handles malformed paths

## Performance Considerations

- **Lazy loading**: Translations are loaded synchronously (small JSON object)
- **No API calls**: All translations are bundled with the app
- **Minimal re-renders**: Language changes only re-render affected components
- **URL history**: Uses native browser history API (no extra libraries)

## SEO Considerations

The system automatically handles SEO:

- **hreflang tags**: Implemented in index.html
- **Canonical URLs**: Properly set for each language variant
- **Sitemap**: Includes all language variants with hreflang
- **robots.txt**: Allows crawling of all language paths
- **Meta tags**: Language-specific Open Graph tags

## Testing the Implementation

### Test language switching:
1. Navigate to https://foldforge.app/
2. Click language switcher
3. Select a different language
4. URL should change to `/es/` (or other language)
5. Page content should remain the same (no reload)

### Test direct language URLs:
1. Navigate to https://foldforge.app/es/pricing
2. Language should be detected as Spanish
3. Language switcher should show Spanish as active

### Test fallback:
1. Add a translation key without all languages
2. Switch to a language without that key
3. Should display English version with console warning

## Troubleshooting

### Page doesn't load after language change
- Check browser console for errors
- Verify LanguageProvider wraps entire app in App.tsx
- Ensure all routes have both language-prefixed and default versions

### Translations not showing
- Check translation key exists in i18n.ts
- Verify key is spelled correctly
- Check currentLanguage is set correctly
- Look for console warnings about missing translations

### Language switcher not appearing
- Verify LanguageSwitcher component is imported
- Check it's placed in Navbar component
- Verify LanguageProvider is wrapping the app

### URL not updating when changing language
- Check browser console for errors
- Verify setLanguage is being called
- Check window.history.pushState is working

## Future Enhancements

Potential improvements to the language system:

1. **Server-side rendering**: Add language detection from Accept-Language header
2. **Language persistence**: Save user's language preference to localStorage
3. **Lazy loading**: Load translations on-demand for better performance
4. **RTL support**: Full right-to-left layout support for Arabic
5. **Dynamic translations**: Load translations from CMS or API
6. **Translation management**: Admin panel for managing translations
7. **Language auto-detection**: Detect user's browser language
8. **Regional variants**: Support for regional language variants (e.g., pt-BR, pt-PT)

## Support

For issues or questions about the language system, refer to:

- `INTERNATIONAL_SEO_GUIDE.md` - SEO implementation details
- `IMPLEMENTATION_REQUIREMENTS.md` - Original requirements
- `client/src/lib/i18n.ts` - Core i18n library
- `client/src/contexts/LanguageContext.tsx` - Language state management
