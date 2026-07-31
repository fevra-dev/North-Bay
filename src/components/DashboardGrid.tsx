import { Calendar, FileText, MapPin } from 'lucide-react';
import { eventsFeed, newsFeed } from '../data/feeds';
import type { TranslationKey } from '../data/i18n';
import { cityLinks } from '../data/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { eventPlaceholderImage } from '../lib/placeholder';
import { CityLink } from './CityLink';

/**
 * Three of each, and the two counts matching is the point.
 *
 * The columns previously held four news items against two events, and because an event card
 * carried a 16:9 photograph at half-column width — 660px wide, so 371px tall — the events column
 * ran 401px longer than the news beside it. Measured, not estimated. Nearly half the news column
 * was empty, which is not a stylistic quibble: a void that size reads as content failing to load.
 *
 * Three is also enough to show the City is active without turning a homepage into an archive. The
 * news feed still holds four items, so "View all news" leads somewhere real rather than being a
 * link that quietly admits there is nothing behind it.
 */
const VISIBLE = 3;

interface DashboardGridProps {
  t: (key: TranslationKey) => string;
  isLowBandwidth: boolean;
}

/**
 * RECENT NEWS and FEATURED EVENTS, side by side.
 *
 * News stays text-only while events carry a photograph, and that difference is deliberate rather
 * than inconsistent: a headline is something to scan, and a picture does not make "Council
 * approved the 2027 budget" faster to read. An event is the opposite question — is this worth
 * turning up to — which text alone answers poorly.
 *
 * What changed is the photograph's size, not its presence. At 128px it still answers that
 * question at a glance. "As little design as possible" was never an argument for removing the
 * image; it is an argument for the image being no larger than its purpose requires.
 */
export const DashboardGrid = ({ t, isLowBandwidth }: DashboardGridProps) => {
  const { getLabel } = useTranslation();

  return (
    <section className="print:block max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Recent news — text only, for scanning. */}
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
            {newsFeed.slice(0, VISIBLE).map((news) => (
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

        {/* Featured events — date, thumbnail and detail in one horizontal band. */}
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
            {eventsFeed.slice(0, VISIBLE).map((event, index) => {
              const [month, day] = getLabel(event.date).split(' ');
              return (
                <a
                  href="#"
                  key={event.id}
                  className="flex items-stretch bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden group nb-hover-border-ink dark:hover:border-zinc-500 transition-colors focus-visible:ring-2 nb-focus-ring-navy"
                >
                  {/*
                    One `nb-event-date` component class rather than a stack of utilities. See
                    styles/index.css: the utility version produced navy-on-navy in light mode and
                    blue-on-blue in dark, because the hover rules and the base colours sat in
                    different cascade layers.
                  */}
                  <div
                    className="nb-event-date px-3 flex flex-col items-center justify-center shrink-0"
                    style={{ minWidth: '68px' }}
                  >
                    <span className="nb-event-month text-xs font-bold uppercase leading-none mb-1">
                      {month}
                    </span>
                    <span className="nb-event-day text-2xl font-black leading-none">{day}</span>
                  </div>

                  {!isLowBandwidth && (
                    /*
                      A real photo carries real information, so its alt text describes what is in
                      it. The gradient fallback carries none, so its alt is empty — it is
                      decorative and the text beside it already holds the content. Announcing
                      "gradient placeholder" would be noise, not information.
                    */
                    <img
                      src={event.image || eventPlaceholderImage(index)}
                      alt={event.image ? getLabel(event.imageAlt) : ''}
                      loading="lazy"
                      decoding="async"
                      width={128}
                      height={96}
                      className="w-32 shrink-0 self-stretch object-cover"
                    />
                  )}

                  <div className="p-4 flex-1 min-w-0">
                    <h3 className="font-bold text-sm mb-1.5 group-hover:underline group-active:underline text-zinc-900 dark:text-zinc-100">
                      {getLabel(event.title)}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} aria-hidden="true" /> {getLabel(event.location)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span aria-hidden="true">•</span> {getLabel(event.time)}
                      </span>
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
