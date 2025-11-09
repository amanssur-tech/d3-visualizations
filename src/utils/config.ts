// Shared chart configuration options for consistent styling and behavior
export const chartConfig = {
  // Common margins for charts
  margins: {
    bar: { top: 45, right: 30, bottom: 50, left: 70 },
    line: { top: 40, right: 100, bottom: 50, left: 70 }
  },

  // Standard dimensions for different chart types
  dimensions: {
    bar: { width: 720, height: 420 },
    line: { width: 860, height: 440 }
  },

  // Animation durations (in milliseconds)
  animation: {
    barGrow: 800,
    lineDrawIn: 1000,
    hover: 200
  },

  // D3 curve types for line charts
  curves: {
    smooth: 0.5 // Catmull-Rom alpha value for smooth curves
  },

  // Chart element sizes
  elements: {
    pointRadius: 5,
    barPadding: 0.2
  },

  // Helper to get CSS variables with fallbacks
  getVar: (name: string): string => {
    if (typeof window === 'undefined') return '';
    const safeGet = (el: HTMLElement | null): string =>
      el ? getComputedStyle(el).getPropertyValue(name).trim() : '';
    const rootVal = safeGet(document.documentElement);
    if (rootVal) return rootVal;
    const chartEl = (document.querySelector('.chart-container') as HTMLElement) || document.body;
    const chartVal = safeGet(chartEl);
    if (chartVal) return chartVal;
    return safeGet(document.body);
  },

  // City-specific colors (using CSS variables)
  cityColors: {
    "Köln": '--color-koeln',
    "Berlin": '--color-berlin'
  }
};
