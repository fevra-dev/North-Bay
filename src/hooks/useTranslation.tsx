import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  categoryTranslations,
  i18n,
  type Language,
  type LocalizedLabel,
  type NavCategory,
  type TranslationKey,
} from '../data/i18n';

interface TranslationValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  tCategory: (key: NavCategory) => string;
  getLabel: (obj: LocalizedLabel) => string;
}

const TranslationContext = createContext<TranslationValue | null>(null);

/**
 * LANGUAGE, shared through context rather than passed down by hand.
 *
 * The language is not a prop, it is ambient state: the search box in the header, the nav items in
 * the mega menu, the meeting table's column headings and the footer links all need it, and they
 * sit at completely different depths. Threading `lang` and `getLabel` through every component
 * between them would mean components that do not care about language carrying it anyway.
 *
 * The more pressing reason is correctness. When this was a plain hook, any component that called
 * it got its OWN `useState` — so a second call site would have created a second, independent
 * language that the toggle could not reach. One provider means one source of truth by
 * construction, not by remembering to only call it once.
 *
 * Keeping `document.documentElement.lang` in sync is not cosmetic: it is what tells a screen
 * reader to switch pronunciation rules between English and French. Without it, VoiceOver reads
 * French copy with English phonetics, which is close to unintelligible. WCAG 2.2 AA, SC 3.1.1.
 */
export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<TranslationValue>(() => {
    return {
      lang,
      setLang,
      toggleLanguage: () => setLang((prev) => (prev === 'en' ? 'fr' : 'en')),
      /** UI chrome string. Falls back to the key itself so a miss is visible, not blank. */
      t: (key: TranslationKey) => i18n[lang][key] ?? key,
      /** Nav category display name. The English name stays the lookup key. */
      tCategory: (key: NavCategory) => categoryTranslations[lang][key] ?? key,
      /** Read the active language off a piece of already-localized content. */
      getLabel: (obj: LocalizedLabel) => obj[lang] ?? obj.en,
    };
  }, [lang]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export const useTranslation = (): TranslationValue => {
  const ctx = useContext(TranslationContext);
  // Throwing rather than falling back to English: a component rendered outside the provider
  // would silently show one language while the rest of the page showed another, which is far
  // harder to notice than a build that stops.
  if (!ctx) throw new Error('useTranslation must be used within a TranslationProvider');
  return ctx;
};
