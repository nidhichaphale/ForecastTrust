import React from 'react'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { RotateCcw, Search } from 'lucide-react'
import type { AlertFilterParams, RegionId, RiskLevel, AlertStatus } from '../../types'

interface AlertFiltersProps {
  filters: AlertFilterParams
  setFilters: (filters: AlertFilterParams) => void
  availableRegions: string[]
  availableStates: string[]
  onClearFilters: () => void
}

const SEVERITY_OPTIONS = [
  { label: 'All Severities', value: 'all' },
  { label: 'Severe', value: 'severe' },
  { label: 'High', value: 'high' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Low', value: 'low' },
]

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'New (Unread)', value: 'new' },
  { label: 'Acknowledged', value: 'acknowledged' },
  { label: 'Resolved', value: 'resolved' },
]

const ALERT_TYPE_OPTIONS = [
  { label: 'All Alert Types', value: 'all' },
  { label: 'Severe Forecast Bust', value: 'severe_forecast_bust' },
  { label: 'Hidden Risk / Zero-Spread', value: 'hidden_risk_zero_spread' },
  { label: 'High Bust Risk', value: 'high_bust_risk' },
  { label: 'Extreme Ens Divergence', value: 'extreme_ensemble_divergence' },
  { label: 'Flash Convective', value: 'flash_convective_discrepancy' },
  { label: 'Data Quality / Ingest Gap', value: 'data_quality_missing_observation' },
]

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  filters,
  setFilters,
  availableRegions,
  availableStates,
  onClearFilters,
}) => {
  const updateFilter = (key: keyof AlertFilterParams, value: any) => {
    setFilters({ ...filters, [key]: value === 'all' ? undefined : value })
  }

  const hasActiveFilters =
    Boolean(filters.severity) ||
    Boolean(filters.status) ||
    Boolean(filters.alertType) ||
    Boolean(filters.region) ||
    Boolean(filters.state) ||
    Boolean(filters.searchQuery)

  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3.5 space-y-3 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-lg">
          <Input
            placeholder="Search by Alert ID, location, state, forecast ID, or message..."
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter('searchQuery', e.target.value || undefined)}
            leftIcon={<Search className="w-3.5 h-3.5 text-slate-500" />}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-slate-300 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 border-t border-[#1a2e4c]/60">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
            Status
          </label>
          <Select
            value={filters.status || 'all'}
            onChange={(e) => updateFilter('status', e.target.value as AlertStatus | 'all')}
            options={STATUS_OPTIONS}
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
            Severity
          </label>
          <Select
            value={filters.severity || 'all'}
            onChange={(e) => updateFilter('severity', e.target.value as RiskLevel | 'all')}
            options={SEVERITY_OPTIONS}
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
            Alert Type
          </label>
          <Select
            value={filters.alertType || 'all'}
            onChange={(e) => updateFilter('alertType', e.target.value)}
            options={ALERT_TYPE_OPTIONS}
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
            Region
          </label>
          <Select
            value={filters.region || 'all'}
            onChange={(e) => updateFilter('region', e.target.value as RegionId | 'all')}
            options={[
              { label: 'All Regions', value: 'all' },
              ...availableRegions.map((r) => ({ label: r, value: r })),
            ]}
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
            State
          </label>
          <Select
            value={filters.state || 'all'}
            onChange={(e) => updateFilter('state', e.target.value)}
            options={[
              { label: 'All States', value: 'all' },
              ...availableStates.map((s) => ({ label: s, value: s })),
            ]}
          />
        </div>
      </div>
    </div>
  )
}
