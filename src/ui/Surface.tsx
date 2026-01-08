import { uiTokens } from './tokens';
import { cn } from './utils';

import type { ComponentPropsWithoutRef, ElementType, ReactElement } from 'react';

type SurfaceVariant = 'panel' | 'card' | 'muted';
type SurfacePadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SurfaceProps<T extends ElementType = 'div'> = {
  as?: T;
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  elevated?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

// Tweak: choose new frame/blur/shadow tokens here to alter each surface style.
const variantClasses: Record<SurfaceVariant, string> = {
  panel: cn(
    uiTokens.surface.panel.frame,
    uiTokens.surface.panel.shadow,
    uiTokens.surface.panel.blur
  ),
  card: cn(uiTokens.surface.card.frame, uiTokens.surface.card.shadow, uiTokens.surface.card.blur),
  muted: cn(
    uiTokens.surface.muted.frame,
    uiTokens.surface.muted.shadow,
    uiTokens.surface.muted.blur
  ),
};

// Tweak: padding presets shared by panel sections—edit for different spacing ramps.
const paddingClasses: Record<SurfacePadding, string> = {
  none: uiTokens.surface.padding.none,
  xs: uiTokens.surface.padding.xs,
  sm: uiTokens.surface.padding.sm,
  md: uiTokens.surface.padding.md,
  lg: uiTokens.surface.padding.lg,
  xl: uiTokens.surface.padding.xl,
};

export const Surface = <T extends ElementType = 'div'>({
  as,
  variant = 'card',
  padding = 'md',
  elevated,
  className,
  ...props
}: SurfaceProps<T>): ReactElement => {
  const Component: ElementType = as ?? 'div';
  return (
    <Component
      className={cn(
        'relative transition-colors',
        variantClasses[variant],
        paddingClasses[padding],
        elevated ? uiTokens.surface.elevatedShadow : undefined,
        className
      )}
      {...props}
    />
  );
};

export default Surface;
