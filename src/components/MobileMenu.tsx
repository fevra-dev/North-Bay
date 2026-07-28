import { ChevronDown, Moon, Sun, WifiOff } from 'lucide-react';
import type { Language, NavCategory, TranslationKey } from '../data/i18n';
import { navCategories, siteStructure } from '../data/navigation';
import { SearchCombobox } from './SearchCombobox';

interface MobileMenuProps {
  lang: Language;
  toggleLanguage: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLowBandwidth: boolean;
  toggleLowBandwidth: () => void;
  expandedCategory: NavCategory | null;
  toggleCategory: (category: NavCategory) => void;
  t: (key: TranslationKey) => string;
  tCategory: (key: NavCategory) => string;
}

/**
 * MOBILE NAVIGATION — a true accordion, not a drill-down.
 *
 * Tapping a category expands its items in place. There is no separate screen to navigate into
 * and back out of, and everything stays reachable in one continuous scroll. sf.gov moved to the
 * same pattern for the same reason: a drill-down forces the visitor to hold a mental model of
 * where they are in a stack, and the back-out gesture is the most common place people give up.
 *
 * The height is `100dvh` rather than `100vh`. On mobile Safari and Chrome, `100vh` resolves to
 * the viewport height with the browser chrome *hidden*, so a panel sized that way extends
 * behind the address bar and its last item sits permanently offscreen. `dvh` tracks the
 * dynamic viewport and is the unit that actually matches what the visitor can see. The `vh`
 * declaration above it is the fallback for browsers without `dvh` support.
 */
export const MobileMenu = ({
  lang,
  toggleLanguage,
  isDarkMode,
  toggleTheme,
  isLowBandwidth,
  toggleLowBandwidth,
  expandedCategory,
  toggleCategory,
  t,
  tCategory,
}: MobileMenuProps) => (
  <div
    id="mobile-menu-panel"
    className="absolute top-full left-0 w-full bg-white dark:bg-zinc-950 overflow-hidden flex flex-col z-0"
    style={{ height: 'calc(100dvh - 80px)' }}
  >
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
      <div className="p-6 flex flex-col min-h-full animate-in fade-in duration-200">
        {/*
          The same controls the desktop header carries in its icon cluster, given room to
          breathe and a real text label here instead of a cramped icon-only row.

          grid-cols-3, not justify-between: with three unequal-width labels ("Data Saver" is
          much wider than "Dark"), justify-between only equalizes the gaps between items, not
          their centers, so the middle control visibly drifted off-center. Three equal columns
          fixes that outright. Caught on a real mobile viewport, not in the desktop preview.
        */}
        <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-3 items-center justify-items-center">
            <button
              type="button"
              onClick={toggleLowBandwidth}
              aria-pressed={isLowBandwidth}
              className="flex flex-col items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 nb-focus-ring-navy rounded-sm px-1"
            >
              <WifiOff
                size={20}
                className={isLowBandwidth ? 'nb-text-navy dark:text-blue-400' : ''}
                aria-hidden="true"
              />
              {isLowBandwidth ? 'Standard' : 'Data Saver'}
            </button>
            {/*
              lang attribute on the label: "Français" is a French string even while the
              surrounding page is English, and without this a screen reader pronounces it with
              English phonetics. WCAG 2.2 AA, SC 3.1.2 (Language of Parts).
            */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={lang === 'en' ? 'Switch to French' : 'Switch to English'}
              className="flex flex-col items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 nb-focus-ring-navy rounded-sm px-1"
            >
              <span className="text-lg font-black leading-none" aria-hidden="true">
                {lang === 'en' ? 'FR' : 'EN'}
              </span>
              <span lang={lang === 'en' ? 'fr' : 'en'}>
                {lang === 'en' ? 'Français' : 'English'}
              </span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDarkMode}
              className="flex flex-col items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 nb-focus-ring-navy rounded-sm px-1"
            >
              {isDarkMode ? (
                <Moon size={20} aria-hidden="true" />
              ) : (
                <Sun size={20} aria-hidden="true" />
              )}
              {isDarkMode ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <SearchCombobox placeholder={t('searchPrompt')} variant="compact" />
        </div>

        <nav className="flex flex-col">
          {navCategories.map((category) => {
            const isExpanded = expandedCategory === category;
            const panelId = `mobile-accordion-${category.replace(/[^a-zA-Z]/g, '-')}`;
            return (
              <div key={category} className="border-b border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between py-5 text-xl font-bold text-zinc-900 dark:text-zinc-100 text-left transition-colors"
                >
                  {tCategory(category)}
                  <ChevronDown
                    size={20}
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 nb-text-navy dark:text-blue-400' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isExpanded && (
                  <ul id={panelId} className="flex flex-col pb-4 pl-2">
                    {siteStructure[category].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="block py-3 text-base font-medium text-zinc-600 dark:text-zinc-400 nb-hover-text-ink dark:hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  </div>
);
