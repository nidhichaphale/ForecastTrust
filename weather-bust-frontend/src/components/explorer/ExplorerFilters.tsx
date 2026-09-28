import React from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { ForecastFilterParams, RiskLevel } from '../../types'

interface ExplorerFiltersProps {
  filters: ForecastFilterParams
  setFilters: (filters: ForecastFilterParams) => void
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

export const ExplorerFilters: React.FC<ExplorerFiltersProps> = ({
  filters,
  setFilters,
  availableRegions,
  availableStates,
  availableLeadDays,
}) => {
  const updateFilter = (key: keyof ForecastFilterParams, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    setFilters({ searchQuery: filters.searchQuery }) // Keep search, clear rest
  }

  const activeFilterCount = Object.keys(filters).filter(k => k !== 'searchQuery' && filters[k as keyof ForecastFilterParams] !== undefined).length

  return (
    <div className="space-y-4">
      {/* Search and Primary Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-end">
        <div className="flex-1 w-full min-w-[200px]">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">Search</label>
          <Input
            placeholder="Search locations, states, IDs..."
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-500" />}
          />
        </div>
        
        <div className="w-full lg:w-48">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">Region</label>
          <Select
            value={filters.region || ''}
            onChange={(e) => updateFilter('region', e.target.value ? e.target.value : undefined)}
            options={[
              { label: 'All Regions', value: '' },
              ...availableRegions.map(r => ({ label: r, value: r }))
            ]}
          />
        </div>

        <div className="w-full lg:w-48">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">State</label>
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

        <div className="w-full lg:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">Lead Day</label>
          <Select
            value={filters.leadDay?.toString() || ''}
            onChange={(e) => updateFilter('leadDay', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            options={[
              { label: 'All Days', value: '' },
              ...availableLeadDays.map(d => ({ label: `Day ${d}`, value: d.toString() }))
            ]}
          />
        </div>

        <div className="w-full lg:w-36">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">Risk Level</label>
          <Select
            value={filters.riskLevel || ''}
            onChange={(e) => updateFilter('riskLevel', e.target.value ? e.target.value : undefined)}
            options={[
              { label: 'All Risks', value: '' },
              ...RISK_LEVELS.map(r => ({ label: r.label, value: r.value }))
            ]}
          />
        </div>
      </div>

      {/* Quick Views / Badges Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0b172a]/50 p-2.5 rounded-lg border border-[#1a2e4c]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Quick Views:
          </span>
          <Badge 
            variant={filters.bustStatus === 'bust' ? 'severe' : 'outline'} 
            className="cursor-pointer"
            onClick={() => updateFilter('bustStatus', filters.bustStatus === 'bust' ? undefined : 'bust')}
          >
            Busts Only
          </Badge>
          <Badge 
            variant={filters.riskLevel === 'high' ? 'high' : 'outline'} 
            className="cursor-pointer"
            onClick={() => updateFilter('riskLevel', filters.riskLevel === 'high' ? undefined : 'high')}
          >
            High Risk
          </Badge>
          <Badge 
            variant={filters.zeroSpreadOnly ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => updateFilter('zeroSpreadOnly', filters.zeroSpreadOnly ? undefined : true)}
          >
            Zero Spread
          </Badge>
          <Badge 
            variant={(filters.minError ?? 0) >= 20 ? 'high' : 'outline'} 
            className="cursor-pointer"
            onClick={() => updateFilter('minError', (filters.minError ?? 0) >= 20 ? undefined : 20)}
          >
            Error {'>'} 20mm
          </Badge>
        </div>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 px-2 text-slate-400 hover:text-slate-200">
            <X className="w-3 h-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
