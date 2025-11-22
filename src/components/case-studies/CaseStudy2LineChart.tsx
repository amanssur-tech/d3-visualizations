import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import lineDataJson from '../../data/case-study02.json';
import { useD3 } from '../../hooks/useD3';
import { chartConfig } from '../../utils/config';
import { downloadPNG, downloadSVG } from '../../utils/export';
import { createTooltip } from '../../utils/tooltip';
import ExportButtons from '../ExportButtons';

import type { TOptions } from 'i18next';

interface RawLineData {
  Stadt: string;
  Jahr: number;
  'Anzahl Kebabläden': number;
}

interface LineData {
  Stadt: string;
  Jahr: number;
  Anzahl: number;
}

interface LineChartProps {
  showHeader?: boolean;
  showControls?: boolean;
  enableMotion?: boolean;
  onExportReady?: (handlers: { exportSvg: () => void; exportPng: () => void }) => void;
}

interface ExportHandlers {
  exportSvg: () => void;
  exportPng: () => void;
}

const CaseStudy2LineChart = ({
  showHeader = true,
  showControls = true,
  enableMotion = true,
  onExportReady,
}: LineChartProps) => {
  const [data, setData] = useState<RawLineData[] | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportHandlers, setExportHandlers] = useState<ExportHandlers | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);
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
    setData(lineDataJson as RawLineData[]);
    setLoading(false);
    setErrorKey(null);
  }, []);

  const chartRef = useD3(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      const tooltip = createTooltip();
      const root = d3.select(container);
      root.selectAll('*').remove();

      const normalized: LineData[] = data.map((d: RawLineData) => ({
        Stadt: d.Stadt,
        Jahr: +d.Jahr,
        Anzahl: +d['Anzahl Kebabläden'],
      }));

      const nested = normalized.reduce<Map<string, LineData[]>>((acc, entry) => {
        const bucket = acc.get(entry.Stadt);
        if (bucket) {
          bucket.push(entry);
        } else {
          acc.set(entry.Stadt, [entry]);
        }
        return acc;
      }, new Map<string, LineData[]>());
      const years: number[] = Array.from(new Set(normalized.map((d) => d.Jahr))).sort(
        (a, b) => a - b
      );

      const margin = chartConfig.margins.line;
      const { width: fullWidth, height: fullHeight } = chartConfig.dimensions.line;
      const width = fullWidth - margin.left - margin.right;
      const height = fullHeight - margin.top - margin.bottom;

      const accent = chartConfig.getVar('--color-accent') ?? '#06b6d4';
      const accentStrong = chartConfig.getVar('--color-accent-strong') ?? '#14b8a6';
      const softText = chartConfig.getVar('--color-text-soft') ?? '#94a3b8';
      const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';

      const svgRoot = root
        .append('svg')
        .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      svgRoot.append('title').text(translate('charts.line.svgTitle'));
      svgRoot.append('desc').text(translate('charts.line.svgDescription'));

      const svg = svgRoot.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scalePoint<number>().domain(years).range([0, width]).padding(0.5);
      const yMax = d3.max(normalized, (d) => d.Anzahl) ?? 0;
      const y = d3
        .scaleLinear()
        .domain([0, yMax * 1.05])
        .range([height, 0])
        .nice();

      const line = d3
        .line<LineData>()
        .x((d) => x(d.Jahr)!)
        .y((d) => y(d.Anzahl))
        .curve(d3.curveCatmullRom.alpha(chartConfig.curves.smooth));

      const yAxisTicks = Math.max(2, Math.floor(height / 40));

      const yAxisGrid = d3
        .axisLeft(y)
        .ticks(yAxisTicks)
        .tickSize(-width)
        .tickFormat(() => '');
      svg.append('g').attr('class', 'grid').call(yAxisGrid);

      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat((n) => n.toString()));
      svg.append('g').call(d3.axisLeft(y).ticks(yAxisTicks).tickSize(0));

      svg
        .selectAll('.grid line')
        .attr('stroke', gridColor)
        .attr('stroke-opacity', 0.35)
        .attr('shape-rendering', 'crispEdges');

      svg
        .selectAll('.axis text')
        .attr('fill', softText)
        .attr('font-size', 12)
        .attr('font-weight', 500);

      svg.selectAll('.axis path, .axis line').attr('stroke', softText).attr('stroke-opacity', 0.2);

      const color: Record<string, string> = Object.fromEntries(
        Object.entries(chartConfig.cityColors).map(([city, varName]) => [
          city,
          chartConfig.getVar(varName) ?? '#333',
        ])
      );

      for (const [stadt, values] of nested) {
        const sorted = values.slice().sort((a, b) => a.Jahr - b.Jahr);
        const stroke = color[stadt] ?? '#333';

        const path = svg
          .append('path')
          .datum(sorted)
          .attr('class', 'line')
          .attr('d', line)
          .attr('stroke', stroke)
          .attr('fill', 'none')
          .attr('stroke-width', 3)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .style('filter', `drop-shadow(0 8px 18px ${accent}20)`);

        const totalLength = path.node()?.getTotalLength() ?? 0;
        path
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(chartConfig.animation.lineDrawIn)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);

        svg
          .selectAll(`.point-${stadt}`)
          .data(sorted)
          .enter()
          .append('circle')
          .attr('class', 'circle-point')
          .attr('cx', (d) => x(d.Jahr) ?? 0)
          .attr('cy', (d) => y(d.Anzahl) ?? 0)
          .attr('r', chartConfig.elements.pointRadius)
          .attr('fill', stroke)
          .on('mouseenter', (event: MouseEvent, d: LineData) =>
            tooltip.show(
              translate('tooltips.line', {
                city: formatCityName(d.Stadt),
                year: d.Jahr,
                count: d.Anzahl,
              }),
              event
            )
          )
          .on('mousemove', (event: MouseEvent) => tooltip.move(event))
          .on('mouseleave', () => tooltip.hide());
      }

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', softText)
        .text(translate('charts.line.axis.year'));

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', softText)
        .text(translate('charts.line.axis.count'));

      const lineSelection = svg.selectAll<SVGPathElement, LineData[]>('.line');
      const legendElement = legendRef.current;
      if (legendElement) {
        const legendContainer = d3.select(legendElement);
        legendContainer.selectAll('*').remove();
        const cities = Array.from(nested.keys());

        const handleLegendHover = (city?: string) => {
          lineSelection.classed('dimmed', (datum) => (city ? datum[0]?.Stadt !== city : false));
        };

        cities.forEach((stadt) => {
          const item = legendContainer
            .append('div')
            .attr('class', 'legend-item')
            .on('mouseenter', () => handleLegendHover(stadt))
            .on('mouseleave', () => handleLegendHover());

          item
            .append('div')
            .attr('class', 'legend-color')
            .style('background-color', color[stadt] ?? accentStrong)
            .style('box-shadow', `0 0 10px ${accentStrong}30`);

          item.append('span').text(formatCityName(stadt));
        });
      }

      const handlers: ExportHandlers = {
        exportSvg: () => {
          const node = svgRoot.node();
          if (node instanceof SVGSVGElement) {
            downloadSVG(node, 'kebab_chart.svg');
          }
        },
        exportPng: () => {
          const node = svgRoot.node();
          if (node instanceof SVGSVGElement) {
            downloadPNG(node, fullWidth, fullHeight, 'kebab_chart.png');
          }
        },
      };

      setExportHandlers(handlers);
      onExportReady?.(handlers);

      return () => {
        root.selectAll('*').remove();
        if (legendElement) {
          d3.select(legendElement).selectAll('*').remove();
        }
      };
    },
    [data, onExportReady, translate, formatCityName, i18n.language]
  );

  const allowMotion = enableMotion && !firstLoad;
  const motionProps = allowMotion
    ? {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -18 },
      }
    : {};

  return (
    <motion.section
      className="mx-auto w-full max-w-4xl rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8"
      {...motionProps}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {showHeader && (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {translate('caseStudies.2.title')}
          </h1>
        </div>
      )}

      <div className="legend mt-4" ref={legendRef} />

      {errorKey && (
        <p className="mt-4 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {translate(errorKey)}
        </p>
      )}

      <div
        ref={chartRef}
        className={`relative mt-6 w-full overflow-hidden rounded-2xl border border-white/50 bg-linear-to-b from-white/80 to-white/40 p-2 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent ${
          loading ? 'animate-pulse opacity-80' : ''
        }`}
        aria-live="polite"
      />

      {showControls && (
        <ExportButtons
          onExportSvg={() => exportHandlers?.exportSvg()}
          onExportPng={() => exportHandlers?.exportPng()}
          disabled={!exportHandlers}
        />
      )}
    </motion.section>
  );
};

export default CaseStudy2LineChart;
