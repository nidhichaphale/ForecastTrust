import React from 'react'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { X, Filter, Search } from 'lucide-react'
import type { ForecastFilterParams } from '../../types'

interface DataFilterBarProps {
  filters: ForecastFilterParams
  setFilters: (f: ForecastFilterParams) => void
  availableDates: string[]
  availableRegions: string[]
  availableStates: string[]
  availableLocations: { id: string; name: string }[]
  availableLeadDays: number[]
}

export const DataFilterBar: React.FC<DataFilterBarProps> = ({
  filters,
  setFilters,
  availableDates,
  availableRegions,
  availableStates,
  availableLocations,
  availableLeadDays,
}) => {
  const set = (k: keyof ForecastFilterParams, v: any) => {
    setFilters({ ...filters, [k]: v || undefined })
  }

  const clearAll = () => {
    setFilters({})
  }

  const hasActive =
    !!filters.startDate ||
    !!filters.endDate ||
    !!filters.region ||
    !!filters.state ||
    !!filters.locationId ||
    filters.leadDay !== undefined ||
    !!filters.dataStatus ||
    !!filters.searchQuery

  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3.5 space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Data Ingestion &amp; Quality Filters</span>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            value={filters.searchQuery || ''}
            onChange={(e) => set('searchQuery', e.target.value)}
            placeholder="Search station, state, ID..."
            className="pl-8 text-xs h-8 bg-navy-950/80 border-navy-700"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 items-end">
        <div className="w-full sm:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Start Date</label>
          <Select
            value={filters.startDate || ''}
            onChange={(e) => set('startDate', e.target.value)}
            options={[{ label: 'Any Date', value: '' }, ...availableDates.map((d) => ({ label: d, value: d }))]}
          />
        </div>

        <div className="w-full sm:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">End Date</label>
          <Select
            value={filters.endDate || ''}
            onChange={(e) => set('endDate', e.target.value)}
            options={[{ label: 'Any Date', value: '' }, ...availableDates.map((d) => ({ label: d, value: d }))]}
          />
        </div>

        <div className="w-full sm:w-40">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Region</label>
          <Select
            value={filters.region || ''}
            onChange={(e) => set('region', e.target.value)}
            options={[{ label: 'All Regions', value: '' }, ...availableRegions.map((r) => ({ label: r, value: r }))]}
          />
        </div>

        <div className="w-full sm:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">State</label>
          <Select
            value={filters.state || ''}
            onChange={(e) => set('state', e.target.value)}
            options={[{ label: 'All States', value: '' }, ...availableStates.map((s) => ({ label: s, value: s }))]}
          />
        </div>

        <div className="w-full sm:w-44">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Station / Location</label>
          <Select
            value={filters.locationId || ''}
            onChange={(e) => set('locationId', e.target.value)}
            options={[{ label: 'All Stations', value: '' }, ...availableLocations.map((l) => ({ label: l.name, value: l.id }))]}
          />
        </div>

        <div className="w-full sm:w-28">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Lead Day</label>
          <Select
            value={filters.leadDay?.toString() || ''}
            onChange={(e) => set('leadDay', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            options={[{ label: 'All Horizons', value: '' }, ...availableLeadDays.map((d) => ({ label: `D+${d}`, value: d.toString() }))]}
          />
        </div>

        <div className="w-full sm:w-40">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Data Quality Status</label>
          <Select
            value={filters.dataStatus || ''}
            onChange={(e) => set('dataStatus', e.target.value)}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Complete', value: 'complete' },
              { label: 'Missing Observation', value: 'missing_observation' },
              { label: 'Partial Telemetry', value: 'partial' },
            ]}
          />
        </div>

        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-9 text-xs text-slate-400 hover:text-slate-200 self-end"
          >
            <X className="w-3.5 h-3.5 mr-1" /> Clear All
          </Button>
        )}
      </div>
    </div>
  )
}
