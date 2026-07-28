import { ChevronDown } from 'lucide-react';
import type { RefObject } from 'react';
import type { LocalizedLabel, TranslationKey } from '../data/i18n';
import { type QuickTaskAction, quickTasks } from '../data/navigation';
import { SearchCombobox } from './SearchCombobox';

interface HeroProps {
  t: (key: TranslationKey) => string;
  getLabel: (obj: LocalizedLabel) => string;
  onTaskSelect: (action: QuickTaskAction) => void;
  searchSectionRef: RefObject<HTMLDivElement | null>;
}

/**
 * HERO — intent first.
 *
 * Two ways in, side by side: pick your task from a list, or search. Both are above the fold on
 * a phone, which is the whole point of having folded the utility bar into the header.
 *
 * The "I want to..." selector is the site's organizing principle. It replaces a fifth "Life
 * Events" navigation tab that duplicated this exact logic — the original put life-stage
 * journeys and city departments beside each other as if they were the same kind of thing, and
 * left the visitor to work out which mental model applied to which tab before clicking.
 */
export const Hero = ({ t, getLabel, onTaskSelect, searchSectionRef }: HeroProps) => (
  <section className="print:hidden bg-white dark:bg-zinc-900 border-b-2 nb-border-ink dark:border-zinc-700 pt-12 pb-12 px-4 sm:px-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8 text-center sm:text-left text-zinc-900 dark:text-white">
        {t('heroHeading')}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 shadow-sm">
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
            className="w-full appearance-none bg-zinc-100 dark:bg-zinc-800 border-2 nb-border-ink dark:border-zinc-600 nb-focus-ring-navy-all text-lg font-bold py-5 pl-6 pr-12 rounded-none outline-none cursor-pointer text-zinc-900 dark:text-zinc-100"
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

        <div ref={searchSectionRef} className="flex-1">
          <SearchCombobox placeholder={t('searchPrompt')} variant="hero" />
        </div>
      </div>
    </div>
  </section>
);
