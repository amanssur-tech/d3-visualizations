// src/components/charts/FlawedDonutRenderer.ts
/**
 * FlawedDonutRenderer
 * Pure D3 renderer for the intentionally misleading donut chart in Case Study 4.
 * Handles:
 *  - SVG creation
 *  - flawed slice ordering
 *  - mismatched legend
 *  - labels and colors
 */

import * as d3 from 'd3';

import { chartConfig } from '../utils/config';

import type { AggregatedRow, TimeOfDay } from '../hooks/useTimeOfDayData';

const flawedOrder: readonly TimeOfDay[] = ['abends', 'morgens', 'mittags'];

const flawedPalette: Record<TimeOfDay, string> = {
  morgens: '#f59e0b',
  mittags: '#fbbf24',
  abends: '#f472b6',
};

interface LegendEntry {
  label: string;
  color: string;
}

export interface FlawedDonutOptions {
  container: HTMLElement;
  aggregated: AggregatedRow[];
  translate: (key: string) => string;
}

export function renderFlawedDonut({ container, aggregated, translate }: FlawedDonutOptions) {
  const root = d3.select(container);
  root.selectAll('*').remove();

  if (!aggregated.length) return;

  const chartWidth = chartConfig.dimensions.line.width;
  const chartHeight = 420;
  const innerRadius = 60;
  const sliceOutline = '#fef9c3';
  const labelColor = '#111827';
  const labelFontSize = 11;

  const svg = root
    .append('svg')
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('class', 'w-full h-auto')
    .style('background', '#ffffff')
    .attr('role', 'img');

  svg.append('title').text(translate('caseStudies:4.flawed.chartTitle'));
  svg.append('desc').text(translate('caseStudies:4.flawed.chartDescription'));

  const pieGroup = svg
    .append('g')
    .attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2 - 10})`);

  const arc = d3
    .arc<d3.PieArcDatum<AggregatedRow>>()
    .innerRadius(innerRadius)
    .outerRadius(Math.min(chartWidth, chartHeight) / 2.4 + 30)
    .cornerRadius(18);

  const pie = d3
    .pie<AggregatedRow>()
    .sort((a, b) => flawedOrder.indexOf(a.timeOfDay) - flawedOrder.indexOf(b.timeOfDay))
    .value((d) => d.average);

  const pieData = pie(aggregated);

  pieGroup
    .selectAll<SVGPathElement, d3.PieArcDatum<AggregatedRow>>('path.slice')
    .data(pieData)
    .join('path')
    .attr('class', 'slice')
    .attr('fill', (d) => flawedPalette[d.data.timeOfDay])
    .attr('stroke', sliceOutline)
    .attr('stroke-width', 2)
    .attr('opacity', 0.9)
    .attr('d', (d) => arc(d) ?? '');

  pieGroup
    .selectAll<SVGTextElement, d3.PieArcDatum<AggregatedRow>>('text.label')
    .data(pieData)
    .join('text')
    .attr('class', 'label')
    .attr('transform', (d) => {
      const [cx, cy] = arc.centroid(d);
      return `translate(${cx},${cy})`;
    })
    .attr('text-anchor', 'middle')
    .attr('fill', labelColor)
    .attr('font-size', labelFontSize)
    .attr('font-weight', 700)
    .text((d) => translate(`caseStudies:4.times.${d.data.timeOfDay}`));

  const legend = svg
    .append('g')
    .attr('transform', `translate(${chartWidth / 2 - 140},${chartHeight - 70})`);

  const legendData: LegendEntry[] = [
    { label: translate('caseStudies:4.times.morgens'), color: flawedPalette.abends },
    { label: translate('caseStudies:4.times.mittags'), color: flawedPalette.morgens },
    { label: translate('caseStudies:4.times.abends'), color: flawedPalette.mittags },
  ];

  legend
    .selectAll<SVGGElement, LegendEntry>('g.legend-item')
    .data(legendData)
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (_, index) => `translate(${index * 120}, 0)`)
    .each(function (d) {
      const group = d3.select(this);
      group
        .append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 3)
        .attr('fill', d.color)
        .attr('stroke', '#1f2937')
        .attr('stroke-width', 0.6);

      group
        .append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('fill', labelColor)
        .attr('font-size', labelFontSize)
        .text(d.label);
    });
}
