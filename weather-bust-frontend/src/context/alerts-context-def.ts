import { createContext } from 'react'
import type { Alert } from '../types'

export interface AlertsContextValue {
  alerts: Alert[]
  unreadCount: number
  unacknowledgedCount: number
  activeCount: number
  highCriticalCount: number
  acknowledgeAlert: (alertId: string) => void
  resolveAlert: (alertId: string) => void
  reopenAlert: (alertId: string) => void
  markAllAsRead: () => void
  getAlertById: (alertId: string) => Alert | undefined
}

export const AlertsContext = createContext<AlertsContextValue | undefined>(undefined)
