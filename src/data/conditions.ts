/**
 * CURRENT CONDITIONS.
 *
 * Winter road conditions and fire danger are the two seasonal, high-frequency things a
 * resident of a northern Ontario city checks a municipal site for, and neither is on
 * northbay.ca as it stands today.
 *
 * Whether the overnight parking ban is on is arguably the single most-checked piece of
 * information on a snowbelt city's site from November through April. In a real deployment this
 * comes from Public Works' own feed; the shape below is the shape that feed should fill.
 *
 * The two are seasonally exclusive in production — nobody needs a parking-ban widget in July —
 * so only one ships live at a time. `currentConditionsSeason` flips which the demo shows,
 * rather than maintaining two widgets that would never both be relevant at once.
 */

export interface WinterConditions {
  readonly parkingBanActive: boolean;
  readonly roadConditionSummary: string;
  readonly updatedAt: string;
}

export const winterConditions: WinterConditions = {
  parkingBanActive: false,
  roadConditionSummary: 'Bare and dry',
  updatedAt: '6:45 AM today',
};

/** Fire danger levels, low to extreme. Order is load-bearing: it drives the gauge geometry. */
export type FireDangerLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface FireConditions {
  readonly dangerLevel: FireDangerLevel;
  readonly banActive: boolean;
  readonly updatedAt: string;
}

/**
 * Real content would come from the MNRF fire danger feed and the City's own fire-ban status.
 * `dangerLevel` drives the gauge needle position, the band color, and the text below it from
 * one single source of truth, so the needle and the words can never contradict each other.
 */
export const fireConditions: FireConditions = {
  dangerLevel: 'high',
  banActive: false,
  updatedAt: '6:45 AM today',
};

export type ConditionsSeason = 'winter' | 'fire';

export const currentConditionsSeason: ConditionsSeason = 'fire';

/**
 * The four danger bands, in ascending order of severity. Colors are chosen to hold a 3:1
 * contrast ratio against the card background at the stroke weight used (WCAG 2.2 AA, SC 1.4.11
 * Non-text Contrast), and the level is always spelled out in text beside the gauge so the color
 * is never the sole carrier of the reading.
 */
export const FIRE_DANGER_LEVELS: readonly { key: FireDangerLevel; color: string }[] = [
  { key: 'low', color: '#16a34a' },
  { key: 'medium', color: '#d97706' },
  { key: 'high', color: '#ea580c' },
  { key: 'extreme', color: '#dc2626' },
];
