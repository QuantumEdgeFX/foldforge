import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath } from '@/lib/i18n';

/**
 * Hook to get localized paths based on current language
 * Ensures all links in the app respect the current language context
 */
export function useLocalizedPath() {
  const { currentLanguage } = useLanguage();

  const getPath = (pathname: string): string => {
    try {
      return getLocalizedPath(pathname, currentLanguage);
    } catch (error) {
      console.error('Error getting localized path:', error);
      return pathname;
    }
  };

  return { getPath, currentLanguage };
}
