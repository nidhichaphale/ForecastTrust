/**
 * Design tokens and theme constants for Weather Forecast Bust Detection UI.
 * Establishes consistent visual identity for scientific/weather SaaS design.
 */

export const THEME_COLORS = {
  // Primary dark navy palette
  background: {
    primary: '#060d19',    // Deepest navy
    secondary: '#0b172a',  // Dark navy container / sidebar / header
    elevated: '#10213d',   // Card / panel surface
    border: '#1a2e4c',     // Subdued navy border
    hover: '#172c50',      // Navigation / interactive hover
    active: '#1e3860',     // Active state
  },
  // Brand accents
  accent: {
    sky: '#38bdf8',        // Sky blue
    cyan: '#06b6d4',       // Cyan accent
    blue: '#2563eb',       // Deep vibrant blue
    ice: '#e0f2fe',        // Ice highlight
  },
  // Cool neutral grays
  text: {
    primary: '#f8fafc',    // Crisp white
    secondary: '#94a3b8',  // Cool muted slate
    tertiary: '#64748b',   // Subdued slate
    muted: '#475569',      // Subtle caption
  },
  // Semantic risk levels
  risk: {
    low: {
      label: 'Low Risk',
      color: '#10b981',       // Green
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dotClass: 'bg-emerald-400',
    },
    moderate: {
      label: 'Moderate Risk',
      color: '#f59e0b',       // Amber / Yellow
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dotClass: 'bg-amber-400',
    },
    high: {
      label: 'High Risk',
      color: '#f97316',       // Orange
      bg: 'rgba(249, 115, 22, 0.12)',
      border: 'rgba(249, 115, 22, 0.3)',
      badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      dotClass: 'bg-orange-400',
    },
    severe: {
      label: 'Severe Risk',
      color: '#ef4444',       // Red
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
      badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
      dotClass: 'bg-red-400',
    },
  },
} as const;

export type RiskLevel = keyof typeof THEME_COLORS.risk;

export const TYPOGRAPHY = {
  pageTitle: 'text-2xl sm:text-3xl font-bold tracking-tight text-white',
  sectionTitle: 'text-lg sm:text-xl font-semibold text-slate-100',
  cardTitle: 'text-base font-semibold text-slate-200',
  largeMetric: 'text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono',
  body: 'text-sm text-slate-300 leading-relaxed',
  supporting: 'text-xs text-slate-400',
  label: 'text-xs font-medium text-slate-400 uppercase tracking-wider',
  navText: 'text-sm font-medium',
} as const;

export const RADIUS = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
} as const;
