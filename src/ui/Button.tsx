import { uiTokens } from './tokens';
import { cn } from './utils';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pill' | 'icon';
type ButtonSize = 'md' | 'sm';

export type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

const baseClasses = cn(
  'inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60',
  uiTokens.utils.focusRing
);

const sizeClasses: Record<ButtonSize, string> = {
  md: uiTokens.button.size.md,
  sm: uiTokens.button.size.sm,
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    uiTokens.button.primary.bg,
    uiTokens.button.primary.text,
    uiTokens.button.primary.shadow,
    uiTokens.utils.lift,
    uiTokens.button.primary.hover,
    uiTokens.button.primary.disabled
  ),
  secondary: cn(
    uiTokens.button.secondary.border,
    uiTokens.button.secondary.bg,
    uiTokens.button.secondary.text,
    uiTokens.button.secondary.shadow,
    uiTokens.utils.lift,
    uiTokens.button.secondary.hover
  ),
  ghost: cn(
    uiTokens.button.ghost.border,
    uiTokens.button.ghost.text,
    uiTokens.button.ghost.shadow,
    uiTokens.utils.lift,
    uiTokens.button.ghost.hover
  ),
  pill: cn(
    uiTokens.button.pill.shape,
    uiTokens.utils.lift,
    uiTokens.button.pill.text,
    uiTokens.button.pill.hover
  ),
  icon: cn(
    uiTokens.button.icon.shape,
    uiTokens.button.icon.border,
    uiTokens.button.icon.size,
    uiTokens.button.icon.text,
    'transition-all duration-200',
    uiTokens.button.icon.shadow,
    uiTokens.button.icon.hover
  ),
};

export const Button = <T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  ...props
}: ButtonProps<T>) => {
  const Component: ElementType = as ?? 'button';
  const shouldApplySize = variant !== 'pill' && variant !== 'icon';
  const isButtonElement = typeof Component === 'string' && Component === 'button';
  const hasTypeProp = Object.prototype.hasOwnProperty.call(props, 'type');
  const resolvedProps = isButtonElement && !hasTypeProp ? { ...props, type: 'button' } : props;
  return (
    <Component
      className={cn(
        baseClasses,
        shouldApplySize ? sizeClasses[size] : undefined,
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...resolvedProps}
    />
  );
};

export default Button;
