/**
 * useD3.ts keeps D3 render logic aligned with React lifecycles by exposing a ref
 * that triggers the provided render callback after animations settle.
 */
import { useEffect, useRef, type RefObject } from 'react';

/**
 * Pass a render callback that receives the container element and optional cleanup function.
 */
export function useD3(
  renderChart: (container: HTMLElement) => void | (() => void)
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  /* ----------------------------- Run render callback when dependencies change ----------------------------- */
  useEffect(() => {
    let mounted = true;
    // Clear any previous render before drawing again
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (!ref.current) return undefined;

    // Small delay avoids layout thrash with React 19 + Framer Motion animations
    const id = setTimeout(() => {
      const container = ref.current;
      if (!mounted || !container) return;
      cleanupRef.current = renderChart(container) ?? null;
    }, 10);

    return () => {
      mounted = false;
      clearTimeout(id);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [renderChart]);

  return ref;
}
