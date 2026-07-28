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
 * The four top-level navigation categories and what sits under each.
 *
 * The item lists mirror the City's own published taxonomy rather than an invented one — this is
 * a redesign of an information architecture, not a replacement of the services behind it, and
 * a nav full of plausible-looking made-up pages would misrepresent what the City actually does.
 * English names are the stable keys the app looks up by; `categoryTranslations` supplies the
 * display name.
 *
 * Each category also carries a one-line description, the way the City's own mega menus do. A
 * heading alone ("Business") makes a visitor guess whether they are in the right place; a
 * sentence tells them.
 */
export const siteStructure: Readonly<Record<NavCategory, readonly string[]>> = {
  'Services & Payments': [
    'Births, Marriages & Deaths',
    'Building & Development',
    'Court Services',
    'Customer Service Centre',
    'Forms, Permits & Licenses',
    'Garbage & Recycling',
    'North Bay Fire and Emergency Services',
    'North Bay Transit',
    'Parking',
    'Property Taxes',
    'Report a Problem',
    'Streets & Sidewalks',
    'Water & Wastewater',
  ],
  Business: [
    'Bid Opportunities',
    'Economic Development',
    'Film North Bay',
    'Funding Access Strategy Team',
    'Local Economy',
    'Municipal Incentives',
    'Real Estate',
    'Sponsorship and Advertising Opportunities',
    'Start & Grow a Business',
  ],
  'City Government': [
    '2026 Elections',
    'Accessibility',
    'Budget and Finance',
    'By-Laws',
    'Careers',
    'Departments',
    'Freedom of Information Requests',
    'Land Acknowledgement',
    'Mayor & Council',
    'Media Room',
    'Meetings, Agendas & Minutes',
    'Municipal Dashboard',
    'Organization Chart',
    'Plans & Studies',
    'Projects & Public Engagement',
  ],
  'Our Community': [
    'About North Bay',
    'Active Transportation',
    'Arts, Heritage & Culture',
    'Bay Cams & Weather Forecast',
    'Community Safety and Well-Being',
    'Environment & Sustainability',
    'Events & Programs',
    'Explore North Bay - GIS Portal',
    'Housing in North Bay',
    'Immigration',
    'Marina',
    'Parks, Playgrounds & Trails',
    'Recreational Activities',
    'Sports Facilities',
  ],
};

/**
 * One-line orientation for each mega menu, taken from the City's own wording. Kept English-only
 * for the same reason as the nav items: in a real deployment these are CMS content fields.
 */
export const categoryDescriptions: Readonly<Record<NavCategory, string>> = {
  'Services & Payments': 'Access information about the service you need all right here.',
  Business: 'Grow your business in North Bay.',
  'City Government':
    "Information about the City's governance such as organization structure, council meetings, budgets and financial reports and more.",
  'Our Community':
    'Information about our community, the activities that happen here, and facilities that support it.',
};

/** Iteration order for the nav. Derived from the structure so the two cannot drift apart. */
export const navCategories = Object.keys(siteStructure) as NavCategory[];

/**
 * CITY SERVICES — the four highest-traffic transactions, surfaced as direct buttons.
 *
 * These are the four the City itself promotes at the top of its homepage, and that agreement is
 * the point: the "I want to…" selector below covers the long tail of resident intents, while
 * these four are frequent enough to deserve a permanent target rather than a dropdown someone
 * has to open and read first. Two ways in, serving genuinely different traffic — not the same
 * list rendered twice.
 */
export interface CityService {
  readonly label: LocalizedLabel;
  readonly href: string;
}

export const cityServices: readonly CityService[] = [
  { label: { en: 'Plan a Transit Route', fr: 'Planifier un trajet' }, href: '#' },
  { label: { en: 'Report an Issue', fr: 'Signaler un problème' }, href: '#' },
  {
    label: { en: 'Apply for a Building Permit', fr: 'Demander un permis de construire' },
    href: '#',
  },
  { label: { en: 'Explore Careers', fr: 'Explorer les carrières' }, href: '#' },
];

/**
 * Social channels. The City posts service disruptions to these faster than anywhere else, which
 * is why they belong in the footer of every page rather than only on a contact page.
 */
export interface SocialLink {
  readonly name: string;
  readonly href: string;
}

export const socialLinks: readonly SocialLink[] = [
  { name: 'Facebook', href: 'https://www.facebook.com/cityofnorthbay' },
  { name: 'X', href: 'https://twitter.com/cityofnorthbay' },
  { name: 'Instagram', href: 'https://www.instagram.com/cityofnbay/' },
  { name: 'YouTube', href: 'https://www.youtube.com/c/thecityofnorthbay' },
];
