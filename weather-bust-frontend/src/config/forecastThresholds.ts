/**
 * Centralized Meteorological Threshold Configurations for Forecast Risk & Verification.
 * Eliminates magic numbers across the application and prepares for domain API calibration.
 */

export const FORECAST_THRESHOLDS = {
  /**
   * Trace rainfall threshold (mm). Forecasts at or below this value are considered "Zero Forecast".
   * In standard synoptic meteorology, <= 0.5mm is treated as non-accumulating / dry.
   */
  NEAR_ZERO_RAIN_THRESHOLD: 0.5,

  /**
   * Zero ensemble spread threshold (mm std dev). Spread at or below this indicates unanimous consensus.
   */
  ZERO_SPREAD_THRESHOLD: 0.5,

  /**
   * Meaningful observed rainfall threshold (mm).
   * Aligned with the India Meteorological Department (IMD) operational definition of a rainy day (>= 2.5mm).
   */
  MEANINGFUL_RAIN_THRESHOLD: 2.5,

  /**
   * Moderate rainfall threshold (mm).
   */
  MODERATE_RAIN_THRESHOLD: 15.0,

  /**
   * Heavy / catastrophic surprise rainfall threshold (mm).
   */
  HEAVY_RAIN_THRESHOLD: 35.0,

  /**
   * Hidden-risk error severity boundaries (absolute error in mm).
   */
  SEVERITY: {
    LOW_MAX: 10.0,      // < 10 mm
    MODERATE_MAX: 25.0, // 10 to 25 mm
    HIGH_MAX: 40.0,     // 25 to 40 mm
    // >= 40 mm is Severe
  },
} as const

export type HiddenRiskSeverity = 'low' | 'moderate' | 'high' | 'severe'

export function getHiddenRiskSeverity(absError: number): HiddenRiskSeverity {
  if (absError >= FORECAST_THRESHOLDS.SEVERITY.HIGH_MAX) return 'severe'
  if (absError >= FORECAST_THRESHOLDS.SEVERITY.MODERATE_MAX) return 'high'
  if (absError >= FORECAST_THRESHOLDS.SEVERITY.LOW_MAX) return 'moderate'
  return 'low'
}
