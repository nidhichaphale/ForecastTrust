import React from 'react'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { X, Filter } from 'lucide-react'
import type { ForecastFilterParams, RiskLevel } from '../../types'

interface AnalysisFilterBarProps {
  filters: ForecastFilterParams
  setFilters: (f: ForecastFilterParams) => void
  availableDates: string[]
  availableRegions: string[]
  availableStates: string[]
  availableLeadDays: number[]
}

const RISK_LEVELS: { label: string; value: RiskLevel }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
  { label: 'Severe', value: 'severe' },
]

export const AnalysisFilterBar: React.FC<AnalysisFilterBarProps> = ({
  filters,
  setFilters,
  availableDates,
  availableRegions,
  availableStates,
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
    filters.leadDay !== undefined ||
    !!filters.riskLevel ||
    !!filters.bustStatus

  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Filter className="w-3.5 h-3.5 text-sky-400" />
        <span>Verification Filter Controls</span>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
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

        <div className="w-full sm:w-40">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">State</label>
          <Select
            value={filters.state || ''}
            onChange={(e) => set('state', e.target.value)}
            options={[{ label: 'All States', value: '' }, ...availableStates.map((s) => ({ label: s, value: s }))]}
          />
        </div>

        <div className="w-full sm:w-28">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Lead Day</label>
          <Select
            value={filters.leadDay?.toString() || ''}
            onChange={(e) => set('leadDay', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            options={[{ label: 'All Lead', value: '' }, ...availableLeadDays.map((d) => ({ label: `D+${d}`, value: d.toString() }))]}
          />
        </div>

        <div className="w-full sm:w-32">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Risk Level</label>
          <Select
            value={filters.riskLevel || ''}
            onChange={(e) => set('riskLevel', e.target.value)}
            options={[{ label: 'All Risks', value: '' }, ...RISK_LEVELS.map((r) => ({ label: r.label, value: r.value }))]}
          />
        </div>

        <div className="w-full sm:w-32">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Bust Outcome</label>
          <Select
            value={filters.bustStatus || ''}
            onChange={(e) => set('bustStatus', e.target.value)}
            options={[
              { label: 'All', value: '' },
              { label: 'Bust Only', value: 'bust' },
              { label: 'Normal / Borderline', value: 'normal' },
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
