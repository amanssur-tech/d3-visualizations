/**
 * CaseStudy5DualView.tsx renders a dual-panel case study with a dumbbell chart
 * and an overlaid scatter plot. It also exposes per-panel export controls
 * and handles the German vs English city name convention.
 */
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';

import { renderCaseStudy5Dumbbell, type CaseStudy5Datum } from '../../charts/CaseStudy5DumbbellRenderer';
import { renderCaseStudy5Scatter } from '../../charts/CaseStudy5ScatterRenderer';
import rawData from '../../data/case-study05.json';
import { useD3 } from '../../hooks/useD3';
import { useTranslator } from '../../hooks/useTranslator';
import { formatCityNameFactory } from '../../utils/formatCityName';

interface RawCaseStudy5Datum {
  Stadt: string;
  Kebabläden: number;
  'Kunden pro Tag': number;
  'Umsatz pro Tag': number;
  'Meistverkaufter Kebab': string;
}

interface DualViewProps {
  showHeader?: boolean;
  enableMotion?: boolean;
}

const CaseStudy5DualView = ({
  showHeader = true,
  enableMotion = true,
}: DualViewProps): ReactElement => {
  const { translate } = useTranslator(['caseStudies', 'common', 'tooltips']);
  const [firstLoad, setFirstLoad] = useState(true);
  const formatCityName = useMemo(() => formatCityNameFactory(translate), [translate]);

  void showHeader;

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  const data: CaseStudy5Datum[] = useMemo(() => {
    return (rawData as RawCaseStudy5Datum[])
      .map((row) => {
        const shops = Number(row.Kebabläden);
        const customersPerDay = Number(row['Kunden pro Tag']);
        const revenuePerDay = Number(row['Umsatz pro Tag']);

        return {
          city: row.Stadt || 'Unknown',
          shops: Number.isFinite(shops) ? shops : 0,
          customersPerDay: Number.isFinite(customersPerDay) ? customersPerDay : 0,
          revenuePerDay: Number.isFinite(revenuePerDay) ? revenuePerDay : 0,
          menuType: row['Meistverkaufter Kebab'] || 'Unknown',
        };
      })
      .filter((row) => row.shops > 0);
  }, []);

  const formatMenuType = useCallback(
    (menuType: string) => translate(`caseStudies:5.menuTypes.${menuType}`) || menuType,
    [translate]
  );

  const renderDumbbellChart = useCallback(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      return renderCaseStudy5Dumbbell({
        container,
        data,
        translate,
        formatCityName,
        formatMenuType,
      });
    },
    [data, translate, formatCityName, formatMenuType]
  );

  const renderScatterChart = useCallback(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      return renderCaseStudy5Scatter({
        container,
        data,
        translate,
        formatCityName,
        formatMenuType,
      });
    },
    [data, translate, formatCityName, formatMenuType]
  );

  const dumbbellRef = useD3(renderDumbbellChart);
  const scatterRef = useD3(renderScatterChart);

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
          {translate('caseStudies:5.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {translate('caseStudies:5.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {translate('caseStudies:5.description')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-600 dark:text-blue-300">
                {translate('caseStudies:5.dumbbell.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:5.dumbbell.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:5.dumbbell.caption')}
              </p>
            </div>
            <span className="rounded-full border border-blue-300/70 bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700 shadow-sm dark:border-blue-300/20 dark:bg-blue-400/15 dark:text-blue-100">
              {translate('caseStudies:5.dumbbell.badge')}
            </span>
          </div>
          <div
            ref={dumbbellRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-200">
              {translate('caseStudies:5.dumbbell.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {['axis', 'encoding', 'ranking', 'comparison', 'context'].map((key) => (
                <li key={key}>{translate(`caseStudies:5.dumbbell.reasons.${key}`)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/80 px-4 py-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-teal-600 dark:text-teal-300">
                {translate('caseStudies:5.scatter.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:5.scatter.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:5.scatter.caption')}
              </p>
            </div>
            <span className="rounded-full border border-teal-300/70 bg-teal-100 px-3 py-1 text-xs font-semibold uppercase text-teal-700 shadow-sm dark:border-teal-300/20 dark:bg-teal-400/15 dark:text-teal-100">
              {translate('caseStudies:5.scatter.badge')}
            </span>
          </div>
          <div
            ref={scatterRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-200">
              {translate('caseStudies:5.scatter.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {['correlation', 'encoding', 'ranking', 'outliers', 'context'].map((key) => (
                <li key={key}>{translate(`caseStudies:5.scatter.reasons.${key}`)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CaseStudy5DualView;
