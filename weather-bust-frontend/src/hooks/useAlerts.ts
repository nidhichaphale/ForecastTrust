import { useContext } from 'react'
import { AlertsContext, type AlertsContextValue } from '../context/alerts-context-def'

export function useAlerts(): AlertsContextValue {
  const context = useContext(AlertsContext)
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider')
  }
  return context
}
