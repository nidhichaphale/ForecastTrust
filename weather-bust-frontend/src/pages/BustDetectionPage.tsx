import React, { useState, useMemo } from 'react'
import { getForecasts, getBustEvents, getRegions, getLocations, getForecastById } from '../mock'
import { getMockValidDates } from '../mock/mapHelpers'
import type { ForecastFilterParams, RegionId, Forecast } from '../types'

import {
  calculateBustSummary,
  calculateBustTrend,
  calculateBustsByLeadDay,
  calculateBustsByRegion,
  calculateLocationBustStats,
  calculateBustProbabilityBuckets,
  calculateBustVsNonBustStats,
  calculateRiskOutcomes,
  calculateErrorDistribution,
  getLargestErrors,
} from '../utils/bustAnalysis'
import { calculateRiskWorkspaceSummary } from '../utils/riskContextAnalysis'

import { BustFilters } from '../components/bust/BustFilters'
import { BustSummaryKPIs } from '../components/bust/BustSummaryKPIs'
import { BustTrendChart } from '../components/bust/BustTrendChart'
import { ErrorDistributionChart } from '../components/bust/ErrorDistributionChart'
import { BustProbabilityChart } from '../components/bust/BustProbabilityChart'
import { LeadDayBustChart } from '../components/bust/LeadDayBustChart'
import { RegionalBustTable } from '../components/bust/RegionalBustTable'
import { LocationBustTable } from '../components/bust/LocationBustTable'
import { BustEventTable } from '../components/bust/BustEventTable'
import { BustVsNonBustComparison } from '../components/bust/BustVsNonBustComparison'
import { RiskWorkspaceNav, RiskContextBar, RiskInvestigationDrawer } from '../components/risk'
import { useUrlFilters } from '../hooks/useUrlFilters'

// Stable static references
const ALL_DATES = getMockValidDates()
const ALL_REGIONS = getRegions().map((r) => r.name)
const LEAD_DAYS = [1, 2, 3, 4, 5, 7, 10]

export const BustDetectionPage: React.FC = () => {
  const [filters, setFilters] = useUrlFilters<ForecastFilterParams>()

  // Drawer state for interactive forecast deep dive
  const [drawerForecast, setDrawerForecast] = useState<Forecast | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Unfiltered baseline for workspace header counts
  const allForecasts = useMemo(() => getForecasts(), [])

  // Available states based on selected region
  const availableStates = useMemo(() => {
    const locs = getLocations(filters.region as RegionId | undefined)
    return Array.from(new Set(locs.map((l) => l.state))).sort()
  }, [filters.region])

  // Core filtered dataset
  const forecasts = useMemo(() => getForecasts(filters), [filters])

  // Risk workspace metrics
  const riskMetrics = useMemo(() => calculateRiskWorkspaceSummary(forecasts), [forecasts])

  // Bust events filtered by the same region/state/leadDay if set
  const bustEvents = useMemo(() => {
    const all = getBustEvents()
    return all.filter((ev) => {
      if (filters.region && ev.region !== filters.region) return false
      if (filters.state && ev.state.toLowerCase() !== filters.state.toLowerCase()) return false
      if (filters.leadDay !== undefined && ev.leadDay !== filters.leadDay) return false
      if (filters.startDate && ev.validDate < filters.startDate) return false
      if (filters.endDate && ev.validDate > filters.endDate) return false
      return true
    })
  }, [filters])

  // Derived analytics — all memoized
  const summary = useMemo(() => calculateBustSummary(forecasts), [forecasts])
  const trend = useMemo(() => calculateBustTrend(forecasts), [forecasts])
  const byLeadDay = useMemo(() => calculateBustsByLeadDay(forecasts), [forecasts])
  const byRegion = useMemo(() => calculateBustsByRegion(forecasts), [forecasts])
  const byLocation = useMemo(() => calculateLocationBustStats(forecasts), [forecasts])
  const probBuckets = useMemo(() => calculateBustProbabilityBuckets(forecasts), [forecasts])
  const vsStats = useMemo(() => calculateBustVsNonBustStats(forecasts), [forecasts])
  const riskOutcomes = useMemo(() => calculateRiskOutcomes(forecasts), [forecasts])
  const errorBins = useMemo(() => calculateErrorDistribution(forecasts), [forecasts])
  const largestErrors = useMemo(() => getLargestErrors(forecasts, 10), [forecasts])

  const handleSelectForecast = (forecastId: string) => {
    const fc = getForecastById(forecastId)
    if (fc) {
      setDrawerForecast(fc)
      setIsDrawerOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Risk & Busts Workspace Navigation */}
      <RiskWorkspaceNav allForecasts={allForecasts} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bust Detection &amp; Verification</h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
            Analyze forecast failures, error patterns, and high-impact bust events across monitored locations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 mt-1">
          <span className="bg-[#0b172a] border border-[#1a2e4c] px-2 py-1 rounded font-mono">
            {forecasts.length.toLocaleString()} forecasts analyzed
          </span>
          <span className="bg-red-950/30 border border-red-900/40 px-2 py-1 rounded font-mono text-red-400">
            {summary.bustCount} busts
          </span>
        </div>
      </div>

      {/* Shared Context Bar */}
      <RiskContextBar metrics={riskMetrics} />

      {/* Filters */}
      <BustFilters
        filters={filters}
        setFilters={setFilters}
        availableDates={ALL_DATES}
        availableRegions={ALL_REGIONS}
        availableStates={availableStates}
        availableLeadDays={LEAD_DAYS}
      />

      {/* KPIs */}
      <BustSummaryKPIs stats={summary} />

      {/* Trend + Error Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BustTrendChart data={trend} />
        <ErrorDistributionChart data={errorBins} />
      </div>

      {/* Probability vs Outcome + Lead Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BustProbabilityChart data={probBuckets} />
        <LeadDayBustChart data={byLeadDay} />
      </div>

      {/* Regional + Risk vs Outcome */}
      <RegionalBustTable regions={byRegion} riskOutcomes={riskOutcomes} />

      {/* Bust vs Non-Bust + Largest Errors */}
      <BustVsNonBustComparison stats={vsStats} largestErrors={largestErrors} />

      {/* Location Table */}
      <LocationBustTable locations={byLocation} />

      {/* Recent Bust Events */}
      <BustEventTable events={bustEvents} onSelectForecast={handleSelectForecast} />

      {/* Unified Risk Investigation Drawer */}
      <RiskInvestigationDrawer
        forecast={drawerForecast}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sourceWorkspace="bust-detection"
      />
    </div>
  )
}

