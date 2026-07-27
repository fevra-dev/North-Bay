import { AlertCircle } from 'lucide-react';
import {
  FIRE_DANGER_LEVELS,
  currentConditionsSeason,
  fireConditions,
  winterConditions,
} from '../data/conditions';
import type { TranslationKey } from '../data/i18n';
import { FIRE_ZONE_ANGLES, fireNeedleAngle, gaugeArcPath, polarToCartesian } from '../lib/gauge';

interface CurrentConditionsProps {
  t: (key: TranslationKey) => string;
}

const statusPillClass = (isActive: boolean) =>
  `text-xs font-bold px-3 py-1 rounded-full ${
    isActive
      ? 'bg-red-600 text-white'
      : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400'
  }`;

const WinterConditionsCard = ({ t }: CurrentConditionsProps) => (
  <section className="print:hidden max-w-7xl mx-auto px-4 sm:px-8 -mt-6 mb-6">
    <div className="bg-white dark:bg-zinc-900 border-2 nb-border-ink dark:border-zinc-700 px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      <h2 className="font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-2 shrink-0">
        <AlertCircle size={16} className="nb-text-navy dark:text-blue-400" aria-hidden="true" />
        {t('winterConditionsTitle')}
      </h2>
      <span role="status" className={statusPillClass(winterConditions.parkingBanActive)}>
        {winterConditions.parkingBanActive ? t('parkingBanOn') : t('parkingBanOff')}
      </span>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-bold text-zinc-900 dark:text-zinc-200">
          {t('roadConditionsLabel')}:
        </span>{' '}
        {winterConditions.roadConditionSummary}
      </span>
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        {t('updatedLabel')}: {winterConditions.updatedAt}
      </span>
      <a
        href="#"
        className="text-xs font-bold nb-text-navy dark:text-blue-400 hover:underline ml-auto"
      >
        {t('winterConditionsLink')}
      </a>
    </div>
  </section>
);

const FireConditionsCard = ({ t }: CurrentConditionsProps) => {
  const levelIndex = FIRE_DANGER_LEVELS.findIndex((l) => l.key === fireConditions.dangerLevel);
  const needleAngle = fireNeedleAngle(levelIndex);
  const needleTip = polarToCartesian(100, 100, 68, needleAngle);

  const levelLabels: Record<string, string> = {
    low: t('fireLevelLow'),
    medium: t('fireLevelMedium'),
    high: t('fireLevelHigh'),
    extreme: t('fireLevelExtreme'),
  };
  const levelLabel = levelLabels[fireConditions.dangerLevel] ?? fireConditions.dangerLevel;

  return (
    <section className="print:hidden max-w-7xl mx-auto px-4 sm:px-8 -mt-6 mb-6">
      <div className="bg-white dark:bg-zinc-900 border-2 nb-border-ink dark:border-zinc-700 px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-4 shrink-0">
          {/*
            The gauge is decorative in the strict sense: every value it displays is also spelled
            out in the text beside it. It is marked aria-hidden so a screen reader reads the
            reading once, as words, instead of announcing a pile of unlabelled SVG paths. The
            colored bands are a second encoding of information the text already carries, which
            is what keeps this compliant with SC 1.4.1 rather than in breach of it.
          */}
          <svg width="88" height="52" viewBox="0 0 200 110" aria-hidden="true">
            <title>Fire danger gauge</title>
            {FIRE_DANGER_LEVELS.map((level, i) => (
              <path
                key={level.key}
                d={gaugeArcPath(100, 100, 95, 65, FIRE_ZONE_ANGLES[i], FIRE_ZONE_ANGLES[i + 1])}
                fill={level.color}
              />
            ))}
            <line
              x1="100"
              y1="100"
              x2={needleTip.x}
              y2={needleTip.y}
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="7" fill="#111111" />
          </svg>
          <div>
            <h2 className="font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
              {t('fireConditionsTitle')}
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-bold">{t('fireDangerLabel')}:</span> {levelLabel}
            </p>
          </div>
        </div>
        <span role="status" className={statusPillClass(fireConditions.banActive)}>
          {t('fireBanLabel')}: {fireConditions.banActive ? t('fireBanYes') : t('fireBanNo')}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {t('updatedLabel')}: {fireConditions.updatedAt}
        </span>
        <a
          href="#"
          className="text-xs font-bold nb-text-navy dark:text-blue-400 hover:underline ml-auto"
        >
          {t('fireConditionsLink')}
        </a>
      </div>
    </section>
  );
};

/**
 * Winter road conditions and fire danger are seasonally exclusive in a real deployment, so only
 * one of them ever ships live. `currentConditionsSeason` in data/conditions.ts picks which.
 */
export const CurrentConditions = ({ t }: CurrentConditionsProps) =>
  currentConditionsSeason === 'winter' ? (
    <WinterConditionsCard t={t} />
  ) : (
    <FireConditionsCard t={t} />
  );
