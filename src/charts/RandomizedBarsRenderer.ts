// src/components/charts/RandomizedBarsRenderer.ts
/**
 * RandomizedBarsRenderer
 * Pure D3 renderer for Case Study 3.
 * Handles:
 *  - bar chart drawing
 *  - gradients per city
 *  - axes + grid
 *  - transitions
 *  - highlight effect
 */

import * as d3 from 'd3';

import { chartConfig } from '../utils/config';

export interface CityDatum {
  city: string;
  value: number;
}

export interface RandomizedBarsRenderOptions {
  container: HTMLElement;
  data: CityDatum[];
  highlightedCity: string | null;
  formatCityName: (name: string) => string;
}

/**
 * renderRandomizedBars
 * Executes the D3 pipeline for Case Study 3's animated bar chart.
 */
export function renderRandomizedBars({
  container,
  data,
  highlightedCity,
  formatCityName,
}: RandomizedBarsRenderOptions) {
  const host = d3.select(container);
  const chartWidth = chartConfig.dimensions.bar.width;
  const chartHeight = 420;
  const margin = { top: 40, right: 24, bottom: 70, left: 64 };
  const barRadius = 12;
  const yTickCount = 6;

  const textColor = chartConfig.getVar('--color-text') ?? '#0f172a';
  const textSoft = chartConfig.getVar('--color-text-soft') ?? '#64748b';
  const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';

  // Persist SVG
  let svg = host.select<SVGSVGElement>('svg');
  if (svg.empty()) {
    svg = host
      .append('svg')
      .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('class', 'w-full h-auto');
    svg.append('title');
    svg.append('desc');
    svg.append('defs');
  }

  svg.select('title').text('Randomized kebab shop counts');
  svg.select('desc').text('Live updating randomized bar chart for Case Study 3');

  // Gradients per city
  const defs = svg.select('defs');
  const colorScale = d3
    .scaleSequential(d3.interpolateViridis)
    .domain([0, Math.max(data.length - 1, 1)]);

  const safeId = (city: string) =>
    city
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  defs
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
    .attr('id', (d: CityDatum) => `cs3-${safeId(d.city)}`)
    .each(function (_, index) {
      const gradient = d3.select(this);
      const base = colorScale(index);
      const parsed = d3.color(base);
      const top = parsed ? parsed.brighter(0.8).formatHex() : base;
      const bottom = parsed ? parsed.darker(0.8).formatHex() : base;

      gradient
        .selectAll('stop')
        .data([
          { offset: '0%', color: top, opacity: 0.95 },
          { offset: '100%', color: bottom, opacity: 0.95 },
        ])
        .join('stop')
        .attr('offset', (d) => d.offset)
        .attr('stop-color', (d) => d.color)
        .attr('stop-opacity', (d) => d.opacity);
    });

  // Scales
  const x = d3
    .scaleBand<string>()
    .domain(data.map((d) => d.city))
    .range([margin.left, chartWidth - margin.right])
    .padding(0.25);

  const maxValue = d3.max(data, (d) => d.value) ?? 1;
  const y = d3
    .scaleLinear()
    .domain([0, maxValue * 1.15])
    .nice()
    .range([chartHeight - margin.bottom, margin.top]);

  const transition = d3.transition().duration(650).ease(d3.easeCubicOut);

  // Grid
  const gridGroup = svg
    .selectAll<SVGGElement, null>('g.grid')
    .data([null])
    .join('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${margin.left},0)`);

  gridGroup
    .call(
      d3
        .axisLeft(y)
        .ticks(yTickCount)
        .tickSize(-chartWidth + margin.left + margin.right)
        .tickFormat(() => '')
    )
    .selectAll('line')
    .attr('stroke', gridColor)
    .attr('stroke-opacity', 0.3)
    .attr('shape-rendering', 'crispEdges');

  // Axes
  const yAxis = svg
    .selectAll<SVGGElement, null>('g.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(yTickCount).tickFormat(d3.format('.0f')));

  yAxis.selectAll('text').attr('fill', textSoft).attr('font-size', 12).attr('font-weight', 500);

  yAxis.selectAll('path, line').attr('stroke', textSoft).attr('stroke-opacity', 0.2);

  const xAxis = svg
    .selectAll<SVGGElement, null>('g.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${chartHeight - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat((city) => formatCityName(city)));

  xAxis
    .selectAll('text')
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 500)
    .attr('transform', 'rotate(-20)')
    .style('text-anchor', 'end');

  // Bars
  const bars = svg
    .selectAll<SVGRectElement, CityDatum>('rect.bar')
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
          .attr('rx', barRadius)
          .attr('fill', (d) => `url(#cs3-${safeId(d.city)})`),
      (update) => update,
      (exit) => exit.transition(transition).attr('y', y(0)).attr('height', 0).remove()
    )
    .attr('fill', (d) => `url(#cs3-${safeId(d.city)})`);

  bars
    .transition(transition)
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

  // Value labels
  const valueFormat = d3.format('.1f');
  const labels = svg
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
      (exit) => exit.transition(transition).style('opacity', 0).remove()
    );

  labels
    .transition(transition)
    .attr('x', (d) => (x(d.city) ?? margin.left) + x.bandwidth() / 2)
    .attr('y', (d) => y(d.value) - 10)
    .text((d) => valueFormat(d.value))
    .style('opacity', 1);
}
