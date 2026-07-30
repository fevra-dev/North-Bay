import type { LocalizedLabel } from './i18n';

const L = (en: string, fr: string): LocalizedLabel => ({ en, fr });

/**
 * SEARCH INDEX.
 *
 * A flat, hand-curated index standing in for whatever the real site's search backend would
 * return. Kept realistic rather than exhaustive: the point of the demo is the interaction pattern
 * (WAI-ARIA combobox, arrow-key navigation, announced result counts), not retrieval quality.
 *
 * BILINGUAL BY CONSTRUCTION, AND MATCHED IN BOTH LANGUAGES AT ONCE.
 *
 * Every entry carries both titles, and a query is tested against both regardless of which
 * language the interface is in. Results then display in the active language. That is deliberate,
 * and it is not the same as simply translating the index:
 *
 *   - A francophone resident typing "ordures" finds the garbage page. Previously they got
 *     nothing, because the index only held "Garbage & Recycling" — the search silently behaved
 *     as though the French side of the site did not exist.
 *   - A resident typing "garbage" while the interface is in French still finds it. Bilingual
 *     residents mix languages constantly, and municipal terms are often known in only one of
 *     them. Matching only the active language would punish exactly the people the French
 *     interface exists to serve.
 *
 * `type` and `category` are surfaced as badges, because "Property Taxes" being a *service* and
 * "2026 Municipal Elections" being a *guide* changes what someone expects on the other side of
 * the click.
 */
export type SearchResultType = 'Service' | 'Guide' | 'Application' | 'Notice' | 'Public Record';

export const searchTypeLabels: Readonly<Record<SearchResultType, LocalizedLabel>> = {
  Service: L('Service', 'Service'),
  Guide: L('Guide', 'Guide'),
  Application: L('Application', 'Demande'),
  Notice: L('Notice', 'Avis'),
  'Public Record': L('Public Record', 'Document public'),
};

export type SearchCategory =
  | 'Payments'
  | 'Services'
  | 'Development'
  | 'Transportation'
  | 'Government'
  | 'Business'
  | 'Community';

export const searchCategoryLabels: Readonly<Record<SearchCategory, LocalizedLabel>> = {
  Payments: L('Payments', 'Paiements'),
  Services: L('Services', 'Services'),
  Development: L('Development', 'Aménagement'),
  Transportation: L('Transportation', 'Transport'),
  Government: L('Government', 'Administration'),
  Business: L('Business', 'Entreprises'),
  Community: L('Community', 'Communauté'),
};

export interface SearchEntry {
  readonly title: LocalizedLabel;
  readonly category: SearchCategory;
  readonly type: SearchResultType;
}

export const searchIndex: readonly SearchEntry[] = [
  // Payments and billing
  { title: L('Property Taxes', 'Impôts fonciers'), category: 'Payments', type: 'Service' },
  {
    title: L('Pay a Parking Ticket', 'Payer une contravention'),
    category: 'Payments',
    type: 'Service',
  },
  {
    title: L('Parking Tickets & Fines', 'Contraventions et amendes'),
    category: 'Payments',
    type: 'Service',
  },
  {
    title: L('Water & Wastewater Billing', 'Facturation eau et eaux usées'),
    category: 'Payments',
    type: 'Service',
  },
  {
    title: L('eServices Portal', 'Portail des services en ligne'),
    category: 'Payments',
    type: 'Service',
  },
  {
    title: L('User Fees & Charges', 'Frais et droits d’utilisation'),
    category: 'Payments',
    type: 'Public Record',
  },

  // Waste
  { title: L('Garbage & Recycling', 'Ordures et recyclage'), category: 'Services', type: 'Guide' },
  {
    title: L('Curbside Collection Schedule', 'Calendrier de collecte en bordure de rue'),
    category: 'Services',
    type: 'Guide',
  },
  {
    title: L('Residential Garbage Collection', 'Collecte des ordures résidentielles'),
    category: 'Services',
    type: 'Guide',
  },
  {
    title: L(
      'Waste Diversion & Household Hazardous Waste',
      'Réacheminement des déchets et déchets dangereux',
    ),
    category: 'Services',
    type: 'Guide',
  },
  {
    title: L('Landfill Hours & Fees', 'Heures et frais du site d’enfouissement'),
    category: 'Services',
    type: 'Guide',
  },

  // Building and development
  {
    title: L('Building Permits', 'Permis de construire'),
    category: 'Development',
    type: 'Application',
  },
  {
    title: L('Building & Development', 'Bâtiment et aménagement'),
    category: 'Development',
    type: 'Guide',
  },
  {
    title: L('Zoning By-Law & Land Use', 'Règlement de zonage et utilisation du sol'),
    category: 'Development',
    type: 'Public Record',
  },
  {
    title: L('Planning Applications', 'Demandes d’aménagement'),
    category: 'Development',
    type: 'Application',
  },

  // Transportation
  {
    title: L('North Bay Transit Schedules', 'Horaires du transport en commun'),
    category: 'Transportation',
    type: 'Service',
  },
  {
    title: L('Transit Planner', 'Planificateur de trajet'),
    category: 'Transportation',
    type: 'Service',
  },
  {
    title: L('Overnight Parking Ban', 'Interdiction de stationner la nuit'),
    category: 'Transportation',
    type: 'Notice',
  },
  {
    title: L('Streets & Sidewalks', 'Rues et trottoirs'),
    category: 'Transportation',
    type: 'Service',
  },
  {
    title: L('Active Transportation', 'Transport actif'),
    category: 'Transportation',
    type: 'Guide',
  },
  {
    title: L('Winter Road Maintenance', 'Entretien hivernal des routes'),
    category: 'Transportation',
    type: 'Guide',
  },

  // Government
  {
    title: L(
      'Council Meetings, Agendas & Minutes',
      'Réunions du conseil, ordres du jour et procès-verbaux',
    ),
    category: 'Government',
    type: 'Public Record',
  },
  {
    title: L('2026 Municipal Elections', 'Élections municipales 2026'),
    category: 'Government',
    type: 'Guide',
  },
  { title: L('Mayor & Council', 'Maire et conseil'), category: 'Government', type: 'Guide' },
  {
    title: L('Municipal Dashboard', 'Tableau de bord municipal'),
    category: 'Government',
    type: 'Public Record',
  },
  {
    title: L('Budget and Finance', 'Budget et finances'),
    category: 'Government',
    type: 'Public Record',
  },
  { title: L('By-Laws', 'Règlements municipaux'), category: 'Government', type: 'Public Record' },
  {
    title: L('Freedom of Information Requests', 'Demandes d’accès à l’information'),
    category: 'Government',
    type: 'Application',
  },
  {
    title: L('Careers with the City', 'Carrières à la Ville'),
    category: 'Government',
    type: 'Service',
  },
  { title: L('Departments', 'Services municipaux'), category: 'Government', type: 'Guide' },
  { title: L('Media Room', 'Salle de presse'), category: 'Government', type: 'Public Record' },
  { title: L('Public Notices', 'Avis publics'), category: 'Government', type: 'Notice' },
  {
    title: L('Accessibility (AODA)', 'Accessibilité (LAPHO)'),
    category: 'Government',
    type: 'Guide',
  },
  {
    title: L('Land Acknowledgement', 'Reconnaissance territoriale'),
    category: 'Government',
    type: 'Guide',
  },

  // Business
  {
    title: L('Business Licensing', 'Permis d’entreprise'),
    category: 'Business',
    type: 'Application',
  },
  {
    title: L('Bid Opportunities & Tenders', 'Appels d’offres et soumissions'),
    category: 'Business',
    type: 'Service',
  },
  {
    title: L('Start & Grow a Business', 'Démarrer et développer une entreprise'),
    category: 'Business',
    type: 'Guide',
  },
  {
    title: L('Economic Development', 'Développement économique'),
    category: 'Business',
    type: 'Guide',
  },
  {
    title: L('Municipal Incentives', 'Incitatifs municipaux'),
    category: 'Business',
    type: 'Guide',
  },
  { title: L('Film North Bay', 'Film North Bay'), category: 'Business', type: 'Service' },

  // Records and licences
  {
    title: L('Marriage Licences', 'Licences de mariage'),
    category: 'Services',
    type: 'Application',
  },
  {
    title: L('Births, Marriages & Deaths', 'Naissances, mariages et décès'),
    category: 'Services',
    type: 'Application',
  },
  {
    title: L('Forms, Permits & Licenses', 'Formulaires, permis et licences'),
    category: 'Services',
    type: 'Application',
  },
  { title: L('Report a Problem', 'Signaler un problème'), category: 'Services', type: 'Service' },
  {
    title: L('Report a Pothole or Road Issue', 'Signaler un nid-de-poule ou un problème routier'),
    category: 'Services',
    type: 'Service',
  },
  {
    title: L('Customer Service Centre', 'Centre de service à la clientèle'),
    category: 'Services',
    type: 'Service',
  },
  {
    title: L(
      'North Bay Fire and Emergency Services',
      'Service d’incendie et des mesures d’urgence',
    ),
    category: 'Services',
    type: 'Service',
  },
  {
    title: L('Fire Ban & Burn Permits', 'Interdiction de feu et permis de brûlage'),
    category: 'Services',
    type: 'Notice',
  },

  // Community
  {
    title: L('Parks, Playgrounds & Trails', 'Parcs, terrains de jeux et sentiers'),
    category: 'Community',
    type: 'Guide',
  },
  {
    title: L(
      'Recreation Programs & Facility Booking',
      'Programmes récréatifs et réservation d’installations',
    ),
    category: 'Community',
    type: 'Service',
  },
  {
    title: L('Sports Facilities', 'Installations sportives'),
    category: 'Community',
    type: 'Service',
  },
  {
    title: L('Arts, Heritage & Culture', 'Arts, patrimoine et culture'),
    category: 'Community',
    type: 'Guide',
  },
  {
    title: L('Events & Programs', 'Événements et programmes'),
    category: 'Community',
    type: 'Guide',
  },
  { title: L('Marina', 'Marina'), category: 'Community', type: 'Service' },
  {
    title: L('Bay Cams & Weather Forecast', 'Webcams de la baie et météo'),
    category: 'Community',
    type: 'Service',
  },
  {
    title: L('Housing in North Bay', 'Logement à North Bay'),
    category: 'Community',
    type: 'Guide',
  },
  { title: L('Immigration', 'Immigration'), category: 'Community', type: 'Guide' },
  {
    title: L('Community Safety and Well-Being', 'Sécurité et bien-être communautaires'),
    category: 'Community',
    type: 'Guide',
  },
  {
    title: L('Explore North Bay - GIS Portal', 'Explorer North Bay — portail SIG'),
    category: 'Community',
    type: 'Service',
  },
  {
    title: L('Environment & Sustainability', 'Environnement et durabilité'),
    category: 'Community',
    type: 'Guide',
  },
];
