import { useContext } from 'react'
import { SettingsContext, type SettingsContextType } from '../context/settings-context-def'

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
