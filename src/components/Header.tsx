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
      {/*
        `min-w-0` on the row and on the nav below it. Without it a flex child refuses to shrink
        below its content width, and since the nav items are `whitespace-nowrap` that content
        width is whatever the longest label happens to be — so the header simply overflowed the
        page. In French it did: "Services et paiements", "Administration municipale" and "Notre
        communauté" are roughly 40% longer than their English equivalents, and the row pushed
        past the viewport and forced the whole page to scroll sideways.

        The lesson generalises past this one bug: any layout sized around English label lengths
        is a layout that breaks the moment it is translated, and on a bilingual municipal site
        that is not an edge case. Sizes below step down at `lg` and back up at `xl` so the row
        fits the longer language at every desktop width rather than only the shorter one.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between relative z-10 bg-inherit gap-2 xl:gap-4 min-w-0">
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
        {/*
          `shrink-0`, deliberately not `min-w-0`.

          Letting this shrink was the bug. A flex child with `min-w-0` will happily size below
          its content, and because the buttons inside are `whitespace-nowrap` they kept their
          full width and spilled straight out of the box — 41px past it in English, 168px in
          French — landing on top of the search field beside them. The page itself never
          scrolled, so an overflow check on the header row saw nothing wrong while the two
          controls visibly overlapped.

          The nav is now incompressible and the search beside it is the flexible element, so
          when space runs short the search gives way instead of the navigation being overrun.
        */}
        <nav className="hidden lg:flex h-full shrink-0" aria-label="Main">
          {navCategories.map((category) => (
            <button
              type="button"
              key={category}
              onMouseEnter={() => setActiveDesktopNav(category)}
              onFocus={() => setActiveDesktopNav(category)}
              aria-expanded={activeDesktopNav === category}
              aria-haspopup="true"
              className={`px-2 xl:px-4 h-full font-bold text-[13px] xl:text-base whitespace-nowrap flex items-center gap-1 transition-colors border-b-4 nb-focus-ring-navy dark:focus-visible:outline dark:focus-visible:outline-2 dark:focus-visible:outline-blue-400 ${headerFgClass} ${
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

        {/*
          PERSISTENT SEARCH.

          Fades in once the hero's own search field has scrolled out of view, so search is
          reachable from anywhere on the page without ever having two identical search boxes
          visible at once. `aria-hidden` and tab removal travel with the fade: a control that is
          invisible must not still be a tab stop, or a keyboard user lands on a field they
          cannot see.

          It sits as its own flex child rather than inside the fixed right-hand cluster, and it
          is the only compressible element in the row (`flex-1 min-w-0`). That ordering is what
          keeps it from being run over: when the row is tight the search gives way, instead of
          the navigation spilling out of its box and landing on top of it.

          `xl` rather than `lg` because between 1024 and 1280 the nav needs the whole row in
          French. Search is still reachable there — the hero field is a scroll away and the
          mobile menu carries its own.
        */}
        <div
          className={`hidden xl:block flex-1 min-w-0 max-w-56 mx-3 transition-opacity duration-200 ${
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

        <div className="flex items-center gap-2 shrink-0">
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
