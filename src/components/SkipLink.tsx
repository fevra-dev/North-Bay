interface SkipLinkProps {
  label: string;
}

/**
 * The first thing a keyboard or screen reader user reaches on the page. Visually hidden until
 * it receives focus, at which point it becomes a real, visible control that jumps past the
 * header and navigation straight to the content. WCAG 2.2 AA, SC 2.4.1 (Bypass Blocks).
 *
 * `nb-skiplink` carries the z-index that puts it above the sticky header — see styles/index.css
 * for why that one line matters more than it looks like it should.
 */
export const SkipLink = ({ label }: SkipLinkProps) => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 nb-skiplink focus:bg-white nb-focus-text-ink focus:font-bold focus:px-4 focus:py-3 focus:border-2 nb-focus-border-ink focus:shadow-lg"
  >
    {label}
  </a>
);
