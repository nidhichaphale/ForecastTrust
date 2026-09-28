import type { RegionId, RiskLevel, DataQualityStatus } from './index'

export type DataTabId = 'overview' | 'coverage' | 'quality' | 'explorer' | 'availability'

export type QualityIssueCategory =
  | 'missing_observation'
  | 'partial_ensemble'
  | 'lead_day_omission'
  | 'invalid_value'
  | 'metadata_warning'

export interface DataWorkspaceKPIs {
  totalForecastRecords: number
  totalLocations: number
  totalForecastDates: number
  totalLeadDaysCovered: number
  totalObservedRecords: number
  missingObservationsCount: number
  qualityIssuesCount: number
  latestForecastDate: string
  earliestForecastDate: string
  completenessRate: number
  scheduledLeadDays: number[]
  omittedLeadDays: number[]
}

export interface GeographicCoverageStat {
  region: RegionId
  regionName: string
  locationsCount: number
  forecastRecordsCount: number
  observedCount: number
  missingObsCount: number
  coveragePercentage: number
  statesCount: number
  states: string[]
}

export interface StateCoverageStat {
  state: string
  region: RegionId
  locationsCount: number
  forecastRecordsCount: number
  observedCount: number
  missingObsCount: number
  coveragePercentage: number
}

export interface LeadDayCoverageStat {
  leadDay: number
  label: string
  forecastCount: number
  observedCount: number
  missingObsCount: number
  isScheduled: boolean
  coveragePercentage: number
  statusNote: string
}

export interface TemporalCoverageStat {
  date: string
  forecastCount: number
  observedCount: number
  missingCount: number
}

export interface DataQualityIssueRecord {
  id: string
  forecastId: string
  locationId: string
  locationName: string
  state: string
  region: RegionId
  validDate: string
  leadDay: number
  category: QualityIssueCategory
  categoryLabel: string
  severity: RiskLevel
  description: string
  impact: string
}

export interface AvailabilityCell {
  available: boolean
  hasObservation: boolean
  status: DataQualityStatus | 'not_scheduled'
}

export interface LocationAvailabilityRow {
  locationId: string
  locationName: string
  state: string
  region: RegionId
  leadDays: Record<number, AvailabilityCell>
  totalAvailable: number
  completenessRate: number
}
