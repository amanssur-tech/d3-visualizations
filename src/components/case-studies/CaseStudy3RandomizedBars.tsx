import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import caseStudy3Data from '../../data/case-study03.json';
import { useD3 } from '../../hooks/useD3';
import { chartConfig } from '../../utils/config';

interface CityDatum {
  city: string;
  value: number;
}

interface CaseStudy3Row {
  Stadt: string;
  Anzahl_Kebablaeden: number;
}
const UPDATE_INTERVAL = 3000;
const HIGHLIGHT_DURATION = 800;

const CaseStudy3RandomizedBars = () => {
  const { t } = useTranslation(['caseStudies', 'common', 'charts']);
  const [data, setData] = useState<CityDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magnitude, setMagnitude] = useState(5);
  const [highlightedCity, setHighlightedCity] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const magnitudeRef = useRef(magnitude);
  const gradientIdRef = useRef(`case-study-3-gradient-${Math.random().toString(16).slice(2)}`);
  const hasAnimatedRef = useRef(false);

  const formatCityName = useCallback(
    (value: string) => {
      const normalized = value === 'Köln' ? 'Koeln' : value;
      const fallback =
        normalized === 'Koeln'
          ? 'Köln'
          : normalized === 'Muenchen'
            ? 'München'
            : normalized === 'Duesseldorf'
              ? 'Düsseldorf'
              : value;
      const key = `charts:cityLabels.${normalized}`;
      return t(key, { defaultValue: fallback });
    },
    [t]
  );

  const dataReady = data.length > 0;

  useEffect(() => {
    magnitudeRef.current = magnitude;
  }, [magnitude]);

  useEffect(() => {
    try {
      const mapped = (caseStudy3Data as CaseStudy3Row[]).map((d) => ({
        city: d.Stadt,
        value: d.Anzahl_Kebablaeden,
      }));
      setData(mapped);
      setErrorMessage(null);
    } catch {
      setErrorMessage(t('common:errors.dataLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!dataReady) return undefined;
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
    }

    const id = window.setInterval(() => {
      setData((prev) => {
        if (!prev.length) return prev;
        const delta = magnitudeRef.current;
        if (delta <= 0) return prev;

        const index = Math.floor(Math.random() * prev.length);
        const direction = Math.random() < 0.5 ? -1 : 1;
        const current = prev[index];

        if (!current) {
          return prev;
        }

        const updatedValue = Math.max(0, current.value + direction * delta);

        const next = prev.map((entry, idx) =>
          idx === index
            ? {
                ...entry,
                value: updatedValue,
              }
            : entry
        );

        setHighlightedCity(current.city);
        return next;
      });
    }, UPDATE_INTERVAL);

    intervalRef.current = id;
    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dataReady]);

  useEffect(() => {
    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
      }
      if (highlightTimeoutRef.current != null) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!highlightedCity) return undefined;
    if (highlightTimeoutRef.current != null) {
      clearTimeout(highlightTimeoutRef.current);
    }
    const timeout = window.setTimeout(() => setHighlightedCity(null), HIGHLIGHT_DURATION);
    highlightTimeoutRef.current = timeout;
    return () => clearTimeout(timeout);
  }, [highlightedCity]);

  const chartRef = useD3(
    (container) => {
      if (!dataReady) return;
      const host = d3.select(container);
      const width = chartConfig.dimensions.bar.width;
      const height = 420;
      const margin = { top: 40, right: 24, bottom: 70, left: 64 };
      const textColor = chartConfig.getVar('--color-text') ?? '#0f172a';
      const textSoft = chartConfig.getVar('--color-text-soft') ?? '#64748b';
      const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';
      const gradientId = gradientIdRef.current;
      const isInitialPass = !hasAnimatedRef.current;
      const gradientIdForCity = (city: string) => {
        const safeCity = city
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        return `${gradientId}-${safeCity}`;
      };

      let svg = host.select<SVGSVGElement>('svg');
      if (svg.empty()) {
        svg = host
          .append('svg')
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('class', 'w-full h-auto');
        svg.append('title');
        svg.append('desc');
        svg.append('defs');
      }

      svg.select('title').text(t('caseStudies:3.chart.title'));
      svg.select('desc').text(t('caseStudies:3.chart.description'));

      const defs = svg.select('defs');
      const colorDomainMax = Math.max(data.length - 1, 1);
      const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, colorDomainMax]);
      const gradients = defs
        .selectAll<SVGLinearGradientElement, CityDatum>('linearGradient.bar-gradient')
        .data(data, (d) => d.city)
        .join(
          (enter) =>
            enter
              .append('linearGradient')
              .attr('class', 'bar-gradient')
              .attr('x1', '0%')
              .attr('x2', '0%')
              .attr('y1', '0%')
              .attr('y2', '100%'),
          (update) => update,
          (exit) => exit.remove()
        )
        .attr('id', (d) => gradientIdForCity(d.city));
      gradients.each(function (_, index) {
        const gradientSelection = d3.select(this);
        const baseColor = colorScale(index);
        const parsed = d3.color(baseColor);
        const topColor = parsed ? parsed.brighter(0.8).formatHex() : baseColor;
        const bottomColor = parsed ? parsed.darker(0.8).formatHex() : baseColor;
        gradientSelection
          .selectAll<SVGStopElement, { offset: string; color: string; opacity: number }>('stop')
          .data([
            { offset: '0%', color: topColor, opacity: 0.95 },
            { offset: '100%', color: bottomColor, opacity: 0.95 },
          ])
          .join('stop')
          .attr('offset', (d) => d.offset)
          .attr('stop-color', (d) => d.color)
          .attr('stop-opacity', (d) => d.opacity);
      });

      const maxValue = d3.max(data, (d) => d.value) ?? 1;
      const x = d3
        .scaleBand<string>()
        .domain(data.map((d) => d.city))
        .range([margin.left, width - margin.right])
        .padding(0.25);
      const y = d3
        .scaleLinear()
        .domain([0, Number.isFinite(maxValue * 1.15) ? maxValue * 1.15 : 1])
        .nice()
        .range([height - margin.bottom, margin.top]);
      const baseTransition = d3.transition().duration(650).ease(d3.easeCubicOut);

      const gridAxis = d3
        .axisLeft(y)
        .ticks(6)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat(() => '');
      svg
        .selectAll<SVGGElement, null>('g.grid')
        .data([null])
        .join('g')
        .attr('class', 'grid')
        .attr('transform', `translate(${margin.left},0)`)
        .call(gridAxis)
        .selectAll('line')
        .attr('stroke', gridColor)
        .attr('stroke-opacity', 0.3)
        .attr('shape-rendering', 'crispEdges');

      const axisLeft = d3.axisLeft(y).ticks(6).tickFormat(d3.format('.0f'));
      const yAxisGroup = svg
        .selectAll<SVGGElement, null>('g.y-axis')
        .data([null])
        .join('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(axisLeft);
      yAxisGroup
        .selectAll('text')
        .attr('fill', textSoft)
        .attr('font-size', 12)
        .attr('font-weight', 500);
      yAxisGroup.selectAll('path, line').attr('stroke', textSoft).attr('stroke-opacity', 0.2);

      const axisBottom = d3.axisBottom<string>(x).tickFormat((d) => formatCityName(d));
      const xAxisGroup = svg
        .selectAll<SVGGElement, null>('g.x-axis')
        .data([null])
        .join('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(axisBottom);
      xAxisGroup
        .selectAll('text')
        .attr('fill', textSoft)
        .attr('font-size', 12)
        .attr('font-weight', 500)
        .attr('transform', 'rotate(-20)')
        .style('text-anchor', 'end');

      const barsGroup = svg
        .selectAll<SVGGElement, null>('g.bars')
        .data([null])
        .join('g')
        .attr('class', 'bars');
      const bars = barsGroup
        .selectAll<SVGRectElement, CityDatum>('rect')
        .data(data, (d) => d.city)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('class', 'bar')
              .attr('x', (d) => x(d.city) ?? margin.left)
              .attr('width', x.bandwidth())
              .attr('y', () => y(0))
              .attr('height', 0)
              .attr('rx', 12)
              .attr('fill', (d) => `url(#${gradientIdForCity(d.city)})`),
          (update) => update,
          (exit) => exit.transition(baseTransition).attr('y', y(0)).attr('height', 0).remove()
        );
      bars.attr('fill', (d) => `url(#${gradientIdForCity(d.city)})`);

      let barsTransition = bars.transition(baseTransition);
      if (isInitialPass) {
        barsTransition = barsTransition.delay((_, index) => index * 70);
      }
      barsTransition
        .attr('x', (d) => x(d.city) ?? margin.left)
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => Math.max(0, y(0) - y(d.value)));

      bars.style('filter', 'none');
      if (highlightedCity) {
        bars
          .filter((d) => d.city === highlightedCity)
          .transition()
          .duration(300)
          .style('filter', 'drop-shadow(0 0 4px #38bdf8)');
      }

      const valueFormat = d3.format('.1f');
      const labelsGroup = svg
        .selectAll<SVGGElement, null>('g.labels')
        .data([null])
        .join('g')
        .attr('class', 'labels');
      const labels = labelsGroup
        .selectAll<SVGTextElement, CityDatum>('text.bar-value')
        .data(data, (d) => d.city)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('class', 'bar-value')
              .attr('text-anchor', 'middle')
              .attr('fill', textColor)
              .attr('font-size', 12)
              .attr('font-weight', 600)
              .attr('x', (d) => (x(d.city) ?? margin.left) + x.bandwidth() / 2)
              .attr('y', () => y(0) - 8)
              .style('opacity', 0),
          (update) => update,
          (exit) => exit.transition(baseTransition).style('opacity', 0).remove()
        );

      let labelsTransition = labels.transition(baseTransition);
      if (isInitialPass) {
        labelsTransition = labelsTransition.delay((_, index) => 120 + index * 60);
      }
      labelsTransition
        .attr('x', (d) => (x(d.city) ?? margin.left) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.value) - 10)
        .text((d) => valueFormat(d.value))
        .style('opacity', 1);

      if (isInitialPass) {
        hasAnimatedRef.current = true;
      }
    },
    [data, dataReady, formatCityName, highlightedCity, t]
  );

  const explanation = useMemo(() => t('caseStudies:3.description'), [t]);

  return (
    <motion.section
      className="mx-auto w-full max-w-4xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {t('caseStudies:3.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {t('caseStudies:3.title')}
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{explanation}</p>
      </div>

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
          {!loading && !errorMessage && !dataReady && (
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
