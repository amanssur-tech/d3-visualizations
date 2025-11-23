// src/components/charts/LineChartRenderer.ts
// src/components/charts/LineChartRenderer.ts
/**
 * LineChartRenderer
 * Pure D3 renderer for Case Study 2 line chart.
 * Handles:
 *  - data normalization
 *  - scales
 *  - axes
 *  - lines + points
 *  - external legend population
 *  - export handler creation (returned to caller)
 */

import * as d3 from 'd3';

import { createChartExportHandlers, type ChartExportHandlers } from '../utils/chartExport';
import { chartConfig } from '../utils/config';
import { createTooltip } from '../utils/tooltip';

import type { TranslateFn } from '../i18n/translate';

export interface RawLineData {
  Stadt: string;
  Jahr: number;
  'Anzahl Kebabläden': number;
}

export interface LineData {
  Stadt: string;
  Jahr: number;
  Anzahl: number;
}

export interface LineChartRenderOptions {
  container: HTMLElement;
  legendContainer?: HTMLElement | null;
  data: RawLineData[];
  translate: TranslateFn;
  formatCityName: (name: string) => string;
  onExportReady?: (handlers: ChartExportHandlers) => void;
}

/**
 * renderLineChart
 * Executes the full D3 rendering pipeline for the multi‑city time‑series chart.
 */
export function renderLineChart({
  container,
  legendContainer,
  data,
  translate,
  formatCityName,
  onExportReady,
}: LineChartRenderOptions) {
  const root = d3.select(container);
  root.selectAll('*').remove();

  if (!data || data.length === 0) return;

  const tooltip = createTooltip();

  /* ----------------------------------- Normalize data ----------------------------------- */
  const normalized: LineData[] = data.map((row) => ({
    Stadt: row.Stadt,
    Jahr: Number(row.Jahr),
    Anzahl: Number(row['Anzahl Kebabläden']),
  }));

  const years = Array.from(new Set(normalized.map((d) => d.Jahr))).sort((a, b) => a - b);

  const grouped = normalized.reduce<Map<string, LineData[]>>((map, entry) => {
    const bucket = map.get(entry.Stadt) ?? [];
    bucket.push(entry);
    map.set(entry.Stadt, bucket);
    return map;
  }, new Map());

  /* ----------------------------------- Layout config ----------------------------------- */
  const margin = chartConfig.margins.line;
  const { width: svgWidth, height: svgHeight } = chartConfig.dimensions.line;
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  const accent = chartConfig.getVar('--color-accent') ?? '#06b6d4';
  const accentStrong = chartConfig.getVar('--color-accent-strong') ?? '#14b8a6';
  const textSoft = chartConfig.getVar('--color-text-soft') ?? '#94a3b8';
  const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';
  const pointRadius = chartConfig.elements.pointRadius;

  /* ------------------------------------- SVG root -------------------------------------- */
  const svgRoot = root
    .append('svg')
    .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svgRoot.append('title').text(translate('charts.line.svgTitle'));
  svgRoot.append('desc').text(translate('charts.line.svgDescription'));

  const svg = svgRoot.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  /* ------------------------------------- Scales ---------------------------------------- */
  const x = d3.scalePoint<number>().domain(years).range([0, innerWidth]).padding(0.5);

  const maxValue = d3.max(normalized, (d) => d.Anzahl) ?? 0;
  const y = d3
    .scaleLinear()
    .domain([0, maxValue * 1.05])
    .range([innerHeight, 0])
    .nice();

  const lineGenerator = d3
    .line<LineData>()
    .x((d) => x(d.Jahr) ?? 0)
    .y((d) => y(d.Anzahl))
    .curve(d3.curveCatmullRom.alpha(chartConfig.curves.smooth));

  /* -------------------------------- Grid + axes ---------------------------------------- */
  const yTicks = Math.max(2, Math.floor(innerHeight / 40));

  svg
    .append('g')
    .attr('class', 'grid')
    .call(
      d3
        .axisLeft(y)
        .ticks(yTicks)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
    )
    .selectAll('line')
    .attr('stroke', gridColor)
    .attr('stroke-opacity', 0.35)
    .attr('shape-rendering', 'crispEdges');

  svg
    .append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickFormat((year) => year.toString()));

  svg.append('g').attr('class', 'axis axis-y').call(d3.axisLeft(y).ticks(yTicks).tickSize(0));

  svg.selectAll('.axis text').attr('fill', textSoft).attr('font-size', 12).attr('font-weight', 500);
  svg.selectAll('.axis path, .axis line').attr('stroke', textSoft).attr('stroke-opacity', 0.2);

  /* ----------------------------- City palette lookups ----------------------------- */
  const cityColors: Record<string, string> = Object.fromEntries(
    Object.entries(chartConfig.cityColors).map(([city, varName]) => [
      city,
      chartConfig.getVar(varName) ?? '#333',
    ])
  );

  /* ----------------------------- Draw each line + points ----------------------------- */
  for (const [city, rows] of grouped) {
    const sortedRows = rows.slice().sort((a, b) => a.Jahr - b.Jahr);
    const stroke = cityColors[city] ?? '#333';

    const path = svg
      .append('path')
      .datum(sortedRows)
      .attr('class', 'line')
      .attr('d', lineGenerator)
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
      .append('g')
      .attr('class', `points-${city}`)
      .selectAll('circle')
      .data(sortedRows)
      .enter()
      .append('circle')
      .attr('class', 'circle-point')
      .attr('cx', (d) => x(d.Jahr) ?? 0)
      .attr('cy', (d) => y(d.Anzahl))
      .attr('r', pointRadius)
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

  /* -------------------------------- Axis labels --------------------------------------- */
  svg
    .append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + margin.bottom - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', textSoft)
    .text(translate('charts.line.axis.year'));

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -margin.left + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', textSoft)
    .text(translate('charts.line.axis.count'));

  /* -------------------------------- Legend building ----------------------------------- */
  const lineSelection = svg.selectAll<SVGPathElement, LineData[]>('.line');

  if (legendContainer) {
    const legend = d3.select(legendContainer);
    legend.selectAll('*').remove();

    const cities = Array.from(grouped.keys());

    const handleHover = (city?: string) => {
      lineSelection.classed('dimmed', (datum) => (city ? datum[0]?.Stadt !== city : false));
    };

    cities.forEach((city) => {
      const item = legend
        .append('div')
        .attr('class', 'legend-item')
        .on('mouseenter', () => handleHover(city))
        .on('mouseleave', () => handleHover());

      item
        .append('div')
        .attr('class', 'legend-color')
        .style('background-color', cityColors[city] ?? accentStrong)
        .style('box-shadow', `0 0 10px ${accentStrong}30`);

      item.append('span').text(formatCityName(city));
    });
  }

  /* -------------------------------- Export handlers ----------------------------------- */
  const node = svgRoot.node();
  if (node instanceof SVGSVGElement) {
    const handlers = createChartExportHandlers(node, svgWidth, svgHeight, 'kebab_chart');
    onExportReady?.(handlers);
  }

  /* -------------------------------- Cleanup ------------------------------------------- */
  return () => {
    root.selectAll('*').remove();
    if (legendContainer) {
      d3.select(legendContainer).selectAll('*').remove();
    }
  };
}
