/**
 * Hidden Risk & Zero-Spread Meteorological Verification Utilities.
 * Derived deterministically from centralized Stage 3 mock forecasts.
 * Domain Principle: High ensemble certainty (zero spread) can mask severe forecast failure.
 */

import type { Forecast, RegionId } from '../types'
import { FORECAST_THRESHOLDS, getHiddenRiskSeverity, type HiddenRiskSeverity } from '../config/forecastThresholds'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface HiddenRiskSummaryStats {
  totalForecasts: number
  zeroSpreadCount: number
  zeroForecastCount: number
  zeroBothCount: number
  hiddenRiskBustCount: number
  hiddenRiskRate: number           // (hiddenRiskBustCount / zeroBothCount) * 100
  avgHiddenRiskError: number        // mm
  maxObservedInZeroSpread: number   // mm
  affectedLocationsCount: number
  verifiedDryCount: number          // zero forecast + zero spread + observed == 0
}

export interface ZeroForecastOutcome {
  category: string
  description: string
  count: number
  percentage: number
  avgObserved: number
  maxObserved: number
  avgAbsError: number
  color: string
}

export interface SpreadDistributionBucket {
  label: string
  range: string
  count: number
  bustCount: number
  bustRate: number
  avgObserved: number
  color: string
}

export interface LocationHiddenRiskStats {
  locationId: string
  locationName: string
  state: string
  region: RegionId
  zeroSpreadCases: number
  zeroForecastCases: number
  hiddenRiskBusts: number
  hiddenRiskRate: number // %
  avgHiddenRiskError: number
  maxObservedRainfall: number
  latestDate: string | null
}

export interface RegionHiddenRiskStats {
  region: RegionId
  totalForecasts: number
  zeroSpreadCases: number
  zeroForecastCases: number
  hiddenRiskBusts: number
  hiddenRiskRate: number
  avgError: number
  maxObservedRainfall: number
}

export interface LeadDayHiddenRiskStats {
  leadDay: number
  zeroSpreadCount: number
  zeroForecastCount: number
  hiddenRiskBustCount: number
  hiddenRiskRate: number
  avgAbsError: number
}

export interface HiddenRiskTrendPoint {
  date: string
  zeroSpreadCount: number
  hiddenRiskBustCount: number
  hiddenRiskRate: number
  avgObserved: number
}

export interface SpreadConditionComparison {
  condition: 'Zero Spread (≤0.5mm)' | 'Non-Zero Spread (>0.5mm)'
  forecasts: number
  busts: number
  bustRate: number
  avgAbsError: number
  maxAbsError: number
  avgSpread: number
}

export interface ForecastConditionComparison {
  condition: 'Zero Forecast (≤0.5mm)' | 'Wet Forecast (>0.5mm)'
  forecasts: number
  busts: number
  bustRate: number
  avgAbsError: number
  maxObservedRainfall: number
}

export interface HiddenRiskScatterPoint {
  id: string
  locationName: string
  validDate: string
  leadDay: number
  forecastRainfall: number
  observedRainfall: number
  ensembleSpread: number
  forecastError: number
  bustStatus: string
  classification: string
  isZeroSpread: boolean
  isZeroForecast: boolean
  isHiddenRiskBust: boolean
  severity: HiddenRiskSeverity
}

// ─────────────────────────────────────────────
// CLASSIFICATION HELPERS
// ─────────────────────────────────────────────

export const isZeroForecast = (f: Forecast): boolean =>
  f.forecastRainfall <= FORECAST_THRESHOLDS.NEAR_ZERO_RAIN_THRESHOLD

export const isZeroSpread = (f: Forecast): boolean =>
  f.zeroSpread || f.ensembleSpread <= FORECAST_THRESHOLDS.ZERO_SPREAD_THRESHOLD

export const isMeaningfulRain = (f: Forecast): boolean =>
  f.observedRainfall >= FORECAST_THRESHOLDS.MEANINGFUL_RAIN_THRESHOLD

export const isHiddenRiskBust = (f: Forecast): boolean =>
  isZeroSpread(f) && isZeroForecast(f) && isMeaningfulRain(f) && f.bustStatus === 'bust'

export function getHiddenRiskClassification(f: Forecast): string {
  const zeroF = isZeroForecast(f)
  const zeroS = isZeroSpread(f)
  const rain = isMeaningfulRain(f)

  if (zeroF && zeroS && rain && f.bustStatus === 'bust') {
    return 'Hidden-Risk Bust'
  }
  if (zeroF && zeroS && f.observedRainfall > FORECAST_THRESHOLDS.NEAR_ZERO_RAIN_THRESHOLD && !rain) {
    return 'Marginal Drizzle Miss'
  }
  if (zeroF && zeroS && f.observedRainfall <= FORECAST_THRESHOLDS.NEAR_ZERO_RAIN_THRESHOLD) {
    return 'Verified Dry Consensus'
  }
  if (zeroF && !zeroS && rain) {
    return 'Unpredicted Convection'
  }
  if (zeroF && !zeroS) {
    return 'Uncertain Dry Forecast'
  }
  return 'Standard Wet Forecast'
}

const avg = (vals: number[]): number =>
  vals.length === 0 ? 0 : parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))

// ─────────────────────────────────────────────
// CALCULATION FUNCTIONS
// ─────────────────────────────────────────────

/** Summary metrics for the active filter set */
export function calculateHiddenRiskSummary(forecasts: Forecast[]): HiddenRiskSummaryStats {
  const zeroSpreadFcs = forecasts.filter(isZeroSpread)
  const zeroForecastFcs = forecasts.filter(isZeroForecast)
  const zeroBoth = forecasts.filter((f) => isZeroSpread(f) && isZeroForecast(f))
  const hiddenBusts = forecasts.filter(isHiddenRiskBust)

  const hiddenBustErrors = hiddenBusts.map((f) => Math.abs(f.forecastError))
  const zeroSpreadObserved = zeroSpreadFcs.map((f) => f.observedRainfall)
  const affectedLocations = new Set(hiddenBusts.map((f) => f.locationId))
  const verifiedDry = zeroBoth.filter((f) => f.observedRainfall <= FORECAST_THRESHOLDS.NEAR_ZERO_RAIN_THRESHOLD)

  return {
    totalForecasts: forecasts.length,
    zeroSpreadCount: zeroSpreadFcs.length,
    zeroForecastCount: zeroForecastFcs.length,
    zeroBothCount: zeroBoth.length,
    hiddenRiskBustCount: hiddenBusts.length,
    hiddenRiskRate: zeroBoth.length > 0 ? parseFloat(((hiddenBusts.length / zeroBoth.length) * 100).toFixed(1)) : 0,
    avgHiddenRiskError: avg(hiddenBustErrors),
    maxObservedInZeroSpread: zeroSpreadObserved.length > 0 ? Math.max(...zeroSpreadObserved) : 0,
    affectedLocationsCount: affectedLocations.size,
    verifiedDryCount: verifiedDry.length,
  }
}

/** Breakdown of outcomes when forecast is zero */
export function calculateZeroForecastOutcomes(forecasts: Forecast[]): ZeroForecastOutcome[] {
  const zeroFcs = forecasts.filter(isZeroForecast)
  const total = zeroFcs.length
  if (total === 0) return []

  const verifiedDry = zeroFcs.filter((f) => f.observedRainfall <= FORECAST_THRESHOLDS.NEAR_ZERO_RAIN_THRESHOLD)
  const traceDrizzle = zeroFcs.filter(
    (f) =>
      f.observedRainfall > FORECAST_THRESHOLDS.NEAR_ZERO_RAIN_THRESHOLD &&
      f.observedRainfall < FORECAST_THRESHOLDS.MEANINGFUL_RAIN_THRESHOLD
  )
  const moderateSurprise = zeroFcs.filter(
    (f) =>
      f.observedRainfall >= FORECAST_THRESHOLDS.MEANINGFUL_RAIN_THRESHOLD &&
      f.observedRainfall < FORECAST_THRESHOLDS.MODERATE_RAIN_THRESHOLD
  )
  const heavyBust = zeroFcs.filter((f) => f.observedRainfall >= FORECAST_THRESHOLDS.MODERATE_RAIN_THRESHOLD)

  const makeOutcome = (
    category: string,
    description: string,
    items: Forecast[],
    color: string
  ): ZeroForecastOutcome => {
    const obs = items.map((f) => f.observedRainfall)
    const errs = items.map((f) => Math.abs(f.forecastError))
    return {
      category,
      description,
      count: items.length,
      percentage: parseFloat(((items.length / total) * 100).toFixed(1)),
      avgObserved: avg(obs),
      maxObserved: obs.length > 0 ? Math.max(...obs) : 0,
      avgAbsError: avg(errs),
      color,
    }
  }

  return [
    makeOutcome('Verified Dry Spell', 'Observed ≤ 0.5mm: model was completely accurate', verifiedDry, '#22c55e'),
    makeOutcome('Trace / Marginal Drizzle', 'Observed 0.5–2.5mm: minor non-catastrophic moisture', traceDrizzle, '#38bdf8'),
    makeOutcome('Surprise Moderate Rain', 'Observed 2.5–15mm: unexpected shower, operational miss', moderateSurprise, '#f59e0b'),
    makeOutcome('Severe Hidden Bust', 'Observed ≥ 15mm: heavy surprise convection failure', heavyBust, '#ef4444'),
  ]
}

/** Ensemble spread distribution with bust breakdown */
export function calculateSpreadDistribution(forecasts: Forecast[]): SpreadDistributionBucket[] {
  const buckets = [
    { label: 'Zero / Near-Zero', range: '≤ 0.5 mm', min: 0, max: FORECAST_THRESHOLDS.ZERO_SPREAD_THRESHOLD, color: '#38bdf8' },
    { label: 'Low Spread', range: '0.5 – 3.0 mm', min: FORECAST_THRESHOLDS.ZERO_SPREAD_THRESHOLD, max: 3.0, color: '#22c55e' },
    { label: 'Medium Spread', range: '3.0 – 8.0 mm', min: 3.0, max: 8.0, color: '#f59e0b' },
    { label: 'High Spread', range: '> 8.0 mm', min: 8.0, max: Infinity, color: '#a855f7' },
  ]

  return buckets.map((b) => {
    const matching = forecasts.filter((f) => {
      const spread = f.ensembleSpread
      return spread >= b.min && (b.max === Infinity ? spread > b.min : spread < b.max || (b.min === 0 && spread <= b.max))
    })
    const busts = matching.filter((f) => f.bustStatus === 'bust')
    return {
      label: b.label,
      range: b.range,
      count: matching.length,
      bustCount: busts.length,
      bustRate: matching.length > 0 ? parseFloat(((busts.length / matching.length) * 100).toFixed(1)) : 0,
      avgObserved: avg(matching.map((f) => f.observedRainfall)),
      color: b.color,
    }
  })
}

/** Location breakdown for hidden risk cases */
export function calculateLocationHiddenRisk(forecasts: Forecast[]): LocationHiddenRiskStats[] {
  const byLoc = new Map<string, Forecast[]>()
  for (const f of forecasts) {
    const list = byLoc.get(f.locationId) ?? []
    list.push(f)
    byLoc.set(f.locationId, list)
  }

  return [...byLoc.entries()].map(([locId, fcs]) => {
    const zeroSpread = fcs.filter(isZeroSpread)
    const zeroForecast = fcs.filter(isZeroForecast)
    const zeroBoth = fcs.filter((f) => isZeroSpread(f) && isZeroForecast(f))
    const hiddenBusts = fcs.filter(isHiddenRiskBust)
    const hiddenErrors = hiddenBusts.map((f) => Math.abs(f.forecastError))
    const maxObs = zeroSpread.map((f) => f.observedRainfall)
    const bustDates = hiddenBusts.map((f) => f.validDate).sort()

    return {
      locationId: locId,
      locationName: fcs[0].locationName,
      state: fcs[0].state,
      region: fcs[0].region,
      zeroSpreadCases: zeroSpread.length,
      zeroForecastCases: zeroForecast.length,
      hiddenRiskBusts: hiddenBusts.length,
      hiddenRiskRate: zeroBoth.length > 0 ? parseFloat(((hiddenBusts.length / zeroBoth.length) * 100).toFixed(1)) : 0,
      avgHiddenRiskError: avg(hiddenErrors),
      maxObservedRainfall: maxObs.length > 0 ? Math.max(...maxObs) : 0,
      latestDate: bustDates.length > 0 ? bustDates[bustDates.length - 1] : null,
    }
  })
}

/** Regional aggregate statistics for hidden risk */
export function calculateRegionHiddenRisk(forecasts: Forecast[]): RegionHiddenRiskStats[] {
  const byRegion = new Map<RegionId, Forecast[]>()
  for (const f of forecasts) {
    const list = byRegion.get(f.region) ?? []
    list.push(f)
    byRegion.set(f.region, list)
  }

  return [...byRegion.entries()].map(([region, fcs]) => {
    const zeroSpread = fcs.filter(isZeroSpread)
    const zeroForecast = fcs.filter(isZeroForecast)
    const zeroBoth = fcs.filter((f) => isZeroSpread(f) && isZeroForecast(f))
    const hiddenBusts = fcs.filter(isHiddenRiskBust)
    const hiddenErrors = hiddenBusts.map((f) => Math.abs(f.forecastError))
    const maxObs = zeroSpread.map((f) => f.observedRainfall)

    return {
      region,
      totalForecasts: fcs.length,
      zeroSpreadCases: zeroSpread.length,
      zeroForecastCases: zeroForecast.length,
      hiddenRiskBusts: hiddenBusts.length,
      hiddenRiskRate: zeroBoth.length > 0 ? parseFloat(((hiddenBusts.length / zeroBoth.length) * 100).toFixed(1)) : 0,
      avgError: avg(hiddenErrors.length > 0 ? hiddenErrors : zeroSpread.map((f) => Math.abs(f.forecastError))),
      maxObservedRainfall: maxObs.length > 0 ? Math.max(...maxObs) : 0,
    }
  })
}

/** Lead-day breakdown across D+1 to D+10 */
export function calculateLeadDayHiddenRisk(forecasts: Forecast[]): LeadDayHiddenRiskStats[] {
  const byLd = new Map<number, Forecast[]>()
  for (const f of forecasts) {
    const list = byLd.get(f.leadDay) ?? []
    list.push(f)
    byLd.set(f.leadDay, list)
  }

  return [...byLd.entries()]
    .sort(([a], [b]) => a - b)
    .map(([leadDay, fcs]) => {
      const zeroSpread = fcs.filter(isZeroSpread)
      const zeroForecast = fcs.filter(isZeroForecast)
      const zeroBoth = fcs.filter((f) => isZeroSpread(f) && isZeroForecast(f))
      const hiddenBusts = fcs.filter(isHiddenRiskBust)
      const errors = hiddenBusts.map((f) => Math.abs(f.forecastError))

      return {
        leadDay,
        zeroSpreadCount: zeroSpread.length,
        zeroForecastCount: zeroForecast.length,
        hiddenRiskBustCount: hiddenBusts.length,
        hiddenRiskRate: zeroBoth.length > 0 ? parseFloat(((hiddenBusts.length / zeroBoth.length) * 100).toFixed(1)) : 0,
        avgAbsError: avg(errors.length > 0 ? errors : zeroSpread.map((f) => Math.abs(f.forecastError))),
      }
    })
}

/** Temporal trend for hidden risk cases */
export function calculateHiddenRiskTrend(forecasts: Forecast[]): HiddenRiskTrendPoint[] {
  const byDate = new Map<string, Forecast[]>()
  for (const f of forecasts) {
    const list = byDate.get(f.validDate) ?? []
    list.push(f)
    byDate.set(f.validDate, list)
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, fcs]) => {
      const zeroSpread = fcs.filter(isZeroSpread)
      const zeroBoth = fcs.filter((f) => isZeroSpread(f) && isZeroForecast(f))
      const hiddenBusts = fcs.filter(isHiddenRiskBust)
      return {
        date,
        zeroSpreadCount: zeroSpread.length,
        hiddenRiskBustCount: hiddenBusts.length,
        hiddenRiskRate: zeroBoth.length > 0 ? parseFloat(((hiddenBusts.length / zeroBoth.length) * 100).toFixed(1)) : 0,
        avgObserved: avg(zeroSpread.map((f) => f.observedRainfall)),
      }
    })
}

/** Comparison between zero-spread and non-zero spread forecasts */
export function calculateSpreadConditionComparison(forecasts: Forecast[]): SpreadConditionComparison[] {
  const zeroSpreadFcs = forecasts.filter(isZeroSpread)
  const nonZeroSpreadFcs = forecasts.filter((f) => !isZeroSpread(f))

  const toStats = (
    condition: 'Zero Spread (≤0.5mm)' | 'Non-Zero Spread (>0.5mm)',
    fcs: Forecast[]
  ): SpreadConditionComparison => {
    const busts = fcs.filter((f) => f.bustStatus === 'bust')
    const errors = fcs.map((f) => Math.abs(f.forecastError))
    return {
      condition,
      forecasts: fcs.length,
      busts: busts.length,
      bustRate: fcs.length > 0 ? parseFloat(((busts.length / fcs.length) * 100).toFixed(1)) : 0,
      avgAbsError: avg(errors),
      maxAbsError: errors.length > 0 ? Math.max(...errors) : 0,
      avgSpread: avg(fcs.map((f) => f.ensembleSpread)),
    }
  }

  return [toStats('Zero Spread (≤0.5mm)', zeroSpreadFcs), toStats('Non-Zero Spread (>0.5mm)', nonZeroSpreadFcs)]
}

/** Comparison between zero-forecast and non-zero forecast records */
export function calculateForecastConditionComparison(forecasts: Forecast[]): ForecastConditionComparison[] {
  const zeroFcs = forecasts.filter(isZeroForecast)
  const nonZeroFcs = forecasts.filter((f) => !isZeroForecast(f))

  const toStats = (
    condition: 'Zero Forecast (≤0.5mm)' | 'Wet Forecast (>0.5mm)',
    fcs: Forecast[]
  ): ForecastConditionComparison => {
    const busts = fcs.filter((f) => f.bustStatus === 'bust')
    const errors = fcs.map((f) => Math.abs(f.forecastError))
    const obs = fcs.map((f) => f.observedRainfall)
    return {
      condition,
      forecasts: fcs.length,
      busts: busts.length,
      bustRate: fcs.length > 0 ? parseFloat(((busts.length / fcs.length) * 100).toFixed(1)) : 0,
      avgAbsError: avg(errors),
      maxObservedRainfall: obs.length > 0 ? Math.max(...obs) : 0,
    }
  }

  return [toStats('Zero Forecast (≤0.5mm)', zeroFcs), toStats('Wet Forecast (>0.5mm)', nonZeroFcs)]
}

/** Scatter/point data for Spread vs Observed and Spread vs Error plots */
export function getHiddenRiskScatterData(forecasts: Forecast[]): HiddenRiskScatterPoint[] {
  return forecasts.map((f) => {
    const absErr = Math.abs(f.forecastError)
    const zeroS = isZeroSpread(f)
    const zeroF = isZeroForecast(f)
    const hiddenB = isHiddenRiskBust(f)
    return {
      id: f.id,
      locationName: f.locationName,
      validDate: f.validDate,
      leadDay: f.leadDay,
      forecastRainfall: f.forecastRainfall,
      observedRainfall: f.observedRainfall,
      ensembleSpread: f.ensembleSpread,
      forecastError: f.forecastError,
      bustStatus: f.bustStatus,
      classification: getHiddenRiskClassification(f),
      isZeroSpread: zeroS,
      isZeroForecast: zeroF,
      isHiddenRiskBust: hiddenB,
      severity: getHiddenRiskSeverity(absErr),
    }
  })
}

/** Extract top hidden-risk incident records */
export function getHiddenRiskCases(forecasts: Forecast[]): Forecast[] {
  return forecasts
    .filter((f) => isZeroSpread(f) && (isMeaningfulRain(f) || isZeroForecast(f)))
    .sort((a, b) => {
      // Prioritize hidden-risk busts first, then by observed rainfall descending
      const aBust = isHiddenRiskBust(a) ? 1 : 0
      const bBust = isHiddenRiskBust(b) ? 1 : 0
      if (aBust !== bBust) return bBust - aBust
      return b.observedRainfall - a.observedRainfall
    })
}
