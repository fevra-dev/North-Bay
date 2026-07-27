import { type RefObject, useEffect } from 'react';

/**
 * Selector for everything the browser will let a keyboard reach. `[tabindex="-1"]` is excluded
 * deliberately: an element with a negative tabindex is programmatically focusable but is not in
 * the tab order, so including it would make Tab visit things the trap should skip.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Elements matching the selector but not actually reachable — a button inside a collapsed
 * accordion, a link in a `hidden` panel. `offsetParent === null` catches `display: none` and
 * anything inside it; the rect check catches `visibility: hidden` and zero-size elements, which
 * keep an offsetParent. Tabbing to an invisible control is a real trap failure: focus vanishes
 * from the screen and the visitor has no way to tell where they are.
 */
const isVisible = (el: HTMLElement): boolean => {
  if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const getFocusable = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);

/**
 * A TRUE FOCUS TRAP, plus focus restoration.
 *
 * While a dialog is open, Tab and Shift+Tab cycle only through elements inside it. Without
 * this, tabbing past the last control lands back in the page behind the dialog — the visitor is
 * now operating a page they cannot see, with a modal still covering it. This is the gap a
 * simple focus-in/focus-out handler does not close, and it is an outright WCAG 2.2 AA failure
 * (SC 2.4.3 Focus Order, SC 2.1.2 No Keyboard Trap in its inverse form).
 *
 * On open: focus moves into the dialog, and the element that triggered it is remembered.
 * On close: focus returns to that trigger, so a keyboard or screen reader user never loses
 * their place in the page.
 *
 * @param containerRef  The dialog element to trap within.
 * @param isOpen        Whether the dialog is currently open.
 * @param deps          Values that change the dialog's focusable contents (e.g. a wizard step),
 *                      so the trap re-reads them instead of caching a stale element list.
 */
export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  deps: readonly unknown[] = [],
): void => {
  // Move focus in on open, and back to the trigger on close.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // rAF, not a bare call: the dialog is being mounted in this same commit, so its children do
    // not exist yet on the line below. One frame later they do.
    const raf = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      // Prefer the first real control; fall back to the container itself, which carries
      // tabIndex={-1} precisely so it can receive focus when it has no focusable children yet.
      const [firstFocusable] = getFocusable(container);
      (firstFocusable ?? container).focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      // `isConnected` guards the case where the trigger itself was removed from the DOM while
      // the dialog was open. Calling focus() on a detached node silently sends focus to
      // <body>, which drops the visitor at the top of the page with no indication why.
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [isOpen, containerRef]);

  // Hold Tab inside the dialog for as long as it is open.
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        // Nothing to cycle through, but Tab must still not escape the dialog.
        e.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Focus somehow sitting outside the dialog — a click on the backdrop, a script moving it,
      // the container itself holding focus. Pull it back to a real control rather than letting
      // this Tab press walk into the page behind.
      if (!(active instanceof HTMLElement) || !container.contains(active) || active === container) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
    // biome-ignore lint/correctness/useExhaustiveDependencies: `deps` is the caller's explicit
    // list of things that change the dialog's focusable contents; that is the whole contract.
  }, [isOpen, containerRef, ...deps]);
};
