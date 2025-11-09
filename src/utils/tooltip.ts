// tooltip.js
// Small reusable tooltip module for D3-based charts

import * as d3 from 'd3';

export function createTooltip(d3: typeof import('d3')) {
  const existing = d3.select('#global-tooltip-root');
  const tip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = (existing.empty()
    ? d3.select('body').append('div').attr('id', 'global-tooltip-root')
    : existing) as d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  tip.classed('tooltip', true)
    .attr('role', 'tooltip')
    .attr('aria-hidden', 'true')
    .style('opacity', 0);

  function show(html: string, event: MouseEvent) {
    tip.html(html)
      .style('left', `${event.pageX + 12}px`)
      .style('top', `${event.pageY + 12}px`)
      .attr('aria-hidden', 'false')
      .transition()
      .duration(120)
      .style('opacity', 1);
  }

  function move(event: MouseEvent) {
    tip.style('left', `${event.pageX + 12}px`).style('top', `${event.pageY + 12}px`);
  }

  function hide() {
    tip.transition().duration(120).style('opacity', 0).attr('aria-hidden', 'true');
  }

  return { show, move, hide, node: () => tip };
}
