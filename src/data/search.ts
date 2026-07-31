import type { LocalizedLabel } from './i18n';

const CITY = 'https://northbay.ca';

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
 * and not the same as simply translating the index:
 *
 *   - A francophone typing "ordures" finds the garbage page. Previously they got nothing, because
 *     the index held only "Garbage & Recycling" — the search behaved as though the French side of
 *     the site did not exist.
 *   - Someone typing "garbage" while the interface is in French still finds it. Bilingual
 *     residents mix languages constantly and often know a municipal term in only one of them, so
 *     matching only the active language would penalise exactly the people the French interface
 *     exists to serve.
 *
 * EVERY RESULT GOES SOMEWHERE. Selecting one used to write its title into the input and close the
 * panel, which looks like a working search right up to the moment it is supposed to be useful.
 * Search is one of the two ways into this site; a result that leads nowhere makes it the one that
 * does not work.
 *
 * Several entries deliberately share a destination. "Pay a Parking Ticket", "Parking Tickets &
 * Fines" and "Overnight Parking Ban" are three things a resident might type and one page the City
 * publishes. Mapping the vocabulary people actually use onto the page that answers them is the
 * job; inventing a URL per phrasing is not.
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
  /** The City's page for this result. Every entry has one; see the note above. */
  readonly href: string;
}

/** Compact constructor — sixty-two entries read better as rows than as nested objects. */
const e = (
  en: string,
  fr: string,
  category: SearchCategory,
  type: SearchResultType,
  path: string,
): SearchEntry => ({
  title: L(en, fr),
  category,
  type,
  href: path.startsWith('http') ? path : `${CITY}${path}`,
});

export const searchIndex: readonly SearchEntry[] = [
  // Payments and billing
  e(
    'Property Taxes',
    'Impôts fonciers',
    'Payments',
    'Service',
    '/services-payments/property-taxes/',
  ),
  e(
    'Pay a Parking Ticket',
    'Payer une contravention',
    'Payments',
    'Service',
    '/services-payments/parking/',
  ),
  e(
    'Parking Tickets & Fines',
    'Contraventions et amendes',
    'Payments',
    'Service',
    '/services-payments/parking/',
  ),
  e(
    'Water & Wastewater Billing',
    'Facturation eau et eaux usées',
    'Payments',
    'Service',
    '/services-payments/water-wastewater/',
  ),
  e(
    'eServices Portal',
    'Portail des services en ligne',
    'Payments',
    'Service',
    '/services-payments/',
  ),
  e(
    'User Fees & Charges',
    'Frais et droits d’utilisation',
    'Payments',
    'Public Record',
    '/city-government/budget-and-finance/',
  ),

  // Waste
  e(
    'Garbage & Recycling',
    'Ordures et recyclage',
    'Services',
    'Guide',
    '/services-payments/garbage-recycling/',
  ),
  e(
    'Curbside Collection Schedule',
    'Calendrier de collecte en bordure de rue',
    'Services',
    'Guide',
    '/services-payments/garbage-recycling/curbside-collection/',
  ),
  e(
    'Residential Garbage Collection',
    'Collecte des ordures résidentielles',
    'Services',
    'Guide',
    '/services-payments/garbage-recycling/curbside-collection/residential-garbage-collection/',
  ),
  e(
    'Waste Diversion & Household Hazardous Waste',
    'Réacheminement des déchets et déchets dangereux',
    'Services',
    'Guide',
    '/services-payments/garbage-recycling/waste-diversion/',
  ),
  e(
    'Landfill Hours & Fees',
    'Heures et frais du site d’enfouissement',
    'Services',
    'Guide',
    '/services-payments/garbage-recycling/',
  ),

  // Building and development
  e(
    'Building Permits',
    'Permis de construire',
    'Development',
    'Application',
    '/services-payments/building-development/',
  ),
  e(
    'Building & Development',
    'Bâtiment et aménagement',
    'Development',
    'Guide',
    '/services-payments/building-development/',
  ),
  e(
    'Zoning By-Law & Land Use',
    'Règlement de zonage et utilisation du sol',
    'Development',
    'Public Record',
    '/city-government/by-laws/',
  ),
  e(
    'Planning Applications',
    'Demandes d’aménagement',
    'Development',
    'Application',
    '/services-payments/building-development/',
  ),

  // Transportation
  e(
    'North Bay Transit Schedules',
    'Horaires du transport en commun',
    'Transportation',
    'Service',
    '/services-payments/north-bay-transit/',
  ),
  e(
    'Transit Planner',
    'Planificateur de trajet',
    'Transportation',
    'Service',
    '/services-payments/north-bay-transit/',
  ),
  e(
    'Overnight Parking Ban',
    'Interdiction de stationner la nuit',
    'Transportation',
    'Notice',
    '/services-payments/parking/',
  ),
  e(
    'Streets & Sidewalks',
    'Rues et trottoirs',
    'Transportation',
    'Service',
    '/services-payments/streets-sidewalks/',
  ),
  e(
    'Active Transportation',
    'Transport actif',
    'Transportation',
    'Guide',
    '/our-community/active-transportation/',
  ),
  e(
    'Winter Road Maintenance',
    'Entretien hivernal des routes',
    'Transportation',
    'Guide',
    '/services-payments/streets-sidewalks/',
  ),

  // Government
  e(
    'Council Meetings, Agendas & Minutes',
    'Réunions du conseil, ordres du jour et procès-verbaux',
    'Government',
    'Public Record',
    '/city-government/meetings-agendas-minutes/',
  ),
  e(
    '2026 Municipal Elections',
    'Élections municipales 2026',
    'Government',
    'Guide',
    '/city-government/2026-elections/',
  ),
  e(
    'Mayor & Council',
    'Maire et conseil',
    'Government',
    'Guide',
    '/city-government/mayor-council/',
  ),
  e(
    'Municipal Dashboard',
    'Tableau de bord municipal',
    'Government',
    'Public Record',
    '/city-government/municipal-dashboard/',
  ),
  e(
    'Budget and Finance',
    'Budget et finances',
    'Government',
    'Public Record',
    '/city-government/budget-and-finance/',
  ),
  e('By-Laws', 'Règlements municipaux', 'Government', 'Public Record', '/city-government/by-laws/'),
  e(
    'Freedom of Information Requests',
    'Demandes d’accès à l’information',
    'Government',
    'Application',
    '/city-government/freedom-of-information-requests/',
  ),
  e(
    'Careers with the City',
    'Carrières à la Ville',
    'Government',
    'Service',
    '/city-government/careers/',
  ),
  e('Departments', 'Services municipaux', 'Government', 'Guide', '/city-government/departments/'),
  e('Media Room', 'Salle de presse', 'Government', 'Public Record', '/city-government/media-room/'),
  e('Public Notices', 'Avis publics', 'Government', 'Notice', '/city-government/media-room/'),
  e(
    'Accessibility (AODA)',
    'Accessibilité (LAPHO)',
    'Government',
    'Guide',
    '/city-government/accessibility/',
  ),
  e(
    'Land Acknowledgement',
    'Reconnaissance territoriale',
    'Government',
    'Guide',
    '/city-government/land-acknowledgement/',
  ),

  // Business
  e(
    'Business Licensing',
    'Permis d’entreprise',
    'Business',
    'Application',
    '/services-payments/forms-permits-licenses/',
  ),
  e(
    'Bid Opportunities & Tenders',
    'Appels d’offres et soumissions',
    'Business',
    'Service',
    '/business/bid-opportunities/',
  ),
  e(
    'Start & Grow a Business',
    'Démarrer et développer une entreprise',
    'Business',
    'Guide',
    '/business/start-grow-a-business/',
  ),
  e(
    'Economic Development',
    'Développement économique',
    'Business',
    'Guide',
    'https://www.investinnorthbay.ca/',
  ),
  e(
    'Municipal Incentives',
    'Incitatifs municipaux',
    'Business',
    'Guide',
    '/business/municipal-incentives/',
  ),
  e(
    'Film North Bay',
    'Film North Bay',
    'Business',
    'Service',
    'https://www.investinnorthbay.ca/industry/film-television/',
  ),

  // Records and licences
  e(
    'Marriage Licences',
    'Licences de mariage',
    'Services',
    'Application',
    '/services-payments/births-marriages-deaths/',
  ),
  e(
    'Births, Marriages & Deaths',
    'Naissances, mariages et décès',
    'Services',
    'Application',
    '/services-payments/births-marriages-deaths/',
  ),
  e(
    'Forms, Permits & Licenses',
    'Formulaires, permis et licences',
    'Services',
    'Application',
    '/services-payments/forms-permits-licenses/',
  ),
  e(
    'Report a Problem',
    'Signaler un problème',
    'Services',
    'Service',
    '/services-payments/report-a-problem/',
  ),
  e(
    'Report a Pothole or Road Issue',
    'Signaler un nid-de-poule ou un problème routier',
    'Services',
    'Service',
    '/services-payments/report-a-problem/',
  ),
  e(
    'Customer Service Centre',
    'Centre de service à la clientèle',
    'Services',
    'Service',
    '/city-government/departments/customer-service-centre/',
  ),
  e(
    'North Bay Fire and Emergency Services',
    'Service d’incendie et des mesures d’urgence',
    'Services',
    'Service',
    'https://fire.northbay.ca/',
  ),
  e(
    'Fire Ban & Burn Permits',
    'Interdiction de feu et permis de brûlage',
    'Services',
    'Notice',
    'https://fire.northbay.ca/',
  ),

  // Community
  e(
    'Parks, Playgrounds & Trails',
    'Parcs, terrains de jeux et sentiers',
    'Community',
    'Guide',
    '/our-community/parks-playgrounds-trails/',
  ),
  e(
    'Recreation Programs & Facility Booking',
    'Programmes récréatifs et réservation d’installations',
    'Community',
    'Service',
    '/our-community/recreational-activities/',
  ),
  e(
    'Sports Facilities',
    'Installations sportives',
    'Community',
    'Service',
    '/our-community/sports-facilities/',
  ),
  e(
    'Arts, Heritage & Culture',
    'Arts, patrimoine et culture',
    'Community',
    'Guide',
    '/our-community/arts-heritage-culture/',
  ),
  e(
    'Events & Programs',
    'Événements et programmes',
    'Community',
    'Guide',
    '/our-community/events-programs/',
  ),
  e('Marina', 'Marina', 'Community', 'Service', '/our-community/marina/'),
  e(
    'Bay Cams & Weather Forecast',
    'Webcams de la baie et météo',
    'Community',
    'Service',
    '/our-community/bay-cams-weather-forecast/',
  ),
  e(
    'Housing in North Bay',
    'Logement à North Bay',
    'Community',
    'Guide',
    '/our-community/housing-in-north-bay/',
  ),
  e('Immigration', 'Immigration', 'Community', 'Guide', 'https://northbayimmigration.ca/'),
  e(
    'Community Safety and Well-Being',
    'Sécurité et bien-être communautaires',
    'Community',
    'Guide',
    '/our-community/community-safety-and-well-being/',
  ),
  e(
    'Explore North Bay - GIS Portal',
    'Explorer North Bay — portail SIG',
    'Community',
    'Service',
    '/our-community/explore-north-bay-gis-portal/',
  ),
  e(
    'Environment & Sustainability',
    'Environnement et durabilité',
    'Community',
    'Guide',
    '/our-community/environment-sustainability/',
  ),
];
