// src/hooks/useRandomizedBars.ts
/**
 * useRandomizedBars
 * Extracted logic from CaseStudy3RandomizedBars:
 *  - data loading
 *  - magnitude state and syncing
 *  - random interval updates
 *  - highlight window
 */

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import caseStudy3Data from '../data/case-study03.json';
import { formatCityNameFactory } from '../utils/formatCityName';

import { useTranslator } from './useTranslator';

export interface CityDatum {
  city: string;
  value: number;
}

interface UseRandomizedBarsResult {
  data: CityDatum[];
  loading: boolean;
  errorMessage: string | null;
  magnitude: number;
  setMagnitude: Dispatch<SetStateAction<number>>;
  highlightedCity: string | null;
  formatCityName: (name: string) => string;
}

interface CaseStudy3Row {
  Stadt: string;
  Anzahl_Kebablaeden: number;
}

// Central config for the randomized bars experiment (default magnitude, slider bounds, timings).
// Tweak these values to slow the updates, expand the slider, or soften the highlight window.
export const randomizedBarsConfig = {
  defaultMagnitude: 5,
  slider: {
    min: 0,
    max: 25,
    step: 0.1,
  },
  updateIntervalMs: 3000,
  highlightDurationMs: 800,
};

export function useRandomizedBars(): UseRandomizedBarsResult {
  const { translate } = useTranslator(['common', 'caseStudies']);

  const [data, setData] = useState<CityDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [magnitude, setMagnitude] = useState(randomizedBarsConfig.defaultMagnitude);
  const magnitudeRef = useRef(randomizedBarsConfig.defaultMagnitude);

  const [highlightedCity, setHighlightedCity] = useState<string | null>(null);

  const updateIntervalRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  const formatCityName = formatCityNameFactory(translate);

  /* Sync magnitude into ref */
  useEffect(() => {
    magnitudeRef.current = magnitude;
  }, [magnitude]);

  /* Load data */
  useEffect(() => {
    try {
      const mapped = (caseStudy3Data as CaseStudy3Row[]).map((row) => ({
        city: row.Stadt,
        value: row.Anzahl_Kebablaeden,
      }));
      setData(mapped);
      setErrorMessage(null);
    } catch {
      setErrorMessage(translate('common.errors.dataLoad'));
    } finally {
      setLoading(false);
    }
  }, [translate]);

  const hasData = data.length > 0;

  const applyRandomUpdate = (prev: CityDatum[]) => {
    if (!prev.length) return { next: prev, highlighted: null };

    const delta = magnitudeRef.current;
    if (delta <= 0) return { next: prev, highlighted: null };

    const index = Math.floor(Math.random() * prev.length);
    const direction = Math.random() < 0.5 ? -1 : 1;

    const current = prev[index];
    if (!current) return { next: prev, highlighted: null };

    const adjustedValue = Math.max(0, current.value + direction * delta);
    const next = prev.map((row, i) => (i === index ? { ...row, value: adjustedValue } : row));

    return { next, highlighted: current.city };
  };

  /* Random interval updates */
  useEffect(() => {
    if (!hasData) return;

    if (updateIntervalRef.current != null) {
      globalThis.clearInterval(updateIntervalRef.current);
    }

    const tick = () => {
      setData((prev) => {
        const { next, highlighted } = applyRandomUpdate(prev);
        if (highlighted) {
          setHighlightedCity(highlighted);
        }
        return next;
      });
    };

    const id = globalThis.setInterval(tick, randomizedBarsConfig.updateIntervalMs);

    updateIntervalRef.current = id;

    return () => {
      if (updateIntervalRef.current != null) {
        globalThis.clearInterval(updateIntervalRef.current);
      }
    };
  }, [hasData]);

  /* Highlight timeout */
  useEffect(() => {
    if (!highlightedCity) return;

    if (highlightTimeoutRef.current != null) {
      globalThis.clearTimeout(highlightTimeoutRef.current);
    }

    const timeout = globalThis.setTimeout(
      () => setHighlightedCity(null),
      randomizedBarsConfig.highlightDurationMs
    );

    highlightTimeoutRef.current = timeout;

    return () => clearTimeout(timeout);
  }, [highlightedCity]);

  /* Cleanup entire hook */
  useEffect(() => {
    return () => {
      if (updateIntervalRef.current != null) {
        globalThis.clearInterval(updateIntervalRef.current);
      }
      if (highlightTimeoutRef.current != null) {
        globalThis.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    errorMessage,
    magnitude,
    setMagnitude,
    highlightedCity,
    formatCityName,
  };
}
