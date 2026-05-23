// Internationalization (i18n) Configuration
export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ar' | 'ja';

export const SUPPORTED_LANGUAGES: Record<Language, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  ja: { name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
};

export const DEFAULT_LANGUAGE: Language = 'en';

// Language-specific content and translations
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.pricing': 'Pricing',
    'nav.studio': 'Studio',
    'nav.docs': 'Docs',
    'nav.blog': 'Blog',
    'nav.support': 'Support',
    'hero.title': 'Stop Guessing. Start Validating.',
    'hero.subtitle': 'The #1 EA Stress Testing Studio for MetaTrader 5',
    'hero.description': 'Pass any prop firm challenge with institutional-grade Monte Carlo simulations and real broker data sync.',
    'cta.start_trial': 'Start Free Trial',
    'cta.learn_more': 'Learn More',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.pricing': 'Precios',
    'nav.studio': 'Estudio',
    'nav.docs': 'Documentación',
    'nav.blog': 'Blog',
    'nav.support': 'Soporte',
    'hero.title': 'Deja de Adivinar. Comienza a Validar.',
    'hero.subtitle': 'El #1 Estudio de Prueba de Estrés de EA para MetaTrader 5',
    'hero.description': 'Supera cualquier desafío de empresa de propiedad con simulaciones de Monte Carlo de grado institucional y sincronización de datos de bróker en tiempo real.',
    'cta.start_trial': 'Comenzar Prueba Gratuita',
    'cta.learn_more': 'Más Información',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.pricing': 'Tarification',
    'nav.studio': 'Studio',
    'nav.docs': 'Documentation',
    'nav.blog': 'Blog',
    'nav.support': 'Support',
    'hero.title': 'Arrêtez de Deviner. Commencez à Valider.',
    'hero.subtitle': 'Le #1 Studio de Test de Stress EA pour MetaTrader 5',
    'hero.description': 'Réussissez n\'importe quel défi de société de trading avec des simulations Monte Carlo de qualité institutionnelle et la synchronisation des données de courtier en temps réel.',
    'cta.start_trial': 'Commencer l\'Essai Gratuit',
    'cta.learn_more': 'En Savoir Plus',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.pricing': 'Preise',
    'nav.studio': 'Studio',
    'nav.docs': 'Dokumentation',
    'nav.blog': 'Blog',
    'nav.support': 'Unterstützung',
    'hero.title': 'Hören Sie auf zu Raten. Beginnen Sie zu Validieren.',
    'hero.subtitle': 'Das #1 EA-Stresstesttudio für MetaTrader 5',
    'hero.description': 'Bestehen Sie jede Prop-Firm-Herausforderung mit institutionellen Monte-Carlo-Simulationen und Echtzeit-Brokerdatensynchronisierung.',
    'cta.start_trial': 'Kostenlose Testversion Starten',
    'cta.learn_more': 'Mehr Erfahren',
  },
  pt: {
    'nav.home': 'Início',
    'nav.pricing': 'Preços',
    'nav.studio': 'Estúdio',
    'nav.docs': 'Documentação',
    'nav.blog': 'Blog',
    'nav.support': 'Suporte',
    'hero.title': 'Pare de Adivinhar. Comece a Validar.',
    'hero.subtitle': 'O #1 Estúdio de Teste de Estresse de EA para MetaTrader 5',
    'hero.description': 'Passe em qualquer desafio de corretora proprietária com simulações de Monte Carlo de qualidade institucional e sincronização de dados de corretora em tempo real.',
    'cta.start_trial': 'Iniciar Avaliação Gratuita',
    'cta.learn_more': 'Saiba Mais',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.pricing': 'الأسعار',
    'nav.studio': 'الاستوديو',
    'nav.docs': 'التوثيق',
    'nav.blog': 'المدونة',
    'nav.support': 'الدعم',
    'hero.title': 'توقف عن التخمين. ابدأ التحقق.',
    'hero.subtitle': 'أفضل استوديو اختبار إجهاد EA لـ MetaTrader 5',
    'hero.description': 'اجتز أي تحدي شركة تداول مع محاكاة مونت كارلو من الدرجة المؤسسية ومزامنة بيانات الوسيط في الوقت الفعلي.',
    'cta.start_trial': 'ابدأ النسخة التجريبية المجانية',
    'cta.learn_more': 'اعرف المزيد',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.pricing': '価格',
    'nav.studio': 'スタジオ',
    'nav.docs': 'ドキュメント',
    'nav.blog': 'ブログ',
    'nav.support': 'サポート',
    'hero.title': '推測をやめて。検証を開始してください。',
    'hero.subtitle': 'MetaTrader 5用#1 EAストレステストスタジオ',
    'hero.description': '機関投資家向けのモンテカルロシミュレーションとリアルタイムのブローカーデータ同期を使用して、プロップファーム チャレンジを突破します。',
    'cta.start_trial': '無料トライアルを開始',
    'cta.learn_more': 'もっと詳しく',
  },
};

export function getLanguageFromPath(pathname: string): Language {
  const segments = pathname.split('/').filter(Boolean);
  const potentialLang = segments[0] as Language;
  
  if (potentialLang && potentialLang in SUPPORTED_LANGUAGES) {
    return potentialLang;
  }
  
  return DEFAULT_LANGUAGE;
}

export function getPathWithoutLanguage(pathname: string): string {
  const lang = getLanguageFromPath(pathname);
  if (lang === DEFAULT_LANGUAGE) {
    return pathname;
  }
  return pathname.replace(new RegExp(`^/${lang}`), '') || '/';
}

export function getLocalizedPath(pathname: string, language: Language): string {
  const pathWithoutLang = getPathWithoutLanguage(pathname);
  
  if (language === DEFAULT_LANGUAGE) {
    return pathWithoutLang;
  }
  
  return `/${language}${pathWithoutLang}`;
}

export function t(key: string, language: Language = DEFAULT_LANGUAGE): string {
  return TRANSLATIONS[language]?.[key] || TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;
}
