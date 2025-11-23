//  src/components/charts/BarChartRenderer.ts
/**
 * BarChartRenderer
 * A pure rendering module that draws the D3 bar chart for Case Study 1.
 * Handles:
 * - SVG creation
 * - gradients
 * - scales
 * - axes
 * - bars + labels
 * - tooltips
 * - export handlers
 */

import * as d3 from 'd3';

import { createChartExportHandlers } from '../utils/chartExport';
import { chartConfig } from '../utils/config';
import { createTooltip } from '../utils/tooltip';

import type { TranslateFn } from '../i18n/translate';

interface KebabData {
  Stadt: string;
  Anzahl_Kebabläden: number;
}

interface RenderOptions {
  container: HTMLDivElement;
  data: KebabData[];
  translate: TranslateFn;
  formatCityName: (name: string) => string;
  onExportReady?: (handlers: { exportSvg: () => void; exportPng: () => void }) => void;
}

export function renderBarChart({
  container,
  data,
  translate,
  formatCityName,
  onExportReady,
}: RenderOptions) {
  // Clear old chart
  const root = d3.select(container);
  root.selectAll('*').remove();

  const tooltip = createTooltip();

  const chartWidth = chartConfig.dimensions.bar.width;
  const chartHeight = chartConfig.dimensions.bar.height;
  const margin = chartConfig.margins.bar;
  const barRadius = 14;

  const accent = chartConfig.getVar('--color-accent') ?? '#06b6d4';
  const accentStrong = chartConfig.getVar('--color-accent-strong') ?? '#14b8a6';
  const textColor = chartConfig.getVar('--color-text') ?? '#0f172a';
  const textSoft = chartConfig.getVar('--color-text-soft') ?? '#64748b';
  const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';

  const gradientId = `barGradient-${Math.random().toString(16).slice(2)}`;

  /* Root SVG */
  const svgRoot = root
    .append('svg')
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('id', 'barchart-svg');

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

  gradient.append('stop').attr('offset', '0%').attr('stop-color', accent).attr('stop-opacity', 0.9);
  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', accentStrong)
    .attr('stop-opacity', 0.95);

  const svg = svgRoot.append('g');

  /* Scales */
  const x = d3
    .scaleBand<string>()
    .domain(data.map((d) => d.Stadt))
    .range([margin.left, chartWidth - margin.right])
    .padding(chartConfig.elements.barPadding);

  const maxCount = d3.max(data, (d) => d.Anzahl_Kebabläden) ?? 0;
  const y = d3
    .scaleLinear()
    .domain([0, maxCount * 1.05])
    .nice()
    .range([chartHeight - margin.bottom, margin.top]);

  /* Grid */
  const yGrid = d3
    .axisLeft(y)
    .tickSize(-chartWidth + margin.left + margin.right)
    .ticks(8)
    .tickFormat(() => '');

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yGrid)
    .selectAll('line')
    .attr('stroke', gridColor)
    .attr('stroke-opacity', 0.4);

  /* Axes */
  svg
    .append('g')
    .attr('transform', `translate(0,${chartHeight - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat((d) => formatCityName(d)));

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(8).tickFormat(d3.format(',d')));

  svg.selectAll('.axis text').attr('fill', textSoft).attr('font-size', 12).attr('font-weight', 500);
  svg
    .selectAll('.axis path, .axis line')
    .attr('stroke', textSoft)
    .attr('stroke-opacity', 0.2)
    .attr('shape-rendering', 'crispEdges');

  /* Bars */
  svg
    .append('g')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('fill', `url(#${gradientId})`)
    .attr('x', (d) => x(d.Stadt) ?? margin.left)
    .attr('width', x.bandwidth())
    .attr('y', y(0))
    .attr('height', 0)
    .attr('rx', barRadius)
    .attr('ry', barRadius)
    .on('mouseenter', function (event: MouseEvent, d: KebabData) {
      d3.select(this).transition().duration(200).style('fill', accentStrong);
      tooltip.show(
        translate('tooltips.bar', {
          city: formatCityName(d.Stadt),
          count: d.Anzahl_Kebabläden,
        }),
        event
      );
    })
    .on('mousemove', (event: MouseEvent) => tooltip.move(event))
    .on('mouseleave', function () {
      d3.select(this).transition().duration(chartConfig.animation.hover).style('fill', null);
      tooltip.hide();
    })
    .transition()
    .duration(chartConfig.animation.barGrow)
    .attr('y', (d) => y(d.Anzahl_Kebabläden))
    .attr('height', (d) => y(0) - y(d.Anzahl_Kebabläden));

  /* Value labels */
  svg
    .append('g')
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('fill', accentStrong)
    .attr('x', (d) => (x(d.Stadt) ?? margin.left) + x.bandwidth() / 2)
    .attr('y', chartHeight - margin.bottom)
    .text((d) => d.Anzahl_Kebabläden ?? '')
    .transition()
    .duration(chartConfig.animation.barGrow)
    .attr('y', (d) => y(d.Anzahl_Kebabläden) - 8);

  /* Axis labels */
  svg
    .append('text')
    .attr('x', chartWidth / 2)
    .attr('y', chartHeight - 10)
    .attr('text-anchor', 'middle')
    .attr('fill', textColor)
    .text(translate('charts.bar.axis.city'));

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -chartHeight / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', textColor)
    .text(translate('charts.bar.axis.count'));

  /* Export handlers */
  const node = svgRoot.node();
  if (node instanceof SVGSVGElement) {
    const handlers = createChartExportHandlers(node, chartWidth, chartHeight, 'kebablaeden_chart');
    onExportReady?.(handlers);
  }

  return () => {
    root.selectAll('*').remove();
  };
}
