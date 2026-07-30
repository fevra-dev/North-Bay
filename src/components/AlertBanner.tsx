import { AlertCircle, ArrowRight } from 'lucide-react';
import { alertSeverityStyles, siteAlert } from '../data/alerts';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Site-wide alert. Both the color and the ARIA role are derived from the alert's severity, so
 * the visual weight and the announcement urgency always agree with each other and with the
 * actual seriousness of the notice.
 *
 * The severity word is carried in the message text as well as the color, because color alone
 * is not an accessible signal (WCAG 2.2 AA, SC 1.4.1).
 */
export const AlertBanner = () => {
  const { t } = useTranslation();
  if (!siteAlert.active) return null;
  const style = alertSeverityStyles[siteAlert.severity];

  return (
    <div
      role={style.role}
      className={`print:hidden ${style.bar} ${style.text} py-1.5 px-4 sm:px-8 text-xs font-bold flex items-center justify-center border-b-2 ${style.border}`}
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <AlertCircle size={14} strokeWidth={2.5} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{t('alertMessage')}</span>
        <a
          href={siteAlert.linkHref}
          className="flex items-center gap-1 hover:underline transition-colors shrink-0 ml-auto sm:ml-2 group"
        >
          {t('alertLinkLabel')}
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 group-active:translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
};
