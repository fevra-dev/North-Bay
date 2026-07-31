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
  /*
    `z-20`, and deliberately NOT `overflow-hidden`.

    Clipping the section was how the background photograph was kept inside its box, and it also
    silently amputated the search results panel: the listbox drops out of the bottom of the hero,
    so anything typed into the field produced suggestions sheared off at the section edge. The
    photograph does not actually need clipping — `absolute inset-0` already bounds it to exactly
    this box — so the clip was pure cost.

    `isolate` still creates the stacking context the `-z-10` image and scrim sit inside, and
    `z-20` lifts that whole context above the sections that follow, so the dropdown paints over
    the City Services row instead of behind it.
  */
  <section className="print:hidden relative z-20 isolate border-b-2 nb-border-ink dark:border-zinc-700">
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
          The photograph is a 2.82:1 panorama, and the two breakpoints crop it along different
          axes — which is why they need different focal points rather than one shared value.

          On a phone the container is taller than it is wide, so `object-cover` keeps the full
          height and crops the sides. Centred, that crop lands on open water and throws away the
          downtown and marina that make the image recognisably North Bay; 32% keeps the shoreline
          and the town in frame. The vertical value is inert here — the whole height is shown.

          From `sm` up it inverts: the hero is a 5.81:1 letterbox at 1440px, so only the middle
          49% of the photograph survives and the horizontal value is the inert one. Centred
          vertically, that window put the marina at 58–81% of the hero — directly behind the
          search row, which occupies 51–80%. The most characterful part of the photograph was
          sitting underneath two opaque white boxes.

          70% raises it to 37–60%, clear of the search and beside the heading, while keeping a
          legible band of downtown along the top. Pushed further — 82% was tested — the skyline
          thins to a sliver and the lower half becomes dead water. Adding hero height instead was
          also tested: it costs 119px of vertical space and returns the marina to behind the
          search, because the search row moves down with it.
        */
        className="absolute inset-0 -z-10 w-full h-full object-cover object-[32%_center] sm:object-[50%_70%]"
      />
    )}

    {/*
      TWO LAYERS, because the contrast requirement applies where the TEXT is, not evenly across
      the whole photograph.

      The flat base is deliberately faint — 10% rather than the 30% it used to carry. Its only
      job is to unify the photograph and stop the white search boxes vibrating against a bright
      backdrop; it was never what made the heading legible, and at 30% it was dimming the
      downtown and the marina to buy contrast it did not deliver.

      Nearly all of the contrast now comes from the gradient in `.nb-hero-scrim`
      (styles/index.css), which holds its density through the top third where the heading sits
      and releases over the city below. Reshaping it rather than simply lightening it improved
      both numbers at once: the hero is 11.7% brighter while the worst-case heading contrast rose
      from 4.74:1 to 5.97:1.

      The measured result governs. tests/verify.mjs samples the lightest pixel behind the heading
      with the heading hidden, rather than averaging the section, because the average was never
      the number the standard cares about — and it now samples a wide viewport too, since that is
      where the crop is harshest and the contrast thinnest.
    */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-[#003366]/10 dark:bg-[#001a33]/22"
    />
    <div aria-hidden="true" className="absolute inset-0 -z-10 nb-hero-scrim" />

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
                {task.href ? ' ↗' : ''}
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
