import { useCallback, useEffect, useState } from 'react';
import {
  categoryTranslations,
  i18n,
  type Language,
  type LocalizedLabel,
  type NavCategory,
  type TranslationKey,
} from '../data/i18n';

/**
 * LANGUAGE.
 *
 * Owns the active language and the three lookup helpers the tree needs. Keeping
 * `document.documentElement.lang` in sync is not cosmetic: it is what tells a screen reader to
 * switch pronunciation rules between English and French. Without it, VoiceOver reads French
 * copy with English phonetics, which is close to unintelligible. WCAG 2.2 AA, SC 3.1.1
 * (Language of Page).
 */
export const useTranslation = () => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /** Look up a UI chrome string. Falls back to the key itself so a miss is visible, not blank. */
  const t = useCallback((key: TranslationKey): string => i18n[lang][key] ?? key, [lang]);

  /** Look up a nav category's display name. The English name stays the lookup key. */
  const tCategory = useCallback(
    (key: NavCategory): string => categoryTranslations[lang][key] ?? key,
    [lang],
  );

  /** Read the active language off a piece of already-localized content. */
  const getLabel = useCallback((obj: LocalizedLabel): string => obj[lang] ?? obj.en, [lang]);

  const toggleLanguage = useCallback(() => setLang((prev) => (prev === 'en' ? 'fr' : 'en')), []);

  return { lang, setLang, toggleLanguage, t, tCategory, getLabel };
};
