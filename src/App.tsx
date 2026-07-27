import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityStatement } from './components/AccessibilityStatement';
import { AlertBanner } from './components/AlertBanner';
import { Breadcrumbs } from './components/Breadcrumbs';
import { CurrentConditions } from './components/CurrentConditions';
import { DashboardGrid } from './components/DashboardGrid';
import { FeedbackWidget } from './components/FeedbackWidget';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MeetingRegistry } from './components/MeetingRegistry';
import { SkipLink } from './components/SkipLink';
import { TaskWizard, type WizardState } from './components/TaskWizard';
import type { MeetingFilter } from './data/feeds';
import type { NavCategory } from './data/i18n';
import type { QuickTaskAction } from './data/navigation';
import { useFocusTrap } from './hooks/useFocusTrap';
import { useScrollLock } from './hooks/useScrollLock';
import { useTheme } from './hooks/useTheme';
import { useTranslation } from './hooks/useTranslation';

/** Which quick tasks open a guided wizard rather than linking straight out. */
const WIZARD_TASKS: Partial<Record<QuickTaskAction, string>> = {
  wizard_business: 'Start a Business Workflow',
  wizard_report: 'Report an Issue',
};

/**
 * Composition root. Holds only the state that genuinely spans more than one region of the page —
 * language, theme, which menu is open, which dialog is open. Everything scoped to a single
 * component (search query, feedback sentiment) lives in that component instead, which is why
 * this file stayed short enough to read in one pass.
 */
export default function App() {
  const { lang, toggleLanguage, t, tCategory, getLabel } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopNav, setActiveDesktopNav] = useState<NavCategory | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<NavCategory | null>(null);
  const [meetingFilter, setMeetingFilter] = useState<MeetingFilter>('All');
  const [wizard, setWizard] = useState<WizardState>({ isOpen: false, step: 1, title: '' });
  const [isA11yStatementOpen, setIsA11yStatementOpen] = useState(false);

  const wizardPanelRef = useRef<HTMLDivElement>(null);
  const a11yDialogRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const isAnyDialogOpen = wizard.isOpen || isA11yStatementOpen;

  // Background scrolling is locked whenever any overlay covers the page.
  useScrollLock(isMobileMenuOpen || isAnyDialogOpen);

  // The accessibility statement's trap. The wizard owns its own, keyed to its step.
  useFocusTrap(a11yDialogRef, isA11yStatementOpen);

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

  /*
    Accordion: tapping an already-open category closes it, tapping a different one switches to
    it. One screen the whole time, rather than a stack of screens to navigate back out of.
  */
  const toggleMobileCategory = useCallback((category: NavCategory) => {
    setExpandedMobileCategory((prev) => (prev === category ? null : category));
  }, []);

  const handleTaskSelect = useCallback((action: QuickTaskAction) => {
    const wizardTitle = WIZARD_TASKS[action];
    if (wizardTitle) setWizard({ isOpen: true, step: 1, title: wizardTitle });
    // Every other task links straight out to an existing service page in a real deployment.
    // Those destinations do not exist in this concept build, which the accessibility
    // statement's "known issues" section states outright rather than leaving to be discovered.
  }, []);

  const jumpToSearch = useCallback(() => {
    const input = searchSectionRef.current?.querySelector('input');
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input?.focus();
  }, []);

  // Data-saver mode swaps to a system font stack and drops transitions, on top of skipping
  // non-essential imagery in the cards themselves.
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
        onJumpToSearch={jumpToSearch}
        t={t}
        tCategory={tCategory}
      />

      <Breadcrumbs t={t} />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero
          t={t}
          getLabel={getLabel}
          onTaskSelect={handleTaskSelect}
          searchSectionRef={searchSectionRef}
        />
        <CurrentConditions t={t} />
        <DashboardGrid t={t} isLowBandwidth={isLowBandwidth} />
        <MeetingRegistry t={t} filter={meetingFilter} setFilter={setMeetingFilter} />
        <FeedbackWidget t={t} />
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
}
