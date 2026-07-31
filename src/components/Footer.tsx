import type { TranslationKey } from '../data/i18n';
import { cityLinks, footerPopularPages, socialLinks } from '../data/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { CityLink } from './CityLink';

interface FooterProps {
  t: (key: TranslationKey) => string;
  onOpenAccessibilityStatement: () => void;
}

/**
 * Brand marks drawn inline as paths rather than pulled from an icon library.
 *
 * lucide-react dropped its brand icons (they are trademarks, not iconography), and adding a
 * second icon dependency for four glyphs is not a trade worth making — adr/0001, zero-trust
 * dependencies. Each is `aria-hidden` with the platform name carried in the link's own
 * accessible name, so a screen reader announces "Facebook, opens in a new tab" rather than
 * describing a shape.
 */
const socialPaths: Record<string, string> = {
  Facebook:
    'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z',
  X: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z',
  Instagram:
    'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z',
  YouTube:
    'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z',
};

const SocialIcon = ({ name }: { name: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d={socialPaths[name]} />
  </svg>
);

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div>
    <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-3">{title}</h2>
    <ul className="space-y-2 text-sm">
      {links.map((link) => (
        <li key={link.label}>
          <CityLink
            href={link.href}
            className="text-zinc-400 hover:text-white hover:underline transition-colors"
          >
            {link.label}
          </CityLink>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * FOOTER.
 *
 * Deliberately compact. The City's own footer is a single slim bar — copyright, three links,
 * four social icons — and that restraint is correct for the place a visitor lands only after
 * failing to find something above. A footer that repeats the whole navigation is a sitemap
 * pretending to be a footer, and it pushes the one thing that genuinely belongs down there
 * further out of reach.
 *
 * What is kept: the address and phone number (a municipal site's most-copied strings), one short
 * column of genuinely popular destinations, the social channels the City posts disruptions to,
 * and the land acknowledgment.
 *
 * The land acknowledgment keeps its full width and its own bordered section. It is the one piece
 * of this footer that is not a utility link, and compacting it alongside "Careers" and "Legal"
 * would say something about how seriously it is meant.
 */
export const Footer = ({ t, onOpenAccessibilityStatement }: FooterProps) => {
  const { getLabel } = useTranslation();
  return (
    <footer
      className="print:hidden nb-bg-ink dark:bg-black text-white pt-14 pb-8 px-4 sm:px-8 border-t nb-border-navy dark:border-blue-900"
      style={{ borderTopWidth: '8px' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-3 mb-12">
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
                {t('cityOfLabel')}
              </span>
              <span className="text-xl font-black text-white tracking-tight leading-none">
                {t('titleShort')}
              </span>
            </div>
            <address className="text-zinc-400 text-sm leading-relaxed not-italic mb-2">
              200 McIntyre Street East
              <br />
              North Bay, ON P1B 8V6
            </address>
            <p className="text-sm">
              <a href="tel:+17054740400" className="text-white font-bold hover:underline">
                705-474-0400
              </a>
            </p>
            <p className="text-sm mt-1">
              <a
                href="mailto:customerservice@northbay.ca"
                className="text-zinc-400 hover:text-white hover:underline transition-colors"
              >
                customerservice@northbay.ca
              </a>
            </p>
          </div>

          <FooterColumn
            title={t('topServicesFooter')}
            links={footerPopularPages.map((page) => ({
              label: getLabel(page.label),
              href: page.href,
            }))}
          />

          <div>
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-3">
              {t('followUs')}
            </h2>
            <ul className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  {/*
                  `rel="noopener noreferrer"` on every external target: `noopener` stops the
                  opened page from reaching back through `window.opener`, and the pairing is the
                  standard hardening for `target="_blank"`.
                */}
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors rounded-sm focus-visible:ring-2 nb-focus-ring-navy"
                  >
                    <SocialIcon name={social.name} />
                    <span className="sr-only">{social.name} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-10 text-center">
          <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl mx-auto mb-8 font-medium">
            <strong className="text-white block mb-2 text-sm uppercase tracking-widest">
              {t('landAcknowledgement')}
            </strong>
            {t('footerLand')}
          </p>

          <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2026 Corporation of the City of North Bay. {t('allRightsReserved')}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <CityLink href={cityLinks.contact} className="hover:text-white transition-colors">
                {t('contactUs')}
              </CityLink>
              <CityLink href={cityLinks.legal} className="hover:text-white transition-colors">
                {t('privacy')}
              </CityLink>
              <CityLink href={cityLinks.careers} className="hover:text-white transition-colors">
                {t('careers')}
              </CityLink>
              <button
                type="button"
                onClick={onOpenAccessibilityStatement}
                className="hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                {t('accessibility')}
              </button>
            </div>
          </div>

          {/*
          Concept disclaimer. This page carries the City's wordmark and its content and is
          deployed at a public URL, so it states plainly that it is neither the City's site nor
          endorsed by it — in the page itself, not only in the README, because the page gets
          screenshotted and linked without its repository.
        */}
          <p className="text-xs text-zinc-600 mt-6">{t('conceptDisclaimer')}</p>
        </div>
      </div>
    </footer>
  );
};
