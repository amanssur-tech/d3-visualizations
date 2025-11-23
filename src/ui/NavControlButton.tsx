import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { navItemActive, navItemBase, navItemInactive } from './NavPill';
import { cn } from './utils';

export type NavControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export const NavControlButton = forwardRef<HTMLButtonElement, NavControlButtonProps>(
  ({ active, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      // Tweak: navItem* tokens define dropdown trigger padding + colors.
      className={cn(navItemBase, active ? navItemActive : navItemInactive, className)}
      {...props}
    />
  )
);

NavControlButton.displayName = 'NavControlButton';

export default NavControlButton;
