/**
 * Bust Detection Analysis Utilities
 * All functions derive from the centralized Stage 3 mock data.
 * Designed to be backend-ready: replace data parameters with API responses.
 */

import type { Forecast, RegionId, RiskLevel } from '../types'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface BustSummaryStats {
  totalForecasts: number
  bustCount: number
  bustRate: number           // percentage 0–100
  avgAbsError: number        // mm
  maxAbsError: number        // mm
  avgBustProbability: number // percentage 0–100
  highSevereBusts: number    // high or severe risk that are busts
  avgConfidence: number      // percentage 0–100
  nonBustCount: number
}

export interface BustTrendPoint {
  date: string
  total: number
  busts: number
  bustRate: number // %
}

export interface LeadDayBustStats {
  leadDay: number
  total: number
  busts: number
  bustRate: number   // %
  avgAbsError: number
  avgBustProb: number // %
}

export interface RegionBustStats {
  region: RegionId
  total: number
  busts: number
  bustRate: number
  avgAbsError: number
  avgBustProb: number
}

export interface LocationBustStats {
  locationId: string
  locationName: string
  state: string
  region: RegionId
  total: number
  busts: number
  bustRate: number
  avgAbsError: number
  avgBustProb: number
  highSevereBusts: number
  latestBustDate: string | null
}

export interface ProbabilityBucket {
  label: string      // e.g. "0–20%"
  min: number
  max: number
  total: number
  busts: number
  bustRate: number
}

export interface BustVsNonBustStats {
  busts: {
    count: number
    avgForecast: number
    avgObserved: number
    avgAbsError: number
    avgSpread: number
    avgBustProb: number
    avgConfidence: number
  }
  nonBusts: {
    count: number
    avgForecast: number
    avgObserved: number
    avgAbsError: number
    avgSpread: number
    avgBustProb: number
    avgConfidence: number
  }
}

export interface RiskOutcomeStat {
  riskLevel: RiskLevel
  total: number
  busts: number
  bustRate: number
}

export interface ErrorBin {
  label: string
  min: number
  max: number
  bustCount: number
  nonBustCount: number
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const avg = (vals: number[]): number =>
  vals.length === 0 ? 0 : parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))

// ─────────────────────────────────────────────
// ANALYSIS FUNCTIONS
// ─────────────────────────────────────────────

/** Overall KPI summary for filtered forecasts */
export function calculateBustSummary(forecasts: Forecast[]): BustSummaryStats {
  const busts = forecasts.filter((f) => f.bustStatus === 'bust')
  const absErrors = forecasts.map((f) => Math.abs(f.forecastError))
  const highSevereBusts = busts.filter((f) => f.riskLevel === 'high' || f.riskLevel === 'severe').length

  return {
    totalForecasts: forecasts.length,
    bustCount: busts.length,
    bustRate: forecasts.length > 0 ? parseFloat(((busts.length / forecasts.length) * 100).toFixed(1)) : 0,
    avgAbsError: avg(absErrors),
    maxAbsError: absErrors.length > 0 ? parseFloat(Math.max(...absErrors).toFixed(1)) : 0,
    avgBustProbability: parseFloat((avg(forecasts.map((f) => f.bustProbability)) * 100).toFixed(1)),
    highSevereBusts,
    avgConfidence: parseFloat((avg(forecasts.map((f) => f.confidence)) * 100).toFixed(1)),
    nonBustCount: forecasts.length - busts.length,
  }
}

/** Bust trend grouped by validDate */
export function calculateBustTrend(forecasts: Forecast[]): BustTrendPoint[] {
  const byDate = new Map<string, { total: number; busts: number }>()
  for (const f of forecasts) {
    const d = f.validDate
    const entry = byDate.get(d) ?? { total: 0, busts: 0 }
    entry.total++
    if (f.bustStatus === 'bust') entry.busts++
    byDate.set(d, entry)
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { total, busts }]) => ({
      date,
      total,
      busts,
      bustRate: total > 0 ? parseFloat(((busts / total) * 100).toFixed(1)) : 0,
    }))
}

/** Bust stats per lead day */
export function calculateBustsByLeadDay(forecasts: Forecast[]): LeadDayBustStats[] {
  const byLd = new Map<number, Forecast[]>()
  for (const f of forecasts) {
    const arr = byLd.get(f.leadDay) ?? []
    arr.push(f)
    byLd.set(f.leadDay, arr)
  }
  return [...byLd.entries()]
    .sort(([a], [b]) => a - b)
    .map(([leadDay, fcs]) => {
      const busts = fcs.filter((f) => f.bustStatus === 'bust').length
      return {
        leadDay,
        total: fcs.length,
        busts,
        bustRate: parseFloat(((busts / fcs.length) * 100).toFixed(1)),
        avgAbsError: avg(fcs.map((f) => Math.abs(f.forecastError))),
        avgBustProb: parseFloat((avg(fcs.map((f) => f.bustProbability)) * 100).toFixed(1)),
      }
    })
}

/** Bust stats per region */
export function calculateBustsByRegion(forecasts: Forecast[]): RegionBustStats[] {
  const byRegion = new Map<RegionId, Forecast[]>()
  for (const f of forecasts) {
    const arr = byRegion.get(f.region) ?? []
    arr.push(f)
    byRegion.set(f.region, arr)
  }
  return [...byRegion.entries()].map(([region, fcs]) => {
    const busts = fcs.filter((f) => f.bustStatus === 'bust').length
    return {
      region,
      total: fcs.length,
      busts,
      bustRate: parseFloat(((busts / fcs.length) * 100).toFixed(1)),
      avgAbsError: avg(fcs.map((f) => Math.abs(f.forecastError))),
      avgBustProb: parseFloat((avg(fcs.map((f) => f.bustProbability)) * 100).toFixed(1)),
    }
  })
}

/** Per-location bust stats */
export function calculateLocationBustStats(forecasts: Forecast[]): LocationBustStats[] {
  const byLoc = new Map<string, Forecast[]>()
  for (const f of forecasts) {
    const arr = byLoc.get(f.locationId) ?? []
    arr.push(f)
    byLoc.set(f.locationId, arr)
  }
  return [...byLoc.entries()].map(([locationId, fcs]) => {
    const busts = fcs.filter((f) => f.bustStatus === 'bust')
    const bustDates = busts.map((f) => f.validDate).sort()
    return {
      locationId,
      locationName: fcs[0].locationName,
      state: fcs[0].state,
      region: fcs[0].region,
      total: fcs.length,
      busts: busts.length,
      bustRate: parseFloat(((busts.length / fcs.length) * 100).toFixed(1)),
      avgAbsError: avg(fcs.map((f) => Math.abs(f.forecastError))),
      avgBustProb: parseFloat((avg(fcs.map((f) => f.bustProbability)) * 100).toFixed(1)),
      highSevereBusts: busts.filter((f) => f.riskLevel === 'high' || f.riskLevel === 'severe').length,
      latestBustDate: bustDates.length > 0 ? bustDates[bustDates.length - 1] : null,
    }
  })
}

/** Group forecasts into bust-probability buckets and check actual outcome */
export function calculateBustProbabilityBuckets(forecasts: Forecast[]): ProbabilityBucket[] {
  const buckets: ProbabilityBucket[] = [
    { label: '0–20%', min: 0, max: 0.2, total: 0, busts: 0, bustRate: 0 },
    { label: '20–40%', min: 0.2, max: 0.4, total: 0, busts: 0, bustRate: 0 },
    { label: '40–60%', min: 0.4, max: 0.6, total: 0, busts: 0, bustRate: 0 },
    { label: '60–80%', min: 0.6, max: 0.8, total: 0, busts: 0, bustRate: 0 },
    { label: '80–100%', min: 0.8, max: 1.01, total: 0, busts: 0, bustRate: 0 },
  ]
  for (const f of forecasts) {
    const bucket = buckets.find((b) => f.bustProbability >= b.min && f.bustProbability < b.max)
    if (!bucket) continue
    bucket.total++
    if (f.bustStatus === 'bust') bucket.busts++
  }
  for (const b of buckets) {
    b.bustRate = b.total > 0 ? parseFloat(((b.busts / b.total) * 100).toFixed(1)) : 0
  }
  return buckets
}

/** Bust vs Non-Bust comparative statistics */
export function calculateBustVsNonBustStats(forecasts: Forecast[]): BustVsNonBustStats {
  const busts = forecasts.filter((f) => f.bustStatus === 'bust')
  const nonBusts = forecasts.filter((f) => f.bustStatus !== 'bust')

  const stats = (fcs: Forecast[]) => {
    const verified = fcs.filter(
      (f): f is Forecast & { observedRainfall: number; forecastError: number } =>
        f.observedRainfall !== null && f.forecastError !== null
    )
    return fcs.length === 0
      ? { count: 0, avgForecast: 0, avgObserved: 0, avgAbsError: 0, avgSpread: 0, avgBustProb: 0, avgConfidence: 0 }
      : {
          count: fcs.length,
          avgForecast: avg(fcs.map((f) => f.forecastRainfall)),
          avgObserved: avg(verified.map((f) => f.observedRainfall)),
          avgAbsError: avg(verified.map((f) => Math.abs(f.forecastError))),
          avgSpread: avg(fcs.map((f) => f.ensembleSpread)),
          avgBustProb: parseFloat((avg(fcs.map((f) => f.bustProbability)) * 100).toFixed(1)),
          avgConfidence: parseFloat((avg(fcs.map((f) => f.confidence)) * 100).toFixed(1)),
        }
  }

  return { busts: stats(busts), nonBusts: stats(nonBusts) }
}

/** Bust rate within each risk level */
export function calculateRiskOutcomes(forecasts: Forecast[]): RiskOutcomeStat[] {
  const levels: RiskLevel[] = ['low', 'moderate', 'high', 'severe']
  return levels.map((riskLevel) => {
    const fcs = forecasts.filter((f) => f.riskLevel === riskLevel)
    const busts = fcs.filter((f) => f.bustStatus === 'bust').length
    return {
      riskLevel,
      total: fcs.length,
      busts,
      bustRate: fcs.length > 0 ? parseFloat(((busts / fcs.length) * 100).toFixed(1)) : 0,
    }
  })
}

/** Error magnitude distribution for bust vs non-bust */
export function calculateErrorDistribution(forecasts: Forecast[]): ErrorBin[] {
  const bins: ErrorBin[] = [
    { label: '0–5', min: 0, max: 5, bustCount: 0, nonBustCount: 0 },
    { label: '5–10', min: 5, max: 10, bustCount: 0, nonBustCount: 0 },
    { label: '10–20', min: 10, max: 20, bustCount: 0, nonBustCount: 0 },
    { label: '20–30', min: 20, max: 30, bustCount: 0, nonBustCount: 0 },
    { label: '30–50', min: 30, max: 50, bustCount: 0, nonBustCount: 0 },
    { label: '50+', min: 50, max: Infinity, bustCount: 0, nonBustCount: 0 },
  ]
  for (const f of forecasts) {
    if (f.forecastError === null) continue
    const absErr = Math.abs(f.forecastError)
    const bin = bins.find((b) => absErr >= b.min && absErr < b.max)
    if (!bin) continue
    if (f.bustStatus === 'bust') bin.bustCount++
    else bin.nonBustCount++
  }
  return bins
}

/** Top N largest-error forecasts */
export function getLargestErrors(forecasts: Forecast[], n = 15): Forecast[] {
  return [...forecasts]
    .filter((f): f is Forecast & { forecastError: number } => f.forecastError !== null)
    .sort((a, b) => Math.abs(b.forecastError) - Math.abs(a.forecastError))
    .slice(0, n)
}
