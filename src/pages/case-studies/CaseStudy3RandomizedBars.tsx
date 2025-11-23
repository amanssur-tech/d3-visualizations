// src/pages/case-studies/CaseStudy3RandomizedBars.tsx
/**
 * CaseStudy3RandomizedBars.tsx powers the third case study page:
 * a live-updating bar chart with adjustable random magnitude controls and contextual copy.
 * Sections guide translations, data/interval management, D3 rendering, and the UI shell.
 */
import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { renderRandomizedBars } from '../../charts/RandomizedBarsRenderer';
import { useRandomizedBars } from '../../hooks/useRandomizedBars';

const CaseStudy3RandomizedBars = () => {
  const { t } = useTranslation(['caseStudies', 'common', 'charts']);

  const { data, loading, errorMessage, magnitude, setMagnitude, highlightedCity, formatCityName } =
    useRandomizedBars();

  /* ----------------------------- Chart rendering ----------------------------- */
  const chartRef = useRef<HTMLDivElement | null>(null);

  useMemo(() => {
    if (!data.length || !chartRef.current) return;
    renderRandomizedBars({
      container: chartRef.current,
      data,
      highlightedCity,
      formatCityName,
    });
  }, [data, highlightedCity, formatCityName]);

  const explanation = useMemo(() => t('caseStudies:3.description'), [t]);

  /* ----------------------------- UI layout + controls ----------------------------- */
  return (
    <motion.section
      className="mx-auto w-full max-w-4xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Intro copy for the experiment */}
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {t('caseStudies:3.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {t('caseStudies:3.title')}
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{explanation}</p>
      </div>

      {/* Control cards with slider + live value */}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-950/60 sm:p-6">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
            <label htmlFor="magnitude-slider">{t('caseStudies:3.controls.magnitude')}</label>
            <span>{t('caseStudies:3.controls.liveValue', { value: magnitude.toFixed(1) })}</span>
          </div>
          <input
            id="magnitude-slider"
            type="range"
            min={0}
            max={25}
            step={0.1}
            value={magnitude}
            onChange={(event) => setMagnitude(Number(event.currentTarget.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-500 dark:bg-slate-700"
            aria-label={t('caseStudies:3.controls.magnitude')}
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>0</span>
            <span>25</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/70 p-4 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-950/60 sm:p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            {t('caseStudies:3.controls.current')}
          </p>
          <p className="mt-2 text-3xl font-semibold text-cyan-600 dark:text-cyan-300">
            {magnitude.toFixed(1)}
          </p>
          <p className="text-slate-500 dark:text-slate-400">{t('caseStudies:3.controls.hint')}</p>
        </div>
      </div>

      {/* Chart container wrapping the randomized bars */}
      <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {t('caseStudies:3.chart.label')}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {t('caseStudies:3.chart.title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {t('caseStudies:3.chart.subtitle')}
            </p>
          </div>
        </div>
        <div
          ref={chartRef}
          className="chart-container relative w-full overflow-hidden rounded-2xl border border-white/50 bg-linear-to-b from-white/80 to-white/50 p-2 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
        >
          {loading && (
            <div className="flex min-h-[280px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              {t('common:loading')}
            </div>
          )}
          {!loading && errorMessage && (
            <div className="flex min-h-[280px] items-center justify-center text-center text-sm text-rose-500 dark:text-rose-300">
              {errorMessage}
            </div>
          )}
          {!loading && !errorMessage && !data.length && (
            <div className="flex min-h-[280px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              {t('common:loading')}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default CaseStudy3RandomizedBars;
