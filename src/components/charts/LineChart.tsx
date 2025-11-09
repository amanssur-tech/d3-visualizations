import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import ExportButtons from '../ExportButtons.jsx';
import { useD3 } from '../../hooks/useD3.js';
import { chartConfig } from '../../utils/config.js';
import { downloadPNG, downloadSVG } from '../../utils/export.js';
import { createTooltip } from '../../utils/tooltip.js';

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
  framed?: boolean;
}

const DATA_URL = `${import.meta.env.BASE_URL || '/'}data/Uebung02_Daten.json`;

const LineChart: React.FC<LineChartProps> = (props): React.ReactElement => {
  const { showHeader = true, showControls = true, enableMotion = true, onExportReady, framed = true } = props;
  const [data, setData] = useState<LineData[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportHandlers, setExportHandlers] = useState<{ exportSvg: () => void; exportPng: () => void } | null>(null);
  const legendRef = useRef(null);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error('Fehler beim Laden der Daten');
        const payload: LineData[] = await response.json();
        if (!cancelled) {
          setData(payload);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const chartRef = useD3(
    (container: HTMLElement) => {
      if (!data || data.length === 0) return undefined;

      const tooltip = createTooltip(d3);
      const root = d3.select(container);
      root.selectAll('*').remove();

      const normalized: LineData[] = data.map((d: any) => ({
        Stadt: d.Stadt,
        Jahr: +d.Jahr,
        Anzahl: +d['Anzahl Kebabläden'],
      }));

      const nested = d3.group(normalized, (d) => d.Stadt);
      const years: number[] = Array.from(new Set(normalized.map((d) => d.Jahr))).sort((a, b) => a - b);

      const margin = chartConfig.margins.line;
      const { width: fullWidth, height: fullHeight } = chartConfig.dimensions.line;
      const width = fullWidth - margin.left - margin.right;
      const height = fullHeight - margin.top - margin.bottom;

      const accent = chartConfig.getVar('--color-accent') || '#06b6d4';
      const accentStrong = chartConfig.getVar('--color-accent-strong') || '#14b8a6';
      const textColor = chartConfig.getVar('--color-text') || '#0f172a';
      const softText = chartConfig.getVar('--color-text-soft') || '#94a3b8';
      const gridColor = chartConfig.getVar('--color-grid') || '#e2e8f0';

      const svgRoot = root
        .append('svg')
        .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      svgRoot.append('title').text('Kebabläden — Köln vs Berlin (2020–2025)');
      svgRoot
        .append('desc')
        .text('Liniendiagramm zur Entwicklung der Kebabläden in Köln und Berlin von 2020 bis 2025.');

      const svg = svgRoot.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scalePoint<number>().domain(years).range([0, width]).padding(0.5);
      const yMax = d3.max(normalized, (d) => d.Anzahl) ?? 0;
      const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]).nice();

      const line = d3
        .line<LineData>()
        .x((d) => x(d.Jahr)!)
        .y((d) => y(d.Anzahl))
        .curve(d3.curveCatmullRom.alpha(chartConfig.curves.smooth));

      const yAxisTicks = Math.max(2, Math.floor(height / 40));

      const yAxisGrid = d3.axisLeft(y).ticks(yAxisTicks).tickSize(-width).tickFormat(() => '');
      svg.append('g').attr('class', 'grid').call(yAxisGrid as any);

      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickFormat((n) => n.toString()));
      svg.append('g').call(d3.axisLeft(y).ticks(yAxisTicks).tickSize(0) as any);

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
          chartConfig.getVar(varName) || '#333',
        ])
      );

      for (const [stadt, values] of nested as Map<string, LineData[]>) {
        const sorted = values.slice().sort((a, b) => a.Jahr - b.Jahr);
        const stroke = color[stadt] || '#333';

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
          .on('mouseenter', (event, d) =>
            tooltip.show(`<strong>${d.Stadt}</strong><br/>${d.Jahr}: ${d.Anzahl}`, event)
          )
          .on('mousemove', (event) => tooltip.move(event))
          .on('mouseleave', () => tooltip.hide());
      }

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', softText)
        .text('Jahr');

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', softText)
        .text('Anzahl Kebabläden');

      const legendContainer = d3.select(legendRef.current);
      legendContainer.selectAll('*').remove();
      const cities = Array.from(nested.keys());

      cities.forEach((stadt) => {
        const item = legendContainer
          .append('div')
          .attr('class', 'legend-item')
          .on('mouseenter', () => {
            svg.selectAll('.line').classed('dimmed', (d: any) => d[0].Stadt !== stadt);
          })
          .on('mouseleave', () => {
            svg.selectAll('.line').classed('dimmed', false);
          });

        item
          .append('div')
          .attr('class', 'legend-color')
          .style('background-color', color[stadt] || accentStrong)
          .style('box-shadow', `0 0 10px ${accentStrong}30`);

        item.append('span').text(stadt);
      });

      const handlers = {
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

      setExportHandlers(handlers as { exportSvg: () => void; exportPng: () => void });
      if (typeof onExportReady === 'function') {
        onExportReady(handlers);
      }

      return () => {
        root.selectAll('*').remove();
        legendContainer.selectAll('*').remove();
      };
    },
    [data, onExportReady]
  );

  const MotionSection = motion.section;
  const allowMotion = enableMotion && !firstLoad;
  const initial = allowMotion ? { opacity: 0, y: 18 } : false;
  const animate = allowMotion ? { opacity: 1, y: 0 } : {};
  const exit = allowMotion ? { opacity: 0, y: -18 } : {};
  const containerClasses = [
    'w-full',
    framed
      ? 'rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-neutral-950/60'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MotionSection
      className={containerClasses}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {showHeader && (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Kebabläden — Köln vs Berlin (2020–2025)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Datenquelle: <code className="rounded-lg bg-slate-100/70 px-2 py-0.5 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-200">data/Uebung02_Daten.json</code>
          </p>
        </div>
      )}

      <div className="legend mt-4" ref={legendRef} />

      {error && (
        <p className="mt-4 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {error}
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
    </MotionSection>
  );
};

export default LineChart;
