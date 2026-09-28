/**
 * Data & Quality Analysis Calculation Engine
 * Pure deterministic algorithms deriving coverage, completeness, and quality metrics
 * directly from the centralized mock data repository.
 */

import type { Forecast, RegionId, RiskLevel } from '../types'
import { getRegions } from '../mock'
import type {
  DataWorkspaceKPIs,
  GeographicCoverageStat,
  StateCoverageStat,
  LeadDayCoverageStat,
  TemporalCoverageStat,
  DataQualityIssueRecord,
  LocationAvailabilityRow,
  AvailabilityCell,
} from '../types/dataQuality'

const ALL_HORIZONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 * Calculate high-level Data & Quality summary KPIs for the active filter scope.
 */
export function calculateDataWorkspaceKPIs(forecasts: Forecast[]): DataWorkspaceKPIs {
  const n = forecasts.length
  if (n === 0) {
    return {
      totalForecastRecords: 0,
      totalLocations: 0,
      totalForecastDates: 0,
      totalLeadDaysCovered: 0,
      totalObservedRecords: 0,
      missingObservationsCount: 0,
      qualityIssuesCount: 0,
      latestForecastDate: 'N/A',
      earliestForecastDate: 'N/A',
      completenessRate: 0,
      scheduledLeadDays: [],
      omittedLeadDays: ALL_HORIZONS,
    }
  }

  const locationIds = new Set(forecasts.map((f) => f.locationId))
  const dates = Array.from(new Set(forecasts.map((f) => f.validDate))).sort()
  const leadDays = Array.from(new Set(forecasts.map((f) => f.leadDay))).sort((a, b) => a - b)

  const observed = forecasts.filter((f) => f.hasObservation !== false && f.observedRainfall >= 0)
  const missing = forecasts.filter((f) => f.hasObservation === false || f.observedRainfall < 0)
  const issues = forecasts.filter((f) => f.dataStatus && f.dataStatus !== 'complete')

  const omittedLeadDays = ALL_HORIZONS.filter((ld) => !leadDays.includes(ld))
  const completenessRate = parseFloat(((observed.length / n) * 100).toFixed(1))

  return {
    totalForecastRecords: n,
    totalLocations: locationIds.size,
    totalForecastDates: dates.length,
    totalLeadDaysCovered: leadDays.length,
    totalObservedRecords: observed.length,
    missingObservationsCount: missing.length,
    qualityIssuesCount: issues.length,
    latestForecastDate: dates[dates.length - 1],
    earliestForecastDate: dates[0],
    completenessRate,
    scheduledLeadDays: leadDays,
    omittedLeadDays,
  }
}

/**
 * Calculate geographic coverage breakdown by Region.
 */
export function calculateGeographicCoverage(forecasts: Forecast[]): GeographicCoverageStat[] {
  const regions = getRegions()
  const byRegion = new Map<RegionId, Forecast[]>()

  for (const f of forecasts) {
    const list = byRegion.get(f.region) ?? []
    list.push(f)
    byRegion.set(f.region, list)
  }

  return regions.map((reg) => {
    const fcs = byRegion.get(reg.id as RegionId) ?? []
    const locations = Array.from(new Set(fcs.map((f) => f.locationId)))
    const states = Array.from(new Set(fcs.map((f) => f.state)))
    const observed = fcs.filter((f) => f.hasObservation !== false && f.observedRainfall >= 0)
    const missing = fcs.filter((f) => f.hasObservation === false || f.observedRainfall < 0)
    const coveragePct = fcs.length > 0 ? parseFloat(((observed.length / fcs.length) * 100).toFixed(1)) : 0

    return {
      region: reg.id as RegionId,
      regionName: reg.name,
      locationsCount: locations.length,
      forecastRecordsCount: fcs.length,
      observedCount: observed.length,
      missingObsCount: missing.length,
      coveragePercentage: coveragePct,
      statesCount: states.length,
      states,
    }
  })
}

/**
 * Calculate coverage breakdown by State.
 */
export function calculateStateCoverage(forecasts: Forecast[]): StateCoverageStat[] {
  const byState = new Map<string, { region: RegionId; forecasts: Forecast[] }>()

  for (const f of forecasts) {
    const entry = byState.get(f.state) ?? { region: f.region, forecasts: [] }
    entry.forecasts.push(f)
    byState.set(f.state, entry)
  }

  return Array.from(byState.entries())
    .map(([state, data]) => {
      const fcs = data.forecasts
      const locations = new Set(fcs.map((f) => f.locationId))
      const observed = fcs.filter((f) => f.hasObservation !== false && f.observedRainfall >= 0)
      const missing = fcs.filter((f) => f.hasObservation === false || f.observedRainfall < 0)
      const coveragePct = fcs.length > 0 ? parseFloat(((observed.length / fcs.length) * 100).toFixed(1)) : 0

      return {
        state,
        region: data.region,
        locationsCount: locations.size,
        forecastRecordsCount: fcs.length,
        observedCount: observed.length,
        missingObsCount: missing.length,
        coveragePercentage: coveragePct,
      }
    })
    .sort((a, b) => b.forecastRecordsCount - a.forecastRecordsCount)
}

/**
 * Calculate lead-day coverage across D+1 to D+10.
 * Transparently distinguishes scheduled horizons from unrepresented horizons (D+6, D+8, D+9).
 */
export function calculateLeadDayCoverage(forecasts: Forecast[]): LeadDayCoverageStat[] {
  const byLeadDay = new Map<number, Forecast[]>()

  for (const f of forecasts) {
    const list = byLeadDay.get(f.leadDay) ?? []
    list.push(f)
    byLeadDay.set(f.leadDay, list)
  }

  return ALL_HORIZONS.map((ld) => {
    const fcs = byLeadDay.get(ld) ?? []
    const isScheduled = fcs.length > 0
    const observed = fcs.filter((f) => f.hasObservation !== false && f.observedRainfall >= 0)
    const missing = fcs.filter((f) => f.hasObservation === false || f.observedRainfall < 0)
    const coveragePercentage = isScheduled ? parseFloat(((observed.length / fcs.length) * 100).toFixed(1)) : 0

    let statusNote = 'Full Operational Schedule'
    if (!isScheduled) {
      statusNote = 'Omitted from Operational Model Run Cycle'
    } else if (missing.length > 0) {
      statusNote = `${missing.length} Telemetry Latencies`
    }

    return {
      leadDay: ld,
      label: `D+${ld}`,
      forecastCount: fcs.length,
      observedCount: observed.length,
      missingObsCount: missing.length,
      isScheduled,
      coveragePercentage,
      statusNote,
    }
  })
}

/**
 * Calculate temporal coverage time series (daily forecast volume vs observation availability).
 */
export function calculateTemporalCoverage(forecasts: Forecast[]): TemporalCoverageStat[] {
  const byDate = new Map<string, Forecast[]>()

  for (const f of forecasts) {
    const list = byDate.get(f.validDate) ?? []
    list.push(f)
    byDate.set(f.validDate, list)
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, fcs]) => {
      const observed = fcs.filter((f) => f.hasObservation !== false && f.observedRainfall >= 0)
      const missing = fcs.filter((f) => f.hasObservation === false || f.observedRainfall < 0)

      return {
        date,
        forecastCount: fcs.length,
        observedCount: observed.length,
        missingCount: missing.length,
      }
    })
}

/**
 * Extract structured audit issues from forecast records.
 */
export function extractQualityIssues(forecasts: Forecast[]): DataQualityIssueRecord[] {
  const issueRecords: DataQualityIssueRecord[] = []
  let issueCounter = 100

  for (const f of forecasts) {
    if (!f.dataStatus || f.dataStatus === 'complete') continue

    issueCounter++
    let category: DataQualityIssueRecord['category'] = 'missing_observation'
    let categoryLabel = 'Missing Observation'
    let severity: RiskLevel = 'moderate'
    let impact = 'Forecast verification cannot compute ground truth bias'
    let description = f.qualityIssues?.[0] || 'Ground truth observation telemetry missing from station ingest.'

    if (f.dataStatus === 'missing_observation') {
      category = 'missing_observation'
      categoryLabel = 'Missing Observation'
      severity = 'high'
      impact = 'Excludes record from MAE, signed error bias, and RMSE evaluation.'
    } else if (f.dataStatus === 'partial') {
      category = 'partial_ensemble'
      categoryLabel = 'Partial Telemetry'
      severity = 'moderate'
      impact = 'Ensemble spread or spatial coordinates interpolated from nearest grid nodes.'
    } else if (f.dataStatus === 'invalid') {
      category = 'invalid_value'
      categoryLabel = 'Range Discrepancy'
      severity = 'severe'
      impact = 'Physical bounding violation flagged during automated QA filter.'
    }

    issueRecords.push({
      id: `iss-${issueCounter}`,
      forecastId: f.id,
      locationId: f.locationId,
      locationName: f.locationName,
      state: f.state,
      region: f.region,
      validDate: f.validDate,
      leadDay: f.leadDay,
      category,
      categoryLabel,
      severity,
      description,
      impact,
    })
  }

  return issueRecords.sort((_a, b) => (b.severity === 'high' ? 1 : -1))
}

/**
 * Generate Location × Lead Day Availability Heatmap Grid.
 */
export function calculateAvailabilityGrid(forecasts: Forecast[]): LocationAvailabilityRow[] {
  const byLocation = new Map<string, { locationName: string; state: string; region: RegionId; forecasts: Forecast[] }>()

  for (const f of forecasts) {
    const entry = byLocation.get(f.locationId) ?? {
      locationName: f.locationName,
      state: f.state,
      region: f.region,
      forecasts: [],
    }
    entry.forecasts.push(f)
    byLocation.set(f.locationId, entry)
  }

  return Array.from(byLocation.entries())
    .map(([locationId, data]) => {
      const fcs = data.forecasts
      const leadDaysMap: Record<number, AvailabilityCell> = {}
      let totalAvailable = 0

      for (const ld of ALL_HORIZONS) {
        const match = fcs.find((f) => f.leadDay === ld)
        if (!match) {
          leadDaysMap[ld] = {
            available: false,
            hasObservation: false,
            status: 'not_scheduled',
          }
        } else {
          totalAvailable++
          const hasObs = match.hasObservation !== false && match.observedRainfall >= 0
          leadDaysMap[ld] = {
            available: true,
            hasObservation: hasObs,
            status: match.dataStatus || (hasObs ? 'complete' : 'missing_observation'),
          }
        }
      }

      const totalObserved = Object.values(leadDaysMap).filter((c) => c.hasObservation).length
      const completenessRate = totalAvailable > 0 ? parseFloat(((totalObserved / totalAvailable) * 100).toFixed(1)) : 0

      return {
        locationId,
        locationName: data.locationName,
        state: data.state,
        region: data.region,
        leadDays: leadDaysMap,
        totalAvailable,
        completenessRate,
      }
    })
    .sort((a, b) => a.locationName.localeCompare(b.locationName))
}
