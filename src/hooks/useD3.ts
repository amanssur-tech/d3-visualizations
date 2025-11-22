import { useEffect, useRef, type DependencyList } from 'react';

/**
 * Small helper hook that wires D3 render logic into React components.
 * Pass a render callback that receives the container element and returns an optional cleanup function.
 */
export function useD3(
  renderChart: (container: HTMLElement) => void | (() => void),
  dependencies: DependencyList = []
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;
    // Clear previous render safely
    if (cleanupRef.current) {
      console.log('[useD3] running previous cleanup');
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (!ref.current) return undefined;

    // Add a small delay to avoid race conditions with React 19 and Framer Motion
    const id = setTimeout(() => {
      const container = ref.current;
      if (!mounted || !container) return;
      console.log('[useD3] render callback firing');
      cleanupRef.current = renderChart(container) ?? null;
    }, 10);

    return () => {
      mounted = false;
      clearTimeout(id);
      if (cleanupRef.current) {
        console.log('[useD3] cleanup');
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
}
