/**
 * CaseStudy4TimeOfDay.tsx compares a flawed donut chart against a corrected multi-band time series
 * to showcase data ethics lessons. Sections cover translations, data prep, both charts, and layout.
 */
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

import { renderFixedTimeBands } from '../../charts/FixedTimeBandsRenderer';
import { renderFlawedDonut } from '../../charts/FlawedDonutRenderer';
import { useTimeOfDayData } from '../../hooks/useTimeOfDayData';
import { useTranslator } from '../../hooks/useTranslator';

const cityPalette: Record<string, string> = {
  Berlin: '#6366f1',
  Köln: '#0ea5e9',
};

const CaseStudy4TimeOfDay = () => {
  const { translate } = useTranslator(['caseStudies', 'common']);
  const flawedRef = useRef<HTMLDivElement | null>(null);
  const fixedRef = useRef<HTMLDivElement | null>(null);

  const { timeOrder, dailyRows, aggregated, days, cities, getSales } = useTimeOfDayData();

  useEffect(() => {
    if (!flawedRef.current) return;
    renderFlawedDonut({
      container: flawedRef.current,
      aggregated,
      translate,
    });
  }, [aggregated, translate]);

  /* ----------------------------- Corrected multi-band chart ----------------------------- */
  useEffect(() => {
    if (!fixedRef.current) return;
    renderFixedTimeBands({
      container: fixedRef.current,
      timeOrder,
      dailyRows,
      days,
      cities,
      getSales,
      translate,
      cityPalette,
    });
  }, [timeOrder, dailyRows, days, cities, getSales, translate]);

  /* ----------------------------- Narrative bullet points ----------------------------- */
  const flawedPoints = useMemo(
    () => [
      translate('caseStudies:4.flawed.reasons.axis'),
      translate('caseStudies:4.flawed.reasons.colors'),
      translate('caseStudies:4.flawed.reasons.legend'),
      translate('caseStudies:4.flawed.reasons.order'),
      translate('caseStudies:4.flawed.reasons.aggregation'),
      translate('caseStudies:4.flawed.reasons.mapping'),
    ],
    [translate]
  );

  const fixedPoints = useMemo(
    () => [
      translate('caseStudies:4.fixed.reasons.baseline'),
      translate('caseStudies:4.fixed.reasons.palette'),
      translate('caseStudies:4.fixed.reasons.legend'),
      translate('caseStudies:4.fixed.reasons.structure'),
      translate('caseStudies:4.fixed.reasons.fullData'),
      translate('caseStudies:4.fixed.reasons.mapping'),
    ],
    [translate]
  );

  /* ----------------------------- Page layout ----------------------------- */
  return (
    <motion.section
      className="mx-auto w-full max-w-4xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Hero copy describing what this case examines */}
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {translate('caseStudies:4.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {translate('caseStudies:4.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {translate('caseStudies:4.description')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Breakdown of what went wrong */}
        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-700 dark:text-amber-200">
                {translate('caseStudies:4.flawed.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:4.flawed.title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:4.flawed.caption')}
              </p>
            </div>
            <span className="rounded-full border border-amber-300/70 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700 shadow-sm dark:border-amber-200/25 dark:bg-amber-400/15 dark:text-amber-200">
              {translate('caseStudies:4.flawed.badge')}
            </span>
          </div>
          <div
            ref={flawedRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-200">
              {translate('caseStudies:4.flawed.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {flawedPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Corrected visualization with supporting talking points */}
        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
                {translate('caseStudies:4.fixed.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:4.fixed.title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:4.fixed.caption')}
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/70 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700 shadow-sm dark:border-emerald-300/20 dark:bg-emerald-400/15 dark:text-emerald-100">
              {translate('caseStudies:4.fixed.badge')}
            </span>
          </div>
          <div
            ref={fixedRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-200">
              {translate('caseStudies:4.fixed.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {fixedPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CaseStudy4TimeOfDay;
