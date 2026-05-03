/**
 * useD3.ts keeps D3 render logic aligned with React lifecycles by exposing a ref
 * that triggers the provided render callback after animations settle.
 * Improved version with better cleanup and consistent lifecycle management.
 */
import { useEffect, useRef, type RefObject } from 'react';

import { hideGlobalTooltip } from '../utils/tooltip';

/**
 * Pass a render callback that receives the container element and returns an optional cleanup function.
 */
export function useD3(
  renderChart: (container: HTMLElement) => void | (() => void)
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    hideGlobalTooltip();

    if (!ref.current) return undefined;

    const id = setTimeout(() => {
      const container = ref.current;
      if (!mounted || !container) return;
      const cleanup = renderChart(container);
      if (cleanup) {
        cleanupRef.current = cleanup;
      }
    }, 10);

    return () => {
      mounted = false;
      clearTimeout(id);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      hideGlobalTooltip();
    };
  }, [renderChart]);

  return ref;
}
