import { ChevronDown, Search, UserCircle } from 'lucide-react';
import { NORTH_BAY_LOGO_URL } from '../data/branding';
import type { Language, NavCategory, TranslationKey } from '../data/i18n';
import { navCategories } from '../data/navigation';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
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
  onJumpToSearch: () => void;
  t: (key: TranslationKey) => string;
  tCategory: (key: NavCategory) => string;
}

/**
 * Site header: identity, primary navigation, utility controls, and both menu surfaces.
 *
 * The utility controls (language, theme, data saver, account) used to occupy a third
 * full-width bar above this one. Three stacked bands meant a phone visitor scrolled past a
 * screen and a half of chrome before reaching a single word of content. They now live in this
 * header's right-side cluster on desktop and inside the mobile panel on small screens.
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
  onJumpToSearch,
  t,
  tCategory,
}: HeaderProps) => {
  const hasLogo = Boolean(NORTH_BAY_LOGO_URL);

  // When a real logo is present the header turns navy, so every icon and label inside it has
  // to flip to white — not just the logo slot itself.
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
        {hasLogo ? (
          <a href="#" className="flex items-center gap-3 shrink-0">
            <img src={NORTH_BAY_LOGO_URL} alt={t('title')} className="h-12 w-auto" />
          </a>
        ) : (
          <a href="#" className="flex flex-col group shrink-0">
            <span className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-0.5">
              {t('cityOfLabel')}
            </span>
            <span className="text-2xl font-black nb-text-navy dark:text-blue-400 tracking-tight leading-none nb-group-hover-ink dark:group-hover:text-white dark:group-active:text-white transition-colors">
              {t('titleShort')}
            </span>
          </a>
        )}

        <nav className="hidden lg:flex h-full" aria-label="Main">
          {navCategories.map((category) => (
            <button
              type="button"
              key={category}
              onMouseEnter={() => setActiveDesktopNav(category)}
              onFocus={() => setActiveDesktopNav(category)}
              aria-expanded={activeDesktopNav === category}
              aria-haspopup="true"
              className={`px-4 xl:px-6 h-full font-bold text-sm flex items-center gap-1.5 transition-colors border-b-4 nb-focus-ring-navy dark:focus-visible:outline dark:focus-visible:outline-2 dark:focus-visible:outline-blue-400 ${headerFgClass} ${
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
                className={`transition-transform duration-200 ${
                  activeDesktopNav === category ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <UtilityControls
            lang={lang}
            toggleLanguage={toggleLanguage}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            isLowBandwidth={isLowBandwidth}
            toggleLowBandwidth={toggleLowBandwidth}
            headerFgClass={headerFgClass}
          />

          <button
            type="button"
            aria-label="Jump to search"
            onClick={onJumpToSearch}
            className={`hidden lg:flex items-center justify-center w-10 h-10 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 nb-focus-ring-navy ${headerFgClass} ${
              hasLogo ? 'hover:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Search size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`hidden lg:flex items-center gap-1.5 text-white nb-bg-navy dark:bg-blue-600 px-4 h-10 text-sm font-bold nb-hover-navy-dark dark:hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 nb-focus-ring-navy ${
              hasLogo ? 'border border-white/30' : ''
            }`}
          >
            <UserCircle size={16} aria-hidden="true" /> {t('sso')}
          </button>

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
