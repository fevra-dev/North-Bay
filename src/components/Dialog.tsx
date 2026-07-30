import { X } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useTranslation } from '../hooks/useTranslation';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: ReactNode;
  children: ReactNode;
  /** Footer controls, rendered below the scrolling body. */
  footer?: ReactNode;
  /** Extra content between the header and the body, e.g. the wizard's step indicator. */
  header?: ReactNode;
  panelRef: RefObject<HTMLDivElement | null>;
  /** Values that change which elements inside the dialog are focusable. */
  trapDeps?: readonly unknown[];
}

/**
 * MODAL DIALOG SHELL.
 *
 * Both dialogs on the page share this, which is what keeps their accessibility behaviour
 * identical rather than merely similar. Everything a modal owes a keyboard user is here:
 *
 * - `role="dialog"` with `aria-modal`, and `aria-labelledby` pointing at its real heading.
 * - A focus trap, with focus moved in on open and returned to the trigger on close
 *   (see hooks/useFocusTrap.ts).
 * - `tabIndex={-1}` on the panel so it can receive focus itself when it has no focusable child.
 * - Backdrop click closes, but only when the click actually started and ended on the backdrop.
 *
 * Escape is handled centrally in App, which is what allows one Escape press to close whatever
 * is on top rather than every overlay racing to respond to the same keystroke.
 *
 * The backdrop is a plain div rather than a button: it is a click *target*, not a control, and
 * a keyboard user closes this with Escape or the labelled close button. Giving the backdrop a
 * role would put a second, unlabelled "button" in the tab order for no benefit.
 */
export const Dialog = ({
  isOpen,
  onClose,
  titleId,
  title,
  children,
  footer,
  header,
  panelRef,
  trapDeps = [],
}: DialogProps) => {
  const { t } = useTranslation();
  useFocusTrap(panelRef, isOpen, trapDeps);

  if (!isOpen) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the backdrop is a click target for
    // pointer users only; Escape and the close button are the keyboard-accessible paths.
    <div
      className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ zIndex: 120 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl border-2 nb-border-ink dark:border-zinc-700 shadow-2xl flex flex-col focus:outline-none"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex justify-between items-center p-6 border-b-2 nb-border-ink dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800">
          <h2
            id={titleId}
            className="text-xl font-black flex items-center gap-2 text-zinc-900 dark:text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('closeDialog')}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors focus-visible:ring-2 nb-focus-ring-navy"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {header}

        <div className="p-6 overflow-y-auto">{children}</div>

        {footer}
      </div>
    </div>
  );
};
