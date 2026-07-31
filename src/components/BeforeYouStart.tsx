import { ArrowRight, Briefcase, CheckCircle2, Info } from 'lucide-react';
import type { RefObject } from 'react';
import { cityLinks } from '../data/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { Dialog } from './Dialog';

interface BeforeYouStartProps {
  isOpen: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
}

/**
 * "BEFORE YOU START" — a preparation checklist, not a process.
 *
 * This replaced a three-step wizard, and the reasons are worth keeping because each one is a
 * mistake that was easy to make and hard to see:
 *
 * 1. It ended nowhere. "Proceed to Portal" closed the dialog. It was the last dead control on a
 *    page where every other path had been wired to the City's real site.
 *
 * 2. It asserted a process nobody verified. Presenting "Step 1: Verify Zoning → Step 2: Prepare
 *    Documents → Step 3: Begin Application" as the City's procedure states something factual
 *    about how a resident starts a business here. A concept may invent a layout; it should not
 *    invent municipal procedure and present it as guidance. The caveat below is the honest
 *    version of what this can claim.
 *
 * 3. It contradicted its own citation. The README cites GOV.UK research finding that multi-step
 *    processes should not run inside a modal, because people lose track of where they are — and
 *    then ran a multi-step process inside a modal. A short list of what to have ready is not a
 *    process, so this resolves the tension rather than arguing around it.
 *
 * What it keeps is the part that was actually working: a properly built dialog — focus moved in
 * on open, trapped while it is open, returned to the trigger on close — and the recognition that
 * a resident who reaches the application without zoning confirmed has already wasted the trip.
 */
export const BeforeYouStart = ({ isOpen, onClose, panelRef }: BeforeYouStartProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      titleId="before-you-start-title"
      panelRef={panelRef}
      title={
        <>
          <Briefcase className="nb-text-navy dark:text-blue-400" aria-hidden="true" />
          {t('checklistTitle')}
        </>
      }
      footer={
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end">
          {/*
            The dialog now ends where the resident actually needs to go. New tab, and
            `noopener,noreferrer`, matching every other outbound link here.
          */}
          <a
            href={cityLinks.startBusiness}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 nb-bg-navy nb-hover-navy-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 font-bold transition-colors focus-visible:ring-2 nb-focus-ring-navy focus-visible:ring-offset-2"
          >
            {t('checklistCta')}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1 group-active:translate-x-1"
              aria-hidden="true"
            />
            <span className="sr-only"> {t('opensOnCitySite')}</span>
          </a>
        </div>
      }
    >
      <div className="space-y-5 text-sm text-zinc-700 dark:text-zinc-300">
        <p>{t('checklistIntro')}</p>

        <ul className="space-y-3">
          {[t('checklistItem1'), t('checklistItem2'), t('checklistItem3')].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="nb-text-navy dark:text-blue-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/*
          Stated inside the dialog rather than only in the accessibility statement, because this
          is the one place on the page where a resident could mistake illustrative content for
          municipal guidance and act on it.
        */}
        <p className="flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3">
          <Info size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          {t('checklistCaveat')}
        </p>
      </div>
    </Dialog>
  );
};
