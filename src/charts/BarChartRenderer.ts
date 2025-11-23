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
 */

import * as d3 from 'd3';

import { chartTheme } from '../theme/chartTheme';
import { chartConfig } from '../utils/config';
import { createTooltip } from '../utils/tooltip';

import {
  generateCaseStudy3GradientFromIndex,
  getCaseStudy3CityGradient,
} from './caseStudy3Palette';

import type { TranslateFn } from '../i18n/translate';

interface KebabData {
  Stadt: string;
  Anzahl_Kebabläden: number;
}

interface CityColorEntry {
  city: string;
  gradientTop: string;
  gradientBottom: string;
}

interface RenderOptions {
  container: HTMLDivElement;
  data: KebabData[];
  translate: TranslateFn;
  formatCityName: (name: string) => string;
}

export function renderBarChart({ container, data, translate, formatCityName }: RenderOptions) {
  // Clear old chart
  const root = d3.select(container);
  root.selectAll('*').remove();

  const tooltip = createTooltip();

  // Tweak: base chart dimensions + margins pulled from shared config.
  const chartWidth = chartConfig.dimensions.bar.width;
  const chartHeight = chartConfig.dimensions.bar.height;
  const margin = chartConfig.margins.bar;
  const barRadius = 14;

  // Tweak: palette + typography colors resolved from CSS variables.
  const textColor = chartTheme.textPrimary;
  const textSoft = chartTheme.textMuted;
  const gridColor = chartTheme.grid;

  /* Root SVG */
  const svgRoot = root
    .append('svg')
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('id', 'barchart-svg');

  svgRoot.append('title').text(translate('charts.bar.svgTitle'));
  svgRoot.append('desc').text(translate('charts.bar.svgDescription'));

  const defs = svgRoot.append('defs');
  const safeId = (city: string) =>
    city
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const cityColorEntries: CityColorEntry[] = data.map((d, index) => {
    const gradient =
      getCaseStudy3CityGradient(d.Stadt) ?? generateCaseStudy3GradientFromIndex(index);
    return {
      city: d.Stadt,
      gradientTop: gradient.gradientTop,
      gradientBottom: gradient.gradientBottom,
    };
  });

  defs
    .selectAll<SVGLinearGradientElement, CityColorEntry>('linearGradient.bar-gradient')
    .data(cityColorEntries, (d) => d.city)
    .join((enter) =>
      enter
        .append('linearGradient')
        .attr('class', 'bar-gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%')
    )
    .attr('id', (d) => `cs1-${safeId(d.city)}`)
    .each(function (entry) {
      const gradient = d3.select(this);
      gradient
        .selectAll('stop')
        .data([
          { offset: '0%', color: entry.gradientTop, opacity: 0.95 },
          { offset: '100%', color: entry.gradientBottom, opacity: 0.95 },
        ])
        .join('stop')
        .attr('offset', (d) => d.offset)
        .attr('stop-color', (d) => d.color)
        .attr('stop-opacity', (d) => d.opacity);
    });

  const getGradientId = (city: string) => `cs1-${safeId(city)}`;

  const svg = svgRoot.append('g');

  /* Scales */
  const x = d3
    .scaleBand<string>()
    .domain(data.map((d) => d.Stadt))
    .range([margin.left, chartWidth - margin.right])
    // Tweak: adjust shared `chartConfig.elements.barPadding` for horizontal spacing.
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
    // Tweak: change tick count or formatting for denser grids.
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

  svg
    .selectAll('.axis text')
    // Tweak: alter font size/weight here for axis labels.
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 500);
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
    .attr('fill', (d) => `url(#${getGradientId(d.Stadt)})`)
    .attr('x', (d) => x(d.Stadt) ?? margin.left)
    .attr('width', x.bandwidth())
    .attr('y', y(0))
    .attr('height', 0)
    .attr('rx', barRadius)
    .attr('ry', barRadius)
    .on('mouseenter', function (event: MouseEvent, d: KebabData) {
      d3.select(this).transition().duration(200).attr('opacity', 0.85);
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
      d3.select(this).transition().duration(chartConfig.animation.hover).attr('opacity', 1);
      tooltip.hide();
    })
    .transition()
    // Tweak: global bar entrance timing controlled via `chartConfig.animation.barGrow`.
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
    .attr('fill', textColor)
    .attr('x', (d) => (x(d.Stadt) ?? margin.left) + x.bandwidth() / 2)
    .attr('y', chartHeight - margin.bottom)
    .text((d) => d.Anzahl_Kebabläden ?? '')
    .transition()
    // Tweak: sync label float-up speed with `chartConfig.animation.barGrow`.
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

  return () => {
    root.selectAll('*').remove();
  };
}
