/**
 * tooltip.ts exposes minimal show/move/hide helpers while ensuring a shared tooltip node exists.
 * Improved version with better cleanup support for chart lifecycles.
 */
import * as d3 from 'd3';

type TooltipSelection = d3.Selection<HTMLDivElement, unknown, HTMLElement | null, unknown>;

interface TooltipApi {
  show: (html: string, event: MouseEvent) => void;
  move: (event: MouseEvent) => void;
  hide: () => void;
  node: () => HTMLDivElement | null;
  destroy: () => void;
}

let activeOwnerCount = 0;

const TOOLTIP_ID = 'global-tooltip-root';

const getOrCreateTooltip = (): TooltipSelection => {
  const existing = d3.select<HTMLDivElement, unknown>(`#${TOOLTIP_ID}`);
  if (existing.empty()) {
    const tip = d3
      .select('body')
      .append<HTMLDivElement>('div')
      .attr('id', TOOLTIP_ID)
      .classed('tooltip', true)
      .attr('role', 'tooltip')
      .attr('aria-hidden', 'true')
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('position', 'fixed')
      .style('z-index', '9999');
    return tip;
  }
  return existing;
};

export const createTooltip = (): TooltipApi => {
  activeOwnerCount++;

  const tip = getOrCreateTooltip();

  const show = (html: string, event: MouseEvent) => {
    tip
      .html(html)
      .style('left', `${event.pageX + 12}px`)
      .style('top', `${event.pageY + 12}px`)
      .attr('aria-hidden', 'false')
      .interrupt()
      .transition()
      .duration(120)
      .style('opacity', 1);
  };

  const move = (event: MouseEvent) => {
    tip.style('left', `${event.pageX + 12}px`).style('top', `${event.pageY + 12}px`);
  };

  const hide = () => {
    tip.interrupt().transition().duration(120).style('opacity', 0).attr('aria-hidden', 'true');
  };

  const destroy = () => {
    activeOwnerCount--;
    hide();
    if (activeOwnerCount <= 0) {
      const element = tip.node();
      if (element) {
        d3.select(element).remove();
      }
      activeOwnerCount = 0;
    }
  };

  const api: TooltipApi = {
    show,
    move,
    hide,
    node: () => tip.node(),
    destroy,
  };

  return api;
};

export const hideGlobalTooltip = (): void => {
  const existing = d3.select<HTMLDivElement, unknown>(`#${TOOLTIP_ID}`);
  if (!existing.empty()) {
    existing.interrupt().transition().duration(120).style('opacity', 0).attr('aria-hidden', 'true');
  }
};
