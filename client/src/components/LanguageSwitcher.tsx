import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, Language, getLocalizedPath } from '@/lib/i18n';
import { useLocation } from 'wouter';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLanguageChange = (language: Language) => {
    try {
      setLanguage(language);
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLangName = SUPPORTED_LANGUAGES[currentLanguage]?.nativeName || 'English';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10"
        title="Change language"
        aria-label="Language selector"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLangName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden">
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, { name, nativeName }]) => {
            const language = code as Language;
            const isActive = language === currentLanguage;

            return (
              <button
                key={code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-primary/5'
                }`}
                title={`Switch to ${name}`}
              >
                <div>
                  <div className="font-semibold">{nativeName}</div>
                  <div className="text-xs text-muted-foreground">{name}</div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
