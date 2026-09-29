import React, { useState, useEffect, useCallback } from 'react'
import {
  type UserSettings,
  type GeneralSettings,
  type AppearanceSettings,
  type ForecastRiskSettings,
  type DataAnalysisSettings,
  type NotificationSettings,
  DEFAULT_USER_SETTINGS,
} from '../types/settings'
import { SettingsContext } from './settings-context-def'

const SETTINGS_STORAGE_KEY = 'weather_intelligence_settings_v1'

/**
 * Safely merge stored settings with default settings to prevent undefined properties on schema updates.
 */
function mergeSettings(saved: unknown): UserSettings {
  if (!saved || typeof saved !== 'object') {
    return DEFAULT_USER_SETTINGS
  }

  const s = saved as Partial<UserSettings>

  return {
    general: {
      ...DEFAULT_USER_SETTINGS.general,
      ...(s.general || {}),
    },
    appearance: {
      ...DEFAULT_USER_SETTINGS.appearance,
      ...(s.appearance || {}),
    },
    forecastRisk: {
      ...DEFAULT_USER_SETTINGS.forecastRisk,
      ...(s.forecastRisk || {}),
    },
    dataAnalysis: {
      ...DEFAULT_USER_SETTINGS.dataAnalysis,
      ...(s.dataAnalysis || {}),
    },
    notifications: {
      ...DEFAULT_USER_SETTINGS.notifications,
      ...(s.notifications || {}),
      enabledCategories: {
        ...DEFAULT_USER_SETTINGS.notifications.enabledCategories,
        ...(s.notifications?.enabledCategories || {}),
      },
    },
  }
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (raw) {
        return mergeSettings(JSON.parse(raw))
      }
    } catch (e) {
      console.warn('Failed to parse user settings from localStorage:', e)
    }
    return DEFAULT_USER_SETTINGS
  })

  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Save to localStorage whenever settings state changes (pure synchronization, no setLastSaved inside)
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.error('Failed to persist user settings to localStorage:', e)
    }
  }, [settings])

  // Handle system theme resolution and DOM class updates
  useEffect(() => {
    const root = document.documentElement
    const themePref = settings.appearance.theme

    let resolvedTheme: 'dark' | 'light' = 'dark'
    if (themePref === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      resolvedTheme = prefersDark ? 'dark' : 'light'
    } else {
      resolvedTheme = themePref
    }

    if (resolvedTheme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }

    // Keep legacy wt_theme key in sync for any other utilities
    localStorage.setItem('wt_theme', resolvedTheme)
  }, [settings.appearance.theme])

  // Apply UI Density to html/body if desired
  useEffect(() => {
    const root = document.documentElement
    if (settings.appearance.density === 'compact') {
      root.setAttribute('data-density', 'compact')
    } else {
      root.removeAttribute('data-density')
    }
  }, [settings.appearance.density])

  const updateGeneral = useCallback((patch: Partial<GeneralSettings>) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, ...patch },
    }))
    setLastSaved(new Date())
  }, [])

  const updateAppearance = useCallback((patch: Partial<AppearanceSettings>) => {
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, ...patch },
    }))
    setLastSaved(new Date())
  }, [])

  const updateForecastRisk = useCallback((patch: Partial<ForecastRiskSettings>) => {
    setSettings((prev) => ({
      ...prev,
      forecastRisk: { ...prev.forecastRisk, ...patch },
    }))
    setLastSaved(new Date())
  }, [])

  const updateDataAnalysis = useCallback((patch: Partial<DataAnalysisSettings>) => {
    setSettings((prev) => ({
      ...prev,
      dataAnalysis: { ...prev.dataAnalysis, ...patch },
    }))
    setLastSaved(new Date())
  }, [])

  const updateNotifications = useCallback((patch: Partial<NotificationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...patch },
    }))
    setLastSaved(new Date())
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_USER_SETTINGS)
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
    setLastSaved(new Date())
  }, [])

  // Check if modified compared to DEFAULT_USER_SETTINGS
  const isModifiedFromDefaults =
    JSON.stringify(settings) !== JSON.stringify(DEFAULT_USER_SETTINGS)

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateGeneral,
        updateAppearance,
        updateForecastRisk,
        updateDataAnalysis,
        updateNotifications,
        resetSettings,
        isModifiedFromDefaults,
        lastSaved,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
