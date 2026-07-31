import { ChevronDown, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NORTH_BAY_LOGO_URL } from '../data/branding';
import type { Language, NavCategory, TranslationKey } from '../data/i18n';
import { navCategories } from '../data/navigation';
import { MEGA_MENU_ID, MegaMenu } from './MegaMenu';
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

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const megaPanelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef(new Map<NavCategory, HTMLButtonElement>());

  /*
    THE PANEL IS SIX TAB STOPS FROM THE BUTTON THAT OPENS IT.

    Measured, on the deployed site: open "Services & Payments" and the next six stops are the
    three remaining nav buttons, the search toggle, the language toggle and the theme toggle.
    Only then do the links you just asked for arrive. The menu was operable the whole time and
    behaved correctly by every assertion in the suite — it was simply nowhere near where a
    keyboard user would look for it.

    The APG's disclosure pattern puts the panel immediately after its button in the DOM, which
    is not available here: the panel spans the viewport and the trigger sits inside a `max-w-7xl`
    row, so reparenting it collapses the full-bleed layout. The compensation is to bridge the gap
    explicitly — Tab off an open trigger enters the panel, Shift+Tab off its first link comes
    back — so the two are adjacent in practice even though the DOM cannot make them adjacent.

    Forward exit past the last link is deliberately left to the browser rather than trapped. This
    is a disclosure, not a dialog: nothing here justifies holding focus captive, and `onBlur`
    below closes the panel when focus genuinely leaves it.
  */
  const panelFocusables = () =>
    megaPanelRef.current
      ? [...megaPanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
      : [];

  const onTriggerKeyDown = (e: React.KeyboardEvent, category: NavCategory) => {
    if (e.key !== 'Tab' || e.shiftKey || activeDesktopNav !== category) return;
    const first = panelFocusables()[0];
    if (!first) return;
    e.preventDefault();
    first.focus();
  };

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !e.shiftKey || !activeDesktopNav) return;
    const items = panelFocusables();
    if (items.length === 0 || document.activeElement !== items[0]) return;
    e.preventDefault();
    triggerRefs.current.get(activeDesktopNav)?.focus();
  };

  /*
    Close when focus leaves for good. `relatedTarget` is the element receiving focus, so this can
    tell "tabbed out of the menu entirely" from "moved between two links inside it" — the nav
    itself is excluded too, otherwise Shift+Tab back to the trigger would close the panel it just
    returned to. A null `relatedTarget` means focus left the document (the browser chrome, another
    window), which is not a reason to collapse anything.
  */
  const onPanelBlur = (e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (!next) return;
    if (megaPanelRef.current?.contains(next) || navRef.current?.contains(next)) return;
    setActiveDesktopNav(null);
  };

  const closeSearch = useCallback(() => {
    setIsSearchExpanded(false);
    // Return focus to the control that opened it. Without this, closing drops focus onto <body>
    // and a keyboard user restarts from the top of the document.
    searchToggleRef.current?.focus();
  }, []);

  // Move focus into the field as it opens. A search control that has to be clicked twice — once
  // to reveal it, once to focus it — is slower than the field it replaced.
  useEffect(() => {
    if (!isSearchExpanded) return;
    const raf = requestAnimationFrame(() => {
      searchPanelRef.current?.querySelector('input')?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [isSearchExpanded]);

  // Escape closes it, and so does the search scrolling back out of relevance.
  useEffect(() => {
    if (!isSearchExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isSearchExpanded, closeSearch]);

  useEffect(() => {
    if (!showHeaderSearch) setIsSearchExpanded(false);
  }, [showHeaderSearch]);

  /*
    A click-opened menu needs a way out that is not the button that opened it. Escape is handled
    centrally in App; this closes on a click anywhere outside the header.

    `mousedown` rather than `click`: a click that begins outside the panel and ends inside it —
    a text selection dragged out of the menu, a slightly wandering pointer — would otherwise
    dismiss the thing the person is reading. `touchstart` alongside it, because iOS does not
    reliably emit a `mousedown` for a tap on a non-interactive area.
  */
  useEffect(() => {
    if (!activeDesktopNav) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const header = headerRef.current;
      if (!header || !(e.target instanceof Node)) return;
      if (!header.contains(e.target)) setActiveDesktopNav(null);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [activeDesktopNav, setActiveDesktopNav]);

  return (
    <header
      ref={headerRef}
      className={`print:hidden sticky top-0 border-b-2 transition-colors nb-sticky-header ${
        hasLogo
          ? 'nb-bg-navy dark:bg-blue-950 border-transparent'
          : 'bg-white dark:bg-zinc-900 nb-border-ink dark:border-zinc-700'
      }`}
      style={{ zIndex: 100 }}
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
        {/*
          CLICK TO OPEN, NOT HOVER.

          This opened on `onMouseEnter` and `onFocus`, which is the more common pattern and the
          worse one on both counts.

          `onFocus` was the sharper problem: a keyboard user tabbing across the header opened
          every menu in turn, each one dumping fifteen links into the tab order they then had to
          walk out of. Nobody asked for any of them. The WAI-ARIA Authoring Practices' disclosure
          navigation pattern is explicit that these toggle on activation — click or Enter — for
          exactly this reason.

          Hover-to-open also has no equivalent on a touch screen, degrades badly for anyone with a
          tremor or using a head pointer who crosses the nav on the way somewhere else, and puts
          the site on the wrong side of SC 3.2.1 (On Focus) by changing context on focus alone.

          `aria-haspopup` is gone with it. It announces a menu widget — the `role="menu"` keyboard
          model with arrow-key traversal — and this is a disclosure containing ordinary links.
          Claiming the wrong widget tells a screen-reader user to expect interactions that do not
          exist. `aria-expanded` alone is the correct and complete contract here.
        */}
        <nav className="hidden lg:flex h-full shrink-0" aria-label="Main" ref={navRef}>
          {navCategories.map((category) => (
            <button
              type="button"
              key={category}
              ref={(el) => {
                if (el) triggerRefs.current.set(category, el);
                else triggerRefs.current.delete(category);
              }}
              onClick={() => setActiveDesktopNav(activeDesktopNav === category ? null : category)}
              onKeyDown={(e) => onTriggerKeyDown(e, category)}
              aria-expanded={activeDesktopNav === category}
              /*
                `aria-controls` is set only while the panel exists. The panel is unmounted when
                closed, and an IDREF pointing at nothing is an ARIA error — it promises assistive
                technology a target it will fail to find. Naming it only when it is real is both
                valid and honest; `aria-expanded` already carries the state on its own.
              */
              aria-controls={activeDesktopNav === category ? MEGA_MENU_ID : undefined}
              className={`px-2 xl:px-4 h-full font-bold text-[13px] xl:text-base whitespace-nowrap flex items-center gap-1 transition-colors border-b-4 nb-focus-ring-navy dark:focus-visible:outline dark:focus-visible:outline-2 dark:focus-visible:outline-blue-400 ${
                activeDesktopNav === category
                  ? hasLogo
                    ? // The open item becomes a tab continuous with the panel below it. It used to
                      // keep the navy fill and mark itself with a 4px white underline — which,
                      // sitting directly on top of a white panel, merged into it and read as the
                      // header's bottom edge deforming under that one item rather than as an
                      // indicator. Measured: white began 4px higher over the active item than
                      // anywhere else along the header.
                      //
                      // The background must track MegaMenu's own `bg-white dark:bg-zinc-900`. A
                      // white tab above a zinc-900 panel is not a tab, it is a floating block.
                      'border-transparent bg-white dark:bg-zinc-900 nb-text-navy dark:text-white'
                    : 'nb-border-navy dark:border-blue-400 nb-text-navy dark:text-blue-400 bg-slate-50 dark:bg-zinc-800'
                  : // `headerFgClass` belongs to this branch alone, and that is load-bearing
                    // rather than tidy. It resolves to `text-white` over the navy header — a
                    // Tailwind utility — while `nb-text-navy` is a component class (adr/0003).
                    // Applied to every item unconditionally it outranked the active item's own
                    // colour and rendered it white on white: measured at 1.00:1, invisible in
                    // both themes. Mutually exclusive states, not an override hoping to win.
                    `${headerFgClass} border-transparent ${
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
            PERSISTENT SEARCH, as a toggle rather than a permanently open field.

            An always-visible field cannot work on a bilingual site. Sized to fit the English nav
            it left no room for the French one — "Administration municipale" and "Notre
            communauté" are far longer than their English equivalents — and sized to fit French
            it was too narrow to type into. Making it flexible only moved the failure: it
            collapsed to an unusable sliver at exactly the widths where French needs the space.

            A toggle removes the conflict entirely. The button is a fixed 40px square in every
            language, and the field it opens spans the header rather than competing with the nav
            for a share of one row. This is also what the City's own site does, and what most
            government sites converge on, for the same reason.
          */}
          {/*
            Always rendered, faded rather than mounted.

            Mounting it on scroll inserted a 40px button into the flex row, which pushed the whole
            navigation 24px sideways the moment the hero search left the viewport — a visible
            lurch in the one element a visitor is most likely to be reading at the time. Reserving
            the space from the start costs nothing and the row never moves.

            Hidden state is complete rather than merely visual: `opacity-0` alone would leave a
            control that is invisible but still clickable and still in the tab order, which is a
            worse failure than the shift. `pointer-events-none`, `tabIndex={-1}` and `aria-hidden`
            travel together with the fade.

            `xl` rather than `lg`, because reserving the space permanently costs 40px that the
            1024px breakpoint does not have in French — the row overflowed by 26px. Below 1280 the
            hero's own search is a scroll away, which is the trade: no header search at that width
            rather than a header that moves, or one that runs off the side.
          */}
          <button
            type="button"
            onClick={() => setIsSearchExpanded(true)}
            aria-label={t('searchLabel')}
            aria-expanded={isSearchExpanded}
            aria-hidden={!showHeaderSearch}
            tabIndex={showHeaderSearch ? 0 : -1}
            data-search-toggle=""
            className={`hidden xl:flex items-center justify-center w-10 h-10 rounded-sm transition-opacity duration-200 focus:outline-none focus-visible:ring-2 nb-focus-ring-navy ${headerFgClass} ${
              hasLogo ? 'hover:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
            } ${showHeaderSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            ref={searchToggleRef}
          >
            <Search size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>

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
            aria-label={t('toggleMenu')}
            aria-expanded={isMobileMenuOpen}
            data-menu-toggle=""
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
        {/*
          The expanded field, overlaying the header row rather than sharing it. `inset-0` on the
          row means it gets the full width in either language, and the close button returns focus
          to the toggle so a keyboard user is not dropped at the top of the document.
        */}
        {isSearchExpanded && (
          <div
            ref={searchPanelRef}
            className={`hidden xl:flex absolute inset-0 items-center gap-3 px-4 sm:px-8 ${
              hasLogo ? 'nb-bg-navy dark:bg-blue-950' : 'bg-white dark:bg-zinc-900'
            }`}
          >
            <div className="flex-1">
              <SearchCombobox placeholder={t('searchLabel')} variant="header" />
            </div>
            <button
              type="button"
              onClick={closeSearch}
              aria-label={t('closeDialog')}
              className={`flex items-center justify-center w-10 h-10 rounded-sm shrink-0 transition-colors focus:outline-none focus-visible:ring-2 nb-focus-ring-navy ${headerFgClass} ${
                hasLogo ? 'hover:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {activeDesktopNav && (
        <MegaMenu
          category={activeDesktopNav}
          categoryLabel={tCategory(activeDesktopNav)}
          panelRef={megaPanelRef}
          onKeyDown={onPanelKeyDown}
          onBlur={onPanelBlur}
        />
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
