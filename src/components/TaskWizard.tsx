import { ArrowRight, Briefcase, CheckCircle2, HelpCircle } from 'lucide-react';
import type { RefObject } from 'react';
import { Dialog } from './Dialog';

export interface WizardState {
  isOpen: boolean;
  step: number;
  title: string;
}

interface TaskWizardProps {
  state: WizardState;
  setState: (next: WizardState) => void;
  panelRef: RefObject<HTMLDivElement | null>;
}

const TOTAL_STEPS = 3;

/**
 * MULTI-STEP TASK WIZARD.
 *
 * GOV.UK's research on step-by-step service flows is explicit that running a multi-step process
 * inside a modal is a pattern to avoid: people lose track of where they are, and the surrounding
 * page offers no orientation to recover from. That finding shaped two decisions here.
 *
 * First, the step count is stated in text ("Step 2 of 3") and not only in the progress bars, so
 * position is legible without interpreting a graphic. Second, this is scoped to short triage
 * flows — confirm zoning, gather documents, hand off to the real portal — rather than being
 * asked to carry an entire application. A genuine application belongs on its own page with its
 * own URL, which is the point at which someone can bookmark it, share it, or come back to it.
 *
 * The progress bars are `aria-hidden`; the text beside them already carries the same
 * information, and three unlabelled divs announce as nothing useful.
 */
export const TaskWizard = ({ state, setState, panelRef }: TaskWizardProps) => {
  const close = () => setState({ ...state, isOpen: false });
  const goTo = (step: number) => setState({ ...state, step });

  return (
    <Dialog
      isOpen={state.isOpen}
      onClose={close}
      titleId="wizard-title"
      panelRef={panelRef}
      // The step is a trap dependency: each step swaps the dialog's focusable contents, and a
      // trap holding a stale element list would cycle Tab through controls that no longer exist.
      trapDeps={[state.step]}
      title={
        <>
          <Briefcase className="nb-text-navy dark:text-blue-400" aria-hidden="true" />
          {state.title}
        </>
      }
      header={
        <>
          <div className="px-6 pt-6 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Step {state.step} of {TOTAL_STEPS}
            </span>
          </div>
          <div className="flex px-6 pt-2 gap-2" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 transition-colors duration-300 ${
                  i <= state.step ? 'nb-bg-navy dark:bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </>
      }
      footer={
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-between">
          <button
            type="button"
            onClick={() => goTo(Math.max(1, state.step - 1))}
            // `invisible` rather than unmounted: removing the button on step 1 would shift the
            // Continue button leftward and then back, and the layout jump reads as a glitch.
            className={`px-4 py-2 font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors ${
              state.step === 1 ? 'invisible' : ''
            }`}
            // Hidden from assistive tech too when invisible, so it is not announced as a
            // control that appears to do nothing.
            aria-hidden={state.step === 1}
            tabIndex={state.step === 1 ? -1 : 0}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => (state.step === TOTAL_STEPS ? close() : goTo(state.step + 1))}
            className="nb-bg-navy nb-hover-navy-dark dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-3 font-bold transition-colors flex items-center gap-2 group"
          >
            {state.step === TOTAL_STEPS ? 'Proceed to Portal' : 'Continue'}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 group-active:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </button>
        </div>
      }
    >
      {state.step === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Step 1: Verify Zoning
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            Ensure your proposed location is zoned for your specific business type.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800 rounded flex gap-3">
            <HelpCircle className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Tip: Use the GIS Portal to look up zoning by address.
            </p>
          </div>
        </div>
      )}
      {state.step === 2 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Step 2: Prepare Documents
          </h3>
          <ul className="space-y-3 mt-4">
            <li className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 size={16} className="text-zinc-400" aria-hidden="true" />
              Master Business License (Provincial)
            </li>
            <li className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 size={16} className="text-zinc-400" aria-hidden="true" />
              Floor Plan / Site Plan
            </li>
          </ul>
        </div>
      )}
      {state.step === 3 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Step 3: Begin Application
          </h3>
          <div className="p-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 aria-hidden="true" /> Application Ready
          </div>
        </div>
      )}
    </Dialog>
  );
};
