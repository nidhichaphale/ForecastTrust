/**
 * Centralized Operational Alert Thresholds & Category Definitions.
 * Eliminates magic numbers and aligns alert generation with meteorologically sound criteria.
 */

export const ALERT_THRESHOLDS = {
  /**
   * Probability threshold (0.0 to 1.0) above which an advance forecast triggers an elevated Bust Probability warning.
   */
  HIGH_RISK_BUST_PROBABILITY: 0.65,

  /**
   * Critical bust probability threshold for emergency prioritization.
   */
  CRITICAL_BUST_PROBABILITY: 0.85,

  /**
   * Verified forecast error magnitude threshold (mm) triggering a Severe Forecast Bust alert.
   */
  SEVERE_BUST_ERROR_MM: 25.0,

  /**
   * Verified forecast error magnitude threshold (mm) triggering an Extreme / Critical Bust alert.
   */
  CRITICAL_BUST_ERROR_MM: 50.0,

  /**
   * Maximum ensemble spread (mm std dev) considered unanimous / near-zero spread.
   */
  HIDDEN_RISK_MAX_SPREAD_MM: 1.0,

  /**
   * Minimum realized rainfall (mm) required on a zero-spread forecast to qualify as a Hidden-Risk Bust.
   */
  HIDDEN_RISK_MIN_REALIZED_MM: 15.0,

  /**
   * Ensemble member standard deviation (mm) indicating extreme model divergence / high atmospheric uncertainty.
   */
  EXTREME_DIVERGENCE_SPREAD_MM: 18.0,

  /**
   * Ground truth observation ingest latency SLA (hours). Overdue observations trigger Data Quality alerts.
   */
  DATA_QUALITY_OBSERVATION_LATENCY_HOURS: 24,
} as const

export type AlertCategory =
  | 'severe_forecast_bust'
  | 'hidden_risk_zero_spread'
  | 'extreme_ensemble_divergence'
  | 'flash_convective_discrepancy'
  | 'high_bust_risk'
  | 'data_quality_missing_observation'

export const ALERT_TYPE_CONFIG: Record<
  AlertCategory,
  {
    label: string
    shortLabel: string
    description: string
    badgeColor: string
    iconColor: string
    defaultSeverity: 'low' | 'moderate' | 'high' | 'severe'
  }
> = {
  severe_forecast_bust: {
    label: 'Severe Forecast Bust',
    shortLabel: 'Forecast Bust',
    description: 'Realized precipitation substantially differed from model predictions beyond verified tolerance thresholds.',
    badgeColor: 'bg-red-500/15 text-red-300 border-red-500/40',
    iconColor: 'text-red-400',
    defaultSeverity: 'severe',
  },
  hidden_risk_zero_spread: {
    label: 'Hidden Risk / Zero-Spread',
    shortLabel: 'Hidden Risk',
    description: 'Ensemble exhibited unanimous zero-spread dry consensus yet significant localized precipitation occurred.',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    iconColor: 'text-amber-400',
    defaultSeverity: 'high',
  },
  extreme_ensemble_divergence: {
    label: 'Extreme Ensemble Divergence',
    shortLabel: 'Ens Divergence',
    description: 'High standard deviation across ensemble members indicating volatile atmospheric uncertainty.',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    iconColor: 'text-purple-400',
    defaultSeverity: 'high',
  },
  flash_convective_discrepancy: {
    label: 'Flash Convective Discrepancy',
    shortLabel: 'Convective Bust',
    description: 'Sudden localized mesoscale convective rainfall unpredicted by numerical synoptic guidance.',
    badgeColor: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
    iconColor: 'text-orange-400',
    defaultSeverity: 'severe',
  },
  high_bust_risk: {
    label: 'High Forecast Bust Risk',
    shortLabel: 'Advance Risk',
    description: 'ML model predicts elevated likelihood of forecast verification failure for upcoming valid dates.',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    iconColor: 'text-rose-400',
    defaultSeverity: 'high',
  },
  data_quality_missing_observation: {
    label: 'Data Quality / Ingest Gap',
    shortLabel: 'Data Quality',
    description: 'Ground truth observational records are missing beyond operational ingest latency thresholds.',
    badgeColor: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
    iconColor: 'text-yellow-400',
    defaultSeverity: 'moderate',
  },
}
