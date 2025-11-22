import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import caseStudy4Data from '../../data/case-study04.json';
import { chartConfig } from '../../utils/config';

type TimeOfDay = 'morgens' | 'mittags' | 'abends';

interface RawRow {
  Stadt: string;
  Tag: number | string;
  Zeit: TimeOfDay | string;
  Verkäufe: number;
}

interface AggregatedRow {
  city: string;
  timeOfDay: TimeOfDay;
  total: number;
  average: number;
}

interface DailyRow {
  city: string;
  day: number;
  timeOfDay: TimeOfDay;
  sales: number;
}

const timeOrder: readonly TimeOfDay[] = ['morgens', 'mittags', 'abends'];
const flawedOrder: readonly TimeOfDay[] = ['abends', 'morgens', 'mittags'];

const flawedPalette: Record<TimeOfDay, string> = {
  morgens: '#f59e0b',
  mittags: '#fbbf24',
  abends: '#f472b6',
};

const fixedPalette: Record<TimeOfDay, string> = {
  morgens: '#06b6d4',
  mittags: '#10b981',
  abends: '#6366f1',
};

const cityPalette: Record<string, string> = {
  Berlin: '#6366f1',
  Köln: '#0ea5e9',
};

const isTimeOfDay = (value: string): value is TimeOfDay => timeOrder.includes(value as TimeOfDay);

const CaseStudy4TimeOfDay = () => {
  const { t } = useTranslation(['caseStudies', 'common']);
  const flawedRef = useRef<HTMLDivElement | null>(null);
  const fixedRef = useRef<HTMLDivElement | null>(null);

  const translate = useCallback(
    (fullKey: string, options?: Record<string, unknown>): string => {
      const knownNamespaces = [
        'common',
        'navbar',
        'footer',
        'dashboard',
        'charts',
        'export',
        'tooltips',
        'caseStudies',
      ] as const;

      const tSafe = t as unknown as (key: string, opts?: Record<string, unknown>) => string;
      const [maybeNs, ...rest] = fullKey.split('.');
      if (maybeNs && rest.length > 0 && (knownNamespaces as readonly string[]).includes(maybeNs)) {
        const key = rest.join('.');
        return tSafe(key, { ns: maybeNs, ...(options ?? {}) });
      }

      return tSafe(fullKey, options);
    },
    [t]
  );

  const dailyRows = useMemo<DailyRow[]>(() => {
    const rows = caseStudy4Data as RawRow[];

    return rows
      .map((row) => {
        const day = Number(row.Tag);
        if (!Number.isFinite(day)) return null;
        const time = isTimeOfDay(row.Zeit) ? row.Zeit : 'mittags';
        return {
          city: row.Stadt || 'Unknown',
          day,
          timeOfDay: time,
          sales: Number(row.Verkäufe) || 0,
        };
      })
      .filter((row): row is DailyRow => row !== null)
      .sort((a, b) => {
        if (a.day === b.day) {
          if (a.city === b.city) {
            return timeOrder.indexOf(a.timeOfDay) - timeOrder.indexOf(b.timeOfDay);
          }
          return a.city.localeCompare(b.city);
        }
        return a.day - b.day;
      });
  }, []);

  const days = useMemo(
    () => Array.from(new Set(dailyRows.map((d) => d.day))).sort((a, b) => a - b),
    [dailyRows]
  );

  const cities = useMemo(() => Array.from(new Set(dailyRows.map((d) => d.city))), [dailyRows]);

  const dailyLookup = useMemo(() => {
    const map = new Map<string, number>();
    dailyRows.forEach((row) => {
      map.set(`${row.city}-${row.day}-${row.timeOfDay}`, row.sales);
    });
    return map;
  }, [dailyRows]);

  const getSales = useCallback(
    (city: string, day: number, time: TimeOfDay): number =>
      dailyLookup.get(`${city}-${day}-${time}`) ?? 0,
    [dailyLookup]
  );

  const aggregated = useMemo<AggregatedRow[]>(() => {
    const totals = new Map<string, { total: number; count: number }>();

    dailyRows.forEach((row) => {
      const key = `${row.city}-${row.timeOfDay}`;
      const current = totals.get(key) ?? { total: 0, count: 0 };
      totals.set(key, { total: current.total + row.sales, count: current.count + 1 });
    });

    const result: AggregatedRow[] = [];
    totals.forEach((value, key) => {
      const [city, timeOfDay] = key.split('-') as [string, TimeOfDay];
      result.push({
        city,
        timeOfDay,
        total: value.total,
        average: value.count ? value.total / value.count : 0,
      });
    });

    return result.sort((a, b) => {
      if (a.city === b.city) {
        return timeOrder.indexOf(a.timeOfDay) - timeOrder.indexOf(b.timeOfDay);
      }
      return a.city.localeCompare(b.city);
    });
  }, [dailyRows]);

  useEffect(() => {
    if (!flawedRef.current || !aggregated.length) return;

    const container = d3.select(flawedRef.current);
    container.selectAll('*').remove();

    const width = chartConfig.dimensions.line.width;
    const height = 420;

    const svg = container
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('class', 'w-full h-auto')
      .style('background', '#ffffff')
      .attr('role', 'img');

    svg.append('title').text(translate('caseStudies:4.flawed.chartTitle'));
    svg.append('desc').text(translate('caseStudies:4.flawed.chartDescription'));

    const pieGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2 - 10})`);

    const arc = d3
      .arc<AggregatedRow>()
      .innerRadius(60)
      .outerRadius(Math.min(width, height) / 2.4 + 30)
      .cornerRadius(18);

    const pie = d3
      .pie<AggregatedRow>()
      .sort((a, b) => flawedOrder.indexOf(a.timeOfDay) - flawedOrder.indexOf(b.timeOfDay))
      .value((d) => d.average);

    pieGroup
      .selectAll('path.slice')
      .data(pie(aggregated))
      .join('path')
      .attr('class', 'slice')
      .attr('fill', (d) => flawedPalette[d.data.timeOfDay])
      .attr('stroke', '#fef9c3')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)
      .attr('d', arc as never);

    pieGroup
      .selectAll('text.label')
      .data(pie(aggregated))
      .join('text')
      .attr('class', 'label')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#111827')
      .attr('font-size', 11)
      .attr('font-weight', 700)
      .text((d) => translate(`caseStudies:4.times.${d.data.timeOfDay}`));

    const legendData = [
      { label: translate('caseStudies:4.times.morgens'), color: flawedPalette.abends },
      { label: translate('caseStudies:4.times.mittags'), color: flawedPalette.morgens },
      { label: translate('caseStudies:4.times.abends'), color: flawedPalette.mittags },
    ];

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width / 2 - 140},${height - 70})`);

    legend
      .selectAll('g.legend-item')
      .data(legendData)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, index) => `translate(${index * 120}, 0)`)
      .call((group) => {
        group
          .append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('rx', 3)
          .attr('fill', (d) => d.color)
          .attr('stroke', '#1f2937')
          .attr('stroke-width', 0.6);
        group
          .append('text')
          .attr('x', 18)
          .attr('y', 10)
          .attr('fill', '#111827')
          .attr('font-size', 11)
          .text((d) => d.label);
      });
  }, [aggregated, translate]);

  useEffect(() => {
    if (!fixedRef.current || !dailyRows.length || !cities.length || !days.length) return;

    const container = d3.select(fixedRef.current);
    container.selectAll('*').remove();

    const width = chartConfig.dimensions.line.width;
    const height = 700;
    const margin = { top: 60, right: 180, bottom: 80, left: 70 };
    const bandHeight = 150;
    const bandGap = 60;
    const bandsTotalHeight = timeOrder.length * bandHeight + bandGap * (timeOrder.length - 1);

    const textColor = chartConfig.getVar('--color-text') ?? '#0f172a';
    const textSoft = chartConfig.getVar('--color-text-soft') ?? '#475569';
    const gridColor = chartConfig.getVar('--color-grid') ?? '#e2e8f0';
    const accent = chartConfig.getVar('--color-accent') ?? '#06b6d4';

    const innerWidth = width - margin.left - margin.right;
    const x = d3.scalePoint<number>().domain(days).range([0, innerWidth]).padding(0.3);

    const svg = container
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
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

    const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    timeOrder.forEach((time, index) => {
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            dailyRows.filter((d) => d.timeOfDay === time),
            (d) => d.sales
          ) ?? 1,
        ])
        .nice()
        .range([bandHeight, 0]);

      const band = root
        .append('g')
        .attr('class', 'time-band')
        .attr('transform', `translate(0, ${index * (bandHeight + bandGap)})`);

      band
        .append('rect')
        .attr('x', -16)
        .attr('y', -12)
        .attr('width', innerWidth + 32)
        .attr('height', bandHeight + 24)
        .attr('fill', '#ffffff')
        .attr('opacity', 0.4)
        .attr('stroke', gridColor)
        .attr('stroke-opacity', 0.35)
        .attr('rx', 18);

      const yGrid = d3
        .axisLeft(y)
        .ticks(4)
        .tickSize(-innerWidth)
        .tickFormat(() => '');

      band
        .append('g')
        .attr('class', 'grid')
        .call(yGrid)
        .selectAll('line')
        .attr('stroke', gridColor)
        .attr('stroke-opacity', 0.6)
        .attr('shape-rendering', 'crispEdges');

      const yAxisGroup = band
        .append('g')
        .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('.0f')));
      yAxisGroup
        .selectAll('text')
        .attr('fill', textSoft)
        .attr('font-size', 11)
        .attr('font-weight', 600);
      yAxisGroup.selectAll('path, line').attr('stroke', textSoft).attr('stroke-opacity', 0.25);

      band
        .append('text')
        .attr('x', -12)
        .attr('y', -18)
        .attr('fill', textColor)
        .attr('font-size', 13)
        .attr('font-weight', 700)
        .text(translate(`caseStudies:4.times.${time}`));

      const line = d3
        .line<{ day: number; value: number }>()
        .x((d) => x(d.day) ?? 0)
        .y((d) => y(d.value));

      cities.forEach((city) => {
        const values = days.map((day) => ({
          day,
          value: getSales(city, day, time),
        }));

        band
          .append('path')
          .datum(values)
          .attr('fill', 'none')
          .attr('stroke', cityPalette[city] ?? accent)
          .attr('stroke-width', 3)
          .attr('d', line);

        band
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

    const xAxisGroup = root
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
      .attr('y', height - 24)
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

    const legendData = cities.map((city) => ({
      label: city,
      color: cityPalette[city] ?? accent,
    }));

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 12},${margin.top})`);

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
      .call((group) => {
        group
          .append('rect')
          .attr('width', 16)
          .attr('height', 16)
          .attr('rx', 5)
          .attr('fill', (d) => d.color)
          .attr('stroke', accent)
          .attr('stroke-opacity', 0.35);
        group
          .append('text')
          .attr('x', 24)
          .attr('y', 12)
          .attr('fill', textSoft)
          .attr('font-size', 12)
          .attr('font-weight', 600)
          .text((d) => d.label);
      });
  }, [cities, dailyRows.length, days, getSales, translate]);

  const flawedPoints = useMemo(
    () => [
      translate('caseStudies:4.flawed.reasons.axis'),
      translate('caseStudies:4.flawed.reasons.colors'),
      translate('caseStudies:4.flawed.reasons.legend'),
      translate('caseStudies:4.flawed.reasons.order'),
      translate('caseStudies:4.flawed.reasons.aggregation'),
      translate('caseStudies:4.flawed.reasons.mapping'),
    ],
    [translate]
  );

  const fixedPoints = useMemo(
    () => [
      translate('caseStudies:4.fixed.reasons.baseline'),
      translate('caseStudies:4.fixed.reasons.palette'),
      translate('caseStudies:4.fixed.reasons.legend'),
      translate('caseStudies:4.fixed.reasons.structure'),
      translate('caseStudies:4.fixed.reasons.fullData'),
      translate('caseStudies:4.fixed.reasons.mapping'),
    ],
    [translate]
  );

  return (
    <motion.section
      className="mx-auto w-full max-w-4xl space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {translate('caseStudies:4.subtitle')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          {translate('caseStudies:4.title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {translate('caseStudies:4.description')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-700 dark:text-amber-200">
                {translate('caseStudies:4.flawed.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:4.flawed.title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:4.flawed.caption')}
              </p>
            </div>
            <span className="rounded-full border border-amber-300/70 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700 shadow-sm dark:border-amber-200/25 dark:bg-amber-400/15 dark:text-amber-200">
              {translate('caseStudies:4.flawed.badge')}
            </span>
          </div>
          <div
            ref={flawedRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-200">
              {translate('caseStudies:4.flawed.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {flawedPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-md dark:border-white/10 dark:bg-neutral-950/60 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
                {translate('caseStudies:4.fixed.label')}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {translate('caseStudies:4.fixed.title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {translate('caseStudies:4.fixed.caption')}
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/70 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700 shadow-sm dark:border-emerald-300/20 dark:bg-emerald-400/15 dark:text-emerald-100">
              {translate('caseStudies:4.fixed.badge')}
            </span>
          </div>
          <div
            ref={fixedRef}
            className="mt-4 rounded-2xl border border-white/50 bg-linear-to-b from-white/85 to-white/60 p-3 shadow-inner dark:border-white/10 dark:from-white/10 dark:to-transparent"
          />
          <div className="mt-4 rounded-2xl border border-white/50 bg-white/80 p-4 text-sm text-slate-700 shadow-inner dark:border-white/10 dark:bg-neutral-950/60 dark:text-slate-200">
            <p className="font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-200">
              {translate('caseStudies:4.fixed.listTitle')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {fixedPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CaseStudy4TimeOfDay;
