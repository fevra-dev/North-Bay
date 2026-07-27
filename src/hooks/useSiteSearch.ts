import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type SearchEntry, searchIndex } from '../data/search';

/** Minimum characters before results appear. One character matches almost everything. */
const MIN_QUERY_LENGTH = 2;

/**
 * LIVE SEARCH, built to the WAI-ARIA combobox pattern.
 *
 * Owns the query, the matching results, and the active-descendant index that arrow keys move.
 * The index is kept here rather than in the component because it has to reset in lockstep with
 * the results — an index pointing past the end of a freshly-filtered list is how a combobox
 * ends up announcing a result that is no longer on screen.
 *
 * Matching is a plain case-insensitive substring test over title and category. A real
 * deployment would put a proper search service behind this; the interaction pattern above it is
 * the part being demonstrated, and it does not change when the retrieval does.
 */
export const useSiteSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo<SearchEntry[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < MIN_QUERY_LENGTH) return [];
    return searchIndex.filter(
      (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    );
  }, [query]);

  // Any change to the query invalidates the highlighted row.
  useEffect(() => {
    setActiveIndex(-1);
    setIsOpen(query.trim().length >= MIN_QUERY_LENGTH);
  }, [query]);

  // Close the results when a click or tap lands outside the search field.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target;
      if (!containerRef.current || !(target instanceof Node)) return;
      if (!containerRef.current.contains(target)) setIsOpen(false);
    };
    // `touchstart` alongside `mousedown`: iOS Safari does not reliably emit mousedown for taps
    // outside an input while a soft keyboard is up, so the panel would stay open on mobile.
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  /**
   * Arrow-key navigation over the result list.
   *
   * Down from nothing selected lands on the first result; Up from nothing selected lands on the
   * last, which is the behaviour the ARIA authoring practices specify and what anyone who uses a
   * keyboard expects. Home/End jump to either end. Both wrap, so a long list has no dead end.
   *
   * Returns the entry to activate when Enter is pressed on a highlighted row, or `null` when
   * the keypress was handled without a selection (or was not ours to handle at all).
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): SearchEntry | null => {
      if (!isOpen || results.length === 0) {
        if (e.key === 'Escape') clear();
        return null;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % results.length);
          return null;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
          return null;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          return null;
        case 'End':
          e.preventDefault();
          setActiveIndex(results.length - 1);
          return null;
        case 'Enter': {
          if (activeIndex < 0) return null;
          e.preventDefault();
          return results[activeIndex] ?? null;
        }
        case 'Escape':
          e.preventDefault();
          close();
          return null;
        default:
          return null;
      }
    },
    [isOpen, results, activeIndex, close, clear],
  );

  return {
    query,
    setQuery,
    results,
    isOpen,
    activeIndex,
    setActiveIndex,
    containerRef,
    handleKeyDown,
    close,
    clear,
  };
};
