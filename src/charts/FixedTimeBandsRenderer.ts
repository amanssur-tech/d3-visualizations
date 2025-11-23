// src/components/charts/FixedTimeBandsRenderer.ts
/**
 * FixedTimeBandsRenderer
 * Pure D3 renderer for the corrected multi-band time series in Case Study 4.
 * Responsibilities:
 *  - SVG creation
 *  - stacked panels (flexible count + labeling)
 *  - scales, axes, grid
 *  - multi-line plots with dots
 *  - shared legend
 */

import * as d3 from 'd3';

import { chartTheme } from '../theme/chartTheme';
import { chartConfig } from '../utils/config';

// Master layout for the corrected time-band chart; change margins/band sizing here to retune spacing.
// Tweak: layout knobs for corrected multi-band chart (margins, band heights, gaps).
const fixedBandsLayout = {
  margin: { top: 60, right: 180, bottom: 80, left: 70 },
  band: {
    height: 250,
    gap: 60,
    padding: 16,
  },
};

export type FixedTimeBandViewMode = 'city' | 'timeOfDay';

export interface FixedTimeBandsViewConfig {
  mode: FixedTimeBandViewMode;
  panelIds: string[];
  getPanelLabel: (panelId: string) => string;
  getPanelClassName?: (panelId: string) => string;
  seriesIds: string[];
  getSeriesLabel: (seriesId: string) => string;
  getSeriesColor: (seriesId: string) => string;
  getValue: (panelId: string, seriesId: string, day: number) => number;
  legendTitle: string;
}

export interface FixedTimeBandsOptions {
  container: HTMLElement;
  days: number[];
  translate: (key: string) => string;
  view: FixedTimeBandsViewConfig;
}

const buildGroupClass = (base: string, extra?: string, mode?: FixedTimeBandViewMode) =>
  [base, mode ? `${base}--${mode}` : null, extra ?? null].filter(Boolean).join(' ');

export function renderFixedTimeBands({ container, days, translate, view }: FixedTimeBandsOptions) {
  const root = d3.select(container);
  root.selectAll('*').remove();

  if (!view.panelIds.length || !view.seriesIds.length || !days.length) return;

  const chartWidth = chartConfig.dimensions.line.width;
  const margin = fixedBandsLayout.margin;
  const bandsTotalHeight =
    view.panelIds.length * fixedBandsLayout.band.height +
    Math.max(view.panelIds.length - 1, 0) * fixedBandsLayout.band.gap;
  const headerSpacing = 10;
  const chartHeight = margin.top + margin.bottom + bandsTotalHeight + headerSpacing;

  // Tweak: update CSS vars if the corrected chart should follow a different palette.
  const textColor = chartTheme.textPrimary;
  const textSoft = chartTheme.textMuted;
  const gridColor = chartTheme.grid;
  const accent = chartTheme.accent;
  const surface = chartTheme.surface;

  const innerWidth = chartWidth - margin.left - margin.right;

  // Tweak: adjust `.padding(0.3)` to spread/squish day markers horizontally.
  const x = d3.scalePoint<number>().domain(days).range([0, innerWidth]).padding(0.3);

  /* Root SVG */
  const svg = root
    .append('svg')
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('class', 'w-full h-auto')
    .attr('data-view-mode', view.mode)
    .attr('role', 'img');

  svg.append('title').text(translate('caseStudies:4.fixed.chartTitle'));
  svg.append('desc').text(translate('caseStudies:4.fixed.chartDescription'));

  svg
    .append('text')
    .attr(
      'transform',
      `translate(${margin.left - 48}, ${margin.top + headerSpacing + bandsTotalHeight / 2}) rotate(-90)`
    )
    .attr('text-anchor', 'middle')
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .text(translate('caseStudies:4.fixed.axisLabel'));

  const rootG = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top + headerSpacing})`);

  /* One stacked band per panel */
  view.panelIds.forEach((panelId, index) => {
    const panelValues = days.flatMap((day) =>
      view.seriesIds.map((seriesId) => view.getValue(panelId, seriesId, day))
    );

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(panelValues.map((value) => value + value * 0.2)) ?? 1])
      .nice()
      .range([fixedBandsLayout.band.height, 0]);

    const bandGroup = rootG
      .append('g')
      .attr('class', buildGroupClass('time-band', view.getPanelClassName?.(panelId), view.mode))
      .attr(
        'transform',
        `translate(0, ${index * (fixedBandsLayout.band.height + fixedBandsLayout.band.gap)})`
      );

    /* Grid */
    bandGroup
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(6)
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
      .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format('.0f')));

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
      .text(view.getPanelLabel(panelId));

    /* Line generator */
    const line = d3
      .line<{ day: number; value: number }>()
      .x((d) => x(d.day) ?? 0)
      .y((d) => y(d.value))
      .curve(d3.curveCatmullRom.alpha(chartConfig.curves.smooth));

    /* Each series line */
    view.seriesIds.forEach((seriesId) => {
      const values = days.map((day) => ({
        day,
        value: view.getValue(panelId, seriesId, day),
      }));
      const seriesColor = view.getSeriesColor(seriesId) ?? accent;

      bandGroup
        .append('path')
        .datum(values)
        // Tweak: stroke color/width determines how each series reads.
        .attr('class', `line ${seriesId}`)
        .attr('fill', 'none')
        .attr('stroke', seriesColor)
        .attr('stroke-width', 3)
        .attr('d', line);

      bandGroup
        .selectAll(`circle.${seriesId}`)
        .data(values)
        .join('circle')
        // Tweak: dot radius + stroke colors highlight per-day emphasis.
        .attr('class', seriesId)
        .attr('cx', (d) => x(d.day) ?? 0)
        .attr('cy', (d) => y(d.value))
        .attr('r', 5)
        .attr('fill', surface)
        .attr('stroke', seriesColor)
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

  /* Legend */
  const legendData = view.seriesIds.map((seriesId) => ({
    label: view.getSeriesLabel(seriesId),
    color: view.getSeriesColor(seriesId) ?? accent,
  }));

  const legend = svg
    .append('g')
    .attr('transform', `translate(${chartWidth - margin.right + 50},${margin.top + 10})`);

  legend
    .append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('fill', textSoft)
    .attr('font-size', 12)
    .attr('font-weight', 700)
    .text(view.legendTitle);

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
        // Tweak: change fill/outline to restyle legend swatches.
        .attr('fill', d.color)
        .attr('stroke', accent)
        .attr('stroke-opacity', 0.35);

      g.append('text')
        .attr('x', 24)
        .attr('y', 12)
        .attr('fill', textSoft)
        .attr('font-size', 12)
        .attr('font-weight', 600)
        // Tweak: legend labels pull city names directly.
        .text(d.label);
    });
}
