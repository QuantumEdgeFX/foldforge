import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, getLanguageFromPath, TRANSLATIONS } from '@/lib/i18n';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from URL on mount
  useEffect(() => {
    try {
      const pathLanguage = getLanguageFromPath(window.location.pathname);
      setCurrentLanguage(pathLanguage);
    } catch (error) {
      console.warn('Failed to detect language from path, using default:', error);
      setCurrentLanguage(DEFAULT_LANGUAGE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update URL when language changes
  const handleSetLanguage = (language: Language) => {
    if (!language || !(language in SUPPORTED_LANGUAGES)) {
      console.warn(`Invalid language: ${language}, using default`);
      setCurrentLanguage(DEFAULT_LANGUAGE);
      return;
    }

    setCurrentLanguage(language);

    // Update URL without page reload
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(new RegExp(`^/(${Object.keys(SUPPORTED_LANGUAGES).join('|')})`), '') || '/';
    
    let newPath = pathWithoutLang;
    if (language !== DEFAULT_LANGUAGE) {
      newPath = `/${language}${pathWithoutLang}`;
    }

    if (newPath !== currentPath) {
      window.history.pushState({ language }, '', newPath);
    }
  };

  // Translation function with fallback
  const t = (key: string): string => {
    try {
      const translation = TRANSLATIONS[currentLanguage]?.[key];
      if (translation) {
        return translation;
      }
      
      // Fallback to English if translation not found
      const englishTranslation = TRANSLATIONS[DEFAULT_LANGUAGE][key];
      if (englishTranslation) {
        console.warn(`Translation missing for key "${key}" in language "${currentLanguage}", using English fallback`);
        return englishTranslation;
      }

      // If no translation found, return the key itself
      console.warn(`Translation key not found: "${key}"`);
      return key;
    } catch (error) {
      console.error(`Error translating key "${key}":`, error);
      return key;
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage: handleSetLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook for just translations
export function useTranslation() {
  const { t, currentLanguage } = useLanguage();
  return { t, currentLanguage };
}
