import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath } from '@/lib/i18n';

/**
 * Hook to get localized paths for navigation links
 * Automatically prepends language prefix when needed
 */
export function useLocalizedLink() {
  const { currentLanguage } = useLanguage();

  const getLink = (pathname: string): string => {
    return getLocalizedPath(pathname, currentLanguage);
  };

  return { getLink };
}
