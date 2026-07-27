import { ChevronRight, Home } from 'lucide-react';
import type { TranslationKey } from '../data/i18n';

interface BreadcrumbsProps {
  t: (key: TranslationKey) => string;
}

/**
 * Real anchors, not styled spans, so a keyboard or screen reader user can actually follow the
 * trail back up. The separators are `aria-hidden` and sit outside the list items: a chevron
 * announced as "greater than" between every level is noise, and the `<ol>` already conveys the
 * hierarchy. The current page carries `aria-current="page"` and is deliberately not a link.
 */
export const Breadcrumbs = ({ t }: BreadcrumbsProps) => (
  <nav
    aria-label="Breadcrumb"
    className="print:hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-2"
  >
    <ol className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
      <li className="flex items-center gap-2">
        <Home size={12} className="shrink-0" aria-hidden="true" />
        <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline">
          {t('breadcrumbHome')}
        </a>
      </li>
      <ChevronRight size={12} aria-hidden="true" />
      <li>
        <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline">
          {t('breadcrumbDashboard')}
        </a>
      </li>
      <ChevronRight size={12} aria-hidden="true" />
      <li aria-current="page" className="text-zinc-900 dark:text-zinc-100 font-bold">
        {t('breadcrumbCurrent')}
      </li>
    </ol>
  </nav>
);
