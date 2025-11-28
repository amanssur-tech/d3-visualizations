// src/charts/CaseStudy5ScatterRenderer.ts
/**
 * Pure D3 renderer for the Case Study 5 scatter/bubble chart.
 * Handles layout, axes, responsive legend, bubble sizing, inline number labels,
 * and tooltips. Update the config or individual sections below to retune sizing,
 * colors, or label offsets.
 */

import * as d3 from 'd3';

import { chartTheme } from '../theme/chartTheme';
import { createTooltip } from '../utils/tooltip';

import { getMenuColor } from './caseStudy5MenuPalette';

import type { CaseStudy5Datum } from './CaseStudy5DumbbellRenderer';
import type { TranslateFn } from '../i18n/translate';

interface ScatterRenderOptions {
  container: HTMLDivElement;
  data: CaseStudy5Datum[];
  translate: TranslateFn;
  formatCityName: (value: string) => string;
  formatMenuType: (value: string) => string;
}

const SCATTER_CONFIG = {
  dimensions: { width: 1050, height: 600 },
  margins: { top: 20, right: 50, bottom: 70, left: 90 },
  bubbleStroke: 'rgba(15,23,42,0.25)',
  labelOffset: 10,
};

const CITY_LABEL_TWEAKS: Record<string, { x: number; y: number }> = {
  Berlin: { x: 0, y: 0 },
  Dortmund: { x: -60, y: 20 },
  Leipzig: { x: 60, y: 35 },
  Muenchen: { x: 22, y: 0 },
  Freiburg: { x: -10, y: 0 },
  Aachen: { x: 0, y: 0 },
};

export const renderCaseStudy5Scatter = ({
  container,
  data,
  translate,
  formatCityName,
  formatMenuType,
}: ScatterRenderOptions) => {
  const root = d3.select(container);
  root.selectAll('*').remove();

  const tooltip = createTooltip();
  const { width, height } = SCATTER_CONFIG.dimensions;
  const margin = SCATTER_CONFIG.margins;

  /* ----------------------------- SVG shell ----------------------------- */
  const svgRoot = root
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svgRoot.append('title').text(translate('caseStudies:5.scatter.chartTitle'));
  svgRoot.append('desc').text(translate('caseStudies:5.scatter.chartDescription'));

  // Add defs for filters
  const defs = svgRoot.append('defs');
  defs
    .append('filter')
    .attr('id', 'text-shadow')
    .append('feDropShadow')
    .attr('dx', '0')
    .attr('dy', '0')
    .attr('stdDeviation', '4')
    .attr('flood-color', 'rgba(0,0,0,1)')
    .attr('flood-opacity', '1');

  const svg = svgRoot.append('g');

  /* ----------------------------- Scales ----------------------------- */
  const maxCustomers = d3.max(data, (d) => d.customersPerDay) ?? 0;
  const maxRevenue = d3.max(data, (d) => d.revenuePerDay) ?? 0;

  // Tweak: adjust domain padding factor to create more breathing room at the extremes.
  const xScale = d3
    .scaleLinear()
    .domain([900, maxCustomers * 1.1])
    .range([margin.left, width - margin.right])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([2000, maxRevenue * 1.1])
    .range([height - margin.bottom, margin.top])
    .nice();

  const shopsExtent = d3.extent(data, (d) => d.shops) as [number, number];
  // Tweak: adjust the size range here to make bubble area encode shops more/less strongly.
  const radiusScale = d3.scaleSqrt().domain(shopsExtent).range([12, 36]);

  /* ----------------------------- Grid + axes ----------------------------- */
  const gridX = d3
    .axisBottom(xScale)
    .tickSize(-height + margin.top + margin.bottom)
    .ticks(15)
    .tickFormat(() => '');
  const gridY = d3
    .axisLeft(yScale)
    .tickSize(-width + margin.left + margin.right)
    .ticks(16)
    .tickFormat(() => '');

  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(gridX)
    .call((g) => g.select('.domain').remove())
    .selectAll('line')
    .attr('stroke', chartTheme.grid)
    .attr('stroke-opacity', 0.3);

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(gridY)
    .call((g) => g.select('.domain').remove())
    .selectAll('line')
    .attr('stroke', chartTheme.grid)
    .attr('stroke-opacity', 0.3);

  svg
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(8)
        .tickSizeOuter(0)
        .tickFormat((value) => d3.format(',')(Number(value)))
    );

  svg
    .append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(yScale)
        .ticks(8)
        .tickSizeOuter(0)
        .tickFormat((value) => d3.format(',')(Number(value)))
    );

  svg
    .selectAll('.axis text')
    .attr('fill', chartTheme.textMuted)
    .attr('font-size', 16)
    .attr('font-weight', 500);

  // Axis labels
  svg
    .append('text')
    .attr('x', margin.left + (width - margin.left - margin.right) / 2)
    .attr('y', height - margin.bottom / 2 + 30)
    .attr('text-anchor', 'middle')
    .attr('fill', chartTheme.textPrimary)
    .attr('font-size', 16)
    .attr('font-weight', 600)
    .text(translate('caseStudies:5.scatter.axis.x'));

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(margin.top + (height - margin.top - margin.bottom) / 2))
    .attr('y', margin.left / 3)
    .attr('text-anchor', 'middle')
    .attr('fill', chartTheme.textPrimary)
    .attr('font-size', 16)
    .attr('font-weight', 600)
    .text(translate('caseStudies:5.scatter.axis.y'));

  /* ----------------------------- Bubble groups ----------------------------- */
  const getLabelShift = (city: string) => CITY_LABEL_TWEAKS[city] ?? { x: 0, y: 0 };

  const bubbles = svg
    .append('g')
    .attr('class', 'bubbles')
    .selectAll<SVGGElement, CaseStudy5Datum>('g.bubble')
    .data<CaseStudy5Datum>(data, (d) => d.city)
    .join('g')
    .attr('class', 'bubble')
    .attr('transform', (d) => `translate(${xScale(d.customersPerDay)},${yScale(d.revenuePerDay)})`);

  bubbles
    .append('circle')
    .attr('r', (d) => radiusScale(d.shops))
    .attr('fill', (d) => getMenuColor(d.menuType))
    .attr('fill-opacity', 0.9)
    .attr('stroke', SCATTER_CONFIG.bubbleStroke)
    .attr('stroke-width', 2)
    .on('mouseenter', function (event, datum) {
      const mouseEvent = event as MouseEvent;
      d3.select(this).transition().duration(150).attr('stroke-width', 3.5);
      tooltip.show(
        translate('caseStudies:5.tooltip.scatter', {
          city: formatCityName(datum.city),
          customers: d3.format(',')(datum.customersPerDay),
          revenue: d3.format(',')(datum.revenuePerDay),
          menu: formatMenuType(datum.menuType),
          shops: d3.format(',')(datum.shops),
        }),
        mouseEvent
      );
    })
    .on('mousemove', (event) => tooltip.move(event as MouseEvent))
    .on('mouseleave', function () {
      d3.select(this).transition().duration(150).attr('stroke-width', 2);
      tooltip.hide();
    });

  // Number of restaurants inline.
  const shopLabels = bubbles
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', 4)
    .attr('y', 4)
    .attr('fill', '#0f172a')
    .attr('font-weight', 700)
    .attr('font-size', 14)
    .text((d) => translate('caseStudies:5.scatter.shopsCount', { value: d3.format(',')(d.shops) }));

  // Deterministic pill rendering
  const pillPaddingX = 6;
  const charWidth = 7.5;
  const pillHeight = 20;

  shopLabels.each(function (_datum, index, nodes) {
    const labelNode = nodes[index] as SVGTextElement | undefined;
    if (!labelNode) return;
    const text = labelNode.textContent ?? '';
    const pillWidth = pillPaddingX * 2 + text.length * charWidth;

    const wrapper = d3.select(labelNode.parentNode as SVGGElement | null);
    if (wrapper.empty()) return;

    let pill = wrapper.select<SVGRectElement>('rect.shops-pill');
    if (pill.empty()) {
      pill = wrapper.insert('rect', () => labelNode).attr('class', 'shops-pill');
    }

    pill
      .attr('x', -pillWidth / 2)
      .attr('y', -pillHeight / 2)
      .attr('width', pillWidth)
      .attr('height', pillHeight)
      .attr('rx', pillHeight / 2)
      .attr('ry', pillHeight / 2)
      .attr('fill', 'rgba(255,255,255,0.95)')
      .attr('stroke', 'rgba(15,23,42,0.12)');
  });

  // City labels positioned above each bubble.
  bubbles
    .append('text')
    .attr('class', 'city-label')
    .attr('x', (d) => getLabelShift(d.city).x)
    .attr('y', (d) => {
      const tweaks = getLabelShift(d.city);
      const base = -(radiusScale(d.shops) + SCATTER_CONFIG.labelOffset);
      return base + tweaks.y;
    })
    .attr('text-anchor', 'middle')
    .attr('fill', chartTheme.textPrimary)
    .attr('font-size', 14)
    .attr('font-weight', 600)
    .text((d) => formatCityName(d.city));

  return () => {
    tooltip.hide();
  };
};
