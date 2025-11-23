import { NavLink, type NavLinkProps } from 'react-router-dom';

import { uiTokens } from './tokens';
import { cn } from './utils';

// Tweak: edit uiTokens.nav.* to restyle pill padding, glow, and states.
export const navItemBase = uiTokens.nav.item.base;
export const navItemActive = uiTokens.nav.item.active;
export const navItemInactive = uiTokens.nav.item.inactive;

export type NavPillProps = Omit<NavLinkProps, 'className'> & {
  className?: string;
};

export const NavPill = ({ className, ...props }: NavPillProps) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      cn(navItemBase, isActive ? navItemActive : navItemInactive, className)
    }
  />
);

export default NavPill;
