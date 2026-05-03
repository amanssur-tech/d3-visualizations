//  src/utils/chartExport.ts
/**
 * chartExport.ts
 * Centralized export helpers for all charts.
 * Provides shared SVG and PNG export handlers with consistent filenames.
 */

import { downloadPNG, downloadSVG } from './export';

export interface ChartExportHandlers {
  exportSvg: () => void;
  exportPng: () => void;
}

/**
 * createChartExportHandlers
 * Wraps downloadSVG and downloadPNG for any chart renderer.
 *
 * @param node - the root <svg> element
 * @param width - numeric width of the chart
 * @param height - numeric height of the chart
 * @param baseName - base filename without extension
 */
export function createChartExportHandlers(
  node: SVGSVGElement,
  width: number,
  height: number,
  baseName: string
): ChartExportHandlers {
  return {
    exportSvg: () => {
      downloadSVG(node, `${baseName}.svg`);
    },
    exportPng: () => {
      downloadPNG(node, width, height, `${baseName}.png`);
    },
  };
}
