# Language System Verification Guide

This document provides comprehensive verification steps to ensure the multi-language system is working correctly without any page load issues.

## System Architecture Verification

### 1. LanguageContext Initialization

**What it does:**
- Initializes on app mount
- Detects language from URL pathname
- Sets up translation functions
- Provides language state globally

**Verification steps:**
1. Check `client/src/contexts/LanguageContext.tsx` exists
2. Verify it exports `LanguageProvider` and `useLanguage` hook
3. Confirm error handling with try-catch blocks
4. Check fallback to DEFAULT_LANGUAGE on errors

**Expected behavior:**
- App loads without errors
- Language context is available in all components
- No console errors on initialization

### 2. App.tsx Routing

**What it does:**
- Supports both language-prefixed and default routes
- Renders same components for all language variants
- Maintains backward compatibility with existing routes

**Verification steps:**
1. Check `client/src/App.tsx` has LanguageProvider wrapping everything
2. Verify routes include both `/:lang/*` and default `/*` patterns
3. Confirm language-prefixed routes are checked first
4. Verify catch-all 404 route is last

**Expected behavior:**
- `/` loads Home page
- `/es/` loads Home page with Spanish context
- `/pricing` loads Pricing page
- `/es/pricing` loads Pricing page with Spanish context
- Invalid routes show 404

### 3. i18n Library

**What it does:**
- Provides translation keys and values
- Exports language utilities
- Handles language detection from paths

**Verification steps:**
1. Check `client/src/lib/i18n.ts` has TRANSLATIONS object
2. Verify all supported languages are defined
3. Confirm translation keys exist for all languages
4. Check utility functions are exported

**Expected behavior:**
- All 7 languages are supported
- Translation keys are consistent across languages
- Utility functions work correctly

## Component Integration Verification

### 1. LanguageSwitcher Component

**What it does:**
- Displays current language
- Allows users to switch languages
- Updates URL without page reload

**Verification steps:**
1. Check `client/src/components/LanguageSwitcher.tsx` exists
2. Verify it uses `useLanguage()` hook
3. Confirm dropdown displays all languages
4. Check language switching updates URL

**Expected behavior:**
- Switcher appears in navbar
- Clicking a language changes the URL
- Page doesn't reload
- Current language is highlighted

### 2. Navbar Integration

**What it does:**
- Includes LanguageSwitcher
- Maintains all existing functionality
- Works on desktop and mobile

**Verification steps:**
1. Check `client/src/components/Navbar.tsx` imports LanguageSwitcher
2. Verify LanguageSwitcher is rendered in desktop nav
3. Confirm LanguageSwitcher is in mobile menu
4. Check all links still work

**Expected behavior:**
- Navbar renders without errors
- Language switcher is visible
- All navigation links work
- Mobile menu includes language switcher

### 3. useLocalizedPath Hook

**What it does:**
- Generates language-aware paths
- Respects current language context
- Provides safe error handling

**Verification steps:**
1. Check `client/src/hooks/useLocalizedPath.ts` exists
2. Verify it uses `useLanguage()` hook
3. Confirm it exports `getPath` function
4. Check error handling

**Expected behavior:**
- Hook can be used in any component
- Returns correct localized paths
- Falls back gracefully on errors

## Page Load Testing

### Test 1: Default English Page Load

**Steps:**
1. Navigate to `https://foldforge.app/`
2. Open browser console (F12)
3. Check for any errors or warnings
4. Verify page content loads

**Expected:**
- Page loads successfully
- No console errors
- Language context initialized
- Content displays correctly

### Test 2: Language-Prefixed Page Load

**Steps:**
1. Navigate to `https://foldforge.app/es/`
2. Open browser console
3. Check for errors
4. Verify Spanish context is set

**Expected:**
- Page loads successfully
- No console errors
- currentLanguage is 'es'
- Language switcher shows Spanish as active

### Test 3: Language Switching

**Steps:**
1. Navigate to `https://foldforge.app/`
2. Click language switcher
3. Select Spanish
4. Observe URL and page

**Expected:**
- URL changes to `/es/`
- Page doesn't reload
- Language switcher shows Spanish
- No console errors

### Test 4: Direct Language URL

**Steps:**
1. Navigate to `https://foldforge.app/es/pricing`
2. Check browser console
3. Verify language is detected

**Expected:**
- Page loads successfully
- Language detected as Spanish
- No console errors
- Language switcher shows Spanish

### Test 5: Invalid Language Code

**Steps:**
1. Navigate to `https://foldforge.app/xx/`
2. Check browser console
3. Verify fallback behavior

**Expected:**
- Page loads successfully
- Defaults to English
- Console warning about invalid language
- No page load errors

### Test 6: Nested Routes

**Steps:**
1. Navigate to `https://foldforge.app/es/aureus-prime/showcase`
2. Check page loads
3. Verify language is Spanish

**Expected:**
- Page loads successfully
- Correct component renders
- Language is Spanish
- No console errors

## Error Handling Verification

### Test 1: Missing Translation Key

**Steps:**
1. Add a component that uses `t('nonexistent.key')`
2. Switch to Spanish
3. Check console

**Expected:**
- Falls back to English translation
- Console warning about missing key
- Page doesn't break
- Fallback text displays

### Test 2: Context Not Found

**Steps:**
1. Try using `useLanguage()` outside LanguageProvider
2. Check error message

**Expected:**
- Clear error message
- App doesn't crash
- Error indicates LanguageProvider is needed

### Test 3: URL Parsing Error

**Steps:**
1. Test with malformed URLs
2. Check console

**Expected:**
- Graceful error handling
- Defaults to English
- No page load failures

## Performance Verification

### Test 1: Language Switching Performance

**Steps:**
1. Open DevTools Performance tab
2. Switch languages multiple times
3. Observe performance metrics

**Expected:**
- Language switching is instant
- No noticeable lag
- Minimal re-renders
- No memory leaks

### Test 2: Page Load Performance

**Steps:**
1. Open DevTools Network tab
2. Load language-prefixed page
3. Check load times

**Expected:**
- Same load time as default route
- No extra network requests
- No performance degradation

## Browser Compatibility

### Test 1: Chrome/Chromium

**Steps:**
1. Open in Chrome
2. Test language switching
3. Check console

**Expected:**
- All features work
- No console errors
- Smooth experience

### Test 2: Firefox

**Steps:**
1. Open in Firefox
2. Test language switching
3. Check console

**Expected:**
- All features work
- No console errors
- Smooth experience

### Test 3: Safari

**Steps:**
1. Open in Safari
2. Test language switching
3. Check console

**Expected:**
- All features work
- No console errors
- Smooth experience

## SEO Verification

### Test 1: hreflang Tags

**Steps:**
1. View page source
2. Search for `hreflang`
3. Verify all language variants

**Expected:**
- hreflang tags present for all languages
- Correct URLs
- x-default tag included

### Test 2: Canonical URLs

**Steps:**
1. Check page source for canonical tag
2. Verify it matches current language

**Expected:**
- Canonical tag present
- Correct URL for language
- No duplicate content issues

### Test 3: Sitemap

**Steps:**
1. Check `client/public/sitemap.xml`
2. Verify all language variants
3. Check hreflang entries

**Expected:**
- All pages listed for all languages
- hreflang tags in sitemap
- Valid XML format

## Rollback Procedure

If issues occur, follow these steps:

1. **Check Git status:**
   ```bash
   cd /home/ubuntu/foldforge
   git status
   ```

2. **View recent commits:**
   ```bash
   git log --oneline -10
   ```

3. **Rollback if needed:**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## Troubleshooting

### Issue: Page doesn't load after language change

**Solution:**
1. Check browser console for errors
2. Verify LanguageProvider wraps entire app
3. Check route definitions in App.tsx
4. Verify language code is valid

### Issue: Translations not showing

**Solution:**
1. Check translation key exists in i18n.ts
2. Verify key spelling
3. Check currentLanguage is set correctly
4. Look for console warnings

### Issue: Language switcher not visible

**Solution:**
1. Check LanguageSwitcher is imported in Navbar
2. Verify it's rendered in the JSX
3. Check CSS isn't hiding it
4. Verify LanguageProvider is present

### Issue: URL doesn't update when changing language

**Solution:**
1. Check browser console for errors
2. Verify setLanguage is being called
3. Check window.history.pushState is supported
4. Verify language code is valid

## Checklist for Deployment

- [ ] All routes support both language-prefixed and default versions
- [ ] LanguageProvider wraps entire app
- [ ] LanguageSwitcher appears in navbar
- [ ] No console errors on page load
- [ ] Language switching works without page reload
- [ ] Direct language URLs work correctly
- [ ] Invalid language codes fall back to English
- [ ] Translation keys exist for all languages
- [ ] hreflang tags are in HTML head
- [ ] Sitemap includes all language variants
- [ ] robots.txt allows all language paths
- [ ] SEO meta tags are correct
- [ ] Performance is acceptable
- [ ] All browsers work correctly
- [ ] Error handling is robust

## Support

For additional help:

1. Check `LANGUAGE_INTEGRATION_GUIDE.md` for usage details
2. Review `INTERNATIONAL_SEO_GUIDE.md` for SEO setup
3. Check browser console for specific error messages
4. Review component source code for implementation details
