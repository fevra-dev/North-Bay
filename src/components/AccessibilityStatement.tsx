import { CheckCircle2 } from 'lucide-react';
import type { RefObject } from 'react';
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
 * The "known issues" section is the part that makes this a real statement rather than a
 * marketing claim. An accessibility statement that lists no gaps is not describing a site, it is
 * describing an intention — and under the IASR the honest disclosure is the requirement.
 */
export const AccessibilityStatement = ({
  isOpen,
  onClose,
  panelRef,
}: AccessibilityStatementProps) => (
  <Dialog
    isOpen={isOpen}
    onClose={onClose}
    titleId="a11y-statement-title"
    panelRef={panelRef}
    title={
      <>
        <CheckCircle2 className="nb-text-navy dark:text-blue-400" aria-hidden="true" />
        Accessibility Statement
      </>
    }
  >
    <div className="space-y-5 text-sm text-zinc-700 dark:text-zinc-300">
      <div>
        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Conformance status</h3>
        <p>
          This site targets <strong>WCAG 2.2 Level AA</strong>, one level above the WCAG 2.0 AA the
          City is required to meet under Ontario's Integrated Accessibility Standards Regulation (O.
          Reg. 191/11). This page is a partial conformance statement for a redesign in progress, not
          a final audit result.
        </p>
      </div>
      <div>
        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">What's been verified</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Keyboard access to every menu, dialog, and control, including a true focus trap in modal
            dialogs
          </li>
          <li>Visible focus indicators on every interactive element</li>
          <li>A skip link and a proper landmark structure (header, nav, main, footer)</li>
          <li>Support for the operating system's reduced-motion preference</li>
          <li>
            Color is never the only way information is conveyed (severity, urgency, and status all
            carry a text label alongside color)
          </li>
          <li>
            Live search follows the WAI-ARIA combobox pattern, including arrow-key navigation
            between results
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Known issues</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            French translations cover persistent navigation and page chrome; some deeper content is
            still English-only pending a fluent review pass
          </li>
          <li>
            This is a demonstration build: navigation links and the account area are not wired to
            real destinations
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">
          Feedback and accommodation requests
        </h3>
        <p>
          If any part of this site is difficult to use with assistive technology, contact the
          Customer Service Centre at{' '}
          <a
            href="mailto:customerservice@northbay.ca"
            className="nb-text-navy dark:text-blue-400 hover:underline"
          >
            customerservice@northbay.ca
          </a>
          . Requests for information in an accessible format will be met in a timeframe that takes
          the request into account.
        </p>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        Last reviewed: July 2026.
      </p>
    </div>
  </Dialog>
);
