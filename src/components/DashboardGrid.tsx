import { Calendar, FileText, MapPin } from 'lucide-react';
import { eventsFeed, newsFeed } from '../data/feeds';
import type { TranslationKey } from '../data/i18n';
import { cityLinks } from '../data/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { CityLink } from './CityLink';
import { eventPlaceholderImage } from '../lib/placeholder';

interface DashboardGridProps {
  t: (key: TranslationKey) => string;
  isLowBandwidth: boolean;
}

/**
 * CIVIC UPDATES and UPCOMING EVENTS, side by side.
 *
 * Updates stay text-only on purpose while events carry photos. That is not an inconsistency:
 * a news headline is something to scan quickly, and a photograph does not make "Council approved
 * the 2027 budget" faster to read. Events are the opposite — they are about atmosphere and
 * whether something looks worth attending, which text alone conveys poorly. Two content types,
 * two treatments, one deliberate reason each.
 */
export const DashboardGrid = ({ t, isLowBandwidth }: DashboardGridProps) => {
  const { getLabel } = useTranslation();
  return (
    <section className="print:block max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 nb-border-ink dark:border-zinc-700 pb-3 mb-6">
            <h2 className="text-xl font-black flex items-center gap-2 text-zinc-900 dark:text-white">
              <FileText size={20} aria-hidden="true" /> {t('recentNews')}
            </h2>
            <CityLink
              href={cityLinks.mediaRoom}
              className="print:hidden text-xs font-bold hover:underline nb-text-navy dark:text-blue-400"
            >
              {t('allUpdates')}
            </CityLink>
          </div>
          <div className="flex flex-col gap-4">
            {newsFeed.map((news) => (
              <a
                href="#"
                key={news.id}
                className="block bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm group nb-hover-border-ink dark:hover:border-zinc-500 transition-colors focus-visible:ring-2 nb-focus-ring-navy"
              >
                <div className="flex items-center gap-2 mb-2">
                  {news.urgent && (
                    <span className="print:hidden flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">
                      <span
                        className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                        aria-hidden="true"
                      />
                      {t('urgentLabel')}
                    </span>
                  )}
                  <span className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide border border-zinc-200 dark:border-zinc-700">
                    {getLabel(news.category)}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {getLabel(news.date)}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight nb-group-hover-navy dark:group-hover:text-blue-400 dark:group-active:text-blue-400 group-hover:underline group-active:underline decoration-2 underline-offset-2 text-zinc-900 dark:text-zinc-100">
                  {getLabel(news.title)}
                </h3>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 nb-border-ink dark:border-zinc-700 pb-3 mb-6">
            <h2 className="text-xl font-black flex items-center gap-2 text-zinc-900 dark:text-white">
              <Calendar size={20} aria-hidden="true" /> {t('featuredEvents')}
            </h2>
            <CityLink
              href={cityLinks.events}
              className="print:hidden text-xs font-bold hover:underline nb-text-navy dark:text-blue-400"
            >
              {t('communityCalendar')}
            </CityLink>
          </div>
          <div className="flex flex-col gap-4">
            {eventsFeed.map((event, index) => {
              const [month, day] = getLabel(event.date).split(' ');
              return (
                <a
                  href="#"
                  key={event.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden group nb-hover-border-ink dark:hover:border-zinc-500 transition-colors focus-visible:ring-2 nb-focus-ring-navy"
                >
                  {!isLowBandwidth && (
                    /*
                    A real photo carries real information, so its alt text describes what is in
                    it. The gradient fallback carries none, so its alt is empty — it is
                    decorative, and the text beside it already holds the actual content.
                    Announcing "gradient placeholder" would be noise, not information.

                    loading="lazy" defers anything below the fold regardless of data-saver mode;
                    data-saver skips non-essential imagery entirely.
                  */
                    <img
                      src={event.image || eventPlaceholderImage(index)}
                      alt={event.image ? getLabel(event.imageAlt) : ''}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={225}
                      className="w-full object-cover"
                      style={{ aspectRatio: '16 / 9' }}
                    />
                  )}
                  <div className="flex">
                    {/*
                    One `nb-event-date` component class rather than a stack of utilities. See
                    styles/index.css for why: the utility version produced navy-on-navy in light
                    mode and blue-on-blue in dark, because the hover rules and the base colors
                    sat in different cascade layers.
                  */}
                    <div
                      className="nb-event-date px-4 py-3 flex flex-col items-center justify-center"
                      style={{ minWidth: '80px' }}
                    >
                      <span className="nb-event-month text-xs font-bold uppercase leading-none mb-1">
                        {month}
                      </span>
                      <span className="nb-event-day text-2xl font-black leading-none">{day}</span>
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-sm mb-2 group-hover:underline group-active:underline text-zinc-900 dark:text-zinc-100">
                        {getLabel(event.title)}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} aria-hidden="true" /> {getLabel(event.location)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span aria-hidden="true">•</span> {getLabel(event.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
