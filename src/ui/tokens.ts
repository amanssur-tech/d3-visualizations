// Semantic tokens grouped by component roles for easier maintenance.
export const uiTokens = {
  // Button tokens cover shared sizing plus variant styling.
  button: {
    size: {
      md: 'rounded-2xl px-5 py-3 text-sm',
      sm: 'rounded-xl px-4 py-2.5 text-sm',
    },
    primary: {
      bg: 'bg-teal-500',
      text: 'text-white',
      hover: 'hover:bg-cyan-700',
      shadow: 'shadow-lg shadow-cyan-600/40',
      disabled: 'disabled:hover:translate-y-0 disabled:hover:bg-cyan-600',
    },
    secondary: {
      border: 'border border-slate-200/80 dark:border-white/10',
      bg: 'bg-white/70 dark:bg-white/5',
      text: 'text-slate-700 dark:text-slate-200',
      hover: 'hover:border-white hover:text-slate-900 dark:hover:border-white/30 dark:hover:text-white',
      shadow: 'shadow-sm shadow-slate-200/60 dark:shadow-black/40',
    },
    ghost: {
      border: 'border border-slate-200/70 dark:border-white/10',
      text: 'text-slate-600 dark:text-slate-100',
      hover: 'hover:border-slate-300 hover:text-slate-900 dark:hover:border-white/30 dark:hover:text-white',
      shadow: 'shadow-sm shadow-slate-200/60 dark:shadow-black/40',
    },
    pill: {
      shape: 'rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
      text: 'text-slate-600 dark:text-slate-300',
      hover: 'hover:bg-white/60 hover:text-slate-900 hover:shadow-md dark:hover:bg-white/10 dark:hover:text-white',
    },
    icon: {
      shape: 'rounded-full',
      size: 'h-9 w-9',
      border: 'border border-slate-200/70 dark:border-white/10',
      text: 'text-slate-500 dark:text-slate-100',
      hover: 'hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:hover:border-white/40',
      shadow: 'shadow-sm shadow-slate-200/60 dark:shadow-black/40 hover:shadow-md',
    },
  },
  // Surface tokens define glassmorphic shells used across panels.
  surface: {
    panel: {
      frame: 'rounded-3xl border border-white/70 bg-white/80 dark:border-white/10 dark:bg-neutral-950/70',
      shadow: 'shadow-lg shadow-slate-900/5',
      blur: 'backdrop-blur',
    },
    card: {
      frame: 'rounded-2xl border border-white/70 bg-white/80 dark:border-white/10 dark:bg-neutral-950/70',
      shadow: 'shadow-lg shadow-slate-900/5',
      blur: 'backdrop-blur',
    },
    muted: {
      frame: 'rounded-2xl border border-white/60 bg-white/70 dark:border-white/10 dark:bg-neutral-900/60',
      shadow: 'shadow-inner shadow-slate-900/5',
      blur: 'backdrop-blur',
    },
    padding: {
      none: '',
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
      xl: 'px-6 py-10',
    },
    elevatedShadow: 'shadow-xl shadow-slate-900/5',
  },
  // Badge tokens keep metadata pills consistent.
  badge: {
    neutral: {
      frame: 'border border-white/70 dark:border-white/10',
      bg: 'bg-white/60 dark:bg-white/10',
      text: 'text-slate-600 dark:text-slate-200',
      shadow: 'shadow-sm shadow-slate-200/60 dark:shadow-black/40',
    },
    soft: {
      bg: 'bg-white/70 dark:bg-white/10',
      text: 'text-slate-600 dark:text-slate-200',
      shadow: 'shadow-sm shadow-slate-200/60 dark:shadow-black/30',
    },
    size: {
      sm: 'rounded-full px-3 py-1 text-xs',
      xs: 'rounded-full px-3 py-1 text-[11px]',
    },
  },
  // Navigation tokens describe pills shared between nav links and buttons.
  nav: {
    item: {
      base: 'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 dark:focus-visible:ring-cyan-400/50',
      active: 'bg-white/70 text-slate-900 shadow dark:bg-neutral-900/70 dark:text-white',
      inactive:
        'text-slate-600 hover:text-slate-900 hover:bg-white/40 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5',
    },
  },
  // Cross-cutting interaction helpers.
  utils: {
    focusRing:
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500',
    lift: 'hover:-translate-y-0.5',
  },
} as const;

export type UiTokens = typeof uiTokens;
