// src/charts/caseStudy3Palette.ts
/**
 * Shared palette helpers so Case Study 1 + Case Study 3 reuse identical city colors.
 * Colors are derived from the Case Study 3 dataset order using the Viridis scale.
 */

import * as d3 from 'd3';

import caseStudy3Data from '../data/case-study03.json';

interface CaseStudy3Row {
  Stadt: string;
}

export interface CaseStudy3CityGradient {
  base: string;
  gradientTop: string;
  gradientBottom: string;
}

const cityOrder = (caseStudy3Data as CaseStudy3Row[]).map((row) => row.Stadt);
const domainMax = Math.max(cityOrder.length - 1, 1);

const colorFromIndex = (index: number) => {
  if (!Number.isFinite(index) || domainMax === 0) {
    return d3.interpolateViridis(0.5);
  }
  const normalized = Math.min(Math.max(index, 0), domainMax) / domainMax;
  return d3.interpolateViridis(normalized);
};

const createGradient = (index: number): CaseStudy3CityGradient => {
  const base = colorFromIndex(index);
  const parsed = d3.color(base);
  const gradientTop = parsed ? parsed.brighter(0.8).formatHex() : base;
  const gradientBottom = parsed ? parsed.darker(0.8).formatHex() : base;
  return {
    base: parsed ? parsed.formatHex() : base,
    gradientTop,
    gradientBottom,
  };
};

const gradientMap = new Map<string, CaseStudy3CityGradient>();
cityOrder.forEach((city, index) => {
  gradientMap.set(city, createGradient(index));
});

export const caseStudy3CityOrder = cityOrder;
export const caseStudy3CityGradients = gradientMap;

export const getCaseStudy3CityGradient = (city: string): CaseStudy3CityGradient | undefined =>
  gradientMap.get(city);

export const generateCaseStudy3GradientFromIndex = (index: number): CaseStudy3CityGradient =>
  createGradient(index);
