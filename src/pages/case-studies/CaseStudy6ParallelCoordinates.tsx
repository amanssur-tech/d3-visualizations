// src/pages/case-studies/CaseStudy6ParallelCoordinates.tsx
/**
 * CaseStudy6ParallelCoordinates.tsx renders the parallel coordinates plot comparing
 * Feinstaub and four other pollutants across German monitoring stations.
 * Layout: hero intro, context cards (metrics/legend/highlights), and the chart panel.
 */
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import {
  CASE_STUDY_6_METRICS,
  getNetworkColor,
  renderCaseStudy6Parallel,
  type CaseStudy6Datum,
  type CaseStudy6MetricKey,
} from '../../charts/CaseStudy6ParallelRenderer';
import { renderCaseStudy6Star } from '../../charts/CaseStudy6StarRenderer';
import rawData from '../../data/case-study06.json';
import { useTranslator } from '../../hooks/useTranslator';
import { Badge } from '../../ui/Badge';
import { Surface } from '../../ui/Surface';

interface CaseStudy6Raw {
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

const NETWORK_KEY_MAP: Record<string, string> = {
  Bremen: 'bremen',
  Hessen: 'hessen',
  'Rheinland-Pfalz': 'rheinlandPfalz',
};

const ENVIRONMENT_KEY_MAP: Record<string, string> = {
  'städtisches Gebiet': 'urban',
};

const STATION_TYPE_KEY_MAP: Record<string, string> = {
  Hintergrund: 'background',
};

const HIGHLIGHT_KEYS = ['normalized', 'fineDust', 'hover'] as const;

const CaseStudy6ParallelCoordinates = (): ReactElement => {
  const { translate } = useTranslator(['caseStudies', 'common']);
  const [data, setData] = useState<CaseStudy6Datum[]>([]);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const starRef = useRef<HTMLDivElement | null>(null);

  const metricLabels = useMemo(
    () => ({
      fineDust: translate('caseStudies:6.metrics.fineDust'),
      carbonMonoxide: translate('caseStudies:6.metrics.carbonMonoxide'),
      ozone: translate('caseStudies:6.metrics.ozone'),
      sulfurDioxide: translate('caseStudies:6.metrics.sulfurDioxide'),
      nitrogenDioxide: translate('caseStudies:6.metrics.nitrogenDioxide'),
    }),
    [translate]
  );

  const translateNetwork = useCallback(
    (network: string) =>
      translate(`caseStudies:6.networks.${NETWORK_KEY_MAP[network] ?? network}`, {
        defaultValue: network,
      }),
    [translate]
  );

  const translateEnvironment = useCallback(
    (environment: string) =>
      translate(`caseStudies:6.environments.${ENVIRONMENT_KEY_MAP[environment] ?? environment}`, {
        defaultValue: environment,
      }),
    [translate]
  );

  const translateStationType = useCallback(
    (stationType: string) =>
      translate(`caseStudies:6.stationTypes.${STATION_TYPE_KEY_MAP[stationType] ?? stationType}`, {
        defaultValue: stationType,
      }),
    [translate]
  );

  /* ----------------------------- Data load ----------------------------- */
  useEffect(() => {
    try {
      const parsed = (rawData as CaseStudy6Raw[]).map<CaseStudy6Datum>((entry) => ({
        network: entry['Bundesland / Messnetz'],
        code: entry.Stationscode,
        name: entry.Stationsname,
        environment: entry.Stationsumgebung,
        stationType: entry['Art der Station'],
        values: {
          fineDust: entry.Feinstaub,
          carbonMonoxide: entry.Kohlenmonoxid,
          ozone: entry.Ozon,
          sulfurDioxide: entry.Schwefeldixoid,
          nitrogenDioxide: entry.Stickstoffdioxid,
        },
      }));

      setData(parsed);
      setErrorKey(null);
    } catch (error) {
      console.error('Failed to parse Case Study 6 data', error);
      setErrorKey('common.errors.unknown');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ----------------------------- Chart render ----------------------------- */
  useEffect(() => {
    if (!data.length || !chartRef.current) return undefined;

    const cleanup = renderCaseStudy6Parallel({
      container: chartRef.current,
      data,
      translate,
      metricOrder: CASE_STUDY_6_METRICS,
      metricLabels,
      formatNetwork: translateNetwork,
      formatEnvironment: translateEnvironment,
      formatStationType: translateStationType,
    });

    return cleanup;
  }, [data, translate, translateEnvironment, translateNetwork, translateStationType, metricLabels]);

  useEffect(() => {
    if (!data.length || !starRef.current) return undefined;

    const cleanup = renderCaseStudy6Star({
      container: starRef.current,
      data,
      translate,
      metricLabels,
      formatNetwork: translateNetwork,
    });

    return cleanup;
  }, [data, translate, translateNetwork, metricLabels]);

  const networks = useMemo(() => Array.from(new Set(data.map((d) => d.network))), [data]);

  /* ----------------------------- Layout ----------------------------- */
  return (
    <motion.section
      className="mx-auto w-full max-w-6xl space-y-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Surface variant="panel" padding="lg" className="sm:px-8">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
          {translate('caseStudies:6.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {translate('caseStudies:6.title')}
        </h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {translate('caseStudies:6.description')}
        </p>
      </Surface>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-4">
          <Surface variant="panel" padding="md">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {translate('caseStudies:library.tagsLabel')}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {translate('caseStudies:6.chart.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {translate('caseStudies:6.chart.description')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(metricLabels) as CaseStudy6MetricKey[]).map((metric) => (
                <Badge key={metric} size="sm" variant="soft">
                  {metricLabels[metric]}
                </Badge>
              ))}
            </div>
          </Surface>

          <Surface variant="panel" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                {translate('caseStudies:6.legend.title')}
              </p>
            </div>

            <div className="space-y-2">
              {networks.map((network) => (
                <div key={network} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: getNetworkColor(network) }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {translateNetwork(network)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{network}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {translate('caseStudies:6.chart.note')}
            </p>

            <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Badge size="xs" variant="soft">
                {translate('caseStudies:6.legend.envLabel')}:{' '}
                {translateEnvironment('städtisches Gebiet')}
              </Badge>
              <Badge size="xs" variant="soft">
                {translate('caseStudies:6.legend.typeLabel')}: {translateStationType('Hintergrund')}
              </Badge>
            </div>
          </Surface>

          <Surface variant="panel" padding="md" className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {translate('caseStudies:6.subtitle')}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {translate('caseStudies:6.chart.title')}
            </h3>
            <ul className="mt-1 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {HIGHLIGHT_KEYS.map((key) => (
                <li key={key} className="flex gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow shadow-emerald-500/30" />
                  <span>{translate(`caseStudies:6.highlights.${key}`)}</span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>

        <Surface variant="panel" padding="lg" className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-200">
                {translate('caseStudies:6.subtitle')}
              </p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:6.title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:6.chart.description')}
              </p>
            </div>
            <Badge size="sm" variant="soft">
              PM10 · CO · O₃ · SO₂ · NO₂
            </Badge>
          </div>

          {errorKey ? (
            <p className="mt-2 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-200">
              {translate(errorKey)}
            </p>
          ) : null}

          <div
            ref={chartRef}
            className={`relative min-h-110 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent ${
              loading ? 'animate-pulse opacity-80' : ''
            }`}
            aria-live="polite"
          />
        </Surface>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Surface variant="panel" padding="lg" className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-200">
                {translate('caseStudies:6.starPlot.title')}
              </p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:6.starPlot.title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:6.starPlot.description')}
              </p>
            </div>
            <Badge size="sm" variant="soft">
              {translate('caseStudies:6.starPlot.note')}
            </Badge>
          </div>

          <div
            ref={starRef}
            className={`relative min-h-105 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent ${
              loading ? 'animate-pulse opacity-80' : ''
            }`}
            aria-live="polite"
          />
        </Surface>

        <Surface variant="panel" padding="lg" className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            {translate('caseStudies:6.comparison.question')}
          </p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {translate('caseStudies:6.title')}
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {(['coverage', 'focus', 'design'] as const).map((key) => (
              <li key={key} className="flex gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-400 shadow shadow-cyan-500/30" />
                <span>{translate(`caseStudies:6.comparison.points.${key}`)}</span>
              </li>
            ))}
          </ul>
        </Surface>
      </div>
    </motion.section>
  );
};

export default CaseStudy6ParallelCoordinates;
