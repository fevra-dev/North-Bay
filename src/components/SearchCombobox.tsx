import { Search } from 'lucide-react';
import { useId } from 'react';
import { type SearchEntry, searchCategoryLabels, searchTypeLabels } from '../data/search';
import { useSiteSearch } from '../hooks/useSiteSearch';
import { useTranslation } from '../hooks/useTranslation';

interface SearchComboboxProps {
  /** Visible-to-screen-readers label and placeholder text. */
  placeholder: string;
  /**
   * `hero` is the large landing treatment, `compact` sits inside the mobile menu, and `header`
   * is the small persistent field that fades into the sticky header on scroll.
   */
  variant?: 'hero' | 'compact' | 'header';
  /**
   * Removes the field from the tab order. Used by the header instance while it is faded out —
   * an invisible control that is still focusable strands a keyboard user on a field they cannot
   * see, which is a worse failure than not having the field at all.
   */
  disabled?: boolean;
}

/**
 * LIVE SEARCH — WAI-ARIA 1.2 combobox pattern.
 *
 * Structure the pattern requires, and why each part is here rather than optional:
 *
 * - `role="combobox"` on the input, with `aria-expanded` tracking the popup's real state.
 * - `aria-controls` pointing at the listbox, so assistive tech can find what the input drives.
 * - `aria-activedescendant` naming the highlighted option. This is the key difference from
 *   moving real DOM focus into the list: the input keeps focus (so typing keeps working) while
 *   the screen reader still announces the highlighted row.
 * - `aria-autocomplete="list"` to say results are suggested but the text is not auto-filled.
 * - A polite live region announcing the result count, so a non-sighted user learns that
 *   results appeared at all. Without it the listbox opens in complete silence.
 *
 * Arrow keys, Home/End, Enter and Escape are handled in `useSiteSearch`.
 *
 * This component exists in two places — the hero and the mobile menu panel. The mobile field
 * was previously an inert input with no state behind it: it accepted typing and did nothing,
 * on the very viewport most residents actually arrive from. Sharing one component means the
 * two cannot drift apart again.
 */
export const SearchCombobox = ({
  placeholder,
  variant = 'hero',
  disabled = false,
}: SearchComboboxProps) => {
  const { t, getLabel } = useTranslation();
  const {
    query,
    setQuery,
    results,
    isOpen,
    activeIndex,
    setActiveIndex,
    containerRef,
    handleKeyDown,
    close,
  } = useSiteSearch();

  // useId keeps the two instances' ids unique. Duplicate ids across the hero and mobile
  // comboboxes would make aria-controls and aria-activedescendant ambiguous, and a screen
  // reader resolves the *first* match in the document — which would be the wrong widget.
  const id = useId();
  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;

  const isHero = variant === 'hero';
  const isHeader = variant === 'header';

  const onSelect = (entry: SearchEntry) => {
    setQuery(getLabel(entry.title));
    close();
  };

  const iconClass = isHero
    ? 'absolute left-4 top-5 text-zinc-500 dark:text-zinc-400 pointer-events-none'
    : isHeader
      ? 'absolute left-3 top-2.5 text-zinc-500 dark:text-zinc-400 pointer-events-none'
      : 'absolute left-4 top-4 text-zinc-500 pointer-events-none';

  const inputClass = isHero
    ? 'w-full bg-white dark:bg-zinc-950 border-2 nb-border-ink dark:border-zinc-600 nb-focus-ring-navy-all text-lg py-5 pl-12 pr-4 rounded-none outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100'
    : isHeader
      ? 'w-full bg-white dark:bg-zinc-900 border-2 border-transparent nb-focus-ring-navy-all text-sm py-2 pl-9 pr-3 rounded-none outline-none placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100'
      : 'w-full bg-zinc-100 dark:bg-zinc-800 text-lg font-medium py-3 pl-12 pr-4 outline-none border-2 border-transparent nb-focus-border-navy text-zinc-900 dark:text-zinc-100';

  return (
    <div ref={containerRef} className={isHero ? 'relative flex-1 shadow-sm' : 'relative'}>
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <Search className={iconClass} size={isHero ? 24 : isHeader ? 16 : 20} aria-hidden="true" />
      <input
        type="text"
        id={inputId}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          const selected = handleKeyDown(e);
          if (selected) onSelect(selected);
        }}
        placeholder={placeholder}
        tabIndex={disabled ? -1 : undefined}
        className={inputClass}
      />

      {/*
        Announced politely rather than assertively: results updating as someone types should
        not interrupt them mid-word. Rendered unconditionally so the live region already exists
        in the DOM when its text changes — a live region inserted at the same moment as its
        content is frequently not announced at all.
      */}
      <span className="sr-only" role="status" aria-live="polite">
        {isOpen
          ? `${results.length} ${results.length === 1 ? t('searchOneResultFound') : t('searchResultsFound')}`
          : ''}
      </span>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-zinc-800 border-2 nb-border-ink dark:border-zinc-600 shadow-xl z-30 max-h-80 overflow-y-auto animate-in fade-in duration-200"
        >
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, idx) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard interaction for this
                // listbox lives on the combobox input via aria-activedescendant, which is what
                // the ARIA pattern specifies. Options must not be separately tabbable.
                <li
                  key={result.title.en}
                  id={`${id}-option-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => onSelect(result)}
                  className={`flex flex-col px-4 py-3 cursor-pointer border-b border-zinc-100 dark:border-zinc-700 last:border-0 transition-colors ${
                    idx === activeIndex ? 'bg-zinc-100 dark:bg-zinc-700' : ''
                  }`}
                >
                  <span className="font-bold nb-text-navy dark:text-blue-400">
                    {getLabel(result.title)}
                  </span>
                  <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    <span className="uppercase tracking-wider">
                      {getLabel(searchCategoryLabels[result.category])}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>{getLabel(searchTypeLabels[result.type])}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400 font-medium">
              {t('searchNoResults')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
