/**
 * SEARCH INDEX.
 *
 * A flat, hand-curated index standing in for whatever the real site's search backend would
 * return. Kept deliberately small and realistic rather than exhaustive: the point of the demo
 * is the interaction pattern (WAI-ARIA combobox, arrow-key navigation, announced result
 * counts), not the retrieval quality.
 *
 * `type` is surfaced to the resident as a badge on each result, because "Property Taxes" being
 * a *service* and "2026 Municipal Elections" being a *guide* changes what someone expects to
 * find on the other side of the click.
 */
export type SearchResultType = 'Service' | 'Guide' | 'Application' | 'Notice' | 'Public Record';

export interface SearchEntry {
  readonly title: string;
  readonly category: string;
  readonly type: SearchResultType;
}

export const searchIndex: readonly SearchEntry[] = [
  { title: 'Property Taxes', category: 'Payments', type: 'Service' },
  { title: 'Garbage & Recycling Collection Schedule', category: 'Services', type: 'Guide' },
  { title: 'Building Permits', category: 'Development', type: 'Application' },
  { title: 'North Bay Transit Schedules', category: 'Transportation', type: 'Service' },
  { title: 'Parking Tickets & Fines', category: 'Payments', type: 'Service' },
  { title: 'Overnight Parking Ban', category: 'Transportation', type: 'Notice' },
  { title: 'Council Meetings, Agendas & Minutes', category: 'Government', type: 'Public Record' },
  { title: '2026 Municipal Elections', category: 'Government', type: 'Guide' },
  { title: 'Business Licensing', category: 'Business', type: 'Application' },
  { title: 'Bid Opportunities & Tenders', category: 'Business', type: 'Service' },
  { title: 'Marriage Licences', category: 'Services', type: 'Application' },
  { title: 'Parks, Playgrounds & Trails', category: 'Community', type: 'Guide' },
  { title: 'Recreation Programs & Facility Booking', category: 'Community', type: 'Service' },
  { title: 'Report a Pothole or Road Issue', category: 'Services', type: 'Service' },
  { title: 'Water & Wastewater Billing', category: 'Payments', type: 'Service' },
  { title: 'Freedom of Information Requests', category: 'Government', type: 'Application' },
];
