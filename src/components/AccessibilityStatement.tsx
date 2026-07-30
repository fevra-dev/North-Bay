import { CheckCircle2 } from 'lucide-react';
import type { RefObject } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Dialog } from './Dialog';

interface AccessibilityStatementProps {
  isOpen: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
}

/**
 * ACCESSIBILITY STATEMENT.
 *
 * What an AODA compliance review actually asks a public body for: a stated conformance target,
 * what has been verified against it, what is still open, and a real route to request an
 * accommodation. Linked from the footer rather than existing as a dead placeholder link.
 *
 * The "known issues" section is the part that makes this a real statement rather than a marketing
 * claim. An accessibility statement that lists no gaps is not describing a site, it is describing
 * an intention — and under the IASR the honest disclosure is the requirement.
 *
 * It is itself fully translated, which matters more here than almost anywhere else on the page:
 * a francophone resident who cannot use the site is exactly the person who needs to be able to
 * read how to ask for help.
 */
export const AccessibilityStatement = ({
  isOpen,
  onClose,
  panelRef,
}: AccessibilityStatementProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      titleId="a11y-statement-title"
      panelRef={panelRef}
      title={
        <>
          <CheckCircle2 className="nb-text-navy dark:text-blue-400" aria-hidden="true" />
          {t('a11yTitle')}
        </>
      }
    >
      <div className="space-y-5 text-sm text-zinc-700 dark:text-zinc-300">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-1">
            {t('a11yConformanceHeading')}
          </h3>
          <p>{t('a11yConformanceBody')}</p>
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-1">
            {t('a11yVerifiedHeading')}
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('a11yVerified1')}</li>
            <li>{t('a11yVerified2')}</li>
            <li>{t('a11yVerified3')}</li>
            <li>{t('a11yVerified4')}</li>
            <li>{t('a11yVerified5')}</li>
            <li>{t('a11yVerified6')}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{t('a11yKnownHeading')}</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('a11yKnown1')}</li>
            <li>{t('a11yKnown2')}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-1">
            {t('a11yFeedbackHeading')}
          </h3>
          <p>
            {t('a11yFeedbackBody')}{' '}
            <a
              href="mailto:customerservice@northbay.ca"
              className="nb-text-navy dark:text-blue-400 hover:underline"
            >
              customerservice@northbay.ca
            </a>
            . {t('a11yFeedbackBody2')}
          </p>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          {t('a11yReviewed')}
        </p>
      </div>
    </Dialog>
  );
};
