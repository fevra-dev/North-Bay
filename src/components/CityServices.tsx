import { ArrowRight } from 'lucide-react';
import type { LocalizedLabel, TranslationKey } from '../data/i18n';
import { cityServices } from '../data/navigation';
import { CityLink } from './CityLink';

interface CityServicesProps {
  t: (key: TranslationKey) => string;
  getLabel: (obj: LocalizedLabel) => string;
}

/**
 * CITY SERVICES — the four highest-traffic transactions as permanent, one-click targets.
 *
 * These sit beside the current-conditions gauge rather than below it, which is the arrangement
 * the City's own homepage uses and the right one: both are "what do I need to know or do right
 * now" content, and stacking them pushes the second one below the fold for no gain.
 *
 * Rendered as a 2×2 grid on desktop and a single column on mobile. Each is a real link with a
 * visible focus ring and a hit area well past the 24×24px WCAG 2.2 AA target-size minimum
 * (SC 2.5.8) — these are the controls most likely to be tapped one-handed on a phone.
 */
export const CityServices = ({ t, getLabel }: CityServicesProps) => (
  <div className="bg-white dark:bg-zinc-900 border-2 nb-border-ink dark:border-zinc-700 p-5 h-full flex flex-col">
    <h2 className="font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white mb-4">
      {t('cityServices')}
    </h2>
    <ul className="grid sm:grid-cols-2 gap-3 flex-1">
      {cityServices.map((service) => (
        <li key={service.label.en} className="flex">
          <CityLink
            href={service.href}
            className="group flex-1 flex items-center justify-between gap-2 border-2 nb-border-navy dark:border-blue-500 nb-text-navy dark:text-blue-400 px-4 py-3 text-sm font-bold transition-colors nb-hover-bg-navy nb-hover-text-white dark:hover:bg-blue-600 dark:hover:text-white focus-visible:ring-2 nb-focus-ring-navy"
          >
            {getLabel(service.label)}
            <ArrowRight
              size={14}
              className="shrink-0 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5"
              aria-hidden="true"
            />
          </CityLink>
        </li>
      ))}
    </ul>
  </div>
);
