/**
 * tooltip.ts exposes minimal show/move/hide helpers while ensuring a shared tooltip node exists.
 */
import * as d3 from 'd3';

type TooltipSelection = d3.Selection<HTMLDivElement, unknown, HTMLElement | null, unknown>;

/* ----------------------------- Tooltip node factory ----------------------------- */
export const createTooltip = () => {
  const existing = d3.select<HTMLDivElement, unknown>('#global-tooltip-root');
  const tip: TooltipSelection = existing.empty()
    ? d3.select('body').append<HTMLDivElement>('div').attr('id', 'global-tooltip-root')
    : existing;

  tip
    .classed('tooltip', true)
    .attr('role', 'tooltip')
    .attr('aria-hidden', 'true')
    .style('opacity', 0);

  const show = (html: string, event: MouseEvent) => {
    tip
      .html(html)
      .style('left', `${event.pageX + 12}px`)
      .style('top', `${event.pageY + 12}px`)
      .attr('aria-hidden', 'false')
      .transition()
      .duration(120)
      .style('opacity', 1);
  };

  const move = (event: MouseEvent) => {
    tip.style('left', `${event.pageX + 12}px`).style('top', `${event.pageY + 12}px`);
  };

  const hide = () => {
    tip.transition().duration(120).style('opacity', 0).attr('aria-hidden', 'true');
  };

  return { show, move, hide, node: () => tip.node() };
};
