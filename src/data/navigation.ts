import type { LocalizedLabel, NavCategory } from './i18n';

/**
 * THE "I WANT TO..." TASK SELECTOR.
 *
 * Life Events now lives inside this mechanism instead of sitting as a fifth navigation tab.
 * The original layout mixed two different mental models in one row: life events (organized by
 * what is happening in someone's life) sitting next to departments (organized by which part of
 * the city runs it). Folding it in here keeps the life-event framing without asking a visitor
 * to silently work out which system each tab belongs to before they can click anything.
 *
 * NYC.gov's 2025 relaunch made the same bet — surface the tasks residents actually arrive to
 * do, ahead of the org chart.
 *
 * Ordered by realistic priority: routine, high-frequency transactions first (the things almost
 * every resident does repeatedly), then economic and practical tasks, then the lower-frequency
 * but higher-stakes life-stage journeys last.
 *
 * Every label is a proper infinitive after "I want to...", not the mix of gerunds ("Having a
 * Family") and verbs ("Start a Business") that read inconsistently depending on which one you
 * happened to land on.
 */
export type QuickTaskAction =
  | 'link_taxes'
  | 'wizard_report'
  | 'link_parking'
  | 'link_job'
  | 'wizard_business'
  | 'link_renovating'
  | 'link_moving'
  | 'link_family'
  | 'link_retiring';

export interface QuickTask {
  readonly label: LocalizedLabel;
  readonly action: QuickTaskAction;
}

export const quickTasks: readonly QuickTask[] = [
  { label: { en: 'Pay Property Taxes', fr: 'Payer les impôts fonciers' }, action: 'link_taxes' },
  { label: { en: 'Report a Pothole', fr: 'Signaler un nid-de-poule' }, action: 'wizard_report' },
  { label: { en: 'Pay a Parking Ticket', fr: 'Payer une contravention' }, action: 'link_parking' },
  { label: { en: 'Find a Job', fr: 'Trouver un emploi' }, action: 'link_job' },
  { label: { en: 'Start a Business', fr: 'Démarrer une entreprise' }, action: 'wizard_business' },
  { label: { en: 'Build or Renovate', fr: 'Construire ou rénover' }, action: 'link_renovating' },
  { label: { en: 'Move to North Bay', fr: 'Emménager à North Bay' }, action: 'link_moving' },
  { label: { en: 'Start a Family', fr: 'Fonder une famille' }, action: 'link_family' },
  {
    label: { en: 'Retire in North Bay', fr: 'Prendre sa retraite à North Bay' },
    action: 'link_retiring',
  },
];

/**
 * The four top-level navigation categories and what sits under each. English names are the
 * stable keys the app looks up by; `categoryTranslations` supplies the display name.
 */
export const siteStructure: Readonly<Record<NavCategory, readonly string[]>> = {
  'Services & Payments': [
    'Births, Marriages & Deaths',
    'Building & Development',
    'Court Services',
    'Forms, Permits & Licenses',
    'Garbage & Recycling',
    'North Bay Transit',
    'Parking',
    'Property Taxes',
    'Report a Problem',
    'Water & Wastewater',
  ],
  Business: [
    'Bid Opportunities',
    'Economic Development',
    'Local Economy',
    'Municipal Incentives',
    'Start & Grow a Business',
    'Film North Bay',
  ],
  'City Government': [
    'Mayor & Council',
    'Meetings, Agendas & Minutes',
    'By-Laws',
    'Careers',
    'Departments',
    'Municipal Elections',
    'Freedom of Information',
  ],
  'Our Community': [
    'About North Bay',
    'Arts, Heritage & Culture',
    'Events & Programs',
    'Parks, Playgrounds & Trails',
    'Recreational Activities',
    'Community Safety',
  ],
};

/** Iteration order for the nav. Derived from the structure so the two cannot drift apart. */
export const navCategories = Object.keys(siteStructure) as NavCategory[];
