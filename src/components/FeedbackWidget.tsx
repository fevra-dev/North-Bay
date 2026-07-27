import { CheckCircle2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import type { TranslationKey } from '../data/i18n';

type Sentiment = 'positive' | 'negative' | 'submitted' | null;

interface FeedbackWidgetProps {
  t: (key: TranslationKey) => string;
}

/**
 * PAGE FEEDBACK.
 *
 * A yes/no question, and a follow-up field only when the answer is no. Asking "what went wrong"
 * of someone who just said the page worked is how a feedback widget trains people to ignore it.
 *
 * The live region is scoped to the response area rather than wrapping the whole section. With
 * `aria-live` on the outer section — as this originally had — clicking "Yes" re-announces every
 * word inside it, heading and body copy included, instead of the one sentence that actually
 * changed. Narrow live regions are the difference between a confirmation and a re-read.
 */
export const FeedbackWidget = ({ t }: FeedbackWidgetProps) => {
  const [sentiment, setSentiment] = useState<Sentiment>(null);
  const [note, setNote] = useState('');

  return (
    <section className="print:hidden max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="bg-white dark:bg-zinc-900 p-6 border-2 nb-border-ink dark:border-zinc-700 flex flex-col gap-4">
        {!sentiment && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg mb-1 text-zinc-900 dark:text-white">
                {t('helpfulQuestion')}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('helpfulSub')}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSentiment('positive')}
                className="flex items-center gap-2 px-6 py-3 border-2 font-bold transition-colors border-zinc-300 dark:border-zinc-600 nb-hover-border-ink dark:hover:border-zinc-400 focus-visible:ring-2 nb-focus-ring-navy"
              >
                <ThumbsUp size={16} aria-hidden="true" /> {t('yesLabel')}
              </button>
              <button
                type="button"
                onClick={() => setSentiment('negative')}
                className="flex items-center gap-2 px-6 py-3 border-2 font-bold transition-colors border-zinc-300 dark:border-zinc-600 nb-hover-border-ink dark:hover:border-zinc-400 focus-visible:ring-2 nb-focus-ring-navy"
              >
                <ThumbsDown size={16} aria-hidden="true" /> {t('noLabel')}
              </button>
            </div>
          </div>
        )}

        <div aria-live="polite">
          {sentiment === 'positive' && (
            <div className="flex items-center gap-3 text-green-800 dark:text-green-400 font-bold">
              <CheckCircle2 size={20} aria-hidden="true" /> Thanks for letting us know this page
              helped.
            </div>
          )}

          {sentiment === 'negative' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-zinc-900 dark:text-white font-bold">
                <CheckCircle2
                  size={20}
                  className="nb-text-navy dark:text-blue-400"
                  aria-hidden="true"
                />
                Thanks. What made this page hard to use?
              </div>
              <label htmlFor="feedback-note" className="sr-only">
                Tell us what made this page hard to use (optional)
              </label>
              <textarea
                id="feedback-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional: tell us more so we can fix it"
                rows={2}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 nb-focus-border-navy dark:focus:border-blue-400 outline-none p-3 text-sm text-zinc-900 dark:text-zinc-100"
              />
              <button
                type="button"
                onClick={() => setSentiment('submitted')}
                className="self-start nb-bg-navy nb-hover-navy-dark dark:bg-blue-600 text-white px-5 py-2 text-sm font-bold transition-colors"
              >
                Send feedback
              </button>
            </div>
          )}

          {sentiment === 'submitted' && (
            <p className="text-sm text-green-800 dark:text-green-400 font-bold flex items-center gap-2">
              <CheckCircle2 size={16} aria-hidden="true" /> Feedback sent. Thank you.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
