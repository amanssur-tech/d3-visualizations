// src/pages/case-studies/CaseStudy1BarChart.tsx
/**
 * CaseStudy1BarChart.tsx renders the first case study page: a static D3 bar chart
 * comparing kebab shop counts per city, plus export controls and optional header.
 * Sections below cover translations, data loading, chart rendering, and UI wrapper content.
 */
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';

import { renderBarChart } from '../../charts/BarChartRenderer';
import kebabData from '../../data/case-study01.json';
import { useD3 } from '../../hooks/useD3';
import { useTranslator } from '../../hooks/useTranslator';
import { formatCityNameFactory } from '../../utils/formatCityName';

interface KebabData {
  Stadt: string;
  Anzahl_Kebabläden: number;
}

interface BarChartProps {
  showHeader?: boolean;
  enableMotion?: boolean;
}

const CaseStudy1BarChart = ({
  showHeader = true,
  enableMotion = true,
}: BarChartProps): ReactElement => {
  const [data, setData] = useState<KebabData[] | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const { translate } = useTranslator(['charts', 'common', 'tooltips']);
  const formatCityName = useMemo(() => formatCityNameFactory(translate), [translate]);

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    try {
      setData(kebabData);
      setErrorKey(null);
    } catch {
      setErrorKey('common.errors.unknown');
    } finally {
      setLoading(false);
    }
  }, []);

  const renderChart = useCallback(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      return renderBarChart({
        container,
        data,
        translate,
        formatCityName,
      });
    },
    [data, translate, formatCityName]
  );

  const chartRef = useD3(renderChart);

  const allowMotion = enableMotion && !firstLoad;
  const initial = allowMotion ? { opacity: 0, y: 18 } : {};
  const animate = allowMotion ? { opacity: 1, y: 0 } : {};
  const exit = allowMotion ? { opacity: 0, y: -18 } : {};

  return (
    <motion.section
      id="barchart-section"
      data-layer="chart-section"
      className="mx-auto w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl border border-white/50 bg-white/70 shadow-md dark:border-white/10 dark:bg-neutral-950/60"
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {showHeader && (
        <div id="barchart-header" data-layer="chart-header" className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {translate('caseStudies.1.title')}
          </h1>
        </div>
      )}

      {errorKey ? (
        <p
          id="barchart-error"
          data-layer="chart-error"
          className="mt-4 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300"
        >
          {translate(errorKey)}
        </p>
      ) : null}

      <div
        id="barchart-container"
        data-layer="chart-container"
        ref={chartRef}
        className={`relative mt-6 w-full overflow-hidden rounded-2xl border border-white/50 bg-linear-to-b from-white/80 to-white/40 p-2 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent ${
          loading ? 'animate-pulse opacity-80' : ''
        }`}
        aria-live="polite"
      />
    </motion.section>
  );
};

export default CaseStudy1BarChart;
