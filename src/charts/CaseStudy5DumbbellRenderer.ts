// src/charts/CaseStudy5DumbbellRenderer.ts
/**
 * Stateless renderer for the Case Study 5 dumbbell chart.
 * Responsibilities:
 *  - build responsive SVG shell
 *  - set up linear + band scales
 *  - draw grid, axes, lines, dots, and inline labels
 *  - wire up hover tooltips for both metrics
 * Every section has comments describing tweakable knobs so future edits stay fast.
 */

import * as d3 from 'd3';

import { chartTheme } from '../theme/chartTheme';
import { createTooltip } from '../utils/tooltip';

import { getMenuColor } from './caseStudy5MenuPalette';

import type { TranslateFn } from '../i18n/translate';

export interface CaseStudy5Datum {
  city: string;
  shops: number;
  customersPerDay: number;
  revenuePerDay: number;
  menuType: string;
}

interface DumbbellRenderOptions {
  container: HTMLDivElement;
  data: CaseStudy5Datum[];
  translate: TranslateFn;
  formatCityName: (value: string) => string;
  formatMenuType: (value: string) => string;
}

const DUMBELL_CONFIG = {
  dimensions: { width: 1050, height: 600 },
  margins: { top: 20, right: 50, bottom: 70, left: 120 },
  dotOpacity: 0.95,
  dotRadius: 8,
  revenueGlow: 0.35,
  neutralLine: '#94a3b8',
};

export const renderCaseStudy5Dumbbell = ({
  container,
  data,
  translate,
  formatCityName,
  formatMenuType,
}: DumbbellRenderOptions): (() => void) => {
  const root = d3.select(container);
  root.selectAll('*').remove();

  const tooltip = createTooltip();

  // Tweak: change `dimensions` above to alter base aspect ratio.
  const { width, height } = DUMBELL_CONFIG.dimensions;
  const margin = DUMBELL_CONFIG.margins;
  const neutral = DUMBELL_CONFIG.neutralLine;

  /* ----------------------------- SVG shell ----------------------------- */
  const svgRoot = root
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svgRoot.append('title').text(translate('caseStudies:5.dumbbell.chartTitle'));
  svgRoot.append('desc').text(translate('caseStudies:5.dumbbell.chartDescription'));

  const svg = svgRoot.append('g');

  /* ----------------------------- Scales ----------------------------- */
  // Tweak: extend the domain padding to widen or tighten left/right breathing room.
  const maxValue = d3.max(data, (d) => Math.max(d.customersPerDay, d.revenuePerDay)) ?? 0;
  const xScale = d3
    .scaleLinear()
    .domain([500, maxValue * 1])
    .range([margin.left, width - margin.right])
    .nice();

  // Tweak: adjust `.padding()` for more/less vertical separation between dumbbells.
  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.city))
    .range([margin.top, height - margin.bottom])
    .padding(0.5);

  // Tweak: adjust stroke scale to make connector thickness encode shop counts more/less.
  const shopsExtent = d3.extent(data, (d) => d.shops) as [number, number];
  const strokeScale = d3.scaleLinear().domain(shopsExtent).range([2, 12]);

  /* ----------------------------- Grid + axes ----------------------------- */
  const verticalGridGroup = svg.insert('g', ':first-child').attr('class', 'vertical-grid');

  verticalGridGroup
    .selectAll('line')
    .data(xScale.ticks(20))
    .join('line')
    .attr('class', 'stroke-gray-200 dark:stroke-gray-700')
    .attr('x1', (tick) => xScale(tick))
    .attr('x2', (tick) => xScale(tick))
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom)
    .attr('stroke-width', 1);

  // Bottom axis with numeric ticks for customers/revenue scale.
  svg
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(10)
        .tickSizeOuter(0)
        .tickFormat((value) => d3.format(',')(Number(value)))
    )
    .call((g) => g.select('.domain').attr('stroke', chartTheme.textMuted));

  // Left axis with formatted city names.
  svg
    .append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', `translate(${margin.left - 20},0)`)
    .call(
      d3
        .axisLeft(yScale)
        .tickSize(0)
        .tickFormat((value) => formatCityName(String(value)))
    )
    .call((g) => g.select('.domain').remove());

  svg
    .selectAll('.axis text')
    .attr('fill', chartTheme.textMuted)
    .attr('font-size', 16)
    .attr('font-weight', 500);

  // Axis labels help future editors locate where to tweak copy.
  svg
    .append('text')
    .attr('x', margin.left + (width - margin.left - margin.right) / 2)
    .attr('y', height - margin.bottom / 2 + 24)
    .attr('text-anchor', 'middle')
    .attr('fill', chartTheme.textPrimary)
    .attr('font-size', 16)
    .attr('font-weight', 600)
    .text(translate('caseStudies:5.dumbbell.axis'));

  /* ----------------------------- Dumbbell lines ----------------------------- */
  const rowGroupsGroup = svg.append('g').attr('class', 'dumbbells');
  rowGroupsGroup.raise();

  const rowGroups = rowGroupsGroup
    .selectAll<SVGGElement, CaseStudy5Datum>('g.dumbbell')
    .data<CaseStudy5Datum>(data, (d) => d.city)
    .join('g')
    .attr('class', 'dumbbell')
    .attr('transform', (d) => `translate(0,${yScale(d.city) ?? 0})`);

  rowGroups
    .append('line')
    .attr('class', 'connector stroke-zinc-300 dark:stroke-zinc-400')
    .attr('x1', (d) => xScale(d.customersPerDay))
    .attr('x2', (d) => xScale(d.revenuePerDay))
    .attr('y1', yScale.bandwidth() / 2)
    .attr('y2', yScale.bandwidth() / 2)
    .attr('stroke', neutral)
    .attr('stroke-width', (d) => strokeScale(d.shops))
    .attr('stroke-linecap', 'round')
    .attr('opacity', 1);

  /* ----------------------------- Inline shop labels ----------------------------- */
  rowGroups
    .append('text')
    .attr('class', 'shop-label')
    .attr(
      'x',
      (d) => (xScale(d.customersPerDay) + xScale(d.revenuePerDay)) / 2 - strokeScale(d.shops) / 2
    )
    .attr('y', yScale.bandwidth() / 2 - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', chartTheme.textPrimary)
    .attr('font-size', 14)
    .attr('font-weight', 600)
    .text((d) =>
      translate('caseStudies:5.dumbbell.shopsLabel', {
        count: d3.format(',')(d.shops),
      })
    );

  /* ----------------------------- Customer vs revenue dots ----------------------------- */
  const dotEnter = (
    selection: d3.Selection<SVGCircleElement, CaseStudy5Datum, SVGGElement, unknown>
  ) => {
    selection
      .attr('cy', yScale.bandwidth() / 2)
      .attr('r', DUMBELL_CONFIG.dotRadius)
      .attr('opacity', DUMBELL_CONFIG.dotOpacity)
      .attr('stroke', '#0f172a')
      .attr('stroke-opacity', 0.15)
      .attr('stroke-width', 1.5);
  };

  // Left dots (customers per day) coloured by menu type.
  rowGroups
    .append('circle')
    .attr('class', 'dot dot--customers')
    .attr('cx', (d) => xScale(d.customersPerDay))
    .attr('fill', (d) => getMenuColor(d.menuType))
    .call(dotEnter)
    .on('mouseenter', function (event, datum) {
      const mouseEvent = event as MouseEvent;
      d3.select(this).transition().duration(150).attr('opacity', 1);
      tooltip.show(
        translate('caseStudies:5.tooltip.customers', {
          city: formatCityName(datum.city),
          customers: d3.format(',')(datum.customersPerDay),
          menu: formatMenuType(datum.menuType),
          shops: d3.format(',')(datum.shops),
        }),
        mouseEvent
      );
    })
    .on('mousemove', (event) => tooltip.move(event as MouseEvent))
    .on('mouseleave', function () {
      d3.select(this).transition().duration(150).attr('opacity', DUMBELL_CONFIG.dotOpacity);
      tooltip.hide();
    });

  // Right dots (revenue per day) emphasized by accent color + glow.
  rowGroups
    .append('circle')
    .attr('class', 'dot dot--revenue fill-zinc-400 dark:fill-zinc-300') // Tailwind red-500
    .attr('cx', (d) => xScale(d.revenuePerDay))
    .attr('fill', chartTheme.accentStrong)
    .call(dotEnter)
    .style('filter', `drop-shadow(0 4px 12px rgba(14,165,233,${DUMBELL_CONFIG.revenueGlow}))`)
    .on('mouseenter', function (event, datum) {
      const mouseEvent = event as MouseEvent;
      d3.select(this).transition().duration(150).attr('opacity', 1);
      tooltip.show(
        translate('caseStudies:5.tooltip.revenue', {
          city: formatCityName(datum.city),
          revenue: d3.format(',')(datum.revenuePerDay),
          shops: d3.format(',')(datum.shops),
        }),
        mouseEvent
      );
    })
    .on('mousemove', (event) => tooltip.move(event as MouseEvent))
    .on('mouseleave', function () {
      d3.select(this).transition().duration(150).attr('opacity', DUMBELL_CONFIG.dotOpacity);
      tooltip.hide();
    });

  return () => {
    tooltip.hide();
  };
};
