// src/pages/case-studies/CaseStudy3RandomizedBars.tsx
/**
 * CaseStudy3RandomizedBars.tsx powers the third case study page:
 * a live-updating bar chart with adjustable random magnitude controls and contextual copy.
 * Sections guide translations, data/interval management, D3 rendering, and the UI shell.
 */
import { motion } from 'framer-motion';
import { useCallback, useMemo, type ReactElement } from 'react';

import { renderRandomizedBars } from '../../charts/RandomizedBarsRenderer';
import { useD3 } from '../../hooks/useD3';
import { randomizedBarsConfig, useRandomizedBars } from '../../hooks/useRandomizedBars';
import { useTranslator } from '../../hooks/useTranslator';

// Tweak: edit `randomizedBarsConfig.slider` if you need different magnitude range/step.
const MAGNITUDE_CONTROL = randomizedBarsConfig.slider;

const CaseStudy3RandomizedBars = (): ReactElement => {
  const { translate } = useTranslator(['caseStudies', 'common', 'charts']);

  const { data, loading, errorMessage, magnitude, setMagnitude, highlightedCity, formatCityName } =
    useRandomizedBars();

  /* ----------------------------- Chart rendering ----------------------------- */
  const renderChart = useCallback(
    (node: HTMLElement) => {
      if (!data.length) return undefined;

      return renderRandomizedBars({
        container: node,
        data,
        highlightedCity,
        formatCityName,
        svgTitle: translate('caseStudies:3.chart.title'),
        svgDescription: translate('caseStudies:3.chart.subtitle'),
      });
    },
    [data, formatCityName, highlightedCity, translate]
  );

  const chartRef = useD3(renderChart);

  const explanation = useMemo(() => translate('caseStudies:3.description'), [translate]);

  /* ----------------------------- UI layout + controls ----------------------------- */
  return (
    // Tweak: overall spacing + fade-in animation for Case Study 3 layout.
    <motion.section
      className="mx-auto w-full max-w-4xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Intro copy for the experiment */}
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {translate('caseStudies:3.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {translate('caseStudies:3.title')}
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{explanation}</p>
      </div>

      {/* Control cards with slider + live value */}
      {/* Tweak: slider + stats card grid—the template ratio controls emphasis. */}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-950/60 sm:p-6">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
            <label htmlFor="magnitude-slider">
              {translate('caseStudies:3.controls.magnitude')}
            </label>
            <span>
              {translate('caseStudies:3.controls.liveValue', { value: magnitude.toFixed(1) })}
            </span>
          </div>
          <input
            id="magnitude-slider"
            type="range"
            // Tweak: slider limits/step pulled from `randomizedBarsConfig.slider`.
            min={MAGNITUDE_CONTROL.min}
            max={MAGNITUDE_CONTROL.max}
            step={MAGNITUDE_CONTROL.step}
            value={magnitude}
            onChange={(event) => setMagnitude(Number(event.currentTarget.value))}
            // Tweak: slider track + thumb colors via Tailwind + `accent-*`.
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-500 dark:bg-slate-700"
            aria-label={translate('caseStudies:3.controls.magnitude')}
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{MAGNITUDE_CONTROL.min}</span>
            <span>{MAGNITUDE_CONTROL.max}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/70 p-4 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-950/60 sm:p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            {translate('caseStudies:3.controls.current')}
          </p>
          <p className="mt-2 text-3xl font-semibold text-cyan-600 dark:text-cyan-300">
            {magnitude.toFixed(1)}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            {translate('caseStudies:3.controls.hint')}
          </p>
        </div>
      </div>

      {/* Chart container wrapping the randomized bars */}
      <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {translate('caseStudies:3.chart.label')}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {translate('caseStudies:3.chart.title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {translate('caseStudies:3.chart.subtitle')}
            </p>
          </div>
        </div>
        <div
          ref={chartRef}
          // Tweak: chart container gradient + min height for the randomized bars.
          className="chart-container relative w-full overflow-hidden rounded-2xl border border-white/50 bg-linear-to-b from-white/80 to-white/50 p-2 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
        >
          {loading && (
            <div className="flex min-h-70 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              {translate('common:loading')}
            </div>
          )}
          {!loading && errorMessage && (
            <div className="flex min-h-70 items-center justify-center text-center text-sm text-rose-500 dark:text-rose-300">
              {errorMessage}
            </div>
          )}
          {!loading && !errorMessage && !data.length && (
            <div className="flex min-h-70 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              {translate('common:loading')}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default CaseStudy3RandomizedBars;
