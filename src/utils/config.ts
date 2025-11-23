/**
 * config.ts centralizes common chart dimensions, margins, animations, and palettes
 * so components can stay readable without re-declaring base values.
 */
export const chartConfig = {
  // Tweak: adjust shared bar/line margins to create more breathing room.
  margins: {
    bar: { top: 45, right: 30, bottom: 50, left: 70 },
    line: { top: 40, right: 100, bottom: 50, left: 70 },
  },

  // Tweak: update canonical width/height for each chart renderer.
  dimensions: {
    bar: { width: 720, height: 420 },
    line: { width: 860, height: 440 },
  },

  // Tweak: central animation durations (ms) applied across D3 transitions.
  animation: {
    barGrow: 800,
    lineDrawIn: 1000,
    hover: 200,
  },

  // Tweak: Catmull-Rom alpha for line smoothing.
  curves: {
    smooth: 0.5, // Catmull-Rom alpha value for smooth curves
  },

  // Tweak: base radii/padding for chart primitives.
  elements: {
    pointRadius: 5,
    barPadding: 0.2,
  },

  // Tweak: override or expand this map to recolor per-city series.
  cityColors: {
    Köln: '--color-koeln',
    Berlin: '--color-berlin',
  },
};
