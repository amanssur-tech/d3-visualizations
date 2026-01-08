// src/pages/case-studies/CaseStudy2LineChart.tsx
/**
 * CaseStudy2LineChart.tsx renders the multi-city time-series case study with hover tooltips,
 * a persistent legend, and export controls so developers can tweak visuals inline.
 */
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { renderLineChart } from '../../charts/LineChartRenderer';
import lineDataJson from '../../data/case-study02.json';
import { useD3 } from '../../hooks/useD3';
import { useTranslator } from '../../hooks/useTranslator';
import { formatCityNameFactory } from '../../utils/formatCityName';

interface RawLineData {
  Stadt: string;
  Jahr: number;
  'Anzahl Kebabläden': number;
}

interface LineChartProps {
  showHeader?: boolean;
  enableMotion?: boolean;
}

const CaseStudy2LineChart = ({
  showHeader = true,
  enableMotion = true,
}: LineChartProps): ReactElement => {
  const [data, setData] = useState<RawLineData[] | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const legendRef = useRef<HTMLDivElement | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const { translate } = useTranslator(['charts', 'common', 'tooltips']);
  const formatCityName = useMemo(() => formatCityNameFactory(translate), [translate]);

  /* ----------------------------- First paint + data load ----------------------------- */
  useEffect(() => {
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    setData(lineDataJson as RawLineData[]);
    setLoading(false);
    setErrorKey(null);
  }, []);

  /* ----------------------------- Chart rendering ----------------------------- */
  const renderChart = useCallback(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      return renderLineChart({
        container,
        legendContainer: legendRef.current,
        data,
        translate,
        formatCityName,
      });
    },
    [data, formatCityName, translate]
  );

  const chartRef = useD3(renderChart);

  const allowMotion = enableMotion && !firstLoad;
  const motionProps = allowMotion
    ? {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -18 },
      }
    : {};

  /* ----------------------------- UI wrapper + controls ----------------------------- */
  return (
    // Tweak: panel styling + padding for Case Study 2 wrapper.
    <motion.section
      className="mx-auto w-full max-w-4xl rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8"
      {...motionProps}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Optional header copy */}
      {showHeader && (
        <div className="space-y-2">
          {/* Tweak: header copy for the line chart page. */}
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {translate('caseStudies.2.title')}
          </h1>
        </div>
      )}

      {/* Legend container sits outside SVG for easy styling */}
      <div className="legend mt-4" ref={legendRef} />

      {/* Load errors */}
      {errorKey ? (
        <p className="mt-4 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {translate(errorKey)}
        </p>
      ) : null}

      {/* Chart mount target */}
      <div
        ref={chartRef}
        // Tweak: adjust gradient + shimmer effect for the SVG host container.
        className={`relative mt-6 w-full overflow-hidden rounded-2xl border border-white/50 bg-linear-to-b from-white/80 to-white/40 p-2 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent ${
          loading ? 'animate-pulse opacity-80' : ''
        }`}
        aria-live="polite"
      />
    </motion.section>
  );
};

export default CaseStudy2LineChart;
