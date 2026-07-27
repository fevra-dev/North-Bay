import { CONCEPT_AUTHOR } from '../data/branding';
import type { TranslationKey } from '../data/i18n';

interface FooterProps {
  t: (key: TranslationKey) => string;
  onOpenAccessibilityStatement: () => void;
}

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-6 border-b border-zinc-800 pb-2">
      {title}
    </h2>
    <ul className="space-y-3 text-sm">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="text-zinc-400 hover:text-white hover:underline transition-all">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * FOOTER, with the land acknowledgment given the position it deserves.
 *
 * The acknowledgment sits at the base of the page in its own bordered section, centered and
 * given room, rather than buried in a row of legal links. The wording is specific rather than
 * template language: it names the Robinson-Huron Treaty of 1850 and the Anishinaabeg peoples,
 * specifically Nipissing First Nation, and extends respect to Métis, Inuit, and all First
 * Peoples. A generic acknowledgment that could apply to any municipality in Canada is not
 * really an acknowledgment of anywhere.
 *
 * It is translated in full, not left English-only — the one place on a bilingual municipal site
 * where a missing translation would be most conspicuous.
 */
export const Footer = ({ t, onOpenAccessibilityStatement }: FooterProps) => (
  <footer
    className="print:hidden nb-bg-ink dark:bg-black text-white pt-20 pb-10 px-4 sm:px-8 border-t nb-border-navy dark:border-blue-900"
    style={{ borderTopWidth: '12px' }}
  >
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex flex-col mb-6">
            <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
              {t('cityOfLabel')}
            </span>
            <span className="text-2xl font-black text-white tracking-tight leading-none">
              {t('titleShort')}
            </span>
          </div>
          <address className="text-zinc-400 text-sm leading-relaxed mb-4 not-italic">
            200 McIntyre St E<br />
            North Bay, ON P1B 8H8
            <br />
            Canada
          </address>
          <p className="text-white text-lg font-bold">
            <a href="tel:+17054740400" className="hover:underline">
              705-474-0400
            </a>
          </p>
        </div>

        <FooterColumn
          title={t('topServices')}
          links={['Forms, Permits & Licenses', 'Garbage & Recycling', 'North Bay Transit']}
        />
        <FooterColumn
          title={t('governmentFooter')}
          links={['Mayor & Council', 'Meetings & Agendas', 'By-Laws']}
        />
        <FooterColumn title={t('connectFooter')} links={['Contact Us', 'Report a Problem']} />
      </div>

      <div className="border-t border-zinc-800 pt-12 pb-8 mt-12 flex flex-col items-center justify-center text-center">
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
          <strong className="text-white block mb-2 text-sm uppercase tracking-widest">
            {t('landAcknowledgement')}
          </strong>
          {t('footerLand')}
        </p>

        <div className="flex flex-col items-center justify-center text-xs text-zinc-500 space-y-5">
          <div className="space-y-1">
            <p>© 2026 Corporation of the City of North Bay.</p>
            <p>{t('allRightsReserved')}</p>
          </div>
          <div className="flex gap-6 pt-2">
            <a href="#" className="hover:text-white transition-colors">
              {t('privacy')}
            </a>
            <button
              type="button"
              onClick={onOpenAccessibilityStatement}
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {t('accessibility')}
            </button>
          </div>

          {/*
            Concept disclaimer. This page carries the City's wordmark and its content, and it is
            deployed at a public URL — so it states plainly that it is neither the City's site nor
            endorsed by it. Kept in the footer of the page itself, not only in the README, because
            the page gets screenshotted and linked without its repository.
          */}
          <p className="pt-4 border-t border-zinc-800 w-full max-w-2xl text-zinc-500">
            {t('conceptDisclaimer')} {CONCEPT_AUTHOR}.
          </p>
        </div>
      </div>
    </div>
  </footer>
);
