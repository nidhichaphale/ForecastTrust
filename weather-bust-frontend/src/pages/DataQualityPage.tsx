import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getForecasts, getLocations, getRegions } from '../mock'
import { getMockValidDates } from '../mock/mapHelpers'
import { useUrlFilters } from '../hooks/useUrlFilters'
import type { ForecastFilterParams, RegionId } from '../types'
import type { DataTabId } from '../types/dataQuality'

import {
  calculateDataWorkspaceKPIs,
  calculateGeographicCoverage,
  calculateStateCoverage,
  calculateLeadDayCoverage,
  calculateTemporalCoverage,
  extractQualityIssues,
  calculateAvailabilityGrid,
} from '../utils/dataQualityAnalysis'
import { DataHeader } from '../components/data/DataHeader'
import { DataFilterBar } from '../components/data/DataFilterBar'
import { DataTabNav } from '../components/data/DataTabNav'

import { DataOverviewTab } from '../components/data/DataOverviewTab'
import { CoverageViewTab } from '../components/data/CoverageViewTab'
import { QualityViewTab } from '../components/data/QualityViewTab'
import { DataExplorerViewTab } from '../components/data/DataExplorerViewTab'
import { AvailabilityViewTab } from '../components/data/AvailabilityViewTab'

// Stable static references
const ALL_DATES = getMockValidDates()
const ALL_REGIONS = getRegions().map((r) => r.name)
const LEAD_DAYS = [1, 2, 3, 4, 5, 7, 10]

export const DataQualityPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useUrlFilters<ForecastFilterParams>()

  // Active view tab state (persisted via query param ?tab=...)
  const activeTab = (searchParams.get('tab') as DataTabId) || 'overview'

  const handleTabChange = (tab: DataTabId) => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'overview') {
      next.delete('tab')
    } else {
      next.set('tab', tab)
    }
    setSearchParams(next, { replace: true })
  }

  // Available locations & states for filter bar
  const availableLocations = useMemo(() => {
    const locs = getLocations(filters.region as RegionId | undefined)
    return locs.map((l) => ({ id: l.id, name: l.name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [filters.region])

  const availableStates = useMemo(() => {
    const locs = getLocations(filters.region as RegionId | undefined)
    return Array.from(new Set(locs.map((l) => l.state))).sort()
  }, [filters.region])

  // Core filtered forecast dataset from centralized mock repository
  const filteredForecasts = useMemo(() => getForecasts(filters), [filters])

  // Derived mathematical metrics and audit structures (memoized)
  const kpis = useMemo(() => calculateDataWorkspaceKPIs(filteredForecasts), [filteredForecasts])
  const geographicStats = useMemo(() => calculateGeographicCoverage(filteredForecasts), [filteredForecasts])
  const stateStats = useMemo(() => calculateStateCoverage(filteredForecasts), [filteredForecasts])
  const leadDayStats = useMemo(() => calculateLeadDayCoverage(filteredForecasts), [filteredForecasts])
  const temporalStats = useMemo(() => calculateTemporalCoverage(filteredForecasts), [filteredForecasts])
  const qualityIssues = useMemo(() => extractQualityIssues(filteredForecasts), [filteredForecasts])
  const availabilityGrid = useMemo(() => calculateAvailabilityGrid(filteredForecasts), [filteredForecasts])

  // Dynamic scope descriptors
  const dateRangeStr = filters.startDate || filters.endDate
    ? `${filters.startDate || '2026-08-01'} to ${filters.endDate || '2026-08-25'}`
    : `${kpis.earliestForecastDate} to ${kpis.latestForecastDate}`

  const leadDaySummaryStr = filters.leadDay !== undefined
    ? `Horizon D+${filters.leadDay}`
    : 'D+1 to D+10 (6, 8, 9 omitted)'

  return (
    <div className="space-y-6">

      {/* Workspace Header & Scope Status */}
      <DataHeader
        dateRange={dateRangeStr}
        locationCount={kpis.totalLocations}
        leadDaySummary={leadDaySummaryStr}
        forecastCount={filteredForecasts.length}
        completenessRate={kpis.completenessRate}
      />

      {/* Unified Data Filter Bar */}
      <DataFilterBar
        filters={filters}
        setFilters={setFilters}
        availableDates={ALL_DATES}
        availableRegions={ALL_REGIONS}
        availableStates={availableStates}
        availableLocations={availableLocations}
        availableLeadDays={LEAD_DAYS}
      />

      {/* Internal Analytical Views Tab Strip */}
      <DataTabNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        issueCount={qualityIssues.length}
      />

      {/* Active Tab View Body */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <DataOverviewTab
            kpis={kpis}
            onSelectTab={handleTabChange}
          />
        )}

        {activeTab === 'coverage' && (
          <CoverageViewTab
            geographicStats={geographicStats}
            stateStats={stateStats}
            leadDayStats={leadDayStats}
            temporalStats={temporalStats}
          />
        )}

        {activeTab === 'quality' && (
          <QualityViewTab
            kpis={kpis}
            issues={qualityIssues}
          />
        )}

        {activeTab === 'explorer' && (
          <DataExplorerViewTab
            forecasts={filteredForecasts}
          />
        )}

        {activeTab === 'availability' && (
          <AvailabilityViewTab
            availabilityGrid={availabilityGrid}
          />
        )}
      </div>
    </div>
  )
}
export default DataQualityPage
