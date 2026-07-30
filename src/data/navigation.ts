import type { LocalizedLabel, NavCategory } from './i18n';

/** Shorthand for the bilingual pairs that make up most of this file. */
const L = (en: string, fr: string): LocalizedLabel => ({ en, fr });

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
 * happened to land on. The French labels are infinitives after "Je veux…" for the same reason.
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
  { label: L('Pay Property Taxes', 'Payer les impôts fonciers'), action: 'link_taxes' },
  { label: L('Report a Pothole', 'Signaler un nid-de-poule'), action: 'wizard_report' },
  { label: L('Pay a Parking Ticket', 'Payer une contravention'), action: 'link_parking' },
  { label: L('Find a Job', 'Trouver un emploi'), action: 'link_job' },
  { label: L('Start a Business', 'Démarrer une entreprise'), action: 'wizard_business' },
  { label: L('Build or Renovate', 'Construire ou rénover'), action: 'link_renovating' },
  { label: L('Move to North Bay', 'Emménager à North Bay'), action: 'link_moving' },
  { label: L('Start a Family', 'Fonder une famille'), action: 'link_family' },
  { label: L('Retire in North Bay', 'Prendre sa retraite à North Bay'), action: 'link_retiring' },
];

/**
 * The four top-level navigation categories and what sits under each.
 *
 * The item lists mirror the City's own published taxonomy rather than an invented one — this is
 * a redesign of an information architecture, not a replacement of the services behind it, and a
 * nav full of plausible-looking made-up pages would misrepresent what the City actually does.
 *
 * Every item is bilingual. An earlier version translated only the four category names and left
 * their contents in English, on the reasoning that in a real CMS these are content fields rather
 * than template strings. That reasoning was sound and the result was still wrong: a francophone
 * resident opening "Services et paiements" met thirteen English links. Navigation is chrome, not
 * content — if the label gets someone to the page, it belongs in the dictionary.
 *
 * Proper nouns stay as they are. "Film North Bay" and "Marina" are the names of things, not
 * descriptions of them, and translating a name is how you make something unfindable.
 */
export const siteStructure: Readonly<Record<NavCategory, readonly LocalizedLabel[]>> = {
  'Services & Payments': [
    L('Births, Marriages & Deaths', 'Naissances, mariages et décès'),
    L('Building & Development', 'Bâtiment et aménagement'),
    L('Court Services', 'Services judiciaires'),
    L('Customer Service Centre', 'Centre de service à la clientèle'),
    L('Forms, Permits & Licenses', 'Formulaires, permis et licences'),
    L('Garbage & Recycling', 'Ordures et recyclage'),
    L('North Bay Fire and Emergency Services', "Service d'incendie et des mesures d'urgence"),
    L('North Bay Transit', 'Transport en commun de North Bay'),
    L('Parking', 'Stationnement'),
    L('Property Taxes', 'Impôts fonciers'),
    L('Report a Problem', 'Signaler un problème'),
    L('Streets & Sidewalks', 'Rues et trottoirs'),
    L('Water & Wastewater', 'Eau et eaux usées'),
  ],
  Business: [
    L('Bid Opportunities', "Appels d'offres"),
    L('Economic Development', 'Développement économique'),
    L('Film North Bay', 'Film North Bay'),
    L('Funding Access Strategy Team', "Équipe de stratégie d'accès au financement"),
    L('Local Economy', 'Économie locale'),
    L('Municipal Incentives', 'Incitatifs municipaux'),
    L('Real Estate', 'Immobilier'),
    L('Sponsorship and Advertising Opportunities', 'Commandites et publicité'),
    L('Start & Grow a Business', 'Démarrer et développer une entreprise'),
  ],
  'City Government': [
    L('2026 Elections', 'Élections 2026'),
    L('Accessibility', 'Accessibilité'),
    L('Budget and Finance', 'Budget et finances'),
    L('By-Laws', 'Règlements municipaux'),
    L('Careers', 'Carrières'),
    L('Departments', 'Services municipaux'),
    L('Freedom of Information Requests', "Demandes d'accès à l'information"),
    L('Land Acknowledgement', 'Reconnaissance territoriale'),
    L('Mayor & Council', 'Maire et conseil'),
    L('Media Room', 'Salle de presse'),
    L('Meetings, Agendas & Minutes', 'Réunions, ordres du jour et procès-verbaux'),
    L('Municipal Dashboard', 'Tableau de bord municipal'),
    L('Organization Chart', 'Organigramme'),
    L('Plans & Studies', 'Plans et études'),
    L('Projects & Public Engagement', 'Projets et participation publique'),
  ],
  'Our Community': [
    L('About North Bay', 'À propos de North Bay'),
    L('Active Transportation', 'Transport actif'),
    L('Arts, Heritage & Culture', 'Arts, patrimoine et culture'),
    L('Bay Cams & Weather Forecast', 'Webcams de la baie et météo'),
    L('Community Safety and Well-Being', 'Sécurité et bien-être communautaires'),
    L('Environment & Sustainability', 'Environnement et durabilité'),
    L('Events & Programs', 'Événements et programmes'),
    L('Explore North Bay - GIS Portal', 'Explorer North Bay — portail SIG'),
    L('Housing in North Bay', 'Logement à North Bay'),
    L('Immigration', 'Immigration'),
    L('Marina', 'Marina'),
    L('Parks, Playgrounds & Trails', 'Parcs, terrains de jeux et sentiers'),
    L('Recreational Activities', 'Activités récréatives'),
    L('Sports Facilities', 'Installations sportives'),
  ],
};

/**
 * One-line orientation for each mega menu, in the City's own register. A heading alone
 * ("Business") makes a visitor guess whether they are in the right place; a sentence tells them.
 */
export const categoryDescriptions: Readonly<Record<NavCategory, LocalizedLabel>> = {
  'Services & Payments': L(
    'Access information about the service you need all right here.',
    "Accédez ici à l'information sur le service dont vous avez besoin.",
  ),
  Business: L('Grow your business in North Bay.', 'Faites croître votre entreprise à North Bay.'),
  'City Government': L(
    "Information about the City's governance such as organization structure, council meetings, budgets and financial reports and more.",
    'Information sur la gouvernance de la Ville : structure organisationnelle, réunions du conseil, budgets et rapports financiers, et plus encore.',
  ),
  'Our Community': L(
    'Information about our community, the activities that happen here, and facilities that support it.',
    "Information sur notre communauté, les activités qui s'y déroulent et les installations qui les soutiennent.",
  ),
};

/** Iteration order for the nav. Derived from the structure so the two cannot drift apart. */
export const navCategories = Object.keys(siteStructure) as NavCategory[];

/**
 * CITY SERVICES — the four highest-traffic transactions, surfaced as direct buttons.
 *
 * These are the four the City itself promotes at the top of its homepage, and that agreement is
 * the point: the "I want to…" selector covers the long tail of resident intents, while these four
 * are frequent enough to deserve a permanent target rather than a dropdown someone has to open
 * and read first. Two ways in, serving genuinely different traffic — not the same list twice.
 */
export interface CityService {
  readonly label: LocalizedLabel;
  readonly href: string;
}

export const cityServices: readonly CityService[] = [
  { label: L('Plan a Transit Route', 'Planifier un trajet'), href: '#' },
  { label: L('Report an Issue', 'Signaler un problème'), href: '#' },
  { label: L('Apply for a Building Permit', 'Demander un permis de construire'), href: '#' },
  { label: L('Explore Careers', 'Explorer les carrières'), href: '#' },
];

/** The four footer "popular pages", bilingual for the same reason the nav is. */
export const footerPopularPages: readonly LocalizedLabel[] = [
  L('Garbage & Recycling', 'Ordures et recyclage'),
  L('North Bay Transit', 'Transport en commun de North Bay'),
  L('Property Taxes', 'Impôts fonciers'),
  L('Forms, Permits & Licenses', 'Formulaires, permis et licences'),
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
