// src/charts/CaseStudy6StarRenderer.ts
/**
 * Radial "star plot" renderer for Case Study 6.
 * Each station becomes a polygon across five pollutant axes.
 * Hover highlights a single station and shows metric/value tooltip.
 */

import * as d3 from 'd3';

import { chartTheme } from '../theme/chartTheme';
import { createTooltip } from '../utils/tooltip';

import {
  CASE_STUDY_6_METRICS,
  getNetworkColor,
  type CaseStudy6Datum,
} from './CaseStudy6ParallelRenderer';

import type { TranslateFn } from '../i18n/translate';

interface StarRenderOptions {
  container: HTMLDivElement;
  data: CaseStudy6Datum[];
  translate: TranslateFn;
  metricLabels: Record<string, string>;
  formatNetwork: (network: string) => string;
}

const CONFIG = {
  dimensions: { width: 720, height: 520 },
  margins: { top: 40, right: 40, bottom: 40, left: 40 },
  ringCount: 5,
  polygonOpacity: 0.28,
  polygonHoverOpacity: 0.9,
};

export const renderCaseStudy6Star = ({
  container,
  data,
  translate,
  metricLabels,
  formatNetwork,
}: StarRenderOptions): (() => void) => {
  const root = d3.select(container);
  root.selectAll('*').remove();
  const tooltip = createTooltip();

  const { width, height } = CONFIG.dimensions;
  const margin = CONFIG.margins;
  const radius =
    Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;
  const center = { x: width / 2, y: height / 2 };

  const svgRoot = root
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svgRoot.append('title').text(translate('caseStudies:6.starPlot.title'));
  svgRoot.append('desc').text(translate('caseStudies:6.starPlot.description'));

  const svg = svgRoot.append('g').attr('transform', `translate(${center.x}, ${center.y})`);

  // Normalized 0-10 scale for radius
  const rScale = d3.scaleLinear().domain([0, 10]).range([0, radius]);

  /* ----------------------------- Grid rings + axes ----------------------------- */
  const angleStep = (Math.PI * 2) / CASE_STUDY_6_METRICS.length;

  const rings = d3.range(1, CONFIG.ringCount + 1);
  svg
    .append('g')
    .attr('class', 'rings')
    .selectAll('circle')
    .data(rings)
    .join('circle')
    .attr('r', (d) => (d / CONFIG.ringCount) * radius)
    .attr('fill', 'none')
    .attr('stroke', chartTheme.grid)
    .attr('stroke-opacity', 0.2);

  const axes = svg.append('g').attr('class', 'axes');
  CASE_STUDY_6_METRICS.forEach((metric, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const [x, y] = [Math.cos(angle) * radius, Math.sin(angle) * radius];

    axes
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', y)
      .attr('stroke', chartTheme.grid)
      .attr('stroke-opacity', 0.35);

    axes
      .append('text')
      .attr('x', x * 1.08)
      .attr('y', y * 1.08)
      .attr('text-anchor', x >= 0 ? 'start' : 'end')
      .attr('alignment-baseline', 'middle')
      .attr('fill', chartTheme.textPrimary)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .text(metricLabels[metric] ?? metric);
  });

  /* ----------------------------- Polygons ----------------------------- */
  const lineGenerator = d3
    .lineRadial<number>()
    .radius((value) => rScale(value))
    .angle((_value, i) => i * angleStep)
    .curve(d3.curveCardinalClosed.tension(0.5));

  const polygons = svg
    .append('g')
    .attr('class', 'polygons')
    .selectAll<SVGPathElement, CaseStudy6Datum>('path.station')
    .data(data, (d) => d.code)
    .join('path')
    .attr('class', 'station')
    .attr('fill', (d) => getNetworkColor(d.network))
    .attr('fill-opacity', CONFIG.polygonOpacity)
    .attr('stroke', (d) => getNetworkColor(d.network))
    .attr('stroke-width', 1.5)
    .attr('d', (d) => lineGenerator(CASE_STUDY_6_METRICS.map((metric) => d.values[metric])));

  /* ----------------------------- Interaction ----------------------------- */
  const reset = () => {
    polygons.attr('fill-opacity', CONFIG.polygonOpacity).attr('stroke-width', 1.5);
  };

  polygons
    .on('mouseenter', function (event, datum) {
      polygons.attr('fill-opacity', 0.08);
      d3.select<SVGPathElement, CaseStudy6Datum>(this)
        .raise()
        .attr('fill-opacity', CONFIG.polygonHoverOpacity)
        .attr('stroke-width', 2.4);

      const [mouseX, mouseY] = d3.pointer(event, svg.node());
      // Find nearest axis to show more specific value
      const angle = Math.atan2(mouseY, mouseX) + Math.PI / 2;
      const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
      const index = Math.round(normalizedAngle / angleStep) % CASE_STUDY_6_METRICS.length;
      const metricKey = CASE_STUDY_6_METRICS[index] ?? CASE_STUDY_6_METRICS[0]!;

      tooltip.show(
        translate('caseStudies:6.starPlot.tooltip', {
          name: datum.name,
          metric: metricLabels[metricKey] ?? metricKey,
          value: datum.values[metricKey].toFixed(1),
          network: formatNetwork(datum.network),
        }),
        event as MouseEvent
      );
    })
    .on('mousemove', (event) => {
      tooltip.move(event as MouseEvent);
    })
    .on('mouseleave', () => {
      tooltip.hide();
      reset();
    });

  return () => {
    tooltip.hide();
    root.selectAll('*').remove();
  };
};
