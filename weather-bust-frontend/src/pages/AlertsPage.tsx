import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAlerts } from '../hooks'
import type { Alert, AlertFilterParams, RegionId, AlertStatus, RiskLevel } from '../types'
import { getRegions, getLocations } from '../mock'
import {
  AlertsSummaryKPIs,
  AlertQuickViews,
  type AlertQuickViewKey,
  AlertFilters,
  AlertTable,
  AlertInvestigationDrawer,
  AlertTimelineChart,
} from '../components/alerts'

export const AlertsPage: React.FC = () => {
  const { alerts, unacknowledgedCount, acknowledgeAlert, resolveAlert, reopenAlert, getAlertById } =
    useAlerts()

  const [searchParams, setSearchParams] = useSearchParams()

  // Primary filter state
  const [filters, setFilters] = useState<AlertFilterParams>(() => ({
    status: (searchParams.get('status') as AlertStatus) || undefined,
    severity: (searchParams.get('severity') as RiskLevel) || undefined,
    alertType: searchParams.get('alertType') || undefined,
    region: (searchParams.get('region') as RegionId) || undefined,
    searchQuery: searchParams.get('q') || undefined,
  }))

  const [activeQuickView, setActiveQuickView] = useState<AlertQuickViewKey>('all')

  const alertIdParam = searchParams.get('alertId')
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(alertIdParam)

  // Derive active alert: user selection takes precedence, fallback to URL parameter
  const selectedAlert = useMemo(() => {
    const id = selectedAlertId ?? alertIdParam
    if (!id) return null
    return getAlertById(id) ?? null
  }, [selectedAlertId, alertIdParam, getAlertById])

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(Boolean(alertIdParam))

  // Available regions & states
  const availableRegions = useMemo(() => getRegions().map((r) => r.name), [])
  const availableStates = useMemo(() => {
    const locs = getLocations(filters.region as RegionId | undefined)
    return Array.from(new Set(locs.map((l) => l.state))).sort()
  }, [filters.region])

  // Quick view tab selection applies sensible filter presets
  const handleQuickViewChange = (viewKey: AlertQuickViewKey) => {
    setActiveQuickView(viewKey)
    if (viewKey === 'all') {
      setFilters((prev) => ({ ...prev, status: undefined, severity: undefined, alertType: undefined }))
    } else if (viewKey === 'unacknowledged') {
      setFilters((prev) => ({ ...prev, status: 'new', alertType: undefined, severity: undefined }))
    } else if (viewKey === 'high_critical') {
      setFilters((prev) => ({ ...prev, severity: 'severe', alertType: undefined }))
    } else if (viewKey === 'busts') {
      setFilters((prev) => ({ ...prev, alertType: 'severe_forecast_bust' }))
    } else if (viewKey === 'hidden_risk') {
      setFilters((prev) => ({ ...prev, alertType: 'hidden_risk_zero_spread' }))
    } else if (viewKey === 'data_quality') {
      setFilters((prev) => ({ ...prev, alertType: 'data_quality_missing_observation' }))
    }
  }

  // Filter alerts according to current parameters and quick view
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alt) => {
      // Quick view constraints
      if (activeQuickView === 'unacknowledged' && alt.status !== 'new') return false
      if (activeQuickView === 'high_critical' && alt.severity !== 'high' && alt.severity !== 'severe')
        return false
      if (
        activeQuickView === 'busts' &&
        alt.alertType !== 'severe_forecast_bust' &&
        alt.alertType !== 'flash_convective_discrepancy'
      )
        return false
      if (activeQuickView === 'hidden_risk' && alt.alertType !== 'hidden_risk_zero_spread') return false
      if (activeQuickView === 'data_quality' && alt.alertType !== 'data_quality_missing_observation')
        return false

      // Explicit filter constraints
      if (filters.status && filters.status !== 'all' && alt.status !== filters.status) return false
      if (filters.severity && alt.severity !== filters.severity) return false
      if (filters.alertType && filters.alertType !== 'all' && alt.alertType !== filters.alertType) return false
      if (filters.region && alt.region !== filters.region) return false
      if (filters.state && alt.state && alt.state.toLowerCase() !== filters.state.toLowerCase())
        return false

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim()
        const matchId = alt.id.toLowerCase().includes(q)
        const matchLoc = alt.locationName.toLowerCase().includes(q)
        const matchState = alt.state?.toLowerCase().includes(q)
        const matchMsg = alt.message.toLowerCase().includes(q)
        const matchType = alt.alertType.toLowerCase().includes(q)
        const matchFcId = alt.relatedForecastId?.toLowerCase().includes(q)
        if (!matchId && !matchLoc && !matchState && !matchMsg && !matchType && !matchFcId) return false
      }

      return true
    })
  }, [alerts, filters, activeQuickView])

  // Derived counts for quick view badges
  const quickCounts = useMemo(() => {
    return {
      total: alerts.length,
      unacknowledged: alerts.filter((a) => a.status === 'new').length,
      highCritical: alerts.filter((a) => a.severity === 'high' || a.severity === 'severe').length,
      busts: alerts.filter(
        (a) => a.alertType === 'severe_forecast_bust' || a.alertType === 'flash_convective_discrepancy'
      ).length,
      hiddenRisk: alerts.filter((a) => a.alertType === 'hidden_risk_zero_spread').length,
      dataQuality: alerts.filter((a) => a.alertType === 'data_quality_missing_observation').length,
    }
  }, [alerts])

  const handleClearFilters = () => {
    setFilters({})
    setActiveQuickView('all')
    setSearchParams({})
  }

  const handleSelectAlert = (alt: Alert) => {
    setSelectedAlertId(alt.id)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-[#0b172a] border border-[#1a2e4c] px-2 py-0.5 rounded">
              System Workspace
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Alerts &amp; Operational Warnings</h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-3xl">
            Triage operational failures, model verification busts, hidden-risk anomalies, and data ingest latency
            across the weather monitoring network.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 mt-1">
          <span className="bg-[#0b172a] border border-[#1a2e4c] px-2.5 py-1 rounded font-mono">
            {filteredAlerts.length} of {alerts.length} alerts
          </span>
          {unacknowledgedCount > 0 && (
            <span className="bg-red-950/40 border border-red-800/60 px-2.5 py-1 rounded font-mono text-red-300">
              {unacknowledgedCount} unacknowledged
            </span>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <AlertsSummaryKPIs alerts={alerts} />

      {/* Quick Views */}
      <AlertQuickViews
        activeView={activeQuickView}
        onSelectView={handleQuickViewChange}
        counts={quickCounts}
      />

      {/* Operational Filter Bar */}
      <AlertFilters
        filters={filters}
        setFilters={setFilters}
        availableRegions={availableRegions}
        availableStates={availableStates}
        onClearFilters={handleClearFilters}
      />

      {/* Timeline Chart */}
      <AlertTimelineChart alerts={filteredAlerts} />

      {/* Alert Registry Table */}
      <AlertTable
        alerts={filteredAlerts}
        onSelectAlert={handleSelectAlert}
        onAcknowledge={acknowledgeAlert}
        onResolve={resolveAlert}
        onReopen={reopenAlert}
        onClearFilters={handleClearFilters}
      />

      {/* Reusable Investigation Drawer */}
      <AlertInvestigationDrawer
        alert={selectedAlert}
        isOpen={isDrawerOpen && selectedAlert !== null}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedAlertId(null)
          if (alertIdParam) {
            const next = new URLSearchParams(searchParams)
            next.delete('alertId')
            setSearchParams(next)
          }
        }}
        onAcknowledge={acknowledgeAlert}
        onResolve={resolveAlert}
        onReopen={reopenAlert}
      />
    </div>
  )
}
