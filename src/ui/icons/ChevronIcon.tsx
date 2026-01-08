//  src/ui/icons/ChevronIcon.tsx
/**
 * ChevronIcon
 * A tiny reusable SVG chevron arrow used in dropdown toggles.
 */

import type { ReactElement } from 'react';

interface ChevronIconProps {
  rotated?: boolean;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

// Tweak: adjust default size/rotation classes here for dropdown chevron behavior.
const ChevronIcon = ({
  rotated = false,
  size = 14,
  strokeWidth = 2,
  className = '',
}: ChevronIconProps): ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${rotated ? 'rotate-180' : ''} transition-transform duration-200 ${className}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

export default ChevronIcon;
