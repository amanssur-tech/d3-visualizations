// src/hooks/useTimeOfDayData.ts
/**
 * useTimeOfDayData
 * Extracts all data preparation logic from CaseStudy4:
 *  - raw normalization
 *  - daily rows
 *  - aggregated rows
 *  - lookup helpers
 *  - derived arrays (days, cities)
 */

import { useMemo } from 'react';

import caseStudy4Data from '../data/case-study04.json';

export type TimeOfDay = 'morgens' | 'mittags' | 'abends';

interface RawRow {
  Stadt: string;
  Tag: number | string;
  Zeit: string;
  Verkäufe: number;
}

export interface DailyRow {
  city: string;
  day: number;
  timeOfDay: TimeOfDay;
  sales: number;
}

export interface DailyValue {
  day: number;
  value: number;
}

export interface AggregatedRow {
  city: string;
  timeOfDay: TimeOfDay;
  total: number;
  average: number;
  daily: DailyValue[];
}

// Tweak: change ordering here to rearrange the vertical stack of Case Study 4 bands.
const timeOrder: readonly TimeOfDay[] = ['morgens', 'mittags', 'abends'];

const isTimeOfDay = (value: string): value is TimeOfDay => timeOrder.includes(value as TimeOfDay);

export function useTimeOfDayData() {
  /* Normalize CSV rows */
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
      .filter((r): r is DailyRow => r !== null)
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

  /* Derived arrays */
  const days = useMemo(
    () => Array.from(new Set(dailyRows.map((d) => d.day))).sort((a, b) => a - b),
    [dailyRows]
  );

  const cities = useMemo(() => Array.from(new Set(dailyRows.map((d) => d.city))), [dailyRows]);

  /* Lookup for fast sales retrieval */
  const dailyLookup = useMemo(() => {
    const map = new Map<string, number>();
    dailyRows.forEach((row) => {
      map.set(`${row.city}-${row.day}-${row.timeOfDay}`, row.sales);
    });
    return map;
  }, [dailyRows]);

  const getSales = (city: string, day: number, time: TimeOfDay): number =>
    dailyLookup.get(`${city}-${day}-${time}`) ?? 0;

  /* Aggregated rows (per city, per timeOfDay) */
  const aggregated = useMemo<AggregatedRow[]>(() => {
    interface Bucket {
      total: number;
      count: number;
      daily: Map<number, number>;
    }

    const totals = new Map<string, Bucket>();

    dailyRows.forEach((row) => {
      const key = `${row.city}-${row.timeOfDay}`;
      const current = totals.get(key) ?? {
        total: 0,
        count: 0,
        daily: new Map<number, number>(),
      };
      current.total += row.sales;
      current.count += 1;
      current.daily.set(row.day, (current.daily.get(row.day) ?? 0) + row.sales);
      totals.set(key, current);
    });

    const result: AggregatedRow[] = [];
    totals.forEach((value, key) => {
      const [city, timeOfDay] = key.split('-') as [string, TimeOfDay];
      const daily = Array.from(value.daily.entries())
        .map(([day, amount]) => ({ day, value: amount }))
        .sort((a, b) => a.day - b.day);

      result.push({
        city,
        timeOfDay,
        total: value.total,
        average: value.count ? value.total / value.count : 0,
        daily,
      });
    });

    return result.sort((a, b) => {
      if (a.city === b.city) {
        return timeOrder.indexOf(a.timeOfDay) - timeOrder.indexOf(b.timeOfDay);
      }
      return a.city.localeCompare(b.city);
    });
  }, [dailyRows]);

  return {
    timeOrder,
    dailyRows,
    aggregated,
    days,
    cities,
    getSales,
  };
}
