import type { ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface CityLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * A link that leaves this concept for the City's real site.
 *
 * Opens in a new tab, and that is a deliberate exception to the usual rule against it. These are
 * not links within a site — they cross from a redesign proposal to the live municipal site, and
 * the two look similar enough that a reviewer could lose track of which one they are reading. A
 * new tab keeps the concept open to come back to and makes the boundary explicit.
 *
 * `rel="noopener noreferrer"` is the standard hardening for `target="_blank"`: `noopener` stops
 * the opened page reaching back through `window.opener`.
 *
 * The destination is announced. WCAG 2.2 SC 3.2.5 treats opening a new window as a change of
 * context that should be predictable, and a screen reader user gets no visual cue that a tab
 * appeared — so the link text carries "(opens northbay.ca in a new tab)" for them.
 */
export const CityLink = ({ href, className, children }: CityLinkProps) => {
  const { t } = useTranslation();
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> {t('opensOnCitySite')}</span>
    </a>
  );
};
