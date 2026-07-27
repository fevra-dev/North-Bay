/**
 * SITE ALERT.
 *
 * Severity drives both the color and the ARIA role, so color carries real meaning instead of
 * decoration — and, critically, is never the *only* carrier of that meaning (WCAG 2.2 AA, SC
 * 1.4.1 Use of Color). The severity word itself is in the announced text.
 *
 * A routine notice never visually competes with a genuine emergency. The notice below is a
 * `warning`: a real, temporary disruption but not an emergency, which is why amber is right for
 * it specifically — not red, and not a quiet informational blue.
 *
 * The role mapping is the part that matters most for assistive technology:
 *   - `status`  → announced politely, at the next natural pause. Correct for info and warning.
 *   - `alert`   → interrupts whatever is currently being read out. Reserved for emergency,
 *                 because interrupting someone should require actually warranting it.
 *
 * sf.gov's own redesign writeups describe small features becoming load-bearing the moment real
 * demand arrives; a municipal alert banner is exactly that feature, which is why it gets a
 * severity model up front rather than a single hardcoded style.
 */
export type AlertSeverity = 'info' | 'warning' | 'emergency';

export interface SiteAlert {
  readonly active: boolean;
  readonly severity: AlertSeverity;
  readonly message: string;
  readonly linkLabel: string;
  readonly linkHref: string;
}

export const siteAlert: SiteAlert = {
  active: true,
  severity: 'warning',
  message: 'Main Street Revitalization Road Closures in effect until Aug 15.',
  linkLabel: 'Detour Maps',
  linkHref: '#',
};

export interface AlertSeverityStyle {
  readonly role: 'status' | 'alert';
  readonly bar: string;
  readonly text: string;
  readonly border: string;
}

export const alertSeverityStyles: Readonly<Record<AlertSeverity, AlertSeverityStyle>> = {
  info: {
    role: 'status',
    bar: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-800 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-600',
  },
  warning: {
    role: 'status',
    bar: 'bg-amber-400 dark:bg-amber-600',
    text: 'text-amber-900 dark:text-zinc-900',
    border: 'nb-border-ink dark:border-zinc-900',
  },
  emergency: {
    role: 'alert',
    bar: 'bg-red-600 dark:bg-red-700',
    text: 'text-white',
    border: 'border-red-900',
  },
};
