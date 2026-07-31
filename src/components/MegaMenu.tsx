import { ArrowRight } from 'lucide-react';
import type { NavCategory } from '../data/i18n';
import { categoryDescriptions, categoryHref, navHref, siteStructure } from '../data/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { CityLink } from './CityLink';

/**
 * The panel's id, referenced by every trigger's `aria-controls`.
 *
 * A single id is safe because only one panel is mounted at a time — opening a second closes the
 * first. If that ever changes this must become per-category, since duplicate ids would silently
 * point every trigger at whichever panel the document happened to contain first.
 */
export const MEGA_MENU_ID = 'nb-mega-menu';

interface MegaMenuProps {
  category: NavCategory;
  categoryLabel: string;
  panelRef?: React.Ref<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

/** Desktop dropdown listing everything under one top-level navigation category. */
export const MegaMenu = ({
  category,
  categoryLabel,
  panelRef,
  onKeyDown,
  onBlur,
}: MegaMenuProps) => {
  const { t, getLabel } = useTranslation();
  const items = siteStructure[category];
  if (!items) return null;

  return (
    /*
      `role="region"` with a name, rather than a bare div.

      The panel cannot sit next to its trigger in the DOM — it spans the viewport while the
      trigger sits inside a `max-w-7xl` row, so reparenting it collapses the full-bleed panel to
      the width of the row. Naming it as a region gives screen-reader users the landmark list as
      a way in, which is the compensation the APG expects when disclosure content is not
      DOM-adjacent. Keyboard users get the shortcut in Header: Tab off an open trigger.
    */
    <div
      id={MEGA_MENU_ID}
      ref={panelRef}
      role="region"
      aria-label={categoryLabel}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className="hidden lg:block absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b-2 nb-border-ink dark:border-zinc-700 shadow-2xl animate-in fade-in duration-150"
    >
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-start justify-between gap-8 mb-8 border-b border-zinc-200 dark:border-zinc-700 pb-4">
          <div>
            <h2 className="text-2xl font-black nb-text-navy dark:text-blue-400 mb-1">
              {categoryLabel}
            </h2>
            {/*
              A one-line description under each menu heading, as the City's own mega menus carry.
              "Business" alone makes a visitor guess whether the section is for starting one,
              paying its taxes, or bidding on work; a sentence answers that before they scan
              fifteen links looking for the answer.
            */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              {getLabel(categoryDescriptions[category])}
            </p>
          </div>
          <CityLink
            href={categoryHref(category)}
            className="shrink-0 text-sm font-bold flex items-center gap-1 hover:underline text-zinc-900 dark:text-zinc-100"
          >
            {t('directory')} <ArrowRight size={16} aria-hidden="true" />
          </CityLink>
        </div>
        <ul className="grid grid-cols-3 gap-x-12 gap-y-4">
          {items.map((item) => (
            <li key={item.en}>
              <CityLink
                href={navHref(category, item)}
                className="text-zinc-600 dark:text-zinc-300 font-medium nb-hover-text-navy dark:hover:text-blue-400 hover:underline decoration-2 underline-offset-4 flex items-start gap-2"
              >
                <span
                  className="mt-1.5 w-1 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full shrink-0"
                  aria-hidden="true"
                />
                {getLabel(item)}
              </CityLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
