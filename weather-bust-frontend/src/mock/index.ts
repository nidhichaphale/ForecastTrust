/**
 * Centralized Mock Data Layer & API-like Access Functions.
 * Provides typed, filterable, search-capable queries for future UI screens without direct array manipulation.
 */

import type {
  Location,
  Region,
  Forecast,
  BustEvent,
  HiddenRiskRecord,
  Alert,
  ModelMetric,
  FeatureImportance,
  RegionalStatistic,
  LeadDayStatistic,
  HistoricalStatistic,
  DataQualityStatistic,
  ForecastFilterParams,
  BustEventFilterParams,
  AlertFilterParams,
  RegionId,
} from '../types'

import { MOCK_LOCATIONS } from './locations'
import { MOCK_REGIONS } from './regions'
import { MOCK_FORECASTS } from './forecasts'
import { MOCK_BUST_EVENTS } from './bustEvents'
import { MOCK_HIDDEN_RISK_RECORDS } from './hiddenRisk'
import { MOCK_ALERTS } from './alerts'
import { MOCK_MODEL_METRICS } from './modelMetrics'
import { MOCK_FEATURE_IMPORTANCE } from './featureImportance'
import { MOCK_REGIONAL_STATS } from './regionalStats'
import { MOCK_LEAD_DAY_STATS } from './leadDayStats'
import { MOCK_HISTORICAL_DATA } from './historicalData'
import { MOCK_DATA_QUALITY } from './dataQuality'

// Export raw datasets
export {
  MOCK_LOCATIONS,
  MOCK_REGIONS,
  MOCK_FORECASTS,
  MOCK_BUST_EVENTS,
  MOCK_HIDDEN_RISK_RECORDS,
  MOCK_ALERTS,
  MOCK_MODEL_METRICS,
  MOCK_FEATURE_IMPORTANCE,
  MOCK_REGIONAL_STATS,
  MOCK_LEAD_DAY_STATS,
  MOCK_HISTORICAL_DATA,
  MOCK_DATA_QUALITY,
}

// Global flag confirming mock dataset readiness
export const MOCK_DATA_READY = true

// ==========================================
// API-LIKE ACCESS FUNCTIONS
// ==========================================

/**
 * Retrieve all registered meteorological stations/locations.
 */
export function getLocations(region?: RegionId): Location[] {
  if (!region) return [...MOCK_LOCATIONS]
  return MOCK_LOCATIONS.filter((loc) => loc.region === region)
}

/**
 * Retrieve specific location by unique ID.
 */
export function getLocationById(id: string): Location | undefined {
  return MOCK_LOCATIONS.find((loc) => loc.id === id)
}

/**
 * Retrieve all meteorological geographic regions.
 */
export function getRegions(): Region[] {
  return [...MOCK_REGIONS]
}

/**
 * Query forecasts with rich multi-parameter filtering, sorting, and search.
 */
export function getForecasts(filters?: ForecastFilterParams): Forecast[] {
  if (!filters) return [...MOCK_FORECASTS]

  return MOCK_FORECASTS.filter((fc) => {
    if (filters.startDate && fc.validDate < filters.startDate) return false
    if (filters.endDate && fc.validDate > filters.endDate) return false
    if (filters.locationId && fc.locationId !== filters.locationId) return false
    if (filters.state && fc.state.toLowerCase() !== filters.state.toLowerCase()) return false
    if (filters.region && fc.region !== filters.region) return false
    if (filters.leadDay !== undefined && fc.leadDay !== filters.leadDay) return false
    if (filters.riskLevel && fc.riskLevel !== filters.riskLevel) return false
    if (filters.bustStatus && fc.bustStatus !== filters.bustStatus) return false
    if (filters.dataStatus && fc.dataStatus !== filters.dataStatus) return false
    if (filters.minError !== undefined && (fc.forecastError === null || Math.abs(fc.forecastError) < filters.minError)) return false
    if (filters.zeroSpreadOnly && !fc.zeroSpread) return false

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      const matchName = fc.locationName.toLowerCase().includes(q)
      const matchState = fc.state.toLowerCase().includes(q)
      const matchRegion = fc.region.toLowerCase().includes(q)
      const matchId = fc.id.toLowerCase().includes(q)
      if (!matchName && !matchState && !matchRegion && !matchId) return false
    }

    return true
  })
}

/**
 * Retrieve specific forecast record by ID.
 */
export function getForecastById(id: string): Forecast | undefined {
  return MOCK_FORECASTS.find((fc) => fc.id === id)
}

/**
 * Query verified bust events with optional filtering.
 */
export function getBustEvents(filters?: BustEventFilterParams): BustEvent[] {
  if (!filters) return [...MOCK_BUST_EVENTS]

  return MOCK_BUST_EVENTS.filter((ev) => {
    if (filters.region && ev.region !== filters.region) return false
    if (filters.state && ev.state.toLowerCase() !== filters.state.toLowerCase()) return false
    if (filters.severity && ev.severity !== filters.severity) return false
    if (filters.leadDay !== undefined && ev.leadDay !== filters.leadDay) return false
    if (filters.minError !== undefined && Math.abs(ev.error) < filters.minError) return false
    return true
  })
}

/**
 * Retrieve specific bust event by event ID.
 */
export function getBustEventById(id: string): BustEvent | undefined {
  return MOCK_BUST_EVENTS.find((ev) => ev.id === id)
}

/**
 * Retrieve zero-spread and false certainty hidden risk records.
 */
export function getHiddenRiskRecords(onlyBusts = false): HiddenRiskRecord[] {
  if (onlyBusts) {
    return MOCK_HIDDEN_RISK_RECORDS.filter((hr) => hr.hiddenRiskStatus)
  }
  return [...MOCK_HIDDEN_RISK_RECORDS]
}

/**
 * Query operational alerts with severity, status, region, and search filtering.
 */
export function getAlerts(filters?: AlertFilterParams): Alert[] {
  if (!filters) return [...MOCK_ALERTS]

  return MOCK_ALERTS.filter((alt) => {
    if (filters.severity && alt.severity !== filters.severity) return false
    if (filters.status && filters.status !== 'all' && alt.status !== filters.status) return false
    if (filters.alertType && filters.alertType !== 'all' && alt.alertType !== filters.alertType) return false
    if (filters.region && alt.region !== filters.region) return false
    if (filters.state && alt.state && alt.state.toLowerCase() !== filters.state.toLowerCase()) return false
    if (filters.locationId && alt.locationId !== filters.locationId) return false
    if (filters.leadDay !== undefined && alt.leadDay !== filters.leadDay) return false
    if (filters.startDate && alt.validDate && alt.validDate < filters.startDate) return false
    if (filters.endDate && alt.validDate && alt.validDate > filters.endDate) return false
    if (filters.unreadOnly && alt.isRead) return false
    if (filters.unresolvedOnly && alt.isResolved) return false

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim()
      const matchId = alt.id.toLowerCase().includes(q)
      const matchLoc = alt.locationName.toLowerCase().includes(q)
      const matchState = alt.state?.toLowerCase().includes(q)
      const matchMsg = alt.message.toLowerCase().includes(q)
      const matchType = alt.alertType.toLowerCase().includes(q)
      const matchFcId = alt.relatedForecastId?.toLowerCase().includes(q)
      if (!matchId && !matchLoc && !matchState && !matchMsg && !matchType && !matchFcId) return false
    }

    return true
  })
}

/**
 * Retrieve specific alert by ID.
 */
export function getAlertById(id: string): Alert | undefined {
  return MOCK_ALERTS.find((alt) => alt.id === id)
}

/**
 * Count active unread alerts.
 */
export function getUnreadAlertsCount(): number {
  return MOCK_ALERTS.filter((alt) => !alt.isRead).length
}

/**
 * Retrieve regional aggregate statistics.
 */
export function getRegionalStats(): RegionalStatistic[] {
  return [...MOCK_REGIONAL_STATS]
}

/**
 * Retrieve lead-day degradation statistics (days 1 to 10).
 */
export function getLeadDayStats(): LeadDayStatistic[] {
  return [...MOCK_LEAD_DAY_STATS]
}

/**
 * Retrieve machine learning model evaluation metrics.
 */
export function getModelMetrics(): ModelMetric[] {
  return [...MOCK_MODEL_METRICS]
}

/**
 * Retrieve feature importance rankings.
 */
export function getFeatureImportance(): FeatureImportance[] {
  return [...MOCK_FEATURE_IMPORTANCE]
}

/**
 * Retrieve multi-season historical statistics.
 */
export function getHistoricalData(year?: number): HistoricalStatistic[] {
  if (!year) return [...MOCK_HISTORICAL_DATA]
  return MOCK_HISTORICAL_DATA.filter((h) => h.year === year)
}

/**
 * Retrieve data quality metrics for ingestion auditing.
 */
export function getDataQualityStats(): DataQualityStatistic {
  return { ...MOCK_DATA_QUALITY }
}

/**
 * High-level overview summary for executive KPI indicators.
 */
export function getOverviewSummary() {
  const totalForecasts = MOCK_FORECASTS.length
  const totalBusts = MOCK_FORECASTS.filter((fc) => fc.bustStatus === 'bust').length
  const overallBustRate = parseFloat(((totalBusts / totalForecasts) * 100).toFixed(1))
  const severeAlertsCount = MOCK_ALERTS.filter((a) => a.severity === 'severe' && !a.isResolved).length
  const activeLocations = MOCK_LOCATIONS.length

  const sumAbsError = MOCK_FORECASTS.reduce((acc, fc) => acc + Math.abs(fc.forecastError), 0)
  const averageError = parseFloat((sumAbsError / totalForecasts).toFixed(1))

  return {
    totalForecasts,
    totalBusts,
    overallBustRate,
    severeAlertsCount,
    activeLocations,
    averageError,
  }
}
