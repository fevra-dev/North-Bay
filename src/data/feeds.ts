import aquaDanceFit from '../assets/aqua-dance-fit.jpg';
import movieInThePark from '../assets/movie-in-the-park.jpg';
import type { LocalizedLabel } from './i18n';

const L = (en: string, fr: string): LocalizedLabel => ({ en, fr });

/**
 * MOCK CONTENT FEEDS.
 *
 * Everything here stands in for what a CMS would supply. The shapes are the contract: a real
 * integration should be able to drop its own objects in without any component changing.
 *
 * All of it is bilingual, including the parts that are genuinely editorial rather than
 * structural — headlines, event names, meeting types, statuses. In a real deployment these come
 * from localized content fields an editor fills in per item, and the shape here models exactly
 * that: one record, two languages, no separate French site to drift out of sync.
 *
 * The event photographs were originally inlined as base64 so the single-file prototype had no
 * dependency on an asset path resolving. Now that this is a real project they are ordinary
 * imports: Vite fingerprints the filenames, so browsers cache them across deploys and the bundle
 * no longer carries 30KB of base64 it has to parse as JavaScript.
 */

export interface Meeting {
  readonly id: string;
  /** Stable English key — used for filtering, so it must not change with the language. */
  readonly type: 'City Council' | 'Committee' | 'Public Meeting';
  /** ISO 8601 (YYYY-MM-DD). Machine-sortable, and unambiguous across locales. */
  readonly date: string;
  readonly time: LocalizedLabel;
  readonly status: LocalizedLabel;
  readonly agendaUrl: string;
  /** `null` when a meeting has no recording — not every proceeding is livestreamed. */
  readonly videoUrl: string | null;
}

/** Display names for the meeting types, keyed by the stable English value above. */
export const meetingTypeLabels: Readonly<Record<Meeting['type'], LocalizedLabel>> = {
  'City Council': L('City Council', 'Conseil municipal'),
  Committee: L('Committee', 'Comité'),
  'Public Meeting': L('Public Meeting', 'Réunion publique'),
};

const AGENDA_PUBLISHED = L('Agenda Published', 'Ordre du jour publié');
const NOTICE_ISSUED = L('Notice Issued', 'Avis publié');

export const meetingsFeed: readonly Meeting[] = [
  {
    id: 'm1',
    type: 'City Council',
    date: '2026-07-14',
    time: L('6:30 PM', '18 h 30'),
    status: AGENDA_PUBLISHED,
    agendaUrl: '#',
    videoUrl: '#',
  },
  {
    id: 'm2',
    type: 'Committee',
    date: '2026-07-14',
    time: L('6:30 PM', '18 h 30'),
    status: AGENDA_PUBLISHED,
    agendaUrl: '#',
    videoUrl: null,
  },
  {
    id: 'm3',
    type: 'Public Meeting',
    date: '2026-07-18',
    time: L('5:00 PM', '17 h'),
    status: NOTICE_ISSUED,
    agendaUrl: '#',
    videoUrl: null,
  },
];

/** Filter options for the meeting registry. 'All' is the default view. */
export const meetingFilters = ['All', 'City Council', 'Committee', 'Public Meeting'] as const;
export type MeetingFilter = (typeof meetingFilters)[number];

export const meetingFilterLabels: Readonly<Record<MeetingFilter, LocalizedLabel>> = {
  All: L('All Meetings', 'Toutes les réunions'),
  ...meetingTypeLabels,
};

export interface NewsItem {
  readonly id: string;
  readonly category: LocalizedLabel;
  readonly title: LocalizedLabel;
  readonly date: LocalizedLabel;
  /** Drives an explicit "Urgent" text badge, not just a colour change. */
  readonly urgent: boolean;
}

/**
 * Headlines follow the City's own house style in both languages: specific street names, a
 * concrete date where one exists, plain declarative phrasing rather than promotional language.
 * "Final Paving on McKeown Avenue Begins Monday" tells a resident whether it affects them before
 * they click; "Exciting Road Improvements!" does not.
 *
 * French dates use the Canadian convention — "27 juillet 2026", no capital on the month.
 */
export const newsFeed: readonly NewsItem[] = [
  {
    id: 'n1',
    category: L('Notice', 'Avis'),
    title: L(
      'Road Closure: Main Street Revitalization',
      'Fermeture de route : revitalisation de la rue Main',
    ),
    date: L('July 27, 2026', '27 juillet 2026'),
    urgent: true,
  },
  {
    id: 'n2',
    category: L('Roads', 'Routes'),
    title: L(
      'Sidewalk Improvements at Lakeshore Drive and Mulligan Avenue',
      'Réfection des trottoirs à Lakeshore Drive et Mulligan Avenue',
    ),
    date: L('July 25, 2026', '25 juillet 2026'),
    urgent: false,
  },
  {
    id: 'n3',
    category: L('Housing', 'Logement'),
    title: L(
      'City Secures $336,000 from the Building Faster Fund',
      'La Ville obtient 336 000 $ du Fonds pour bâtir plus vite',
    ),
    date: L('July 21, 2026', '21 juillet 2026'),
    urgent: false,
  },
  {
    id: 'n4',
    category: L('Project', 'Projet'),
    title: L(
      'Recreation Centre On Track to Open August 2026',
      "Le centre récréatif en voie d'ouvrir en août 2026",
    ),
    date: L('July 17, 2026', '17 juillet 2026'),
    urgent: false,
  },
];

export interface CommunityEvent {
  readonly id: string;
  /** Split on the space into month / day for the date tile, so both parts localize. */
  readonly date: LocalizedLabel;
  readonly title: LocalizedLabel;
  readonly location: LocalizedLabel;
  readonly time: LocalizedLabel;
  readonly image: string;
  /**
   * Real alt text describing what is actually in the photograph, not the event name repeated.
   * An empty string would be correct for purely decorative imagery; these are informative.
   */
  readonly imageAlt: LocalizedLabel;
}

export const eventsFeed: readonly CommunityEvent[] = [
  {
    id: 'e1',
    date: L('Jul 16', '16 juill.'),
    // Program names are names, not descriptions. "Aqua Dance Fit" is what the schedule, the
    // signage and the instructor all call it, so translating it would make it unfindable.
    title: L('Aqua Dance Fit', 'Aqua Dance Fit'),
    location: L('The Cove Beach', 'Plage The Cove'),
    time: L('11:00 AM', '11 h'),
    image: aquaDanceFit,
    imageAlt: L(
      'Participants doing water aerobics in a roped-off swimming area at The Cove Beach',
      "Des participants font de l'aquaforme dans une zone de baignade délimitée à la plage The Cove",
    ),
  },
  {
    id: 'e2',
    date: L('Jul 31', '31 juill.'),
    title: L('Civic Holiday: Movie in the Park', 'Congé civique : cinéma au parc'),
    location: L('Waterfront', 'Secteur riverain'),
    time: L('8:00 PM', '20 h'),
    image: movieInThePark,
    imageAlt: L(
      'The North Bay waterfront park and bandshell at sunset',
      'Le parc riverain de North Bay et son kiosque à musique au coucher du soleil',
    ),
  },
];
