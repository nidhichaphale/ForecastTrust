/**
 * Centralized Domain Types for the Weather Forecast Bust Detection Platform.
 * Fully typed, reusable contracts simulating production weather-intelligence APIs.
 */

export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe'

export type BustStatus = 'normal' | 'borderline' | 'bust'

export type RegionId =
  | 'North India'
  | 'South India'
  | 'East India'
  | 'West India'
  | 'Central India'
  | 'Northeast India'

export interface Location {
  id: string
  name: string
  state: string
  region: RegionId
  latitude: number
  longitude: number
  elevationMeters: number
  isCoastal: boolean
}

export interface Region {
  id: RegionId
  name: string
  description: string
  locationCount: number
  primaryTerrain: string
}

export type DataQualityStatus = 'complete' | 'partial' | 'missing_observation' | 'invalid'

export interface Forecast {
  id: string
  locationId: string
  locationName: string
  state: string
  region: RegionId
  initDate: string // YYYY-MM-DD
  validDate: string // YYYY-MM-DD
  leadDay: number // 1 to 10
  forecastRainfall: number // mm
  observedRainfall: number // mm
  hasObservation?: boolean // false if ground truth observation is unavailable/missing
  forecastError: number // observed - forecast (mm)
  ensembleMean: number // mm
  ensembleSpread: number // std dev (mm)
  ensembleMin: number // mm
  ensembleMax: number // mm
  ensembleRange: number // max - min (mm)
  bustProbability: number // 0.00 to 1.00
  riskLevel: RiskLevel
  confidence: number // 0.00 to 1.00
  bustStatus: BustStatus
  zeroSpread: boolean
  dataStatus?: DataQualityStatus
  qualityIssues?: string[]
}

export interface EnsembleForecast {
  forecastId: string
  memberCount: number
  members: number[]
  percentile10: number
  percentile50: number
  percentile90: number
}

export interface BustEvent {
  id: string
  forecastId: string
  locationId: string
  locationName: string
  state: string
  region: RegionId
  initDate: string
  validDate: string
  leadDay: number
  forecastRainfall: number
  observedRainfall: number
  error: number
  bustProbability: number
  severity: RiskLevel
  detectionConfidence: number
  bustType: 'excess_underforecast' | 'deficit_overforecast' | 'unpredicted_convective'
  summary: string
}

export interface HiddenRiskRecord {
  id: string
  locationId: string
  locationName: string
  state: string
  region: RegionId
  validDate: string
  leadDay: number
  zeroSpreadStatus: boolean
  zeroForecastStatus: boolean
  ensembleSpread: number
  forecastRainfall: number
  observedRainfall: number
  hiddenRiskStatus: boolean
  hiddenRiskProbability: number
  outcomeType: 'accurate_dry_agreement' | 'hidden_bust_occurrence' | 'marginal_drizzle'
  notes: string
}

export type AlertStatus = 'new' | 'acknowledged' | 'resolved'

export type AlertType =
  | 'severe_forecast_bust'
  | 'hidden_risk_zero_spread'
  | 'extreme_ensemble_divergence'
  | 'flash_convective_discrepancy'
  | 'high_bust_risk'
  | 'data_quality_missing_observation'

export interface Alert {
  id: string
  timestamp: string
  locationId: string
  locationName: string
  state?: string
  region: RegionId
  alertType: AlertType
  severity: RiskLevel
  message: string
  relatedForecastId?: string
  relatedBustEventId?: string
  isRead: boolean
  isResolved: boolean
  status: AlertStatus
  acknowledgedAt?: string
  resolvedAt?: string
  validDate?: string
  leadDay?: number
  triggerMetric?: string
  triggerValue?: string | number
  threshold?: string | number
}

export interface ModelMetric {
  modelId: string
  modelName: string
  rocAuc: number
  prAuc: number
  brierScore: number
  precision: number
  recall: number
  f1Score: number
  accuracy: number
  brierSkillScore: number
  calibrationError: number
  description: string
  leadDayDegradation: {
    leadDay: number
    rocAuc: number
    brierScore: number
    f1Score: number
  }[]
}

export interface FeatureImportance {
  featureName: string
  displayName: string
  category: 'ensemble' | 'temporal' | 'spatial' | 'historical'
  importanceScore: number
  normalizedRatio: number
  rank: number
  description: string
}

export interface RegionalStatistic {
  region: RegionId
  forecastCount: number
  bustCount: number
  bustRate: number // percentage e.g. 14.5
  avgForecastRainfall: number // mm
  avgObservedRainfall: number // mm
  avgError: number // mm
  avgRiskProbability: number
  highRiskCount: number
  topAffectedState: string
}

export interface LeadDayStatistic {
  leadDay: number // 1 to 10
  forecastCount: number
  bustCount: number
  bustRate: number
  avgError: number
  avgSpread: number
  avgBustProbability: number
  modelRocAuc: number
}

export interface HistoricalStatistic {
  period: string // YYYY-MM
  monthName: string
  year: number
  totalForecasts: number
  totalBusts: number
  bustRate: number
  severeBusts: number
  avgObservedRainfall: number
  avgForecastRainfall: number
  precipitationAnomaly: number
}

export interface DataQualityStatistic {
  totalRecords: number
  validRecords: number
  missingValues: number
  missingPercentage: number
  zeroForecasts: number
  zeroSpreadCases: number
  bustLabelsCount: number
  dateCoverageStart: string
  dateCoverageEnd: string
  totalLocations: number
  completenessRate: number
}

// Filter parameter interfaces
export interface ForecastFilterParams {
  startDate?: string
  endDate?: string
  locationId?: string
  state?: string
  region?: RegionId
  leadDay?: number
  riskLevel?: RiskLevel
  bustStatus?: BustStatus
  minError?: number
  zeroSpreadOnly?: boolean
  searchQuery?: string
  dataStatus?: DataQualityStatus
}

export interface BustEventFilterParams {
  region?: RegionId
  state?: string
  severity?: RiskLevel
  leadDay?: number
  minError?: number
}

export interface AlertFilterParams {
  severity?: RiskLevel
  status?: AlertStatus | 'all'
  alertType?: string
  region?: RegionId
  state?: string
  locationId?: string
  startDate?: string
  endDate?: string
  leadDay?: number
  unreadOnly?: boolean
  unresolvedOnly?: boolean
  searchQuery?: string
}

// Navigation and Config
export interface NavItem {
  label: string
  path?: string
  badge?: string
}

export interface AppConfig {
  appName: string
  appVersion: string
  environment: string
}

export * from './settings'
