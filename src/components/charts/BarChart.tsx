import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import ExportButtons from '../ExportButtons.jsx';
import { chartConfig } from '../../utils/config.js';
import { downloadPNG, downloadSVG } from '../../utils/export.js';
import { createTooltip } from '../../utils/tooltip.js';

interface KebabData {
  Stadt: string;
  Anzahl_Kebabläden: number;
}

interface BarChartProps {
  showHeader?: boolean;
  showControls?: boolean;
  enableMotion?: boolean;
  onExportReady?: (handlers: { exportSvg: () => void; exportPng: () => void }) => void;
  framed?: boolean;
}

const DATA_URL = `${import.meta.env.BASE_URL || '/'}data/kebab_stores.json`;

const BarChart = ({
  showHeader = true,
  showControls = true,
  enableMotion = true,
  onExportReady,
  framed = true,
}: BarChartProps) => {
  const [data, setData] = useState<KebabData[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportHandlers, setExportHandlers] = useState<{ exportSvg: () => void; exportPng: () => void } | null>(null);
  const chartRef = useRef(null);
  const mounted = useRef(false);
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
        const payload: KebabData[] = await response.json();
        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
          setError(message);
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

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    if (!mounted.current) {
      mounted.current = true;
    }

    const tooltip = createTooltip(d3);
    const root = d3.select(chartRef.current);
    root.selectAll('*').remove();

    const { width, height } = chartConfig.dimensions.bar;
    const margin = chartConfig.margins.bar;

    const accent = chartConfig.getVar('--color-accent') || '#06b6d4';
    const accentStrong = chartConfig.getVar('--color-accent-strong') || '#14b8a6';
    const textColor = chartConfig.getVar('--color-text') || '#0f172a';
    const textSoft = chartConfig.getVar('--color-text-soft') || '#64748b';
    const gridColor = chartConfig.getVar('--color-grid') || '#e2e8f0';

    const gradientId = `barGradient-${Math.random().toString(16).slice(2)}`;
    const svgRoot = root
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svgRoot.append('title').text('Kebabläden nach Stadt');
    svgRoot
      .append('desc')
      .text('Balkendiagramm zum Vergleich der Anzahl von Kebabläden in verschiedenen deutschen Städten.');

    const defs = svgRoot.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', accent).attr('stop-opacity', 0.9);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', accentStrong).attr('stop-opacity', 0.95);

    const svg = svgRoot.append('g');

    const x = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.Stadt))
      .range([margin.left, width - margin.right])
      .padding(chartConfig.elements.barPadding);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Anzahl_Kebabläden) ?? 0])
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
      .call(yGrid as any)
      .selectAll('line')
      .attr('stroke', gridColor)
      .attr('stroke-opacity', 0.4);

    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((d) => (d === 'Koeln' ? 'Köln' : d === 'Muenchen' ? 'München' : d))
      );

    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format(',d')).ticks(8));

    svg.selectAll('.axis text').attr('fill', textSoft).attr('font-size', 12).attr('font-weight', 500);
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
      .on('mouseenter', (event, d) => {
        d3.select(event.target)
          .transition()
          .duration(200)
          .style('fill', accentStrong);
        tooltip.show(
          `<strong>${d.Stadt === 'Koeln' ? 'Köln' : d.Stadt === 'Muenchen' ? 'München' : d.Stadt}</strong><br/>${d.Anzahl_Kebabläden} Kebabläden`,
          event
        );
      })
      .on('mousemove', (event) => tooltip.move(event))
      .on('mouseleave', (event) => {
        d3.select(event.target)
          .transition()
          .duration(chartConfig.animation.hover)
          .style('fill', null);
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
      .text('Stadt');

    svg
      .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .text('Anzahl Kebabläden');

    const handlers = {
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
    if (onExportReady) {
      onExportReady(handlers);
    }

    return () => {
      root.selectAll('*').remove();
    };
  }, [data, onExportReady]);

  const allowMotion = enableMotion && !firstLoad;
  const initial = allowMotion ? { opacity: 0, y: 18 } : {};
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
    <motion.section
      className={containerClasses}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {showHeader && (
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Kebabläden nach Stadt</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Datenquelle: <code className="rounded-lg bg-slate-100/70 px-2 py-0.5 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-200">data/kebab_stores.json</code>
          </p>
        </div>
      )}

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
          onExportSvg={() => exportHandlers?.exportSvg?.()}
          onExportPng={() => exportHandlers?.exportPng?.()}
          disabled={!exportHandlers}
        />
      )}
    </motion.section>
  );
};

export default BarChart;
