import { useEffect } from 'react';

/**
 * Ensures a single tooltip root exists for D3 to reuse across charts.
 */
const Tooltip = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    let el = document.getElementById('global-tooltip-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-tooltip-root';
      el.className =
        'tooltip pointer-events-none rounded-2xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-neutral-900/80 dark:text-slate-100';
      el.setAttribute('role', 'tooltip');
      el.setAttribute('aria-hidden', 'true');
      el.style.opacity = '0';
      document.body.appendChild(el);
    }
    return () => {
      el?.parentNode?.removeChild(el);
    };
  }, []);

  return null;
};

export default Tooltip;
