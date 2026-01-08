/**
 * CaseStudy4TimeOfDay.tsx compares a flawed donut chart against a corrected multi-band time series
 * to showcase data ethics lessons. Sections cover translations, data prep, both charts, and layout.
 */
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { caseStudy4Palette } from '../../charts/caseStudy4Palette';
import { caseStudy4TimePalette } from '../../charts/caseStudy4TimePalette';
import { renderFixedTimeBands } from '../../charts/FixedTimeBandsRenderer';
import { renderFlawedDonut } from '../../charts/FlawedDonutRenderer';
import { useTimeOfDayData } from '../../hooks/useTimeOfDayData';
import { useTranslator } from '../../hooks/useTranslator';

type CaseStudy4Palette = typeof caseStudy4Palette & { Berlin?: string };
const CASE4_PALETTE: CaseStudy4Palette = caseStudy4Palette;

// Translation keys powering the flawed vs fixed talking points; reorder/edit here to change the story beats.
const TALKING_POINT_KEYS = {
  flawed: ['axis', 'colors', 'legend', 'order', 'aggregation', 'mapping'] as const,
  fixed: ['baseline', 'palette', 'legend', 'structure', 'fullData', 'mapping'] as const,
};

const CaseStudy4TimeOfDay = (): ReactElement => {
  const { translate } = useTranslator(['caseStudies', 'common']);
  const flawedRef = useRef<HTMLDivElement | null>(null);
  const fixedRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<'city' | 'timeOfDay'>('city');

  const { timeOrder, aggregated, days, cities, getSales } = useTimeOfDayData();
  const defaultCityColor = CASE4_PALETTE.Berlin ?? '#6366f1';
  const defaultTimeColor = caseStudy4TimePalette.morgens;

  useEffect(() => {
    if (!flawedRef.current) return;
    renderFlawedDonut({
      container: flawedRef.current,
      aggregated,
      translate,
    });
  }, [aggregated, translate]);

  const preferredCityOrder = useMemo(() => {
    const ordered = ['Köln', 'Berlin'];
    const normalized = ordered.filter((city) => cities.includes(city));
    const remaining = cities.filter((city) => !ordered.includes(city));
    return [...normalized, ...remaining];
  }, [cities]);

  const sanitizeForClass = (value: string) =>
    `city-${value
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '')
      .replaceAll(/[^a-z0-9]+/gi, '-')
      .replaceAll(/(?:^-+|-+$)/g, '')
      .toLowerCase()}`;

  const cityComparisonView = useMemo(
    () => ({
      mode: 'city' as const,
      panelIds: [...timeOrder],
      getPanelLabel: (panelId: string) => translate(`caseStudies:4.times.${panelId}`),
      getPanelClassName: (panelId: string) => `time-${panelId}`,
      seriesIds: [...cities],
      getSeriesLabel: (seriesId: string) =>
        translate(`caseStudies:4.cities.${seriesId}`) ?? seriesId,
      getSeriesColor: (seriesId: string) => CASE4_PALETTE[seriesId] ?? defaultCityColor,
      getValue: (panelId: string, seriesId: string, day: number) =>
        getSales(seriesId, day, panelId as (typeof timeOrder)[number]),
      legendTitle: translate('caseStudies:4.fixed.legendTitle'),
    }),
    [cities, defaultCityColor, getSales, timeOrder, translate]
  );

  const timeOfDayComparisonView = useMemo(
    () => ({
      mode: 'timeOfDay' as const,
      panelIds: preferredCityOrder,
      getPanelLabel: (panelId: string) => translate(`caseStudies:4.cities.${panelId}`) ?? panelId,
      getPanelClassName: (panelId: string) => sanitizeForClass(panelId),
      seriesIds: [...timeOrder],
      getSeriesLabel: (seriesId: string) => translate(`caseStudies:4.times.${seriesId}`),
      getSeriesColor: (seriesId: string) =>
        caseStudy4TimePalette[seriesId as (typeof timeOrder)[number]] ?? defaultTimeColor,
      getValue: (panelId: string, seriesId: string, day: number) =>
        getSales(panelId, day, seriesId as (typeof timeOrder)[number]),
      legendTitle: translate('caseStudies:4.fixed.legendTimes'),
    }),
    [defaultTimeColor, getSales, preferredCityOrder, timeOrder, translate]
  );

  const activeView = viewMode === 'city' ? cityComparisonView : timeOfDayComparisonView;

  /* ----------------------------- Corrected multi-band chart ----------------------------- */
  useEffect(() => {
    if (!fixedRef.current) return;
    renderFixedTimeBands({
      container: fixedRef.current,
      days,
      translate,
      view: activeView,
    });
  }, [activeView, days, translate]);

  /* ----------------------------- Narrative bullet points ----------------------------- */
  const flawedPoints = useMemo(
    () => TALKING_POINT_KEYS.flawed.map((key) => translate(`caseStudies:4.flawed.reasons.${key}`)),
    [translate]
  );

  const fixedPoints = useMemo(
    () => TALKING_POINT_KEYS.fixed.map((key) => translate(`caseStudies:4.fixed.reasons.${key}`)),
    [translate]
  );

  /* ----------------------------- Page layout ----------------------------- */
  return (
    // Tweak: page spacing + fade animation for flawed vs fixed comparison.
    <motion.section
      className="mx-auto w-full max-w-4xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Hero copy describing what this case examines */}
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        {/* Tweak: hero eyebrow/title/description text for case study intro. */}
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
        <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
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
            // Tweak: flawed donut host container background + border.
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-200">
              {translate('caseStudies:4.flawed.listTitle')}
            </p>
            {/* Tweak: reorder this list to change flawed talking point emphasis. */}
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {flawedPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Corrected visualization with supporting talking points */}
        <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
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
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  {translate(
                    viewMode === 'city'
                      ? 'caseStudies:4.fixed.axisCity'
                      : 'caseStudies:4.fixed.axisTimeOfDay'
                  )}
                </p>
                <fieldset className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-black/40">
                  <legend className="sr-only">
                    {translate('caseStudies:4.fixed.viewToggleAria')}
                  </legend>
                  {(['city', 'timeOfDay'] as const).map((mode) => {
                    const isActive = viewMode === mode;
                    const labelKey =
                      mode === 'city'
                        ? 'caseStudies:4.fixed.axisCity'
                        : 'caseStudies:4.fixed.axisTimeOfDay';
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => !isActive && setViewMode(mode)}
                        className={`inline-flex items-center rounded-full px-3 py-1 transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-200/60 dark:bg-neutral-900 dark:text-white dark:shadow-cyan-500/30 dark:ring-cyan-400/40'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                        aria-pressed={isActive}
                      >
                        {translate(labelKey)}
                      </button>
                    );
                  })}
                </fieldset>
              </div>
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
            {/* Tweak: positive talking points list order mirrors the corrected narrative. */}
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
