// hreflang Tag Generator for International SEO
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './i18n';

export interface HrefLangConfig {
  currentPath: string;
  currentLanguage: Language;
  baseUrl: string;
}

/**
 * Generates hreflang link tags for a given page
 * Helps search engines understand language and regional variants
 */
export function generateHrefLangTags(config: HrefLangConfig): string {
  const { currentPath, currentLanguage, baseUrl } = config;
  
  // Remove language prefix from path for consistency
  const pathWithoutLang = currentPath.replace(new RegExp(`^/(${Object.keys(SUPPORTED_LANGUAGES).join('|')})`), '') || '/';
  
  const tags: string[] = [];
  
  // Add tags for all supported languages
  Object.keys(SUPPORTED_LANGUAGES).forEach((lang) => {
    const language = lang as Language;
    let url = baseUrl;
    
    if (language === DEFAULT_LANGUAGE) {
      url += pathWithoutLang;
    } else {
      url += `/${language}${pathWithoutLang}`;
    }
    
    tags.push(`<link rel="alternate" hreflang="${language}" href="${url}" />`);
  });
  
  // Add x-default for unspecified languages
  tags.push(`<link rel="alternate" hreflang="x-default" href="${baseUrl}${pathWithoutLang}" />`);
  
  return tags.join('\n    ');
}

/**
 * Generates hreflang XML for sitemap
 */
export function generateHrefLangSitemapEntries(
  basePath: string,
  baseUrl: string,
  languages: Language[] = Object.keys(SUPPORTED_LANGUAGES) as Language[]
): string {
  const entries: string[] = [];
  
  languages.forEach((lang) => {
    let url = baseUrl;
    if (lang !== DEFAULT_LANGUAGE) {
      url += `/${lang}`;
    }
    url += basePath;
    
    entries.push(`  <url>`);
    entries.push(`    <loc>${url}</loc>`);
    
    // Add hreflang links within the URL entry
    languages.forEach((altLang) => {
      let altUrl = baseUrl;
      if (altLang !== DEFAULT_LANGUAGE) {
        altUrl += `/${altLang}`;
      }
      altUrl += basePath;
      
      entries.push(`    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`);
    });
    
    entries.push(`  </url>`);
  });
  
  return entries.join('\n');
}

/**
 * Generates meta tags for language targeting
 */
export function generateLanguageMeta(language: Language): Record<string, string> {
  return {
    'og:locale': getLocaleCode(language),
    'og:locale:alternate': Object.keys(SUPPORTED_LANGUAGES)
      .filter(l => l !== language)
      .map(l => getLocaleCode(l as Language))
      .join(', '),
  };
}

/**
 * Converts language code to locale code (e.g., 'es' -> 'es_ES')
 */
function getLocaleCode(language: Language): string {
  const localeMap: Record<Language, string> = {
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
    pt: 'pt_BR',
    ar: 'ar_SA',
    ja: 'ja_JP',
  };
  
  return localeMap[language] || 'en_US';
}

/**
 * Generates canonical URL with proper language handling
 */
export function generateCanonicalUrl(
  currentPath: string,
  currentLanguage: Language,
  baseUrl: string
): string {
  const pathWithoutLang = currentPath.replace(new RegExp(`^/(${Object.keys(SUPPORTED_LANGUAGES).join('|')})`), '') || '/';
  
  let canonicalUrl = baseUrl;
  if (currentLanguage !== DEFAULT_LANGUAGE) {
    canonicalUrl += `/${currentLanguage}`;
  }
  canonicalUrl += pathWithoutLang;
  
  return canonicalUrl;
}
