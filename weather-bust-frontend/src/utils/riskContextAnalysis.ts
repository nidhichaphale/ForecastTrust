/**
 * Risk & Busts Workspace Context Utilities
 * Shared analytical metrics, cross-workspace query generators, and eligibility evaluators.
 */

import type { Forecast } from '../types'

export interface RiskWorkspaceSummaryMetrics {
  totalForecasts: number
  highOrSevereRiskCount: number
  bustCount: number
  bustRate: number
  avgBustProbability: number
  avgEnsembleSpread: number
  hiddenRiskBustCount: number
  zeroSpreadCount: number
  zeroForecastCount: number
}

/**
 * Calculate unified workspace metrics derived from the active filter context.
 */
export function calculateRiskWorkspaceSummary(forecasts: Forecast[]): RiskWorkspaceSummaryMetrics {
  const n = forecasts.length
  if (n === 0) {
    return {
      totalForecasts: 0,
      highOrSevereRiskCount: 0,
      bustCount: 0,
      bustRate: 0,
      avgBustProbability: 0,
      avgEnsembleSpread: 0,
      hiddenRiskBustCount: 0,
      zeroSpreadCount: 0,
      zeroForecastCount: 0,
    }
  }

  const highOrSevere = forecasts.filter((f) => f.riskLevel === 'high' || f.riskLevel === 'severe')
  const busts = forecasts.filter((f) => f.bustStatus === 'bust')
  const zeroSpread = forecasts.filter((f) => f.zeroSpread || f.ensembleSpread === 0)
  const zeroForecast = forecasts.filter((f) => f.forecastRainfall === 0)

  // Hidden risk busts: model had zero or near-zero spread (overconfidence), yet became a verified bust
  const hiddenBusts = forecasts.filter(
    (f) => (f.zeroSpread || f.ensembleSpread <= 1.0) && (f.bustStatus === 'bust' || (f.observedRainfall !== null && f.observedRainfall >= 15.0))
  )

  const avgProb = (forecasts.reduce((acc, f) => acc + f.bustProbability, 0) / n) * 100
  const avgSpread = forecasts.reduce((acc, f) => acc + f.ensembleSpread, 0) / n
  const bustRate = (busts.length / n) * 100

  return {
    totalForecasts: n,
    highOrSevereRiskCount: highOrSevere.length,
    bustCount: busts.length,
    bustRate: parseFloat(bustRate.toFixed(1)),
    avgBustProbability: parseFloat(avgProb.toFixed(1)),
    avgEnsembleSpread: parseFloat(avgSpread.toFixed(1)),
    hiddenRiskBustCount: hiddenBusts.length,
    zeroSpreadCount: zeroSpread.length,
    zeroForecastCount: zeroForecast.length,
  }
}

/**
 * Build URL search string carrying forward compatible parameters across Risk & Busts workspaces.
 */
export function buildCrossWorkspaceQuery(params: {
  locationId?: string
  state?: string
  region?: string
  leadDay?: number
  startDate?: string
  endDate?: string
  date?: string
}): string {
  const q = new URLSearchParams()

  if (params.locationId) q.set('locationId', params.locationId)
  if (params.state) q.set('state', params.state)
  if (params.region) q.set('region', params.region)
  if (params.leadDay !== undefined) q.set('leadDay', params.leadDay.toString())

  const effectiveDate = params.date || params.startDate
  if (effectiveDate) {
    q.set('startDate', effectiveDate)
    q.set('endDate', params.endDate || effectiveDate)
  }

  const str = q.toString()
  return str ? `?${str}` : ''
}

/**
 * Evaluate if a forecast has hidden-risk characteristics (zero/near-zero spread or zero forecast).
 */
export function isEligibleForHiddenRisk(fc: Forecast): boolean {
  return fc.zeroSpread || fc.ensembleSpread <= 1.2 || fc.forecastRainfall === 0
}

/**
 * Evaluate if a forecast has actionable bust failure characteristics.
 */
export function isEligibleForBustInvestigation(fc: Forecast): boolean {
  const absErr = fc.forecastError !== null ? Math.abs(fc.forecastError) : 0
  return fc.bustStatus === 'bust' || absErr >= 15.0 || fc.bustProbability >= 0.50
}
