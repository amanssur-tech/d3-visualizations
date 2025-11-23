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

import { chartTheme } from '../theme/chartTheme';
import { chartConfig } from '../utils/config';

import type { AggregatedRow, TimeOfDay } from '../hooks/useTimeOfDayData';

// Keep the slices grouped by time of day so the donut looks polished (but hides meaning).
const flawedOrder: readonly TimeOfDay[] = ['morgens', 'mittags', 'abends'];

const flawedPalette: Record<TimeOfDay, string> = {
  morgens: '#fbbf24',
  mittags: '#f5a524',
  abends: '#f472b6',
};

const flawedDonutConfig = {
  innerRadius: 120,
  sliceOutline: '#fde68a',
  labelFontSize: 11,
  cornerRadius: 22,
};

interface LegendEntry {
  label: string;
  color: string;
}

interface SliceDatum {
  key: string;
  city: string;
  timeOfDay: TimeOfDay;
  day: number;
  value: number;
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

  // Tweak: adjust canvas size here if the flawed donut should occupy more/less space.
  const chartWidth = chartConfig.dimensions.line.width;
  const chartHeight = 550;
  const innerRadius = flawedDonutConfig.innerRadius;
  const sliceOutline = flawedDonutConfig.sliceOutline;
  const labelColor = chartTheme.textPrimary;
  const legendStroke = chartTheme.textMuted;
  const labelFontSize = flawedDonutConfig.labelFontSize;

  const dayNumbers = Array.from(
    new Set(aggregated.flatMap((row) => row.daily.map((entry) => entry.day)))
  ).sort((a, b) => a - b);

  const daySlices: SliceDatum[][] = dayNumbers.map((day) =>
    flawedOrder.flatMap((time) =>
      aggregated
        .filter((row) => row.timeOfDay === time)
        .map((row) => {
          const dailyEntry = row.daily.find((entry) => entry.day === day);
          return {
            key: `${row.city}-${row.timeOfDay}-${day}`,
            city: row.city,
            timeOfDay: row.timeOfDay,
            day,
            value: dailyEntry?.value ?? 0,
          };
        })
    )
  );

  const svg = root
    .append('svg')
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('class', 'w-full h-auto')
    .attr('role', 'img');

  svg.append('title').text(translate('caseStudies:4.flawed.chartTitle'));
  svg.append('desc').text(translate('caseStudies:4.flawed.chartDescription'));

  const pieGroup = svg
    .append('g')
    .attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2 - 10})`);

  const pie = d3
    .pie<SliceDatum>()
    .sort((a, b) => flawedOrder.indexOf(a.timeOfDay) - flawedOrder.indexOf(b.timeOfDay))
    .value((d) => d.value);

  const ringThickness = 14;
  const ringData: d3.PieArcDatum<SliceDatum>[][] = [];

  daySlices.forEach((slicesForDay, index) => {
    const pieData = pie(slicesForDay);
    ringData.push(pieData);

    const ringInner = innerRadius + index * ringThickness;
    const ringOuter = ringInner + ringThickness;

    const ringArc = d3
      .arc<d3.PieArcDatum<SliceDatum>>()
      .innerRadius(ringInner)
      .outerRadius(ringOuter)
      .cornerRadius(flawedDonutConfig.cornerRadius);

    pieGroup
      .append('g')
      .attr('class', `ring ring-${index + 1}`)
      .selectAll<SVGPathElement, d3.PieArcDatum<SliceDatum>>('path.slice')
      .data(pieData)
      .join('path')
      .attr('class', 'slice')
      .attr('fill', (d) => flawedPalette[d.data.timeOfDay])
      .attr('stroke', sliceOutline)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.95)
      .attr('d', (d) => ringArc(d) ?? '');
  });

  const outerPieData = ringData[ringData.length - 1] ?? [];
  const outerInner = innerRadius + (ringData.length - 1) * ringThickness;
  const outerArc = d3
    .arc<d3.PieArcDatum<SliceDatum>>()
    .innerRadius(outerInner)
    .outerRadius(outerInner + ringThickness);

  pieGroup
    .selectAll<SVGTextElement, d3.PieArcDatum<SliceDatum>>('text.label')
    .data(outerPieData)
    .join('text')
    .attr('class', 'label')
    .attr('transform', (d) => {
      const [cx, cy] = outerArc.centroid(d);
      return `translate(${cx},${cy})`;
    })
    .attr('text-anchor', 'middle')
    .attr('fill', labelColor)
    .attr('font-size', labelFontSize)
    .attr('font-weight', 700)
    .text((d) => {
      const timeText = translate(`caseStudies:4.times.${d.data.timeOfDay}`);
      const cityText = translate(`caseStudies:4.cities.${d.data.city}`);
      return `${timeText} ${cityText}`;
    });

  const legendEntries: LegendEntry[] = [
    { label: translate('caseStudies:4.cities.Köln'), color: flawedPalette.abends },
    { label: translate('caseStudies:4.cities.Berlin'), color: flawedPalette.morgens },
    { label: translate('caseStudies:4.flawed.legendAverage'), color: flawedPalette.mittags },
    { label: translate('caseStudies:4.flawed.legendSalesPerDay'), color: chartTheme.grid },
    { label: translate('caseStudies:4.flawed.legendRingPerDay'), color: chartTheme.textMuted },
  ];

  const legend = svg
    .append('g')
    .attr('transform', `translate(${chartWidth / 2 - 300},${chartHeight - 60})`);

  legend
    .selectAll<SVGGElement, LegendEntry>('g.legend-item')
    .data(legendEntries)
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (_, index) => `translate(${index * 130}, 0)`)
    .each(function (d) {
      const group = d3.select(this);
      group
        .append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('rx', 5)
        .attr('fill', d.color)
        .attr('stroke', legendStroke)
        .attr('stroke-width', 0.6);

      group
        .append('text')
        .attr('x', 20)
        .attr('y', 11)
        .attr('fill', labelColor)
        .attr('font-size', labelFontSize)
        .text(d.label);
    });
}
