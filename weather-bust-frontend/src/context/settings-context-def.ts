import { createContext } from 'react'
import type {
  UserSettings,
  GeneralSettings,
  AppearanceSettings,
  ForecastRiskSettings,
  DataAnalysisSettings,
  NotificationSettings,
} from '../types/settings'

export interface SettingsContextType {
  settings: UserSettings
  updateGeneral: (patch: Partial<GeneralSettings>) => void
  updateAppearance: (patch: Partial<AppearanceSettings>) => void
  updateForecastRisk: (patch: Partial<ForecastRiskSettings>) => void
  updateDataAnalysis: (patch: Partial<DataAnalysisSettings>) => void
  updateNotifications: (patch: Partial<NotificationSettings>) => void
  resetSettings: () => void
  isModifiedFromDefaults: boolean
  lastSaved: Date | null
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)
