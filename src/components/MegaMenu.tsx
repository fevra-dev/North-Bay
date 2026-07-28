import { ArrowRight } from 'lucide-react';
import type { NavCategory } from '../data/i18n';
import { categoryDescriptions, siteStructure } from '../data/navigation';

interface MegaMenuProps {
  category: NavCategory;
  categoryLabel: string;
}

/** Desktop dropdown listing everything under one top-level navigation category. */
export const MegaMenu = ({ category, categoryLabel }: MegaMenuProps) => {
  const items = siteStructure[category];
  if (!items) return null;

  return (
    <div className="hidden lg:block absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b-2 nb-border-ink dark:border-zinc-700 shadow-2xl animate-in slide-in-from-top-2 duration-200">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-start justify-between gap-8 mb-8 border-b border-zinc-200 dark:border-zinc-700 pb-4">
          <div>
            <h2 className="text-2xl font-black nb-text-navy dark:text-blue-400 mb-1">
              {categoryLabel}
            </h2>
            {/*
              A one-line description under each menu heading, as the City's own mega menus carry.
              "Business" alone makes a visitor guess whether the section is for starting one,
              paying one's taxes, or bidding on work; a sentence answers it before they scan
              fifteen links looking for the answer.
            */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {categoryDescriptions[category]}
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 text-sm font-bold flex items-center gap-1 hover:underline text-zinc-900 dark:text-zinc-100"
          >
            Directory <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <ul className="grid grid-cols-3 gap-x-12 gap-y-4">
          {items.map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-zinc-600 dark:text-zinc-300 font-medium nb-hover-text-navy dark:hover:text-blue-400 hover:underline decoration-2 underline-offset-4 flex items-start gap-2"
              >
                <span
                  className="mt-1.5 w-1 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full shrink-0"
                  aria-hidden="true"
                />
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
