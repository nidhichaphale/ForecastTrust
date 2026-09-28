import React from 'react'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { X, Filter } from 'lucide-react'
import type { ForecastFilterParams, RiskLevel } from '../../types'
import { cn } from '../../utils/cn'

export interface HiddenRiskFilterState extends ForecastFilterParams {
  spreadCondition?: 'all' | 'zero' | 'nonzero'
  forecastCondition?: 'all' | 'zero' | 'wet'
}

interface HiddenRiskFiltersProps {
  filters: HiddenRiskFilterState
  setFilters: (f: HiddenRiskFilterState) => void
  availableDates: string[]
  availableRegions: string[]
  availableStates: string[]
  availableLeadDays: number[]
  activeQuickView: string
  setActiveQuickView: (view: string) => void
}

const RISK_LEVELS: { label: string; value: RiskLevel }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
  { label: 'Severe', value: 'severe' },
]

export const HiddenRiskFilters: React.FC<HiddenRiskFiltersProps> = ({
  filters,
  setFilters,
  availableDates,
  availableRegions,
  availableStates,
  availableLeadDays,
  activeQuickView,
  setActiveQuickView,
}) => {
  const set = (k: keyof HiddenRiskFilterState, v: any) => {
    setActiveQuickView('')
    setFilters({ ...filters, [k]: v || undefined })
  }

  const handleQuickView = (preset: string) => {
    setActiveQuickView(preset)
    switch (preset) {
      case 'zero_spread':
        setFilters({ spreadCondition: 'zero' })
        break
      case 'zero_forecast':
        setFilters({ forecastCondition: 'zero' })
        break
      case 'zero_both':
        setFilters({ spreadCondition: 'zero', forecastCondition: 'zero' })
        break
      case 'hidden_busts':
        setFilters({ spreadCondition: 'zero', forecastCondition: 'zero', bustStatus: 'bust' })
        break
      case 'high_risk_hidden':
        setFilters({ spreadCondition: 'zero', riskLevel: 'high' })
        break
      case 'all':
      default:
        setFilters({})
        break
    }
  }

  const clearAll = () => {
    setActiveQuickView('all')
    setFilters({})
  }

  const hasActive =
    !!filters.startDate ||
    !!filters.endDate ||
    !!filters.region ||
    !!filters.state ||
    filters.leadDay !== undefined ||
    !!filters.riskLevel ||
    !!filters.bustStatus ||
    (filters.spreadCondition && filters.spreadCondition !== 'all') ||
    (filters.forecastCondition && filters.forecastCondition !== 'all')

  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 space-y-3.5">
      {/* Quick Views Row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1a2e4c]/80 pb-3">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          Quick Views:
        </span>

        {[
          { id: 'all', label: 'All Cases' },
          { id: 'zero_spread', label: 'Zero Spread Only' },
          { id: 'zero_forecast', label: 'Zero Forecast Only' },
          { id: 'zero_both', label: 'Zero Spread + Zero Fcst' },
          { id: 'hidden_busts', label: 'Hidden-Risk Busts ⚠' },
          { id: 'high_risk_hidden', label: 'High-Risk Hidden Cases' },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => handleQuickView(btn.id)}
            className={cn(
              'px-2.5 py-1 rounded text-xs transition-colors font-medium',
              activeQuickView === btn.id
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-[#10213d] text-slate-300 hover:bg-[#1a2e4c] hover:text-white border border-[#1a2e4c]'
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Primary Parametric Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-full sm:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Start Date</label>
          <Select
            value={filters.startDate || ''}
            onChange={(e) => set('startDate', e.target.value)}
            options={[{ label: 'Any', value: '' }, ...availableDates.map((d) => ({ label: d, value: d }))]}
          />
        </div>

        <div className="w-full sm:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">End Date</label>
          <Select
            value={filters.endDate || ''}
            onChange={(e) => set('endDate', e.target.value)}
            options={[{ label: 'Any', value: '' }, ...availableDates.map((d) => ({ label: d, value: d }))]}
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
            options={[{ label: 'All', value: '' }, ...availableLeadDays.map((d) => ({ label: `D+${d}`, value: d.toString() }))]}
          />
        </div>

        <div className="w-full sm:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Spread Condition</label>
          <Select
            value={filters.spreadCondition || 'all'}
            onChange={(e) => set('spreadCondition', e.target.value)}
            options={[
              { label: 'All Spreads', value: 'all' },
              { label: 'Zero Spread (≤0.5mm)', value: 'zero' },
              { label: 'Non-Zero Spread (>0.5mm)', value: 'nonzero' },
            ]}
          />
        </div>

        <div className="w-full sm:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Fcst Condition</label>
          <Select
            value={filters.forecastCondition || 'all'}
            onChange={(e) => set('forecastCondition', e.target.value)}
            options={[
              { label: 'All Forecasts', value: 'all' },
              { label: 'Zero Forecast (≤0.5mm)', value: 'zero' },
              { label: 'Wet Forecast (>0.5mm)', value: 'wet' },
            ]}
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
              { label: 'Non-Bust', value: 'normal' },
            ]}
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

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 text-xs text-slate-400 hover:text-slate-200 self-end">
            <X className="w-3.5 h-3.5 mr-1" /> Clear All
          </Button>
        )}
      </div>
    </div>
  )
}
