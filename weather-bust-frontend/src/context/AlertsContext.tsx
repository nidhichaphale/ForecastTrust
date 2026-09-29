import React, { useState, useMemo, useCallback } from 'react'
import type { Alert } from '../types'
import { MOCK_ALERTS } from '../mock/alerts'
import { AlertsContext } from './alerts-context-def'

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
          acknowledgedAt: undefined,
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
      }))
    )
  }, [])

  const getAlertById = useCallback(
    (alertId: string): Alert | undefined => {
      return alerts.find((alt) => alt.id === alertId)
    },
    [alerts]
  )

  // Derived triage metrics
  const unreadCount = useMemo(() => alerts.filter((a) => !a.isRead).length, [alerts])
  const unacknowledgedCount = useMemo(
    () => alerts.filter((a) => a.status === 'new').length,
    [alerts]
  )
  const activeCount = useMemo(() => alerts.filter((a) => !a.isResolved).length, [alerts])
  const highCriticalCount = useMemo(
    () =>
      alerts.filter(
        (a) => !a.isResolved && (a.severity === 'high' || a.severity === 'severe')
      ).length,
    [alerts]
  )

  return (
    <AlertsContext.Provider
      value={{
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
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}
