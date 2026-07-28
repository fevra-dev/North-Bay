import { ChevronDown } from 'lucide-react';
import { NORTH_BAY_LOGO_URL } from '../data/branding';
import type { Language, NavCategory, TranslationKey } from '../data/i18n';
import { navCategories } from '../data/navigation';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { SearchCombobox } from './SearchCombobox';
import { UtilityControls } from './UtilityControls';

interface HeaderProps {
  lang: Language;
  toggleLanguage: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLowBandwidth: boolean;
  toggleLowBandwidth: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  activeDesktopNav: NavCategory | null;
  setActiveDesktopNav: (category: NavCategory | null) => void;
  expandedMobileCategory: NavCategory | null;
  toggleMobileCategory: (category: NavCategory) => void;
  /** True once the hero's own search has scrolled out of view. */
  showHeaderSearch: boolean;
  t: (key: TranslationKey) => string;
  tCategory: (key: NavCategory) => string;
}

/**
 * Site header: identity, primary navigation, utility controls, and both menu surfaces.
 *
 * The utility controls (language, theme, data saver) used to occupy a third full-width bar above
 * this one. Three stacked bands meant a phone visitor scrolled past a screen and a half of
 * chrome before reaching a single word of content. They now live in this header's right-side
 * cluster on desktop and inside the mobile panel on small screens.
 */
export const Header = ({
  lang,
  toggleLanguage,
  isDarkMode,
  toggleTheme,
  isLowBandwidth,
  toggleLowBandwidth,
  isMobileMenuOpen,
  toggleMobileMenu,
  activeDesktopNav,
  setActiveDesktopNav,
  expandedMobileCategory,
  toggleMobileCategory,
  showHeaderSearch,
  t,
  tCategory,
}: HeaderProps) => {
  const hasLogo = Boolean(NORTH_BAY_LOGO_URL);

  // When a real logo is present the header turns navy, so every icon and label inside it has to
  // flip to white — not just the logo slot itself.
  const headerFgClass = hasLogo ? 'text-white' : 'text-zinc-900 dark:text-zinc-100';

  return (
    <header
      className={`print:hidden sticky top-0 border-b-2 transition-colors ${
        hasLogo
          ? 'nb-bg-navy dark:bg-blue-950 border-transparent'
          : 'bg-white dark:bg-zinc-900 nb-border-ink dark:border-zinc-700'
      }`}
      style={{ zIndex: 100 }}
      onMouseLeave={() => setActiveDesktopNav(null)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between relative z-10 bg-inherit gap-4">
        <a href="#" className="flex items-center gap-3 shrink-0">
          {hasLogo ? (
            <img src={NORTH_BAY_LOGO_URL} alt={t('title')} className="h-12 w-auto" />
          ) : (
            <span className="flex flex-col group">
              <span className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-0.5">
                {t('cityOfLabel')}
              </span>
              <span className="text-2xl font-black nb-text-navy dark:text-blue-400 tracking-tight leading-none">
                {t('titleShort')}
              </span>
            </span>
          )}
        </a>

        {/*
          Navigation set at text-base rather than text-sm. These four labels are the primary
          wayfinding on the entire site; at 14px against a navy field they read as secondary
          chrome, which is the opposite of their role.
        */}
        <nav className="hidden lg:flex h-full" aria-label="Main">
          {navCategories.map((category) => (
            <button
              type="button"
              key={category}
              onMouseEnter={() => setActiveDesktopNav(category)}
              onFocus={() => setActiveDesktopNav(category)}
              aria-expanded={activeDesktopNav === category}
              aria-haspopup="true"
              className={`px-3 xl:px-5 h-full font-bold text-base whitespace-nowrap flex items-center gap-1.5 transition-colors border-b-4 nb-focus-ring-navy dark:focus-visible:outline dark:focus-visible:outline-2 dark:focus-visible:outline-blue-400 ${headerFgClass} ${
                activeDesktopNav === category
                  ? hasLogo
                    ? 'border-white bg-white/10'
                    : 'nb-border-navy dark:border-blue-400 nb-text-navy dark:text-blue-400 bg-slate-50 dark:bg-zinc-800'
                  : `border-transparent ${
                      hasLogo ? 'hover:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`
              }`}
            >
              {tCategory(category)}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 shrink-0 ${
                  activeDesktopNav === category ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {/*
            PERSISTENT SEARCH.

            Fades in once the hero's own search field has scrolled out of view, so search is
            reachable from anywhere on the page without ever having two identical search boxes
            visible at the same time. `aria-hidden` and `inert`-style tab removal travel with the
            fade: a control that is invisible must not still be a tab stop, or a keyboard user
            lands on a field they cannot see.
          */}
          <div
            className={`hidden lg:block w-64 transition-opacity duration-200 ${
              showHeaderSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!showHeaderSearch}
          >
            <SearchCombobox
              placeholder={t('searchLabel')}
              variant="header"
              disabled={!showHeaderSearch}
            />
          </div>

          <UtilityControls
            lang={lang}
            toggleLanguage={toggleLanguage}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            isLowBandwidth={isLowBandwidth}
            toggleLowBandwidth={toggleLowBandwidth}
            headerFgClass={headerFgClass}
          />

          {/*
            Three lines morphing into an X, built entirely from standard Tailwind spacing
            (gap-1.5 = 6px, translate-y-2 = 8px) chosen so the geometry lines up exactly without
            a single arbitrary bracket value. The point is not "animation good" — it is that
            every value here is one the build is guaranteed to generate.
          */}
          <button
            type="button"
            className={`lg:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none focus-visible:ring-2 nb-focus-ring-navy focus-visible:ring-offset-2 rounded-sm ${headerFgClass}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu-panel"
          >
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {activeDesktopNav && (
        <MegaMenu category={activeDesktopNav} categoryLabel={tCategory(activeDesktopNav)} />
      )}

      {isMobileMenuOpen && (
        <MobileMenu
          lang={lang}
          toggleLanguage={toggleLanguage}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isLowBandwidth={isLowBandwidth}
          toggleLowBandwidth={toggleLowBandwidth}
          expandedCategory={expandedMobileCategory}
          toggleCategory={toggleMobileCategory}
          t={t}
          tCategory={tCategory}
        />
      )}
    </header>
  );
};
