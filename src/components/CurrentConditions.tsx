import { AlertCircle } from 'lucide-react';
import {
  FIRE_DANGER_LEVELS,
  currentConditionsSeason,
  fireConditions,
  winterConditions,
} from '../data/conditions';
import type { TranslationKey } from '../data/i18n';
import { useTranslation } from '../hooks/useTranslation';
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

const WinterConditionsCard = ({ t }: CurrentConditionsProps) => {
  const { getLabel } = useTranslation();
  return (
    <div className="h-full">
      <div className="bg-white dark:bg-zinc-900 border-2 nb-border-ink dark:border-zinc-700 px-5 py-4 h-full flex flex-wrap items-center gap-x-6 gap-y-2">
        <h2 className="font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-2 shrink-0">
          <AlertCircle size={16} className="nb-text-navy dark:text-blue-400" aria-hidden="true" />
          {t('winterConditionsTitle')}
        </h2>
        <span role="status" className={statusPillClass(winterConditions.parkingBanActive)}>
          {winterConditions.parkingBanActive ? t('parkingBanOn') : t('parkingBanOff')}
        </span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-bold text-zinc-900 dark:text-zinc-200">
            {t('roadConditionsLabel')}
          </span>{' '}
          {getLabel(winterConditions.roadConditionSummary)}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {t('updatedLabel')} {getLabel(winterConditions.updatedAt)}
        </span>
        <a
          href="#"
          className="text-xs font-bold nb-text-navy dark:text-blue-400 hover:underline ml-auto"
        >
          {t('winterConditionsLink')}
        </a>
      </div>
    </div>
  );
};

const FireConditionsCard = ({ t }: CurrentConditionsProps) => {
  const { getLabel } = useTranslation();
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
    <div className="h-full">
      <div className="bg-white dark:bg-zinc-900 border-2 nb-border-ink dark:border-zinc-700 px-5 py-4 h-full flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-4 shrink-0">
          {/*
            The gauge is decorative in the strict sense: every value it displays is also spelled
            out in the text beside it. It is marked aria-hidden so a screen reader reads the
            reading once, as words, instead of announcing a pile of unlabelled SVG paths. The
            colored bands are a second encoding of information the text already carries, which
            is what keeps this compliant with SC 1.4.1 rather than in breach of it.
          */}
          {/*
            The needle and hub are painted with `currentColor`, not a hardcoded hex. They were
            `#111111`, which is near-invisible against the dark card — the one part of the gauge
            that carries the actual reading, disappearing in the theme where contrast matters
            most. Inheriting the text color means the needle is ink in light mode and zinc-100 in
            dark, and it can never fall out of step with the surface behind it again.
          */}
          <svg
            width="132"
            height="76"
            viewBox="0 0 200 110"
            aria-hidden="true"
            className="text-zinc-900 dark:text-zinc-100 shrink-0"
          >
            <title>Fire danger gauge</title>
            {FIRE_DANGER_LEVELS.map((level, i) => (
              <path
                key={level.key}
                d={gaugeArcPath(100, 100, 95, 65, FIRE_ZONE_ANGLES[i], FIRE_ZONE_ANGLES[i + 1])}
                fill={level.color}
              />
            ))}

            {/*
              Band labels sitting on the arc, as the City's own gauge carries. Without them the
              coloured dial is decoration: a visitor cannot tell whether orange is the third band
              of four or the second of three until they read the sentence beside it. The labels
              make the graphic self-describing at a glance, which is the entire reason to draw a
              gauge instead of printing the word.

              White at this size holds contrast against all four band colours, the darkest of
              which is green #16a34a. They stay inside the aria-hidden svg because the reading is
              already announced as text — repeating four band names to a screen reader would be
              noise, not information.
            */}
            {FIRE_DANGER_LEVELS.map((level, i) => {
              const mid = (FIRE_ZONE_ANGLES[i] + FIRE_ZONE_ANGLES[i + 1]) / 2;
              const at = polarToCartesian(100, 100, 80, mid);
              return (
                <text
                  key={`${level.key}-label`}
                  x={at.x}
                  y={at.y}
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${90 - mid} ${at.x} ${at.y})`}
                >
                  {getLabel(level.short)}
                </text>
              );
            })}
            <line
              x1="100"
              y1="100"
              x2={needleTip.x}
              y2={needleTip.y}
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="7" fill="currentColor" />
          </svg>
          <div>
            <h2 className="font-black text-sm uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
              {t('fireConditionsTitle')}
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-bold">{t('fireDangerLabel')}</span> {levelLabel}
            </p>
          </div>
        </div>
        <span role="status" className={statusPillClass(fireConditions.banActive)}>
          {t('fireBanLabel')} {fireConditions.banActive ? t('fireBanYes') : t('fireBanNo')}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {t('updatedLabel')} {getLabel(fireConditions.updatedAt)}
        </span>
        <a
          href="#"
          className="text-xs font-bold nb-text-navy dark:text-blue-400 hover:underline ml-auto"
        >
          {t('fireConditionsLink')}
        </a>
      </div>
    </div>
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
