// src/pages/case-studies/CaseStudy1BarChart.tsx
/**
 * CaseStudy1BarChart.tsx renders the first case study page: a static D3 bar chart
 * comparing kebab shop counts per city, plus export controls and optional header.
 * Sections below cover translations, data loading, chart rendering, and UI wrapper content.
 */
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { renderBarChart } from '../../charts/BarChartRenderer';
import kebabData from '../../data/case-study01.json';
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
  const chartRef = useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const { i18n, translate } = useTranslator(['charts', 'common', 'tooltips']);
  const formatCityName = useMemo(() => formatCityNameFactory(translate), [translate]);

  /* ----------------------------- First paint + data load ----------------------------- */
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

  /* ----------------------------- Chart rendering ----------------------------- */
  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    if (!mounted.current) {
      mounted.current = true;
    }

    const cleanup = renderBarChart({
      container: chartRef.current,
      data,
      translate,
      formatCityName,
    });

    return cleanup;
  }, [data, translate, formatCityName, i18n.language]);

  const allowMotion = enableMotion && !firstLoad;
  const initial = allowMotion ? { opacity: 0, y: 18 } : {};
  const animate = allowMotion ? { opacity: 1, y: 0 } : {};
  const exit = allowMotion ? { opacity: 0, y: -18 } : {};

  /* ----------------------------- UI wrapper + controls ----------------------------- */
  return (
    // Tweak: chart panel radius, blur, and padding via this wrapper class string.
    <motion.section
      id="barchart-section"
      data-layer="chart-section"
      className="mx-auto w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl border border-white/50 bg-white/70 shadow-md dark:border-white/10 dark:bg-neutral-950/60"
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Optional header copy */}
      {showHeader && (
        <div id="barchart-header" data-layer="chart-header" className="space-y-2">
          {/* Tweak: headline copy for Case Study 1 lives here. */}
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {translate('caseStudies.1.title')}
          </h1>
        </div>
      )}

      {/* Load errors surface inline */}
      {errorKey ? (
        <p
          id="barchart-error"
          data-layer="chart-error"
          // Tweak: error alert colors + typography for data load issues.
          className="mt-4 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300"
        >
          {translate(errorKey)}
        </p>
      ) : null}

      {/* Chart mount target */}
      <div
        id="barchart-container"
        data-layer="chart-container"
        ref={chartRef}
        // Tweak: chart canvas background gradient + loading shimmer toggled here.
        className={`relative mt-6 w-full overflow-hidden rounded-2xl border border-white/50 bg-linear-to-b from-white/80 to-white/40 p-2 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent ${
          loading ? 'animate-pulse opacity-80' : ''
        }`}
        aria-live="polite"
      />
    </motion.section>
  );
};

export default CaseStudy1BarChart;
