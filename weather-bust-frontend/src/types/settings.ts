/**
 * Settings & System Preference Type Definitions.
 */

export type LandingWorkspace =
  | '/'
  | '/forecasts'
  | '/map'
  | '/bust-detection'
  | '/hidden-risk'
  | '/analysis'
  | '/data'
  | '/alerts'

export type ThemePreference = 'dark' | 'light' | 'system'

export type UiDensity = 'comfortable' | 'compact'

export type DateFormatPreference = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MMM DD, YYYY'

export type RainfallUnit = 'mm' | 'cm' | 'inches'

export type DecimalPrecision = 0 | 1 | 2

export type RiskDisplayPreference = 'riskLevel' | 'bustProbability' | 'ensembleSpread'

export type DefaultDateBehavior = 'latest' | 'today' | 'custom'

export interface GeneralSettings {
  defaultLandingWorkspace: LandingWorkspace
  defaultDateBehavior: DefaultDateBehavior
  defaultLeadDay: number | 'all'
  defaultRegion: string // 'all' or specific RegionId
}

export interface AppearanceSettings {
  theme: ThemePreference
  density: UiDensity
  showConfidenceMetrics: boolean
  enableHighContrastCards: boolean
}

export interface ForecastRiskSettings {
  defaultForecastView: 'list' | 'map'
  defaultRiskMetric: RiskDisplayPreference
  autoHighlightHighRisk: boolean
  showEnsembleMiniDistributions: boolean
}

export interface DataAnalysisSettings {
  dateFormat: DateFormatPreference
  rainfallUnit: RainfallUnit
  decimalPrecision: DecimalPrecision
  tableRowsPerPage: number
  autoRefreshDataIntervalSec: number
}

export interface NotificationSettings {
  showNotificationBadge: boolean
  headerMaxItems: number
  alertSoundEnabled: boolean
  enabledCategories: {
    severe_forecast_bust: boolean
    hidden_risk_zero_spread: boolean
    extreme_ensemble_divergence: boolean
    flash_convective_discrepancy: boolean
    high_bust_risk: boolean
    data_quality_missing_observation: boolean
  }
}

export interface UserSettings {
  general: GeneralSettings
  appearance: AppearanceSettings
  forecastRisk: ForecastRiskSettings
  dataAnalysis: DataAnalysisSettings
  notifications: NotificationSettings
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  general: {
    defaultLandingWorkspace: '/',
    defaultDateBehavior: 'latest',
    defaultLeadDay: 'all',
    defaultRegion: 'all',
  },
  appearance: {
    theme: 'dark',
    density: 'comfortable',
    showConfidenceMetrics: true,
    enableHighContrastCards: false,
  },
  forecastRisk: {
    defaultForecastView: 'list',
    defaultRiskMetric: 'riskLevel',
    autoHighlightHighRisk: true,
    showEnsembleMiniDistributions: true,
  },
  dataAnalysis: {
    dateFormat: 'YYYY-MM-DD',
    rainfallUnit: 'mm',
    decimalPrecision: 1,
    tableRowsPerPage: 25,
    autoRefreshDataIntervalSec: 0, // Disabled
  },
  notifications: {
    showNotificationBadge: true,
    headerMaxItems: 5,
    alertSoundEnabled: false,
    enabledCategories: {
      severe_forecast_bust: true,
      hidden_risk_zero_spread: true,
      extreme_ensemble_divergence: true,
      flash_convective_discrepancy: true,
      high_bust_risk: true,
      data_quality_missing_observation: true,
    },
  },
}
