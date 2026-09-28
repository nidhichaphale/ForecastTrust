import React from 'react'
import { Select } from '../ui/Select'
import type { ForecastFilterParams, RiskLevel } from '../../types'


interface MapFiltersProps {
  filters: ForecastFilterParams
  setFilters: (filters: ForecastFilterParams) => void
  availableDates: string[]
  availableRegions: string[]
  availableStates: string[]
  availableLeadDays: number[]
}

const RISK_LEVELS: { label: string; value: RiskLevel }[] = [
  { label: 'Severe', value: 'severe' },
  { label: 'High', value: 'high' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Low', value: 'low' },
]

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  setFilters,
  availableDates,
  availableRegions,
  availableStates,
  availableLeadDays,
}) => {
  const updateFilter = (key: keyof ForecastFilterParams, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  // Force single date selection for the map by tying startDate and endDate to the same value
  const handleDateChange = (val: string) => {
    setFilters({ ...filters, startDate: val, endDate: val })
  }

  return (
    <div className="flex flex-wrap items-end gap-3 bg-[#0b172a] p-3 rounded-lg border border-[#1a2e4c]">
      <div className="w-full sm:w-36">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Forecast Date</label>
        <Select
          value={filters.startDate || ''}
          onChange={(e) => handleDateChange(e.target.value)}
          options={availableDates.map(d => ({ label: d, value: d }))}
        />
      </div>

      <div className="w-full sm:w-36">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Region</label>
        <Select
          value={filters.region || ''}
          onChange={(e) => updateFilter('region', e.target.value ? e.target.value : undefined)}
          options={[
            { label: 'All Regions', value: '' },
            ...availableRegions.map(r => ({ label: r, value: r }))
          ]}
        />
      </div>

      <div className="w-full sm:w-36">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">State</label>
        <Select
          value={filters.state || ''}
          onChange={(e) => updateFilter('state', e.target.value ? e.target.value : undefined)}
          disabled={!!filters.region && availableStates.length === 0}
          options={[
            { label: 'All States', value: '' },
            ...availableStates.map(s => ({ label: s, value: s }))
          ]}
        />
      </div>

      <div className="w-full sm:w-28">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Lead Day</label>
        <Select
          value={filters.leadDay?.toString() || ''}
          onChange={(e) => updateFilter('leadDay', e.target.value ? parseInt(e.target.value, 10) : undefined)}
          options={[
            { label: 'All Days', value: '' },
            ...availableLeadDays.map(d => ({ label: `Day ${d}`, value: d.toString() }))
          ]}
        />
      </div>

      <div className="w-full sm:w-32">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Risk</label>
        <Select
          value={filters.riskLevel || ''}
          onChange={(e) => updateFilter('riskLevel', e.target.value ? e.target.value : undefined)}
          options={[
            { label: 'All Risks', value: '' },
            ...RISK_LEVELS.map(r => ({ label: r.label, value: r.value }))
          ]}
        />
      </div>

      <div className="w-full sm:w-32">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Bust Status</label>
        <Select
          value={filters.bustStatus || ''}
          onChange={(e) => updateFilter('bustStatus', e.target.value ? e.target.value : undefined)}
          options={[
            { label: 'All', value: '' },
            { label: 'Bust Only', value: 'bust' },
            { label: 'Non-Bust', value: 'non-bust' },
          ]}
        />
      </div>
    </div>
  )
}
