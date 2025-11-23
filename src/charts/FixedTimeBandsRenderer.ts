// src/components/charts/FixedTimeBandsRenderer.ts
/**
 * FixedTimeBandsRenderer
 * Pure D3 renderer for the corrected multi-band time series in Case Study 4.
 * Responsibilities:
 *  - SVG creation
 *  - one panel for each time-of-day band
 *  - scales, axes, grid
 *  - per-city multi-line plot with dots
 *  - shared legend
 */

import * as d3 from 'd3';

import { chartConfig } from '../utils/config';

import type { TimeOfDay, DailyRow } from '../hooks/useTimeOfDayData';

export interface FixedTimeBandsOptions {
  container: HTMLElement;
  timeOrder: readonly TimeOfDay[];
  dailyRows: DailyRow[];
  days: number[];
  cities: string[];
  getSales: (city: string, day: number, time: TimeOfDay) => number;
  translate: (key: string) => string;
  cityPalette: Record<string, string>;
}

export function renderFixedTimeBands({
  container,
  timeOrder,
  dailyRows,
  days,
  cities,
  getSales,
  translate,
  cityPalette,
}: FixedTimeBandsOptions) {
  const root = d3.select(container);
  root.selectAll('*').remove();

  if (!dailyRows.length || !cities.length || !days.length) return;

  const chartWidth = chartConfig.dimensions.line.width;
  const chartHeight = 700;

  const margin = { top: 60, right: 180, bottom: 80, left: 70 };
  const bandHeight = 150;
  const bandGap = 60;
  const bandPadding = 16;

  const textColor = chartConfig.getVar('--color-text') ?? '#0f172a';
  const textSoft = chartConfig.getVar('--color-text-soft') ?? '#475569';
  const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';
  const accent = chartConfig.getVar('--color-accent') ?? '#06b6d4';

  const innerWidth = chartWidth - margin.left - margin.right;
  const bandsTotalHeight = timeOrder.length * bandHeight + bandGap * (timeOrder.length - 1);

  const x = d3.scalePoint<number>().domain(days).range([0, innerWidth]).padding(0.3);

  /* Root SVG */
  const svg = root
    .append('svg')
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('class', 'w-full h-auto')
    .style('background', '#ffffff')
    .attr('role', 'img');

  svg.append('title').text(translate('caseStudies:4.fixed.chartTitle'));
  svg.append('desc').text(translate('caseStudies:4.fixed.chartDescription'));

  svg
    .append('text')
    .attr('x', margin.left - 10)
    .attr('y', margin.top - 20)
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .text(translate('caseStudies:4.fixed.axisLabel'));

  const rootG = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  /* One stacked band per time of day */
  timeOrder.forEach((time, index) => {
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          dailyRows.filter((row) => row.timeOfDay === time),
          (row) => row.sales
        ) ?? 1,
      ])
      .nice()
      .range([bandHeight, 0]);

    const bandGroup = rootG
      .append('g')
      .attr('class', `time-band time-${time}`)
      .attr('transform', `translate(0, ${index * (bandHeight + bandGap)})`);

    /* Background panel */
    bandGroup
      .append('rect')
      .attr('x', -bandPadding)
      .attr('y', -12)
      .attr('width', innerWidth + bandPadding * 2)
      .attr('height', bandHeight + 24)
      .attr('fill', '#ffffff')
      .attr('opacity', 0.4)
      .attr('stroke', gridColor)
      .attr('stroke-opacity', 0.35)
      .attr('rx', 18);

    /* Grid */
    bandGroup
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', gridColor)
      .attr('stroke-opacity', 0.6)
      .attr('shape-rendering', 'crispEdges');

    /* Y axis */
    const yAxisGroup = bandGroup
      .append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('.0f')));

    yAxisGroup
      .selectAll('text')
      .attr('fill', textSoft)
      .attr('font-size', 11)
      .attr('font-weight', 600);

    yAxisGroup.selectAll('path, line').attr('stroke', textSoft).attr('stroke-opacity', 0.25);

    /* Title left inside band */
    bandGroup
      .append('text')
      .attr('x', -12)
      .attr('y', -18)
      .attr('fill', textColor)
      .attr('font-size', 13)
      .attr('font-weight', 700)
      .text(translate(`caseStudies:4.times.${time}`));

    /* Line generator */
    const line = d3
      .line<{ day: number; value: number }>()
      .x((d) => x(d.day) ?? 0)
      .y((d) => y(d.value));

    /* Each city's line */
    cities.forEach((city) => {
      const values = days.map((day) => ({ day, value: getSales(city, day, time) }));

      bandGroup
        .append('path')
        .datum(values)
        .attr('class', `line ${city}`)
        .attr('fill', 'none')
        .attr('stroke', cityPalette[city] ?? accent)
        .attr('stroke-width', 3)
        .attr('d', line);

      bandGroup
        .selectAll(`circle.${city}`)
        .data(values)
        .join('circle')
        .attr('class', city)
        .attr('cx', (d) => x(d.day) ?? 0)
        .attr('cy', (d) => y(d.value))
        .attr('r', 5)
        .attr('fill', '#fff')
        .attr('stroke', cityPalette[city] ?? accent)
        .attr('stroke-width', 2);
    });
  });

  /* Shared X axis */
  const xAxisGroup = rootG
    .append('g')
    .attr('transform', `translate(0, ${bandsTotalHeight})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')));

  xAxisGroup
    .selectAll('text')
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 600);

  xAxisGroup.selectAll('path, line').attr('stroke', textSoft).attr('stroke-opacity', 0.2);

  svg
    .append('text')
    .attr('x', margin.left + innerWidth / 2)
    .attr('y', chartHeight - 24)
    .attr('text-anchor', 'middle')
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .text(translate('caseStudies:4.fixed.axisDays'));

  svg
    .append('text')
    .attr('x', margin.left - 10)
    .attr('y', margin.top - 36)
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .text(translate('caseStudies:4.fixed.axisCity'));

  /* Legend */
  const legendData = cities.map((city) => ({
    label: city,
    color: cityPalette[city] ?? accent,
  }));

  const legend = svg
    .append('g')
    .attr('transform', `translate(${chartWidth - margin.right + 12},${margin.top})`);

  legend
    .append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 700)
    .text(translate('caseStudies:4.fixed.legendTitle'));

  legend
    .selectAll('g.legend-item')
    .data(legendData)
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (_, index) => `translate(0, ${index * 26})`)
    .each(function (d) {
      const g = d3.select(this);

      g.append('rect')
        .attr('width', 16)
        .attr('height', 16)
        .attr('rx', 5)
        .attr('fill', d.color)
        .attr('stroke', accent)
        .attr('stroke-opacity', 0.35);

      g.append('text')
        .attr('x', 24)
        .attr('y', 12)
        .attr('fill', textSoft)
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .text(d.label);
    });
}
