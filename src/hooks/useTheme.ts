import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nb-theme';

/**
 * THEME.
 *
 * A plain manual toggle. It seeds from the device's own `prefers-color-scheme` so a
 * first-time visitor gets the theme they already asked their operating system for, and from a
 * previously saved choice on any later visit. From that point it is a direct on/off — nothing
 * auto-switches underneath someone mid-session.
 *
 * Three things had to line up for the toggle to actually work, and all three live here or
 * beside here:
 *
 * 1. `@custom-variant dark (&:where(.dark, .dark *))` in styles/index.css, without which
 *    Tailwind v4 compiles every `dark:` utility against `prefers-color-scheme` and ignores the
 *    class entirely.
 * 2. The class goes on `document.documentElement`, not on a wrapper `<div>`. Putting it on a
 *    div leaves `<html>` and `<body>` unstyled, so the area behind a short page — and the
 *    overscroll bounce area on iOS — stays light while the content above it is dark.
 * 3. The blocking script in index.html applies the same class before first paint, so a
 *    returning dark-mode visitor never sees a white flash. That script and this hook read and
 *    write the same `nb-theme` key; changing one without the other reintroduces the flash.
 */
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Read back whatever the pre-paint script in index.html already decided, so this hook and
    // that script can never disagree about the initial state.
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem(STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    } catch {
      // Private browsing or blocked storage: the theme still applies for this session, it
      // just will not be remembered. Failing to persist is not a reason to fail to render.
    }
  }, [isDarkMode]);

  /*
    Follow the OS setting only while the visitor has not expressed a preference of their own.
    Once they touch the toggle, their choice is stored and this listener stops overriding it —
    changing the OS theme should not silently undo a deliberate click.
  */
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let hasStoredPreference = false;
      try {
        hasStoredPreference = localStorage.getItem(STORAGE_KEY) !== null;
      } catch {
        hasStoredPreference = false;
      }
      if (!hasStoredPreference) setIsDarkMode(e.matches);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => setIsDarkMode((prev) => !prev), []);

  return { isDarkMode, toggleTheme };
};
