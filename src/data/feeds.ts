import aquaDanceFit from '../assets/aqua-dance-fit.jpg';
import movieInThePark from '../assets/movie-in-the-park.jpg';

/**
 * MOCK CONTENT FEEDS.
 *
 * Everything here stands in for what a CMS would supply. The shapes are the contract: a real
 * integration should be able to drop its own objects in without any component changing.
 *
 * The event photos were originally inlined as base64 so the single-file prototype had zero
 * dependency on an asset path resolving. Now that this is a real project with a real asset
 * pipeline, they are ordinary imports: Vite fingerprints the filenames, so browsers cache them
 * across deploys and the bundle no longer carries 30KB of base64 it has to parse as JavaScript.
 */

export interface Meeting {
  readonly id: string;
  readonly type: 'City Council' | 'Committee' | 'Public Meeting';
  /** ISO 8601 (YYYY-MM-DD). Machine-sortable, and unambiguous across locales. */
  readonly date: string;
  readonly time: string;
  readonly status: string;
  readonly agendaUrl: string;
  /** `null` when a meeting has no recording — not every proceeding is livestreamed. */
  readonly videoUrl: string | null;
}

export const meetingsFeed: readonly Meeting[] = [
  {
    id: 'm1',
    type: 'City Council',
    date: '2026-07-14',
    time: '6:30 PM',
    status: 'Agenda Published',
    agendaUrl: '#',
    videoUrl: '#',
  },
  {
    id: 'm2',
    type: 'Committee',
    date: '2026-07-14',
    time: '6:30 PM',
    status: 'Agenda Published',
    agendaUrl: '#',
    videoUrl: null,
  },
  {
    id: 'm3',
    type: 'Public Meeting',
    date: '2026-07-18',
    time: '5:00 PM',
    status: 'Notice Issued',
    agendaUrl: '#',
    videoUrl: null,
  },
];

/** Filter options for the meeting registry. 'All' is the default view. */
export const meetingFilters = ['All', 'City Council', 'Committee', 'Public Meeting'] as const;
export type MeetingFilter = (typeof meetingFilters)[number];

export interface NewsItem {
  readonly id: string;
  readonly category: string;
  readonly title: string;
  readonly date: string;
  /** Drives an explicit "Urgent" text badge, not just a color change. */
  readonly urgent: boolean;
}

/**
 * Headlines follow the City's own house style, which is worth matching precisely: specific
 * street names, a concrete date in the headline where one exists, and plain declarative phrasing
 * rather than promotional language. "Final Paving on McKeown Avenue Begins Monday" tells a
 * resident whether it affects them before they click; "Exciting Road Improvements!" does not.
 */
export const newsFeed: readonly NewsItem[] = [
  {
    id: 'n1',
    category: 'Notice',
    title: 'Road Closure: Main Street Revitalization',
    date: 'July 27, 2026',
    urgent: true,
  },
  {
    id: 'n2',
    category: 'Roads',
    title: 'Sidewalk Improvements at Lakeshore Drive and Mulligan Avenue',
    date: 'July 25, 2026',
    urgent: false,
  },
  {
    id: 'n3',
    category: 'Housing',
    title: 'City Secures $336,000 from the Building Faster Fund',
    date: 'July 21, 2026',
    urgent: false,
  },
  {
    id: 'n4',
    category: 'Project',
    title: 'Recreation Centre On Track to Open August 2026',
    date: 'July 17, 2026',
    urgent: false,
  },
];

export interface CommunityEvent {
  readonly id: string;
  readonly date: string;
  readonly title: string;
  readonly location: string;
  readonly time: string;
  readonly image: string;
  /**
   * Real alt text describing what is actually in the photograph, not the event name repeated.
   * An empty string would be correct for purely decorative imagery; these are informative.
   */
  readonly imageAlt: string;
}

export const eventsFeed: readonly CommunityEvent[] = [
  {
    id: 'e1',
    date: 'Jul 16',
    title: 'Aqua Dance Fit',
    location: 'The Cove Beach',
    time: '11:00 AM',
    image: aquaDanceFit,
    imageAlt: 'Participants doing water aerobics in a roped-off swimming area at The Cove Beach',
  },
  {
    id: 'e2',
    date: 'Jul 31',
    title: 'Civic Holiday: Movie in the Park',
    location: 'Waterfront',
    time: '8:00 PM',
    image: movieInThePark,
    imageAlt: 'The North Bay waterfront park and bandshell at sunset',
  },
];
