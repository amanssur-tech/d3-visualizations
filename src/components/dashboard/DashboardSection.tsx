// src/components/dashboard/DashboardSection.tsx
import { Surface } from '../../ui/Surface';

import type { ReactNode } from 'react';

/**
 * DashboardSection is a lightweight layout helper used inside Dashboard.tsx.
 * It provides a consistent spacing + styling wrapper for logical dashboard blocks
 * such as hero, featured case studies, methodology, tools, or CTA sections.
 *
 * Usage keeps the dashboard cleaner and more readable while avoiding repetition.
 */

interface DashboardSectionProps {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const DashboardSection = ({
  title,
  eyebrow,
  action,
  children,
  className,
}: DashboardSectionProps) => {
  const shouldRenderHeader = Boolean(eyebrow ?? title ?? action);

  return (
    // Tweak: shared panel chrome + padding for dashboard sections; pass className to override layout.
    <Surface as="section" variant="panel" padding="lg" className={className ?? ''}>
      {shouldRenderHeader && (
        // Tweak: header row spacing + alignment for section title/actions.
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            {eyebrow && (
              // Tweak: eyebrow typography (caps, tracking) for section label.
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                {eyebrow}
              </p>
            )}
            {title && (
              // Tweak: section title weight/size; edit text passed via props in Dashboard.tsx.
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Tweak: section body content renders here—wrap with grids/flex in parent if needed. */}
      <div>{children}</div>
    </Surface>
  );
};

export default DashboardSection;
