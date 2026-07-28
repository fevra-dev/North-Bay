import { ChevronDown } from 'lucide-react';
import type { RefObject } from 'react';
import waterfront from '../assets/waterfront.jpg';
import type { LocalizedLabel, TranslationKey } from '../data/i18n';
import { type QuickTaskAction, quickTasks } from '../data/navigation';
import { SearchCombobox } from './SearchCombobox';

interface HeroProps {
  t: (key: TranslationKey) => string;
  getLabel: (obj: LocalizedLabel) => string;
  onTaskSelect: (action: QuickTaskAction) => void;
  searchSectionRef: RefObject<HTMLDivElement | null>;
  /** Data-saver mode drops the hero photograph entirely. */
  isLowBandwidth: boolean;
}

/**
 * HERO — intent first, over a photograph of the place.
 *
 * Two ways in, side by side: pick your task from a list, or search. Both are above the fold on a
 * phone, which is the point of having folded the utility bar into the header.
 *
 * The "I want to…" selector is the site's organizing principle. It replaces a fifth "Life Events"
 * navigation tab that duplicated this exact logic — the original put life-stage journeys and city
 * departments beside each other as if they were the same kind of thing, and left the visitor to
 * work out which mental model applied to which tab before clicking.
 *
 * ON PUTTING TEXT OVER A PHOTOGRAPH
 *
 * A hero image is where municipal sites most often quietly fail WCAG: white text is dropped onto
 * a photo, it looks fine against the one region the designer checked, and it becomes unreadable
 * over a bright patch somewhere else — a cloud, a sunlit building, a stretch of water. The
 * contrast requirement (SC 1.4.3, 4.5:1) applies to the text against *whatever pixel is actually
 * behind it*, not against the average.
 *
 * So the photograph never sits directly behind text here. A solid navy scrim covers it at a fixed
 * opacity, which puts a known, measurable colour behind every character regardless of what the
 * image is doing underneath. The scrim is the brand navy rather than generic black, so the
 * treatment still reads as the City's rather than as a stock overlay.
 *
 * The measured result is asserted in tests/verify.mjs: the real composited pixel behind the
 * heading is sampled from a screenshot and its contrast against white is computed. That number
 * has to clear 4.5:1 or the suite fails, so a future change to the photo or the scrim cannot
 * silently break legibility.
 */
export const Hero = ({
  t,
  getLabel,
  onTaskSelect,
  searchSectionRef,
  isLowBandwidth,
}: HeroProps) => (
  <section className="print:hidden relative isolate border-b-2 nb-border-ink dark:border-zinc-700 overflow-hidden">
    {/*
      Data-saver mode skips the photograph outright and falls back to flat navy. This is the
      single heaviest asset on the page, and the whole point of the mode is that someone on a
      metered or weak connection should not pay for atmosphere.
    */}
    {!isLowBandwidth && (
      <img
        src={waterfront}
        alt=""
        aria-hidden="true"
        /*
          eager + high priority, deliberately the opposite of every other image on the page.
          This is the Largest Contentful Paint element; deferring it is measurably the wrong
          call, whereas the event photos further down genuinely should wait.
        */
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={1920}
        height={680}
        /*
          The photograph is a 2.82:1 panorama. On a phone, `object-cover` keeps the full height
          and crops the sides — and centred, that crop lands on open water, throwing away the
          downtown and marina that make the image recognisably North Bay. Shifting the focal
          point left keeps the shoreline and the town in frame on narrow viewports, and returns
          to centre at `sm` and up where the full panorama fits.
        */
        className="absolute inset-0 -z-10 w-full h-full object-cover object-[32%_center] sm:object-center"
      />
    )}

    {/*
      The scrim. Slightly denser at the top where the sky is brightest, easing toward the bottom
      over the darker water — enough variation to keep the photograph readable as a photograph,
      never light enough to put the text at risk. In dark mode it deepens further so the hero
      does not glow against a near-black page.
    */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-linear-to-b from-[#003366]/79 via-[#003366]/68 to-[#002347]/77 dark:from-[#001a33]/89 dark:via-[#001a33]/82 dark:to-[#00101f]/87"
    />

    <div className="max-w-4xl mx-auto pt-12 pb-12 px-4 sm:px-8">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8 text-center sm:text-left text-white drop-shadow-sm">
        {t('heroHeading')}
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 shadow-lg">
          <label htmlFor="task-select" className="sr-only">
            {t('iWantTo')}
          </label>
          <select
            id="task-select"
            defaultValue=""
            onChange={(e) => {
              const action = e.target.value as QuickTaskAction | '';
              if (action) onTaskSelect(action);
              // Reset to the prompt so the control reads as an action launcher rather than a
              // persistent filter — selecting the same task twice in a row has to work.
              e.target.value = '';
            }}
            className="w-full appearance-none bg-white dark:bg-zinc-800 border-2 nb-border-ink dark:border-zinc-600 nb-focus-ring-navy-all text-lg font-bold py-5 pl-6 pr-12 rounded-none outline-none cursor-pointer text-zinc-900 dark:text-zinc-100"
          >
            <option value="">{t('iWantTo')}</option>
            {quickTasks.map((task) => (
              <option key={task.action} value={task.action}>
                {getLabel(task.label)}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-4 top-6 text-zinc-500 dark:text-zinc-400 pointer-events-none"
            size={24}
            aria-hidden="true"
          />
        </div>

        <div ref={searchSectionRef} className="flex-1 shadow-lg">
          <SearchCombobox placeholder={t('searchPrompt')} variant="hero" />
        </div>
      </div>
    </div>
  </section>
);
