import React, { useState, useMemo } from 'react'
import { getForecasts, getRegions, getLocations } from '../mock'
import { getMockValidDates } from '../mock/mapHelpers'
import type { RegionId, Forecast } from '../types'
import {
  calculateHiddenRiskSummary,
  calculateZeroForecastOutcomes,
  calculateSpreadDistribution,
  calculateLocationHiddenRisk,
  calculateRegionHiddenRisk,
  calculateLeadDayHiddenRisk,
  calculateHiddenRiskTrend,
  calculateSpreadConditionComparison,
  calculateForecastConditionComparison,
  getHiddenRiskScatterData,
  getHiddenRiskCases,
  isZeroSpread,
  isZeroForecast,
} from '../utils/hiddenRiskAnalysis'
import { calculateRiskWorkspaceSummary } from '../utils/riskContextAnalysis'

import { HiddenRiskThresholdsBanner } from '../components/hiddenRisk/HiddenRiskThresholdsBanner'
import { HiddenRiskFilters, type HiddenRiskFilterState } from '../components/hiddenRisk/HiddenRiskFilters'
import { HiddenRiskSummaryKPIs } from '../components/hiddenRisk/HiddenRiskSummaryKPIs'
import { ZeroSpreadVsObservedChart } from '../components/hiddenRisk/ZeroSpreadVsObservedChart'
import { SpreadDistributionChart } from '../components/hiddenRisk/SpreadDistributionChart'
import { ZeroForecastOutcomesChart } from '../components/hiddenRisk/ZeroForecastOutcomesChart'
import { HiddenRiskTrendChart } from '../components/hiddenRisk/HiddenRiskTrendChart'
import { SpreadAndForecastComparisons } from '../components/hiddenRisk/SpreadAndForecastComparisons'
import { HiddenRiskCasesTable } from '../components/hiddenRisk/HiddenRiskCasesTable'
import { LocationHiddenRiskTable } from '../components/hiddenRisk/LocationHiddenRiskTable'
import { RegionalAndLeadDayAnalysis } from '../components/hiddenRisk/RegionalAndLeadDayAnalysis'
import { RiskWorkspaceNav, RiskContextBar, RiskInvestigationDrawer } from '../components/risk'
import { useUrlFilters } from '../hooks/useUrlFilters'

const ALL_DATES = getMockValidDates()
const ALL_REGIONS = getRegions().map((r) => r.name)
const LEAD_DAYS = [1, 2, 3, 4, 5, 7, 10]

export const HiddenRiskPage: React.FC = () => {
  const [filters, setFilters] = useUrlFilters<HiddenRiskFilterState>()
  const [activeQuickView, setActiveQuickView] = useState('all')

  // Drawer state for interactive forecast deep dive
  const [drawerForecast, setDrawerForecast] = useState<Forecast | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Unfiltered baseline for workspace header counts
  const allForecasts = useMemo(() => getForecasts(), [])

  // Dynamic states list based on active region
  const availableStates = useMemo(() => {
    const locs = getLocations(filters.region as RegionId | undefined)
    return Array.from(new Set(locs.map((l) => l.state))).sort()
  }, [filters.region])

  // Central dataset filtered with parametric criteria
  const filteredForecasts = useMemo(() => {
    const base = getForecasts(filters)

    return base.filter((fc) => {
      if (filters.spreadCondition === 'zero' && !isZeroSpread(fc)) return false
      if (filters.spreadCondition === 'nonzero' && isZeroSpread(fc)) return false
      if (filters.forecastCondition === 'zero' && !isZeroForecast(fc)) return false
      if (filters.forecastCondition === 'wet' && isZeroForecast(fc)) return false
      return true
    })
  }, [filters])

  // Risk workspace metrics
  const riskMetrics = useMemo(() => calculateRiskWorkspaceSummary(filteredForecasts), [filteredForecasts])

  // Memoized analytical aggregations
  const summary = useMemo(() => calculateHiddenRiskSummary(filteredForecasts), [filteredForecasts])
  const scatterData = useMemo(() => getHiddenRiskScatterData(filteredForecasts), [filteredForecasts])
  const zeroForecastOutcomes = useMemo(() => calculateZeroForecastOutcomes(filteredForecasts), [filteredForecasts])
  const spreadDistribution = useMemo(() => calculateSpreadDistribution(filteredForecasts), [filteredForecasts])
  const trendData = useMemo(() => calculateHiddenRiskTrend(filteredForecasts), [filteredForecasts])
  const spreadComparison = useMemo(() => calculateSpreadConditionComparison(filteredForecasts), [filteredForecasts])
  const forecastComparison = useMemo(() => calculateForecastConditionComparison(filteredForecasts), [filteredForecasts])
  const locationStats = useMemo(() => calculateLocationHiddenRisk(filteredForecasts), [filteredForecasts])
  const regionStats = useMemo(() => calculateRegionHiddenRisk(filteredForecasts), [filteredForecasts])
  const leadDayStats = useMemo(() => calculateLeadDayHiddenRisk(filteredForecasts), [filteredForecasts])
  const hiddenRiskCases = useMemo(() => getHiddenRiskCases(filteredForecasts), [filteredForecasts])

  return (
    <div className="space-y-6">
      {/* Risk & Busts Workspace Navigation */}
      <RiskWorkspaceNav allForecasts={allForecasts} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Hidden Risk &amp; Zero-Spread Monitoring</h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-3xl">
            Detect and investigate operational blind spots where ensemble models exhibit unanimous dry consensus
            (zero spread) but fail into severe unexpected precipitation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 mt-1">
          <span className="bg-[#0b172a] border border-[#1a2e4c] px-2.5 py-1 rounded font-mono">
            {filteredForecasts.length.toLocaleString()} forecasts analyzed
          </span>
          <span className="bg-red-950/30 border border-red-900/40 px-2.5 py-1 rounded font-mono text-red-400">
            {summary.hiddenRiskBustCount} hidden busts
          </span>
        </div>
      </div>

      {/* Shared Context Bar */}
      <RiskContextBar metrics={riskMetrics} />

      {/* Detection Logic & Threshold Definitions Banner */}
      <HiddenRiskThresholdsBanner />

      {/* Dedicated Filter System */}
      <HiddenRiskFilters
        filters={filters}
        setFilters={setFilters}
        availableDates={ALL_DATES}
        availableRegions={ALL_REGIONS}
        availableStates={availableStates}
        availableLeadDays={LEAD_DAYS}
        activeQuickView={activeQuickView}
        setActiveQuickView={setActiveQuickView}
      />

      {/* Summary KPI Strip */}
      <HiddenRiskSummaryKPIs stats={summary} />

      {/* Primary Visualizations: Zero-Spread vs Realized Rainfall & Spread Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ZeroSpreadVsObservedChart scatterData={scatterData} />
        <SpreadDistributionChart data={spreadDistribution} />
      </div>

      {/* Zero Forecast Outcome Analysis & Temporal Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ZeroForecastOutcomesChart outcomes={zeroForecastOutcomes} />
        <HiddenRiskTrendChart data={trendData} />
      </div>

      {/* Comparative Evidence Matrices */}
      <SpreadAndForecastComparisons
        spreadComparison={spreadComparison}
        forecastComparison={forecastComparison}
      />

      {/* Regional & Lead-Day Concentrations */}
      <RegionalAndLeadDayAnalysis regions={regionStats} leadDays={leadDayStats} />

      {/* Station-Level Hidden Risk Registry */}
      <LocationHiddenRiskTable locations={locationStats} />

      {/* Hidden Risk Investigation Registry */}
      <HiddenRiskCasesTable
        cases={hiddenRiskCases}
        onSelectForecast={(fc) => {
          setDrawerForecast(fc)
          setIsDrawerOpen(true)
        }}
      />

      {/* Unified Risk Investigation Drawer */}
      <RiskInvestigationDrawer
        forecast={drawerForecast}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sourceWorkspace="hidden-risk"
      />
    </div>
  )
}

