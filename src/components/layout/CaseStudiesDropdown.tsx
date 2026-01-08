// src/components/layout/CaseStudiesDropdown.tsx
/**
 * This component renders the animated dropdown panel with:
 * - Eyebrow label
 * - Case study links
 * - "View all" CTA
 *
 * It receives:
 * - translate: translation fn from Navbar
 * - caseStudyLinks: list of case studies
 * - closeDropdown: callback to close menu
 * - dropdownMenuRef: ref passed from Navbar
 * - dropdownId: for aria-controls linking
 */

import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import type { ReactElement, RefObject } from 'react';

// Tweak: edit case study ordering/paths here; translation keys resolve human-facing labels.
const caseStudyLinks = [
  {
    id: '1',
    labelKey: 'navbar.dropdown.items.1',
    to: '/case-studies/1-bar-chart-city-comparison',
  },
  {
    id: '2',
    labelKey: 'navbar.dropdown.items.2',
    to: '/case-studies/2-line-chart-city-trends',
  },
  {
    id: '3',
    labelKey: 'navbar.dropdown.items.3',
    to: '/case-studies/3-randomized-bar-variation',
  },
  {
    id: '4',
    labelKey: 'navbar.dropdown.items.4',
    to: '/case-studies/4-time-of-day-sales-flawed-corrected',
  },
  {
    id: '5',
    labelKey: 'navbar.dropdown.items.5',
    to: '/case-studies/5-dual-dumbbell-bubble-city-story',
  },
] as const;

interface CaseStudiesDropdownProps {
  translate: (key: string) => string;
  closeDropdown: () => void;
  dropdownMenuRef: RefObject<HTMLDivElement | null>;
  dropdownId: string;
}

const CaseStudiesDropdown = ({
  translate,
  closeDropdown,
  dropdownMenuRef,
  dropdownId,
}: CaseStudiesDropdownProps): ReactElement => {
  return (
    <motion.div
      id={dropdownId}
      ref={dropdownMenuRef}
      // Tweak: dropdown slide/opacity animation when entering/leaving the navbar.
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      // Tweak: floating panel positioning, sizing, and glassmorphism styling.
      className="absolute left-1/2 top-full mt-3 w-1/4 min-w-[20rem] -translate-x-1/2 rounded-[28px] border border-white/60 bg-white/80 pt-4 pl-3.5 shadow-[0_12px_40px_rgba(15,23,42,0.18)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/15 dark:bg-neutral-900/85 dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      {/* Tweak: eyebrow label copy for dropdown context lives here. */}
      <p className="px-4 pb-1.5 pt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
        {translate('navbar.dropdown.eyebrow')}
      </p>

      {caseStudyLinks.map((item) => (
        <NavLink
          key={item.id}
          to={item.to}
          // Tweak: individual link spacing/type ramp + hover translation.
          className="inline-flex w-full whitespace-nowrap px-4 pl-7 py-2 text-sm font-medium text-slate-900 transition-all duration-200 hover:-translate-y-px hover:text-slate-950 dark:text-slate-100 dark:hover:text-white"
          onClick={closeDropdown}
        >
          {translate(item.labelKey)}
        </NavLink>
      ))}

      <NavLink
        to="/case-studies"
        // Tweak: CTA row at bottom—change padding/font weight to emphasize differently.
        className="inline-flex w-full whitespace-nowrap px-4 py-3 pb-5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-px hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
        onClick={closeDropdown}
      >
        {translate('navbar.dropdown.viewAll')}
        <span className="ml-1 inline-block">↗</span>
      </NavLink>
    </motion.div>
  );
};

export default CaseStudiesDropdown;
