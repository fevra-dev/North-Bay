import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityStatement } from './components/AccessibilityStatement';
import { AlertBanner } from './components/AlertBanner';
import { CityServices } from './components/CityServices';
import { CurrentConditions } from './components/CurrentConditions';
import { DashboardGrid } from './components/DashboardGrid';
import { FeedbackWidget } from './components/FeedbackWidget';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MeetingRegistry } from './components/MeetingRegistry';
import { MunicipalDashboard } from './components/MunicipalDashboard';
import { SkipLink } from './components/SkipLink';
import { TaskWizard, type WizardState } from './components/TaskWizard';
import type { MeetingFilter } from './data/feeds';
import type { NavCategory, TranslationKey } from './data/i18n';
import { type QuickTaskAction, quickTasks } from './data/navigation';
import { useFocusTrap } from './hooks/useFocusTrap';
import { useScrollLock } from './hooks/useScrollLock';
import { useTheme } from './hooks/useTheme';
import { TranslationProvider, useTranslation } from './hooks/useTranslation';

/**
 * Which quick tasks open a guided wizard rather than linking straight out. The value is a
 * translation key, not a title — the dialog heading has to follow the active language.
 */
const WIZARD_TASKS: Partial<Record<QuickTaskAction, TranslationKey>> = {
  wizard_business: 'wizardBusinessTitle',
  wizard_report: 'wizardReportTitle',
};

/**
 * Composition root. Holds only the state that genuinely spans more than one region of the page —
 * theme, which menu is open, which dialog is open. Everything scoped to a single component
 * (search query, feedback sentiment) lives in that component instead, which is why this file
 * stayed short enough to read in one pass. Language lives in TranslationProvider, one level up.
 */
const AppContent = () => {
  const { lang, toggleLanguage, t, tCategory, getLabel } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopNav, setActiveDesktopNav] = useState<NavCategory | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<NavCategory | null>(null);
  const [meetingFilter, setMeetingFilter] = useState<MeetingFilter>('All');
  const [wizard, setWizard] = useState<WizardState>({ isOpen: false, step: 1, titleKey: null });
  const [isA11yStatementOpen, setIsA11yStatementOpen] = useState(false);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);

  const wizardPanelRef = useRef<HTMLDivElement>(null);
  const a11yDialogRef = useRef<HTMLDivElement>(null);
  const heroSearchRef = useRef<HTMLDivElement>(null);

  const isAnyDialogOpen = wizard.isOpen || isA11yStatementOpen;

  useScrollLock(isMobileMenuOpen || isAnyDialogOpen);
  useFocusTrap(a11yDialogRef, isA11yStatementOpen);

  /*
    The header's search control appears only once the hero's own search has scrolled out of view,
    so search is always reachable but two search fields are never on screen at once.

    IntersectionObserver rather than a scroll listener: the browser reports the crossing itself
    instead of the page recomputing geometry on every scroll frame, which on a long municipal
    homepage is the difference between a smooth scroll and a janky one on a mid-range phone.
  */
  useEffect(() => {
    const target = heroSearchRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowHeaderSearch(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  /*
    One Escape press closes whatever is currently on top: a dialog first, then the mobile menu,
    then an open desktop mega menu. Handled centrally rather than per-overlay so two overlays can
    never both respond to the same keystroke and close together.
  */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (wizard.isOpen) {
        setWizard((prev) => ({ ...prev, isOpen: false }));
      } else if (isA11yStatementOpen) {
        setIsA11yStatementOpen(false);
      } else if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setExpandedMobileCategory(null);
      } else if (activeDesktopNav) {
        setActiveDesktopNav(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [wizard.isOpen, isA11yStatementOpen, isMobileMenuOpen, activeDesktopNav]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      if (prev) setExpandedMobileCategory(null);
      return !prev;
    });
  }, []);

  const toggleMobileCategory = useCallback((category: NavCategory) => {
    setExpandedMobileCategory((prev) => (prev === category ? null : category));
  }, []);

  const handleTaskSelect = useCallback((action: QuickTaskAction) => {
    const titleKey = WIZARD_TASKS[action];
    if (titleKey) {
      setWizard({ isOpen: true, step: 1, titleKey });
      return;
    }
    /*
      The other seven go to the City's real page for that task.

      They used to reset the selector and do nothing, which made the site's own organizing
      principle the least trustworthy thing on it: a task-first architecture that does not route
      you to the task is just a differently-worded menu. A new tab for the same reason every other
      outbound link uses one — this is a concept handing off to the live municipal site, and the
      reviewer should not lose the concept to check that the handoff works.
    */
    const task = quickTasks.find((qt) => qt.action === action);
    if (task?.href) window.open(task.href, '_blank', 'noopener,noreferrer');
  }, []);

  const bandwidthClass = isLowBandwidth
    ? 'font-mono transition-none'
    : 'font-sans transition-colors duration-200';

  return (
    <div
      className={`min-h-screen bg-zinc-100 dark:bg-zinc-950 nb-text-ink dark:text-zinc-100 antialiased ${bandwidthClass}`}
    >
      <SkipLink label={t('skipToContent')} />
      <AlertBanner />

      <Header
        lang={lang}
        toggleLanguage={toggleLanguage}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLowBandwidth={isLowBandwidth}
        toggleLowBandwidth={() => setIsLowBandwidth((prev) => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        activeDesktopNav={activeDesktopNav}
        setActiveDesktopNav={setActiveDesktopNav}
        expandedMobileCategory={expandedMobileCategory}
        toggleMobileCategory={toggleMobileCategory}
        showHeaderSearch={showHeaderSearch}
        t={t}
        tCategory={tCategory}
      />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero
          t={t}
          getLabel={getLabel}
          onTaskSelect={handleTaskSelect}
          searchSectionRef={heroSearchRef}
          isLowBandwidth={isLowBandwidth}
        />

        {/*
          City Services and current conditions share one row rather than stacking. Both answer
          "what do I need to do or know right now", and they are the two things the City itself
          puts side by side at the top of its homepage. `items-stretch` keeps the two cards the
          same height so the row reads as one band rather than two leftovers.
        */}
        <section
          aria-label={t('cityServices')}
          className="print:hidden max-w-7xl mx-auto px-4 sm:px-8 py-8 grid gap-6 lg:grid-cols-2 items-stretch"
        >
          <CityServices t={t} getLabel={getLabel} />
          <CurrentConditions t={t} />
        </section>

        <DashboardGrid t={t} isLowBandwidth={isLowBandwidth} />
        <MeetingRegistry t={t} filter={meetingFilter} setFilter={setMeetingFilter} />
        <FeedbackWidget t={t} />
        <MunicipalDashboard t={t} />
      </main>

      <Footer t={t} onOpenAccessibilityStatement={() => setIsA11yStatementOpen(true)} />

      <TaskWizard state={wizard} setState={setWizard} panelRef={wizardPanelRef} />
      <AccessibilityStatement
        isOpen={isA11yStatementOpen}
        onClose={() => setIsA11yStatementOpen(false)}
        panelRef={a11yDialogRef}
      />
    </div>
  );
};

export default function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
}
