import { Building, Database, Download, ExternalLink, Printer } from 'lucide-react';
import { useMemo } from 'react';
import {
  type MeetingFilter,
  meetingFilterLabels,
  meetingFilters,
  meetingTypeLabels,
  meetingsFeed,
} from '../data/feeds';
import type { TranslationKey } from '../data/i18n';
import { useTranslation } from '../hooks/useTranslation';
import { downloadCsv, toCsv } from '../lib/csv';

interface MeetingRegistryProps {
  t: (key: TranslationKey) => string;
  filter: MeetingFilter;
  setFilter: (filter: MeetingFilter) => void;
}

/**
 * PUBLIC MEETING REGISTRY.
 *
 * A real `<table>` with `<th scope="col">` headers, because this is genuinely tabular data and a
 * grid of divs would strip a screen reader user of the ability to navigate it by row and column.
 *
 * Two exports sit above it. CSV matters more than it looks: agendas and minutes are the records
 * journalists and residents actually pull from a municipal site, and handing them a machine-
 * readable file is the difference between publishing data and merely displaying it.
 */
export const MeetingRegistry = ({ t, filter, setFilter }: MeetingRegistryProps) => {
  const { getLabel } = useTranslation();
  const filteredMeetings = useMemo(
    () => (filter === 'All' ? meetingsFeed : meetingsFeed.filter((m) => m.type === filter)),
    [filter],
  );

  const handleExportCsv = () => {
    const header = [t('colDateTime'), t('colMeetingType'), t('colStatus')];
    const rows = filteredMeetings.map((m) => [
      `${m.date} ${getLabel(m.time)}`,
      getLabel(meetingTypeLabels[m.type]),
      getLabel(m.status),
    ]);
    const slug = filter.toLowerCase().replace(/\s+/g, '-');
    downloadCsv(`north-bay-meetings-${slug}.csv`, toCsv(header, rows));
  };

  return (
    <section className="print:block bg-white dark:bg-zinc-900 border-y-2 nb-border-ink dark:border-zinc-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col nb-border-ink dark:border-zinc-700 border-b-2 pb-4 mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 mb-2 text-zinc-900 dark:text-white">
              <Building size={24} aria-hidden="true" /> {t('meetingRegistry')}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('meetingRegistrySub')}</p>
          </div>

          <div className="print:hidden flex flex-nowrap items-center gap-4 overflow-x-auto pb-1">
            <div className="flex gap-2 border-r border-zinc-300 dark:border-zinc-700 pr-4 shrink-0">
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 transition-colors border border-zinc-200 dark:border-zinc-700 focus-visible:ring-2 nb-focus-ring-navy whitespace-nowrap"
              >
                <Database size={14} aria-hidden="true" /> CSV
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 transition-colors border border-zinc-200 dark:border-zinc-700 focus-visible:ring-2 nb-focus-ring-navy whitespace-nowrap"
              >
                <Printer size={14} aria-hidden="true" /> {t('printLabel')}
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label
                htmlFor="meeting-filter"
                className="text-sm font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 whitespace-nowrap"
              >
                <span className="sr-only">{t('filterLabel')}</span>
              </label>
              <select
                id="meeting-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as MeetingFilter)}
                className="bg-zinc-100 dark:bg-zinc-800 border-2 nb-border-ink dark:border-zinc-600 text-sm font-bold py-2 px-3 outline-none nb-focus-ring-navy-all cursor-pointer text-zinc-900 dark:text-zinc-100 transition-colors"
              >
                {meetingFilters.map((option) => (
                  <option key={option} value={option}>
                    {getLabel(meetingFilterLabels[option])}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/*
          `relative` is load-bearing, not decoration. The table is 800px wide inside this
          scrolling wrapper, and the screen-reader-only spans in the action links are
          `position: absolute` (that is how Tailwind's `sr-only` works). An absolutely
          positioned element is only clipped by an ancestor with `overflow` if that ancestor is
          also its containing block — which requires it to be positioned. Without `relative`
          here, those spans resolve against the page instead, land at x≈800, and drag the whole
          document's scroll width out to 720px on a 390px phone: the page scrolls sideways with
          nothing visible to scroll to. Caught by the mobile overflow assertion in
          tests/verify.mjs, not by looking at it.
        */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: '800px' }}>
            <caption className="sr-only">{t('meetingsCaption')}</caption>
            <thead>
              <tr className="border-b-2 border-zinc-300 dark:border-zinc-700">
                <th
                  scope="col"
                  style={{ width: '20%' }}
                  className="py-4 px-4 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-500 uppercase"
                >
                  {t('colDateTime')}
                </th>
                <th
                  scope="col"
                  style={{ width: '30%' }}
                  className="py-4 px-4 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-500 uppercase"
                >
                  {t('colMeetingType')}
                </th>
                <th
                  scope="col"
                  style={{ width: '20%' }}
                  className="py-4 px-4 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-500 uppercase"
                >
                  {t('colStatus')}
                </th>
                <th
                  scope="col"
                  style={{ width: '30%' }}
                  className="print:hidden py-4 px-4 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-500 uppercase text-right"
                >
                  {t('colActions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group"
                  >
                    <td className="py-4 px-4 align-top">
                      {/*
                        <time> with a machine-readable datetime: the visible text is the ISO
                        date, but marking it up means a browser or assistive tech can treat it as
                        a date rather than an opaque string.
                      */}
                      <time
                        dateTime={meeting.date}
                        className="font-bold nb-text-ink dark:text-zinc-100 block"
                      >
                        {meeting.date}
                      </time>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {getLabel(meeting.time)}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top font-bold nb-text-navy dark:text-blue-400">
                      {getLabel(meetingTypeLabels[meeting.type])}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span
                        className={`text-xs font-bold px-2 py-1 border ${
                          meeting.status.en === 'Notice Issued'
                            ? 'bg-zinc-100 border-zinc-300 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300'
                            : 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
                        }`}
                      >
                        {getLabel(meeting.status)}
                      </span>
                    </td>
                    <td className="print:hidden py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        {meeting.agendaUrl ? (
                          <a
                            href={meeting.agendaUrl}
                            /*
                              Hover expressed entirely in Tailwind utilities rather than the
                              nb- tokens. Both the resting and hover colours here have dark-mode
                              counterparts, and keeping the whole set in one layer means the pair
                              can never half-apply — which is exactly what happened before: the
                              background stayed white while the text turned white with it, and
                              the button vanished into the page.
                            */
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-zinc-900 border-2 nb-border-ink dark:border-zinc-500 text-zinc-900 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 dark:hover:border-zinc-100 px-3 py-1.5 transition-colors focus-visible:ring-2 nb-focus-ring-navy"
                          >
                            <Download size={14} aria-hidden="true" />
                            {/* The link text alone would be four identical "Agenda" links to a
                                screen reader running a link list; the meeting type disambiguates. */}
                            {t('agendaLabel')}
                            <span className="sr-only">
                              {' '}
                              — {getLabel(meetingTypeLabels[meeting.type])}, {meeting.date}
                            </span>
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 italic mr-2">
                            {t('notYetAvailable')}
                          </span>
                        )}
                        {meeting.videoUrl && (
                          <a
                            href={meeting.videoUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 border-2 nb-border-navy dark:border-blue-500 nb-text-navy dark:text-blue-400 hover:bg-[#003366] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white px-3 py-1.5 transition-colors focus-visible:ring-2 nb-focus-ring-navy"
                          >
                            <ExternalLink size={14} aria-hidden="true" />
                            {t('watchLiveLabel')}
                            <span className="sr-only">
                              {' '}
                              — {getLabel(meetingTypeLabels[meeting.type])}, {meeting.date}
                            </span>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-zinc-500 dark:text-zinc-500 font-medium"
                  >
                    {t('noMeetings')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
