/**
 * CaseStudy6ParallelCoordinates.tsx renders the sixth case study page:
 * a dual-panel view with parallel coordinates and star plot visualization
 * for comparing pollutant metrics across monitoring stations.
 */
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';

import {
  renderCaseStudy6Parallel,
  type CaseStudy6Datum,
  type CaseStudy6MetricKey,
} from '../../charts/CaseStudy6ParallelRenderer';
import { renderCaseStudy6Star } from '../../charts/CaseStudy6StarRenderer';
import rawData from '../../data/case-study06.json';
import { useD3 } from '../../hooks/useD3';
import { useTranslator } from '../../hooks/useTranslator';

interface RawCaseStudy6Datum {
  'Bundesland / Messnetz': string;
  Stationscode: string;
  Stationsname: string;
  Stationsumgebung: string;
  'Art der Station': string;
  Feinstaub: number;
  Kohlenmonoxid: number;
  Ozon: number;
  Schwefeldixoid: number;
  Stickstoffdioxid: number;
}

interface ParallelViewProps {
  enableMotion?: boolean;
}

const CaseStudy6ParallelCoordinates = ({
  enableMotion = true,
}: ParallelViewProps): ReactElement => {
  const { translate } = useTranslator(['caseStudies', 'common', 'tooltips']);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  const data: CaseStudy6Datum[] = useMemo(() => {
    return (rawData as RawCaseStudy6Datum[])
      .map((row) => {
        const values: Record<CaseStudy6MetricKey, number> = {
          fineDust: Number(row.Feinstaub) || 0,
          carbonMonoxide: Number(row.Kohlenmonoxid) || 0,
          ozone: Number(row.Ozon) || 0,
          sulfurDioxide: Number(row.Schwefeldixoid) || 0,
          nitrogenDioxide: Number(row.Stickstoffdioxid) || 0,
        };

        return {
          network: row['Bundesland / Messnetz'] || 'Unknown',
          code: row.Stationscode || 'Unknown',
          name: row.Stationsname || 'Unknown',
          environment: row.Stationsumgebung || 'Unknown',
          stationType: row['Art der Station'] || 'Unknown',
          values,
        };
      })
      .filter((row) => Object.values(row.values).some((v) => v > 0));
  }, []);

  const metricLabels: Record<CaseStudy6MetricKey, string> = useMemo(
    () => ({
      fineDust: translate('caseStudies:6.metrics.pm25') || 'Feinstaub',
      carbonMonoxide: translate('caseStudies:6.metrics.co') || 'Kohlenmonoxid',
      ozone: translate('caseStudies:6.metrics.o3') || 'Ozon',
      sulfurDioxide: translate('caseStudies:6.metrics.so2') || 'Schwefeldixoid',
      nitrogenDioxide: translate('caseStudies:6.metrics.no2') || 'Stickstoffdioxid',
    }),
    [translate]
  );

  const formatNetwork = useCallback(
    (network: string) => translate(`caseStudies:6.networks.${network}`) || network,
    [translate]
  );

  const formatEnvironment = useCallback(
    (environment: string) => translate(`caseStudies:6.environments.${environment}`) || environment,
    [translate]
  );

  const formatStationType = useCallback(
    (stationType: string) => translate(`caseStudies:6.stationTypes.${stationType}`) || stationType,
    [translate]
  );

  const renderParallelChart = useCallback(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      return renderCaseStudy6Parallel({
        container,
        data,
        translate,
        metricLabels,
        formatNetwork,
        formatEnvironment,
        formatStationType,
      });
    },
    [data, translate, metricLabels, formatNetwork, formatEnvironment, formatStationType]
  );

  const renderStarChart = useCallback(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      return renderCaseStudy6Star({
        container,
        data,
        translate,
        metricLabels,
        formatNetwork,
      });
    },
    [data, translate, metricLabels, formatNetwork]
  );

  const parallelRef = useD3(renderParallelChart);
  const starRef = useD3(renderStarChart);

  const allowMotion = enableMotion && !firstLoad;
  const initial = allowMotion ? { opacity: 0, y: 24 } : {};
  const animate = allowMotion ? { opacity: 1, y: 0 } : {};
  const exit = allowMotion ? { opacity: 0, y: -24 } : {};

  return (
    <motion.section
      className="mx-auto w-full max-w-4xl space-y-6"
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {translate('caseStudies:6.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {translate('caseStudies:6.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {translate('caseStudies:6.description')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-300">
                {translate('caseStudies:6.parallel.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:6.parallel.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:6.parallel.caption')}
              </p>
            </div>
            <span className="rounded-full border border-indigo-300/70 bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase text-indigo-700 shadow-sm dark:border-indigo-300/20 dark:bg-indigo-400/15 dark:text-indigo-100">
              {translate('caseStudies:6.parallel.badge')}
            </span>
          </div>
          <div
            ref={parallelRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-200">
              {translate('caseStudies:6.parallel.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {['axes', 'encoding', 'ranking', 'comparison', 'context'].map((key) => (
                <li key={key}>{translate(`caseStudies:6.parallel.reasons.${key}`)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">
                {translate('caseStudies:6.starPlot.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:6.starPlot.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:6.starPlot.caption')}
              </p>
            </div>
            <span className="rounded-full border border-violet-300/70 bg-violet-100 px-3 py-1 text-xs font-semibold uppercase text-violet-700 shadow-sm dark:border-violet-300/20 dark:bg-violet-400/15 dark:text-violet-100">
              {translate('caseStudies:6.starPlot.badge')}
            </span>
          </div>
          <div
            ref={starRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-200">
              {translate('caseStudies:6.starPlot.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {['axes', 'encoding', 'ranking', 'outliers', 'context'].map((key) => (
                <li key={key}>{translate(`caseStudies:6.starPlot.reasons.${key}`)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CaseStudy6ParallelCoordinates;
