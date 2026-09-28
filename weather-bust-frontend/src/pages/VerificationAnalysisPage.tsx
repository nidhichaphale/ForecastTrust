import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Compass, Map, AlertTriangle, EyeOff, BarChart3, Database } from 'lucide-react'

import { getForecasts, getLocations, getRegions } from '../mock'
import { getMockValidDates } from '../mock/mapHelpers'
import { useUrlFilters } from '../hooks/useUrlFilters'
import type { ForecastFilterParams, RegionId } from '../types'

import {
  calculateVerificationSummary,
  calculateErrorTrend,
  calculateErrorDistribution,
  calculateLeadDayVerification,
  calculateRegionalVerification,
  getTopErrorForecasts,
  getMockModelsData,
  getMockFeaturesData,
  getHistoricalVerificationData,
} from '../utils/verificationAnalysis'

import { WorkspaceSubNav, type WorkspaceTab } from '../components/navigation/WorkspaceSubNav'
import { AnalysisHeader } from '../components/analysis/AnalysisHeader'
import { AnalysisFilterBar } from '../components/analysis/AnalysisFilterBar'
import { AnalysisTabNav, type AnalysisTabId } from '../components/analysis/AnalysisTabNav'

import { VerificationOverviewTab } from '../components/analysis/VerificationOverviewTab'
import { ErrorAnalysisTab } from '../components/analysis/ErrorAnalysisTab'
import { LeadDayAnalysisTab } from '../components/analysis/LeadDayAnalysisTab'
import { RegionalAnalysisTab } from '../components/analysis/RegionalAnalysisTab'
import { HistoricalAnalysisTab } from '../components/analysis/HistoricalAnalysisTab'
import { ModelPerformanceTab } from '../components/analysis/ModelPerformanceTab'
import { FeatureInsightsTab } from '../components/analysis/FeatureInsightsTab'

// Stable static references
const ALL_DATES = getMockValidDates()
const ALL_REGIONS = getRegions().map((r) => r.name)
const LEAD_DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const WORKSPACE_TABS: WorkspaceTab[] = [
  { label: 'Forecast Explorer', path: '/forecasts', icon: Compass },
  { label: 'Risk Map', path: '/map', icon: Map },
  { label: 'Bust Detection', path: '/bust-detection', icon: AlertTriangle },
  { label: 'Hidden Risk', path: '/hidden-risk', icon: EyeOff },
  { label: 'Verification & Analysis', path: '/analysis', icon: BarChart3 },
  { label: 'Data & Quality', path: '/data', icon: Database },
]

export const VerificationAnalysisPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useUrlFilters<ForecastFilterParams>()

  // Active view tab state (persisted via query param ?tab=...)
  const activeTab = (searchParams.get('tab') as AnalysisTabId) || 'overview'

  const handleTabChange = (tab: AnalysisTabId) => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'overview') {
      next.delete('tab')
    } else {
      next.set('tab', tab)
    }
    setSearchParams(next, { replace: true })
  }

  // Available states based on selected region
  const availableStates = useMemo(() => {
    const locs = getLocations(filters.region as RegionId | undefined)
    return Array.from(new Set(locs.map((l) => l.state))).sort()
  }, [filters.region])

  // Core filtered forecast dataset
  const filteredForecasts = useMemo(() => getForecasts(filters), [filters])

  // Statistical calculations (memoized on filteredForecasts)
  const summary = useMemo(() => calculateVerificationSummary(filteredForecasts), [filteredForecasts])
  const errorTrend = useMemo(() => calculateErrorTrend(filteredForecasts), [filteredForecasts])
  const errorBins = useMemo(() => calculateErrorDistribution(filteredForecasts), [filteredForecasts])
  const leadDayStats = useMemo(() => calculateLeadDayVerification(filteredForecasts), [filteredForecasts])
  const regionalStats = useMemo(() => calculateRegionalVerification(filteredForecasts), [filteredForecasts])
  const topErrors = useMemo(() => getTopErrorForecasts(filteredForecasts, 10), [filteredForecasts])

  // External static benchmark datasets (memoized once)
  const modelsData = useMemo(() => getMockModelsData(), [])
  const featuresData = useMemo(() => getMockFeaturesData(), [])
  const historicalData = useMemo(() => getHistoricalVerificationData(), [])

  // Dynamic scope descriptors
  const dateRangeStr = filters.startDate || filters.endDate
    ? `${filters.startDate || '2026-07-01'} to ${filters.endDate || '2026-07-28'}`
    : 'Full July 2026 Monsoon Observation Period'

  const regionSummaryStr = filters.region
    ? filters.region
    : 'All 6 Meteorological Regions'

  const leadDaySummaryStr = filters.leadDay !== undefined
    ? `Lead Horizon: D+${filters.leadDay}`
    : 'All Horizons (D+1 to D+10)'

  return (
    <div className="space-y-6">
      {/* Workspace Unified Sub-Nav */}
      <WorkspaceSubNav
        workspaceTitle="Verification & Analysis Workspace"
        workspaceDescription="Comprehensive meteorological verification suite covering systematic error bias, lead-time degradation, regional performance, model benchmark comparison, and feature importance."
        tabs={WORKSPACE_TABS}
      />

      {/* Workspace Header & Scope Status */}
      <AnalysisHeader
        dateRange={dateRangeStr}
        regionSummary={regionSummaryStr}
        leadDaySummary={leadDaySummaryStr}
        forecastCount={filteredForecasts.length}
      />

      {/* Unified Verification Filter Bar */}
      <AnalysisFilterBar
        filters={filters}
        setFilters={setFilters}
        availableDates={ALL_DATES}
        availableRegions={ALL_REGIONS}
        availableStates={availableStates}
        availableLeadDays={LEAD_DAYS}
      />

      {/* Internal Analytical Views Tab Strip */}
      <AnalysisTabNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Active Tab View Body */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <VerificationOverviewTab
            summary={summary}
            errorTrend={errorTrend}
            leadDayStats={leadDayStats}
            topErrorForecasts={topErrors}
            onSelectTab={handleTabChange}
          />
        )}

        {activeTab === 'errors' && (
          <ErrorAnalysisTab
            summary={summary}
            errorTrend={errorTrend}
            errorBins={errorBins}
            topErrorForecasts={topErrors}
          />
        )}

        {activeTab === 'lead-day' && (
          <LeadDayAnalysisTab
            leadDayStats={leadDayStats}
          />
        )}

        {activeTab === 'region' && (
          <RegionalAnalysisTab
            regionalStats={regionalStats}
          />
        )}

        {activeTab === 'historical' && (
          <HistoricalAnalysisTab
            historicalData={historicalData}
          />
        )}

        {activeTab === 'models' && (
          <ModelPerformanceTab
            models={modelsData}
          />
        )}

        {activeTab === 'features' && (
          <FeatureInsightsTab
            features={featuresData}
          />
        )}
      </div>
    </div>
  )
}
export default VerificationAnalysisPage
