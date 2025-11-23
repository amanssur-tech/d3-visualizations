// src/hooks/useRandomizedBars.ts
/**
 * useRandomizedBars
 * Extracted logic from CaseStudy3RandomizedBars:
 *  - data loading
 *  - magnitude state and syncing
 *  - random interval updates
 *  - highlight window
 */

import { useEffect, useRef, useState } from 'react';

import caseStudy3Data from '../data/case-study03.json';
import { formatCityNameFactory } from '../utils/formatCityName';

import { useTranslator } from './useTranslator';

export interface CityDatum {
  city: string;
  value: number;
}

interface CaseStudy3Row {
  Stadt: string;
  Anzahl_Kebablaeden: number;
}

const UPDATE_INTERVAL = 3000;
const HIGHLIGHT_DURATION = 800;

export function useRandomizedBars() {
  const { translate } = useTranslator(['common', 'caseStudies']);

  const [data, setData] = useState<CityDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [magnitude, setMagnitude] = useState(5);
  const magnitudeRef = useRef(magnitude);

  const [highlightedCity, setHighlightedCity] = useState<string | null>(null);

  const updateIntervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

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

  /* Random interval updates */
  useEffect(() => {
    if (!hasData) return;

    if (updateIntervalRef.current != null) {
      clearInterval(updateIntervalRef.current);
    }

    const id = window.setInterval(() => {
      setData((prev) => {
        if (!prev.length) return prev;

        const delta = magnitudeRef.current;
        if (delta <= 0) return prev;

        const index = Math.floor(Math.random() * prev.length);
        const direction = Math.random() < 0.5 ? -1 : 1;

        const current = prev[index];
        if (!current) return prev;

        const adjustedValue = Math.max(0, current.value + direction * delta);

        const next = prev.map((row, i) => (i === index ? { ...row, value: adjustedValue } : row));

        setHighlightedCity(current.city);
        return next;
      });
    }, UPDATE_INTERVAL);

    updateIntervalRef.current = id;

    return () => {
      if (updateIntervalRef.current != null) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [hasData]);

  /* Highlight timeout */
  useEffect(() => {
    if (!highlightedCity) return;

    if (highlightTimeoutRef.current != null) {
      clearTimeout(highlightTimeoutRef.current);
    }

    const timeout = window.setTimeout(() => setHighlightedCity(null), HIGHLIGHT_DURATION);

    highlightTimeoutRef.current = timeout;

    return () => clearTimeout(timeout);
  }, [highlightedCity]);

  /* Cleanup entire hook */
  useEffect(() => {
    return () => {
      if (updateIntervalRef.current != null) {
        clearInterval(updateIntervalRef.current);
      }
      if (highlightTimeoutRef.current != null) {
        clearTimeout(highlightTimeoutRef.current);
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
