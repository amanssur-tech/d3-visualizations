import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import kebabData from '../../data/case-study01.json';
import { chartConfig } from '../../utils/config';
import { downloadPNG, downloadSVG } from '../../utils/export';
import { createTooltip } from '../../utils/tooltip';
import ExportButtons from '../ExportButtons';

import type { TOptions } from 'i18next';

interface KebabData {
  Stadt: string;
  Anzahl_Kebabläden: number;
}

interface BarChartProps {
  showHeader?: boolean;
  showControls?: boolean;
  enableMotion?: boolean;
  onExportReady?: (handlers: { exportSvg: () => void; exportPng: () => void }) => void;
}

interface ExportHandlers {
  exportSvg: () => void;
  exportPng: () => void;
}

const CaseStudy1BarChart = ({
  showHeader = true,
  showControls = true,
  enableMotion = true,
  onExportReady,
}: BarChartProps) => {
  const [data, setData] = useState<KebabData[] | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportHandlers, setExportHandlers] = useState<ExportHandlers | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const { t, i18n } = useTranslation(['charts', 'common', 'tooltips']);
  const translate = useCallback(
    (fullKey: string, options?: TOptions): string => {
      const knownNamespaces = [
        'common',
        'navbar',
        'footer',
        'dashboard',
        'charts',
        'export',
        'tooltips',
        'caseStudies',
      ] as const;

      type TranslateFn = (key: string, options?: TOptions) => string;
      const tSafe = t as unknown as TranslateFn;
      type NamespaceKey = (typeof knownNamespaces)[number];
      const [maybeNs, ...rest] = fullKey.split('.');
      if (maybeNs && rest.length > 0 && (knownNamespaces as readonly string[]).includes(maybeNs)) {
        const key = rest.join('.');
        const ns = maybeNs as NamespaceKey;
        return tSafe(key, { ns, ...(options ?? {}) });
      }

      return tSafe(fullKey, options);
    },
    [t]
  );
  const formatCityName = useCallback(
    (value: string) => {
      const normalized = value === 'Köln' ? 'Koeln' : value;
      const fallback =
        normalized === 'Koeln' ? 'Köln' : normalized === 'Muenchen' ? 'München' : value;
      const key = `charts.cityLabels.${normalized}`;
      return translate(key, { defaultValue: fallback });
    },
    [translate]
  );

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

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    if (!mounted.current) {
      mounted.current = true;
    }

    const tooltip = createTooltip();
    const root = d3.select(chartRef.current);
    root.selectAll('*').remove();

    const { width, height } = chartConfig.dimensions.bar;
    const margin = chartConfig.margins.bar;

    const accent = chartConfig.getVar('--color-accent') ?? '#06b6d4';
    const accentStrong = chartConfig.getVar('--color-accent-strong') ?? '#14b8a6';
    const textColor = chartConfig.getVar('--color-text') ?? '#0f172a';
    const textSoft = chartConfig.getVar('--color-text-soft') ?? '#64748b';
    const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';

    const gradientId = `barGradient-${Math.random().toString(16).slice(2)}`;
    const svgRoot = root
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('id', 'barchart-svg')
      .attr('data-layer', 'chart-svg');

    svgRoot.append('title').text(translate('charts.bar.svgTitle'));
    svgRoot.append('desc').text(translate('charts.bar.svgDescription'));

    const defs = svgRoot.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', accent)
      .attr('stop-opacity', 0.9);
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', accentStrong)
      .attr('stop-opacity', 0.95);

    const svg = svgRoot
      .append('g')
      .attr('id', 'barchart-svg-group')
      .attr('data-layer', 'chart-svg-group');

    const x = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.Stadt))
      .range([margin.left, width - margin.right])
      .padding(chartConfig.elements.barPadding);

    const y = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.Anzahl_Kebabläden) ?? 0) * 1.05])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yGrid = d3
      .axisLeft(y)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => '')
      .ticks(8);

    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', gridColor)
      .attr('stroke-opacity', 0.4);

    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d) => formatCityName(d)));

    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format(',d')).ticks(8));

    svg
      .selectAll('.axis text')
      .attr('fill', textSoft)
      .attr('font-size', 12)
      .attr('font-weight', 500);
    svg
      .selectAll('.axis path, .axis line')
      .attr('stroke', textSoft)
      .attr('stroke-opacity', 0.2)
      .attr('shape-rendering', 'crispEdges');

    svg
      .append('g')
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('fill', `url(#${gradientId})`)
      .attr('x', (d) => x(d.Stadt) ?? 0)
      .attr('width', x.bandwidth())
      .attr('y', y(0))
      .attr('height', 0)
      .attr('rx', 14)
      .attr('ry', 14)
      .on('mouseenter', (event: MouseEvent, d: KebabData) => {
        const target = event.currentTarget as SVGRectElement;
        d3.select(target).transition().duration(200).style('fill', accentStrong);
        tooltip.show(
          translate('tooltips.bar', {
            city: formatCityName(d.Stadt),
            count: d.Anzahl_Kebabläden,
          }),
          event
        );
      })
      .on('mousemove', (event: MouseEvent) => tooltip.move(event))
      .on('mouseleave', (event: MouseEvent) => {
        const target = event.currentTarget as SVGRectElement;
        d3.select(target).transition().duration(chartConfig.animation.hover).style('fill', null);
        tooltip.hide();
      })
      .transition()
      .duration(chartConfig.animation.barGrow)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(d.Anzahl_Kebabläden))
      .attr('height', (d) => y(0) - y(d.Anzahl_Kebabläden));

    svg
      .append('g')
      .selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', (d) => x(d.Stadt)! + x.bandwidth() / 2)
      .attr('y', height - margin.bottom)
      .attr('text-anchor', 'middle')
      .attr('fill', accentStrong)
      .text((d) => d.Anzahl_Kebabläden ?? '')
      .transition()
      .duration(chartConfig.animation.barGrow)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(d.Anzahl_Kebabläden) - 8);

    svg
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .text(translate('charts.bar.axis.city'));

    svg
      .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .text(translate('charts.bar.axis.count'));

    const handlers: ExportHandlers = {
      exportSvg: () => {
        const node = svgRoot.node();
        if (node instanceof SVGSVGElement) {
          downloadSVG(node, 'kebablaeden_chart.svg');
        }
      },
      exportPng: () => {
        const node = svgRoot.node();
        if (node instanceof SVGSVGElement) {
          downloadPNG(node, width, height, 'kebablaeden_chart.png');
        }
      },
    };

    setExportHandlers(handlers);
    onExportReady?.(handlers);

    return () => {
      root.selectAll('*').remove();
    };
  }, [data, onExportReady, translate, formatCityName, i18n.language]);

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

      {errorKey && (
        <p
          id="barchart-error"
          data-layer="chart-error"
          className="mt-4 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300"
        >
          {translate(errorKey)}
        </p>
      )}

      <div
        id="barchart-container"
        data-layer="chart-container"
        ref={chartRef}
        className={`relative mt-6 w-full overflow-hidden rounded-2xl border border-white/50 bg-linear-to-b from-white/80 to-white/40 p-2 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent ${
          loading ? 'animate-pulse opacity-80' : ''
        }`}
        aria-live="polite"
      />

      {showControls && (
        <ExportButtons
          data-layer="chart-controls"
          onExportSvg={() => exportHandlers?.exportSvg()}
          onExportPng={() => exportHandlers?.exportPng()}
          disabled={!exportHandlers}
        />
      )}
    </motion.section>
  );
};

export default CaseStudy1BarChart;
