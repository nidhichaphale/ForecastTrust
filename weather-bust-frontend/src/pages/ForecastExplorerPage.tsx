import React, { useState, useMemo } from 'react'
import { getForecasts, getRegions, getLocations } from '../mock'
import type { ForecastFilterParams, Forecast, RegionId } from '../types'

import { ExplorerFilters } from '../components/explorer/ExplorerFilters'
import { ExplorerTable, type SortField } from '../components/explorer/ExplorerTable'
import { ExplorerSummary } from '../components/explorer/ExplorerSummary'
import { WorkspaceSubNav } from '../components/navigation/WorkspaceSubNav'
import { Button } from '../components/ui/Button'
import { ChevronLeft, ChevronRight, Eye, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUrlFilters } from '../hooks/useUrlFilters'

export const ForecastExplorerPage: React.FC = () => {
  const [filters, setFilters] = useUrlFilters<ForecastFilterParams>()

  const [sortField, setSortField] = useState<SortField>('validDate')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // -- Data Derivation --
  // We use the mock API to get the current set of filtered forecasts
  const filteredForecasts = useMemo(() => getForecasts(filters), [filters])
  const totalForecasts = useMemo(() => getForecasts().length, [])

  // -- Dependent Filter Options --
  const availableRegions = useMemo(() => getRegions().map(r => r.name), [])
  const availableStates = useMemo(() => {
    const locs = getLocations(filters.region as RegionId)
    const states = Array.from(new Set(locs.map(l => l.state)))
    return states.sort()
  }, [filters.region])
  const availableLeadDays = [1, 2, 3, 4, 5, 6, 7]

  // -- Sorting --
  const sortedForecasts = useMemo(() => {
    return [...filteredForecasts].sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]
      
      if (sortField === 'forecastError') {
        valA = Math.abs(a.forecastError)
        valB = Math.abs(b.forecastError)
      }
      
      if (valA < valB) return sortDesc ? 1 : -1
      if (valA > valB) return sortDesc ? -1 : 1
      return 0
    })
  }, [filteredForecasts, sortField, sortDesc])

  // -- Pagination --
  const totalPages = Math.ceil(sortedForecasts.length / pageSize)
  const paginatedForecasts = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedForecasts.slice(start, start + pageSize)
  }, [sortedForecasts, page, pageSize])

  const handleFilterChange: React.Dispatch<React.SetStateAction<ForecastFilterParams>> = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  // -- Summary Stats --
  const summaryStats = useMemo(() => {
    const highRisk = filteredForecasts.filter(fc => fc.riskLevel === 'high' || fc.riskLevel === 'severe').length
    const busts = filteredForecasts.filter(fc => fc.bustStatus === 'bust').length
    const avgProb = filteredForecasts.length > 0 
      ? (filteredForecasts.reduce((acc, fc) => acc + fc.bustProbability, 0) / filteredForecasts.length) * 100 
      : 0
    
    return {
      highRiskCount: highRisk,
      bustCount: busts,
      avgBustProb: avgProb
    }
  }, [filteredForecasts])

  // -- Handlers --
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc)
    } else {
      setSortField(field)
      setSortDesc(true)
    }
  }

  const navigate = useNavigate()

  const handleRowClick = (fc: Forecast) => {
    navigate(`/forecasts/${fc.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Forecast Workspace Navigation */}
      <WorkspaceSubNav
        workspaceTitle="Forecast Workspace"
        workspaceDescription="Dense tabular analysis, spatial risk monitoring, and individual forecast verification."
        tabs={[
          { label: 'Forecast Explorer', path: '/forecasts', icon: Eye },
          { label: 'Spatial Risk Map', path: '/map', icon: Map },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Forecast Explorer</h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
            Search and analyze rainfall forecasts, uncertainty, and bust risk across monitored locations.
          </p>
        </div>
      </div>

      {/* Summary */}
      <ExplorerSummary 
        totalCount={totalForecasts}
        filteredCount={filteredForecasts.length}
        highRiskCount={summaryStats.highRiskCount}
        bustCount={summaryStats.bustCount}
        avgBustProb={summaryStats.avgBustProb}
      />

      {/* Filters */}
      <ExplorerFilters 
        filters={filters}
        setFilters={handleFilterChange}
        availableRegions={availableRegions}
        availableStates={availableStates}
        availableLeadDays={availableLeadDays}
      />

      {/* Table */}
      <ExplorerTable 
        forecasts={paginatedForecasts}
        sortField={sortField}
        sortDesc={sortDesc}
        onSort={handleSort}
        onRowClick={handleRowClick}
        onResetFilters={() => handleFilterChange({})}
      />

      {/* Pagination */}
      {filteredForecasts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filteredForecasts.length)} of {filteredForecasts.length} forecasts
            </span>
            <select 
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-[#0b172a] border border-[#1a2e4c] rounded px-2 py-1 outline-none text-slate-300"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <span className="font-mono font-medium text-slate-300 px-2">
              {page} / {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="h-8 px-2.5"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
