import React, { useState, useMemo, useCallback } from 'react'
import { getMapForecasts, getMockValidDates, type MapForecast } from '../mock/mapHelpers'
import { getRegions, getLocations, getForecasts } from '../mock'
import type { ForecastFilterParams, RegionId, Forecast } from '../types'

import { MapFilters } from '../components/map/MapFilters'
import { MapSummary } from '../components/map/MapSummary'
import { RiskMap } from '../components/map/RiskMap'
import { MapLegend } from '../components/map/MapLegend'
import { MapLocationPanel } from '../components/map/MapLocationPanel'
import { RiskWorkspaceNav, RiskContextBar, RiskInvestigationDrawer } from '../components/risk'
import { Button } from '../components/ui/Button'
import { RotateCcw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useUrlFilters } from '../hooks/useUrlFilters'
import { calculateRiskWorkspaceSummary } from '../utils/riskContextAnalysis'

// Precompute static filter options
const ALL_DATES = getMockValidDates()
const DEFAULT_DATE = ALL_DATES[ALL_DATES.length - 1] ?? '' // latest date
const ALL_REGIONS = getRegions().map((r) => r.name)
const LEAD_DAYS = [1, 2, 3, 4, 5, 7, 10]

export const ForecastRiskMapPage: React.FC = () => {
  // Filters synchronized with URL
  const [filters, setFilters] = useUrlFilters<ForecastFilterParams>({
    startDate: DEFAULT_DATE,
    endDate: DEFAULT_DATE,
  })

  // Map reset trigger (increment to fire IndiaViewReset)
  const [resetTrigger, setResetTrigger] = useState(0)

  // Drawer state for fast deep-dive inspection
  const [drawerForecast, setDrawerForecast] = useState<Forecast | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Complete unfiltered forecast pool for global badges in header
  const allForecasts = useMemo(() => getForecasts(), [])

  // Available states based on selected region
  const availableStates = useMemo(() => {
    const locs = getLocations(filters.region as RegionId | undefined)
    return Array.from(new Set(locs.map((l) => l.state))).sort()
  }, [filters.region])

  // Apply filters to get map-ready forecasts
  const mapForecasts = useMemo(() => getMapForecasts(filters), [filters])

  // Unified Risk Workspace Metrics for context bar
  const riskMetrics = useMemo(() => calculateRiskWorkspaceSummary(mapForecasts), [mapForecasts])

  // Summary stats from filtered set
  const summaryStats = useMemo(() => {
    const locationIds = new Set(mapForecasts.map((fc) => fc.locationId))
    return {
      locationsCount: locationIds.size,
      highRiskCount: riskMetrics.highOrSevereRiskCount,
      bustCount: riskMetrics.bustCount,
      avgBustProb: riskMetrics.avgBustProbability,
    }
  }, [mapForecasts, riskMetrics])

  const [searchParams] = useSearchParams()
  const locIdParam = searchParams.get('locationId')
  const [selectedId, setSelectedId] = useState<string | null>(locIdParam)

  const handleSelect = useCallback((fc: MapForecast) => {
    setSelectedId(fc.locationId)
  }, [])

  const handleReset = () => {
    setFilters({ startDate: DEFAULT_DATE, endDate: DEFAULT_DATE })
    setSelectedId(null)
    setResetTrigger((t) => t + 1)
  }

  // Determine active context string shown in summary bar
  const selectedDateLabel = filters.startDate ?? 'All Dates'
  const selectedLeadLabel = filters.leadDay ? `D+${filters.leadDay}` : 'All Lead Days'
  const selectedRegionLabel = filters.region ?? 'All Regions'

  // Active selected forecast: manual click takes precedence, fallback to URL param
  const activeSelected = useMemo(() => {
    const targetId = selectedId ?? locIdParam
    if (!targetId) return null
    return mapForecasts.find((f) => f.locationId === targetId || f.id === targetId) ?? null
  }, [selectedId, locIdParam, mapForecasts])

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Risk & Busts Workspace Navigation */}
      <RiskWorkspaceNav allForecasts={allForecasts} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Spatial Risk Map</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Geographic view of forecast risk, uncertainty, and potential busts across monitored locations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="shrink-0">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset View
        </Button>
      </div>

      {/* Shared Context Bar */}
      <RiskContextBar metrics={riskMetrics} />

      {/* Filters Bar */}
      <MapFilters
        filters={filters}
        setFilters={setFilters}
        availableDates={ALL_DATES}
        availableRegions={ALL_REGIONS}
        availableStates={availableStates}
        availableLeadDays={LEAD_DAYS}
      />

      {/* Context ribbon */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
        <span>Showing:</span>
        <span className="bg-[#10213d] border border-[#1a2e4c] px-2 py-0.5 rounded font-mono text-slate-200">
          {selectedDateLabel}
        </span>
        <span>&middot;</span>
        <span className="bg-[#10213d] border border-[#1a2e4c] px-2 py-0.5 rounded text-slate-200">
          {selectedRegionLabel}
        </span>
        <span>&middot;</span>
        <span className="bg-[#10213d] border border-[#1a2e4c] px-2 py-0.5 rounded text-slate-200">
          {selectedLeadLabel}
        </span>
      </div>

      {/* Summary Bar */}
      <MapSummary
        locationsCount={summaryStats.locationsCount}
        highRiskCount={summaryStats.highRiskCount}
        bustCount={summaryStats.bustCount}
        avgBustProb={summaryStats.avgBustProb}
      />

      {/* Map + Panel Area */}
      <div className="relative flex gap-4 flex-1" style={{ minHeight: '520px' }}>
        {/* Map */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-[#1a2e4c]">
          {mapForecasts.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b172a] text-center z-10">
              <p className="text-slate-400 font-medium mb-2">No forecasts match the selected filters.</p>
              <p className="text-xs text-slate-500 mb-4">Try adjusting the date, region, lead day, or risk level.</p>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <RiskMap
              forecasts={mapForecasts}
              selectedId={activeSelected?.id ?? null}
              onSelect={handleSelect}
              resetTrigger={resetTrigger}
            />
          )}

          {/* Legend — positioned inside map area, bottom-left */}
          <div className="absolute bottom-4 left-4 z-[1000]">
            <MapLegend />
          </div>
        </div>

        {/* Selected Location Panel */}
        {activeSelected && (
          <div className="w-72 shrink-0 hidden lg:block">
            <MapLocationPanel
              forecast={activeSelected}
              onClose={() => setSelectedId(null)}
              onInspect={(fc) => {
                setDrawerForecast(fc)
                setIsDrawerOpen(true)
              }}
            />
          </div>
        )}
      </div>

      {/* Mobile selected panel (bottom) */}
      {activeSelected && (
        <div className="lg:hidden">
          <MapLocationPanel
            forecast={activeSelected}
            onClose={() => setSelectedId(null)}
            onInspect={(fc) => {
              setDrawerForecast(fc)
              setIsDrawerOpen(true)
            }}
          />
        </div>
      )}

      {/* Unified Risk Investigation Drawer */}
      <RiskInvestigationDrawer
        forecast={drawerForecast}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sourceWorkspace="map"
      />
    </div>
  )
}

