import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from './utils';
import { navItemActive, navItemBase, navItemInactive } from './NavPill';

export type NavControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export const NavControlButton = forwardRef<HTMLButtonElement, NavControlButtonProps>(
  ({ active, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(navItemBase, active ? navItemActive : navItemInactive, className)}
      {...props}
    />
  )
);

NavControlButton.displayName = 'NavControlButton';

export default NavControlButton;
