// src/charts/CaseStudy6ParallelRenderer.ts
/**
 * Pure D3 renderer for the Case Study 6 parallel coordinates plot.
 * Renders one vertical axis per pollutant, draws a line per station,
 * and adds hover highlighting + tooltips. Update the config or label
 * helpers below to tweak sizing, palette, or interactivity.
 */

import * as d3 from 'd3';

import type { TranslateFn } from '../i18n/translate';
import { chartTheme } from '../theme/chartTheme';
import { createTooltip } from '../utils/tooltip';

export type CaseStudy6MetricKey =
  | 'fineDust'
  | 'carbonMonoxide'
  | 'ozone'
  | 'sulfurDioxide'
  | 'nitrogenDioxide';

export interface CaseStudy6Datum {
  network: string;
  code: string;
  name: string;
  environment: string;
  stationType: string;
  values: Record<CaseStudy6MetricKey, number>;
}

export const CASE_STUDY_6_METRICS: CaseStudy6MetricKey[] = [
  'fineDust',
  'carbonMonoxide',
  'ozone',
  'sulfurDioxide',
  'nitrogenDioxide',
];

const NETWORK_COLORS: Record<string, string> = {
  Bremen: '#0ea5e9',
  Hessen: '#22c55e',
  'Rheinland-Pfalz': '#a855f7',
};

export const getNetworkColor = (network: string) => NETWORK_COLORS[network] ?? '#6366f1';

interface ParallelRenderOptions {
  container: HTMLDivElement;
  data: CaseStudy6Datum[];
  translate: TranslateFn;
  metricOrder?: CaseStudy6MetricKey[];
  metricLabels: Record<CaseStudy6MetricKey, string>;
  formatNetwork: (network: string) => string;
  formatEnvironment: (environment: string) => string;
  formatStationType: (stationType: string) => string;
}

const CONFIG = {
  dimensions: { width: 1120, height: 540 },
  margins: { top: 36, right: 180, bottom: 44, left: 90 },
  lineWidth: 2.6,
  hoverWidth: 3.4,
};

export const renderCaseStudy6Parallel = ({
  container,
  data,
  translate,
  metricOrder = CASE_STUDY_6_METRICS,
  metricLabels,
  formatNetwork,
  formatEnvironment,
  formatStationType,
}: ParallelRenderOptions) => {
  const metrics = metricOrder.filter((metric) => metricLabels[metric]);
  if (!metrics.length) return () => {};

  const root = d3.select(container);
  root.selectAll('*').remove();

  const tooltip = createTooltip();
  const { width, height } = CONFIG.dimensions;
  const margin = CONFIG.margins;

  /* ----------------------------- SVG shell ----------------------------- */
  const svgRoot = root
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svgRoot.append('title').text(translate('caseStudies:6.chart.title'));
  svgRoot.append('desc').text(translate('caseStudies:6.chart.description'));

  const svg = svgRoot.append('g');

  /* ----------------------------- Scales ----------------------------- */
  const xScale = d3
    .scalePoint<CaseStudy6MetricKey>()
    .domain(metrics)
    .range([margin.left, width - margin.right])
    .padding(0.6);

  const yScales: Record<CaseStudy6MetricKey, d3.ScaleLinear<number, number>> = {} as Record<
    CaseStudy6MetricKey,
    d3.ScaleLinear<number, number>
  >;

  metrics.forEach((metric) => {
    const values = data.map((d) => d.values[metric]);
    const maxValue = Math.max(10, d3.max(values) ?? 0);
    yScales[metric] = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([height - margin.bottom, margin.top]);
  });

  /* ----------------------------- Axes + grid ----------------------------- */
  const axisGroups = svg
    .selectAll<SVGGElement, CaseStudy6MetricKey>('g.axis')
    .data(metrics)
    .join('g')
    .attr('class', 'axis')
    .attr('transform', (metric) => `translate(${xScale(metric) ?? 0},0)`);

  axisGroups
    .append('line')
    .attr('y1', margin.top - 6)
    .attr('y2', height - margin.bottom + 6)
    .attr('stroke', chartTheme.grid)
    .attr('stroke-opacity', 0.35);

  axisGroups.each(function (metric) {
    const axis = d3.axisLeft(yScales[metric]).ticks(5).tickSizeOuter(0);
    d3.select<SVGGElement, CaseStudy6MetricKey>(this).call(axis);
  });

  axisGroups.selectAll('text').attr('fill', chartTheme.textMuted).attr('font-size', 12);
  axisGroups.selectAll('path, line').attr('stroke', chartTheme.grid).attr('stroke-opacity', 0.4);

  axisGroups
    .append('text')
    .attr('y', margin.top - 14)
    .attr('text-anchor', 'middle')
    .attr('fill', chartTheme.textPrimary)
    .attr('font-size', 13)
    .attr('font-weight', 700)
    .text((metric) => metricLabels[metric]);

  /* ----------------------------- Legend ----------------------------- */
  const networks = Array.from(new Set(data.map((d) => d.network)));
  const legend = svg
    .append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - margin.right + 16},${margin.top})`);

  legend
    .selectAll('g.legend-item')
    .data(networks)
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (_network, index) => `translate(0, ${index * 22})`)
    .call((group) => {
      group
        .append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('rx', 3)
        .attr('fill', (network) => getNetworkColor(network));

      group
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .attr('fill', chartTheme.textPrimary)
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .text((network) => formatNetwork(network));
    });

  /* ----------------------------- Lines + points ----------------------------- */
  const lineGenerator = d3
    .line<[number, number]>()
    .x(([x]) => x)
    .y(([, y]) => y)
    .curve(d3.curveCatmullRom.alpha(0.6));

  const metricPositions = metrics.map((metric) => ({
    metric,
    x: xScale(metric) ?? 0,
  }));

  const lineGroup = svg.append('g').attr('class', 'station-lines');
  const lines = lineGroup
    .selectAll<SVGPathElement, CaseStudy6Datum>('path.station-line')
    .data(data, (d) => d.code)
    .join('path')
    .attr('class', 'station-line')
    .attr('fill', 'none')
    .attr('stroke', (d) => getNetworkColor(d.network))
    .attr('stroke-width', CONFIG.lineWidth)
    .attr('stroke-opacity', 0.9)
    .attr('d', (d) =>
      lineGenerator(
        metrics.map((metric) => [
          xScale(metric) ?? 0,
          yScales[metric](d.values[metric]),
        ]) as [number, number][]
      ) ?? ''
    );

  const points = svg
    .append('g')
    .attr('class', 'station-points')
    .selectAll<SVGGElement, CaseStudy6Datum>('g.point-group')
    .data(data, (d) => d.code)
    .join('g')
    .attr('class', 'point-group')
    .attr('fill', (d) => getNetworkColor(d.network))
    .attr('fill-opacity', 0.9)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5);

  points
    .selectAll<SVGCircleElement, { metric: CaseStudy6MetricKey; value: number; x: number }>(
      'circle.metric-point'
    )
    .data((d) =>
      metrics.map((metric) => ({
        metric,
        value: d.values[metric],
        x: xScale(metric) ?? 0,
      }))
    )
    .join('circle')
    .attr('class', 'metric-point')
    .attr('r', 3)
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => yScales[d.metric](d.value));

  /* ----------------------------- Interactions ----------------------------- */
  const resetLines = () => {
    lines.attr('stroke-opacity', 0.9).attr('stroke-width', CONFIG.lineWidth);
    points.attr('opacity', 1);
  };

  lines
    .on('mouseenter', function (_event, datum) {
      lines.attr('stroke-opacity', 0.12);
      d3.select<SVGPathElement, CaseStudy6Datum>(this)
        .raise()
        .attr('stroke-opacity', 1)
        .attr('stroke-width', CONFIG.hoverWidth);
      points.attr('opacity', 0.1);
      points
        .filter((pointDatum) => pointDatum.code === datum.code)
        .attr('opacity', 1)
        .raise();
    })
    .on('mousemove', (event, datum) => {
      const [mouseX] = d3.pointer(event);
      const nearest = metricPositions.reduce(
        (acc, curr) => {
          const distance = Math.abs(curr.x - mouseX);
          return distance < acc.distance ? { ...curr, distance } : acc;
        },
        { metric: metrics[0]!, distance: Number.POSITIVE_INFINITY }
      );

      const metricKey = nearest.metric;
      const html = translate('caseStudies:6.chart.tooltip', {
        name: datum.name,
        network: formatNetwork(datum.network),
        environment: formatEnvironment(datum.environment),
        stationType: formatStationType(datum.stationType),
        metric: metricLabels[metricKey],
        value: datum.values[metricKey].toFixed(1),
      });

      tooltip.show(html, event as MouseEvent);
    })
    .on('mouseleave', () => {
      tooltip.hide();
      resetLines();
    })
    .on('touchend', () => {
      tooltip.hide();
      resetLines();
    });

  svg
    .append('text')
    .attr('x', margin.left)
    .attr('y', height - margin.bottom / 2 + 12)
    .attr('fill', chartTheme.textMuted)
    .attr('font-size', 12)
    .text(translate('caseStudies:6.chart.note'));

  return () => {
    tooltip.hide();
    root.selectAll('*').remove();
  };
};
