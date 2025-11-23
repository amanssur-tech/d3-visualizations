import { uiTokens } from './tokens';
import { cn } from './utils';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

type BadgeVariant = 'neutral' | 'soft';
type BadgeSize = 'sm' | 'xs';

export type BadgeProps<T extends ElementType = 'span'> = {
  as?: T;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

const baseClasses = 'inline-flex items-center font-semibold';

const variantClasses: Record<BadgeVariant, string> = {
  neutral: cn(
    uiTokens.badge.neutral.frame,
    uiTokens.badge.neutral.bg,
    uiTokens.badge.neutral.text,
    uiTokens.badge.neutral.shadow
  ),
  soft: cn(uiTokens.badge.soft.bg, uiTokens.badge.soft.text, uiTokens.badge.soft.shadow),
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: uiTokens.badge.size.sm,
  xs: uiTokens.badge.size.xs,
};

export const Badge = <T extends ElementType = 'span'>({
  as,
  variant = 'neutral',
  size = 'sm',
  className,
  ...props
}: BadgeProps<T>) => {
  const Component: ElementType = as ?? 'span';
  return (
    <Component
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
};

export default Badge;
