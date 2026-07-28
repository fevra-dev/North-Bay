import { Moon, Sun, WifiOff } from 'lucide-react';
import { NORTH_BAY_LOGO_URL } from '../data/branding';
import type { Language } from '../data/i18n';

export interface UtilityControlsProps {
  lang: Language;
  toggleLanguage: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLowBandwidth: boolean;
  toggleLowBandwidth: () => void;
  /** Tailwind classes for foreground color, which depends on whether the header is navy. */
  headerFgClass?: string;
}

/**
 * Language, theme, and data-saver controls.
 *
 * These were originally a third full-width utility bar stacked above the header, which meant
 * three horizontal bands before any actual content appeared. Folded into the header's own
 * right-side cluster on desktop, and into the mobile menu panel on small screens, that is down
 * to two — the change that recovers the most vertical space above the fold on a phone.
 *
 * Every control is a real `<button>` with `aria-pressed` where it toggles state, so its current
 * value is announced rather than inferred from an icon.
 */
export const UtilityControls = ({
  lang,
  toggleLanguage,
  isDarkMode,
  toggleTheme,
  isLowBandwidth,
  toggleLowBandwidth,
  headerFgClass = '',
}: UtilityControlsProps) => {
  const hasLogo = Boolean(NORTH_BAY_LOGO_URL);
  const buttonBase = `flex items-center justify-center w-9 h-9 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 nb-focus-ring-navy ${
    hasLogo ? 'hover:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
  }`;

  // No divider rule here any more. There used to be one on the right, separating this cluster
  // from the "My North Bay" button; with that button gone it was a line with nothing on the far
  // side of it. The gap between controls already does the separating.
  return (
    <div className="hidden lg:flex items-center gap-1">
      <button
        type="button"
        onClick={toggleLowBandwidth}
        aria-pressed={isLowBandwidth}
        aria-label={isLowBandwidth ? 'Switch to standard mode' : 'Switch to data saver mode'}
        title={isLowBandwidth ? 'Standard Mode' : 'Data Saver Mode'}
        className={buttonBase}
      >
        <WifiOff
          size={16}
          className={isLowBandwidth && !hasLogo ? 'nb-text-navy dark:text-blue-400' : headerFgClass}
          aria-hidden="true"
        />
      </button>

      {/*
        The language toggle reads "FR" / "EN" rather than showing a globe.

        A globe icon says "language settings exist somewhere in here" and needs a hover or a
        click to reveal which language it would switch to. Two letters say exactly what happens,
        and — on a bilingual municipal site where a francophone resident is scanning for the one
        control that matters most to them — they are recognizable at a glance without parsing an
        icon at all. The `lang` attribute is set because "FR" is a French-language string sitting
        in an English page: without it a screen reader spells it with English phonetics.
      */}
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label={lang === 'en' ? 'Switch to French' : 'Switch to English'}
        title={lang === 'en' ? 'Français' : 'English'}
        className={`flex items-center justify-center min-w-9 h-9 px-2 rounded-sm text-sm font-black tracking-wide transition-colors focus:outline-none focus-visible:ring-2 nb-focus-ring-navy ${headerFgClass} ${
          hasLogo ? 'hover:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
      >
        <span lang={lang === 'en' ? 'fr' : 'en'} aria-hidden="true">
          {lang === 'en' ? 'FR' : 'EN'}
        </span>
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        className={`${buttonBase} ${headerFgClass}`}
      >
        {isDarkMode ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
      </button>
    </div>
  );
};
