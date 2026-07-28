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
  // Payments and billing
  { title: 'Property Taxes', category: 'Payments', type: 'Service' },
  { title: 'Pay a Parking Ticket', category: 'Payments', type: 'Service' },
  { title: 'Parking Tickets & Fines', category: 'Payments', type: 'Service' },
  { title: 'Water & Wastewater Billing', category: 'Payments', type: 'Service' },
  { title: 'eServices Portal', category: 'Payments', type: 'Service' },
  { title: 'User Fees & Charges', category: 'Payments', type: 'Public Record' },

  // Waste
  { title: 'Garbage & Recycling', category: 'Services', type: 'Guide' },
  { title: 'Curbside Collection Schedule', category: 'Services', type: 'Guide' },
  { title: 'Residential Garbage Collection', category: 'Services', type: 'Guide' },
  { title: 'Waste Diversion & Household Hazardous Waste', category: 'Services', type: 'Guide' },
  { title: 'Landfill Hours & Fees', category: 'Services', type: 'Guide' },

  // Building and development
  { title: 'Building Permits', category: 'Development', type: 'Application' },
  { title: 'Building & Development', category: 'Development', type: 'Guide' },
  { title: 'Zoning By-Law & Land Use', category: 'Development', type: 'Public Record' },
  { title: 'Planning Applications', category: 'Development', type: 'Application' },

  // Transportation
  { title: 'North Bay Transit Schedules', category: 'Transportation', type: 'Service' },
  { title: 'Transit Planner', category: 'Transportation', type: 'Service' },
  { title: 'Overnight Parking Ban', category: 'Transportation', type: 'Notice' },
  { title: 'Streets & Sidewalks', category: 'Transportation', type: 'Service' },
  { title: 'Active Transportation', category: 'Transportation', type: 'Guide' },
  { title: 'Winter Road Maintenance', category: 'Transportation', type: 'Guide' },

  // Government
  { title: 'Council Meetings, Agendas & Minutes', category: 'Government', type: 'Public Record' },
  { title: '2026 Municipal Elections', category: 'Government', type: 'Guide' },
  { title: 'Mayor & Council', category: 'Government', type: 'Guide' },
  { title: 'Municipal Dashboard', category: 'Government', type: 'Public Record' },
  { title: 'Budget and Finance', category: 'Government', type: 'Public Record' },
  { title: 'By-Laws', category: 'Government', type: 'Public Record' },
  { title: 'Freedom of Information Requests', category: 'Government', type: 'Application' },
  { title: 'Careers with the City', category: 'Government', type: 'Service' },
  { title: 'Departments', category: 'Government', type: 'Guide' },
  { title: 'Media Room', category: 'Government', type: 'Public Record' },
  { title: 'Public Notices', category: 'Government', type: 'Notice' },
  { title: 'Accessibility (AODA)', category: 'Government', type: 'Guide' },
  { title: 'Land Acknowledgement', category: 'Government', type: 'Guide' },

  // Business
  { title: 'Business Licensing', category: 'Business', type: 'Application' },
  { title: 'Bid Opportunities & Tenders', category: 'Business', type: 'Service' },
  { title: 'Start & Grow a Business', category: 'Business', type: 'Guide' },
  { title: 'Economic Development', category: 'Business', type: 'Guide' },
  { title: 'Municipal Incentives', category: 'Business', type: 'Guide' },
  { title: 'Film North Bay', category: 'Business', type: 'Service' },

  // Records and licences
  { title: 'Marriage Licences', category: 'Services', type: 'Application' },
  { title: 'Births, Marriages & Deaths', category: 'Services', type: 'Application' },
  { title: 'Forms, Permits & Licenses', category: 'Services', type: 'Application' },
  { title: 'Report a Problem', category: 'Services', type: 'Service' },
  { title: 'Report a Pothole or Road Issue', category: 'Services', type: 'Service' },
  { title: 'Customer Service Centre', category: 'Services', type: 'Service' },
  { title: 'North Bay Fire and Emergency Services', category: 'Services', type: 'Service' },
  { title: 'Fire Ban & Burn Permits', category: 'Services', type: 'Notice' },

  // Community
  { title: 'Parks, Playgrounds & Trails', category: 'Community', type: 'Guide' },
  { title: 'Recreation Programs & Facility Booking', category: 'Community', type: 'Service' },
  { title: 'Sports Facilities', category: 'Community', type: 'Service' },
  { title: 'Arts, Heritage & Culture', category: 'Community', type: 'Guide' },
  { title: 'Events & Programs', category: 'Community', type: 'Guide' },
  { title: 'Marina', category: 'Community', type: 'Service' },
  { title: 'Bay Cams & Weather Forecast', category: 'Community', type: 'Service' },
  { title: 'Housing in North Bay', category: 'Community', type: 'Guide' },
  { title: 'Immigration', category: 'Community', type: 'Guide' },
  { title: 'Community Safety and Well-Being', category: 'Community', type: 'Guide' },
  { title: 'Explore North Bay - GIS Portal', category: 'Community', type: 'Service' },
  { title: 'Environment & Sustainability', category: 'Community', type: 'Guide' },
];
