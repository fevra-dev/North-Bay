import { ArrowRight, BarChart3 } from 'lucide-react';
import type { TranslationKey } from '../data/i18n';
import { cityLinks } from '../data/navigation';
import { CityLink } from './CityLink';

interface MunicipalDashboardProps {
  t: (key: TranslationKey) => string;
}

/**
 * MUNICIPAL DASHBOARD.
 *
 * A full-width banner immediately above the footer, matching where the City places its own.
 * The position is deliberate rather than leftover: open municipal data is something a resident
 * goes looking for after they have finished the task they arrived to do, so it belongs at the
 * end of the page — prominent, but not competing with the transactions above it.
 *
 * The heading is a real `h2` inside a `section` with an accessible name, so it appears in a
 * screen reader's landmark and heading lists rather than reading as a stray banner.
 */
export const MunicipalDashboard = ({ t }: MunicipalDashboardProps) => (
  <section
    aria-labelledby="municipal-dashboard-heading"
    className="print:hidden max-w-7xl mx-auto px-4 sm:px-8 pb-12"
  >
    <div className="bg-white dark:bg-zinc-900 border-2 nb-border-ink dark:border-zinc-700 p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex-1">
        <h2
          id="municipal-dashboard-heading"
          className="text-xl font-black flex items-center gap-2 mb-2 text-zinc-900 dark:text-white"
        >
          <BarChart3 size={22} className="nb-text-navy dark:text-blue-400" aria-hidden="true" />
          {t('municipalDashboard')}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {t('municipalDashboardSub')}
        </p>
      </div>
      <CityLink
        href={cityLinks.municipalDashboard}
        className="group shrink-0 inline-flex items-center justify-center gap-2 nb-bg-navy nb-hover-navy-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3.5 text-sm font-bold transition-colors focus-visible:ring-2 nb-focus-ring-navy focus-visible:ring-offset-2"
      >
        {t('exploreDashboard')}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1 group-active:translate-x-1"
          aria-hidden="true"
        />
      </CityLink>
    </div>
  </section>
);
