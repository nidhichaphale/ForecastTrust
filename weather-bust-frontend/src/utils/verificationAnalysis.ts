/**
 * Verification & Analysis Calculation Utilities
 * Pure deterministic functions deriving verification statistics from centralized mock data.
 * Adheres strictly to meteorological verification standards (MAE, Bias, RMSE, Lead-Time Decay).
 */

import type { Forecast, RegionId, ModelMetric, FeatureImportance, HistoricalStatistic } from '../types'
import { getModelMetrics, getFeatureImportance, getHistoricalData } from '../mock'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface VerificationSummaryMetrics {
  totalForecasts: number
  mae: number               // Mean Absolute Error (mm)
  bias: number              // Mean Signed Error (mm): avg(forecast - observed)
  rmse: number              // Root Mean Square Error (mm)
  maxAbsError: number       // Maximum absolute error (mm)
  bustCount: number
  bustRate: number          // percentage 0–100
  avgBustProbability: number // percentage 0–100
  avgEnsembleSpread: number // mm
  avgConfidence: number     // percentage 0–100
}

export interface ErrorTrendPoint {
  date: string
  mae: number
  bias: number
  maxError: number
  bustRate: number
  forecastCount: number
}

export interface ErrorDistributionBin {
  bin: string
  range: string
  totalCount: number
  normalCount: number
  bustCount: number
  percentage: number
}

export interface LeadDayVerificationStat {
  leadDay: number
  forecastCount: number
  mae: number
  bias: number
  rmse: number
  bustCount: number
  bustRate: number
  avgSpread: number
  avgBustProb: number
}

export interface RegionalVerificationStat {
  region: RegionId
  forecastCount: number
  mae: number
  bias: number
  rmse: number
  bustCount: number
  bustRate: number
  avgSpread: number
  maxError: number
}

// ─────────────────────────────────────────────
// BASIC STATISTICAL HELPERS
// ─────────────────────────────────────────────

const avg = (vals: number[]): number =>
  vals.length === 0 ? 0 : parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))

const calcRmse = (errors: number[]): number => {
  if (errors.length === 0) return 0
  const meanSquare = errors.reduce((acc, err) => acc + err * err, 0) / errors.length
  return parseFloat(Math.sqrt(meanSquare).toFixed(2))
}

// ─────────────────────────────────────────────
// CORE VERIFICATION AGGREGATIONS
// ─────────────────────────────────────────────

/** Overall verification KPIs for active filter scope */
export function calculateVerificationSummary(forecasts: Forecast[]): VerificationSummaryMetrics {
  const n = forecasts.length
  if (n === 0) {
    return {
      totalForecasts: 0,
      mae: 0,
      bias: 0,
      rmse: 0,
      maxAbsError: 0,
      bustCount: 0,
      bustRate: 0,
      avgBustProbability: 0,
      avgEnsembleSpread: 0,
      avgConfidence: 0,
    }
  }

  // Signed error: forecastRainfall - observedRainfall (only on records with ground truth observation)
  const verified = forecasts.filter(
    (f): f is Forecast & { observedRainfall: number; forecastError: number } =>
      f.observedRainfall !== null && f.forecastError !== null
  )
  const signedErrors = verified.map((f) => f.forecastRainfall - f.observedRainfall)
  const absErrors = signedErrors.map((e) => Math.abs(e))
  const busts = forecasts.filter((f) => f.bustStatus === 'bust')

  return {
    totalForecasts: n,
    mae: avg(absErrors),
    bias: avg(signedErrors),
    rmse: calcRmse(signedErrors),
    maxAbsError: absErrors.length > 0 ? Math.max(...absErrors) : 0,
    bustCount: busts.length,
    bustRate: parseFloat(((busts.length / n) * 100).toFixed(1)),
    avgBustProbability: parseFloat((avg(forecasts.map((f) => f.bustProbability)) * 100).toFixed(1)),
    avgEnsembleSpread: avg(forecasts.map((f) => f.ensembleSpread)),
    avgConfidence: parseFloat((avg(forecasts.map((f) => f.confidence)) * 100).toFixed(1)),
  }
}

/** Error trend over time (daily aggregated) */
export function calculateErrorTrend(forecasts: Forecast[]): ErrorTrendPoint[] {
  const byDate = new Map<string, Forecast[]>()
  for (const f of forecasts) {
    const list = byDate.get(f.validDate) ?? []
    list.push(f)
    byDate.set(f.validDate, list)
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, fcs]) => {
      const verified = fcs.filter(
        (f): f is Forecast & { observedRainfall: number; forecastError: number } =>
          f.observedRainfall !== null && f.forecastError !== null
      )
      const signedErrors = verified.map((f) => f.forecastRainfall - f.observedRainfall)
      const absErrors = signedErrors.map((e) => Math.abs(e))
      const busts = fcs.filter((f) => f.bustStatus === 'bust')

      return {
        date,
        mae: avg(absErrors),
        bias: avg(signedErrors),
        maxError: absErrors.length > 0 ? Math.max(...absErrors) : 0,
        bustRate: fcs.length > 0 ? parseFloat(((busts.length / fcs.length) * 100).toFixed(1)) : 0,
        forecastCount: fcs.length,
      }
    })
}

/** Error distribution histogram bins */
export function calculateErrorDistribution(forecasts: Forecast[]): ErrorDistributionBin[] {
  const verified = forecasts.filter(
    (f): f is Forecast & { observedRainfall: number; forecastError: number } =>
      f.observedRainfall !== null && f.forecastError !== null
  )
  const n = verified.length
  if (n === 0) return []

  const binDefs = [
    { bin: '0–5 mm', min: 0, max: 5 },
    { bin: '5–10 mm', min: 5, max: 10 },
    { bin: '10–20 mm', min: 10, max: 20 },
    { bin: '20–30 mm', min: 20, max: 30 },
    { bin: '30–50 mm', min: 30, max: 50 },
    { bin: '50+ mm', min: 50, max: Infinity },
  ]

  return binDefs.map((def) => {
    const matching = verified.filter((f) => {
      const absErr = Math.abs(f.forecastRainfall - f.observedRainfall)
      return absErr >= def.min && (def.max === Infinity ? absErr >= def.min : absErr < def.max)
    })
    const normal = matching.filter((f) => f.bustStatus !== 'bust')
    const bust = matching.filter((f) => f.bustStatus === 'bust')

    return {
      bin: def.bin,
      range: def.max === Infinity ? `≥ ${def.min} mm` : `${def.min}–${def.max} mm`,
      totalCount: matching.length,
      normalCount: normal.length,
      bustCount: bust.length,
      percentage: parseFloat(((matching.length / n) * 100).toFixed(1)),
    }
  })
}

/** Lead-day verification degradation metrics (D+1 to D+10) */
export function calculateLeadDayVerification(forecasts: Forecast[]): LeadDayVerificationStat[] {
  const byLd = new Map<number, Forecast[]>()
  for (const f of forecasts) {
    const list = byLd.get(f.leadDay) ?? []
    list.push(f)
    byLd.set(f.leadDay, list)
  }

  return [...byLd.entries()]
    .sort(([a], [b]) => a - b)
    .map(([leadDay, fcs]) => {
      const verified = fcs.filter(
        (f): f is Forecast & { observedRainfall: number; forecastError: number } =>
          f.observedRainfall !== null && f.forecastError !== null
      )
      const signedErrors = verified.map((f) => f.forecastRainfall - f.observedRainfall)
      const absErrors = signedErrors.map((e) => Math.abs(e))
      const busts = fcs.filter((f) => f.bustStatus === 'bust')

      return {
        leadDay,
        forecastCount: fcs.length,
        mae: avg(absErrors),
        bias: avg(signedErrors),
        rmse: calcRmse(signedErrors),
        bustCount: busts.length,
        bustRate: fcs.length > 0 ? parseFloat(((busts.length / fcs.length) * 100).toFixed(1)) : 0,
        avgSpread: avg(fcs.map((f) => f.ensembleSpread)),
        avgBustProb: parseFloat((avg(fcs.map((f) => f.bustProbability)) * 100).toFixed(1)),
      }
    })
}

/** Regional verification performance metrics across Indian meteorological zones */
export function calculateRegionalVerification(forecasts: Forecast[]): RegionalVerificationStat[] {
  const byReg = new Map<RegionId, Forecast[]>()
  for (const f of forecasts) {
    const list = byReg.get(f.region) ?? []
    list.push(f)
    byReg.set(f.region, list)
  }

  return [...byReg.entries()].map(([region, fcs]) => {
    const verified = fcs.filter(
      (f): f is Forecast & { observedRainfall: number; forecastError: number } =>
        f.observedRainfall !== null && f.forecastError !== null
    )
    const signedErrors = verified.map((f) => f.forecastRainfall - f.observedRainfall)
    const absErrors = signedErrors.map((e) => Math.abs(e))
    const busts = fcs.filter((f) => f.bustStatus === 'bust')

    return {
      region,
      forecastCount: fcs.length,
      mae: avg(absErrors),
      bias: avg(signedErrors),
      rmse: calcRmse(signedErrors),
      bustCount: busts.length,
      bustRate: fcs.length > 0 ? parseFloat(((busts.length / fcs.length) * 100).toFixed(1)) : 0,
      avgSpread: avg(fcs.map((f) => f.ensembleSpread)),
      maxError: absErrors.length > 0 ? Math.max(...absErrors) : 0,
    }
  })
}

/** Extract highest error outlier records for drill-down */
export function getTopErrorForecasts(forecasts: Forecast[], limit = 10): Forecast[] {
  return [...forecasts]
    .filter((f): f is Forecast & { forecastError: number } => f.forecastError !== null)
    .sort((a, b) => Math.abs(b.forecastError) - Math.abs(a.forecastError))
    .slice(0, limit)
}

/** Retrieve Model Comparison Dataset */
export function getMockModelsData(): ModelMetric[] {
  return getModelMetrics()
}

/** Retrieve Feature Importance Dataset */
export function getMockFeaturesData(): FeatureImportance[] {
  return getFeatureImportance()
}

/** Retrieve Multi-Season Historical Dataset */
export function getHistoricalVerificationData(): HistoricalStatistic[] {
  return getHistoricalData()
}
