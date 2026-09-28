import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import type { Alert } from '../types'
import { MOCK_ALERTS } from '../mock/alerts'

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

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined)

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session-level operational alert records
  const [alerts, setAlerts] = useState<Alert[]>(() => [...MOCK_ALERTS])

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id !== alertId) return alt
        return {
          ...alt,
          status: 'acknowledged',
          isRead: true,
          acknowledgedAt: new Date().toISOString(),
        }
      })
    )
  }, [])

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id !== alertId) return alt
        return {
          ...alt,
          status: 'resolved',
          isResolved: true,
          isRead: true,
          resolvedAt: new Date().toISOString(),
        }
      })
    )
  }, [])

  const reopenAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id !== alertId) return alt
        return {
          ...alt,
          status: 'new',
          isResolved: false,
          isRead: false,
          resolvedAt: undefined,
        }
      })
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) =>
      prev.map((alt) => ({
        ...alt,
        isRead: true,
        status: alt.status === 'new' ? 'acknowledged' : alt.status,
      }))
    )
  }, [])

  const getAlertById = useCallback(
    (alertId: string) => alerts.find((a) => a.id === alertId),
    [alerts]
  )

  const unreadCount = useMemo(() => alerts.filter((a) => !a.isRead).length, [alerts])
  const unacknowledgedCount = useMemo(() => alerts.filter((a) => a.status === 'new').length, [alerts])
  const activeCount = useMemo(() => alerts.filter((a) => !a.isResolved && a.status !== 'resolved').length, [alerts])
  const highCriticalCount = useMemo(
    () => alerts.filter((a) => !a.isResolved && (a.severity === 'high' || a.severity === 'severe')).length,
    [alerts]
  )

  const value = useMemo(
    () => ({
      alerts,
      unreadCount,
      unacknowledgedCount,
      activeCount,
      highCriticalCount,
      acknowledgeAlert,
      resolveAlert,
      reopenAlert,
      markAllAsRead,
      getAlertById,
    }),
    [
      alerts,
      unreadCount,
      unacknowledgedCount,
      activeCount,
      highCriticalCount,
      acknowledgeAlert,
      resolveAlert,
      reopenAlert,
      markAllAsRead,
      getAlertById,
    ]
  )

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>
}

export function useAlerts(): AlertsContextValue {
  const context = useContext(AlertsContext)
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider')
  }
  return context
}
