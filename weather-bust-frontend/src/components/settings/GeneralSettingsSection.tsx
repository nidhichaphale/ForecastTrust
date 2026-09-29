import React from 'react'
import { SettingField } from './SettingField'
import { useSettings } from '../../hooks'
import { type LandingWorkspace, type DefaultDateBehavior } from '../../types/settings'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Compass, Calendar, Navigation, Globe } from 'lucide-react'

const LANDING_OPTIONS: { value: LandingWorkspace; label: string }[] = [
  { value: '/', label: 'Dashboard (Executive KPI Overview)' },
  { value: '/forecasts', label: 'Forecast Explorer (Station Grid & Search)' },
  { value: '/map', label: 'Risk Overview / Spatial Map' },
  { value: '/bust-detection', label: 'Bust Detection (Severity & Errors)' },
  { value: '/hidden-risk', label: 'Hidden Risk / Zero-Spread Monitoring' },
  { value: '/analysis', label: 'Verification & Analysis Workspace' },
  { value: '/data', label: 'Data & Quality Workspace' },
  { value: '/alerts', label: 'Alerts & Operational Warnings' },
]

const DATE_BEHAVIOR_OPTIONS: { value: DefaultDateBehavior; label: string; desc: string }[] = [
  {
    value: 'latest',
    label: 'Latest Monitored Date',
    desc: 'Always load the most recent forecast cycle date available in dataset',
  },
  {
    value: 'today',
    label: 'Real-time System Date',
    desc: 'Align filter to current calendar day',
  },
  {
    value: 'custom',
    label: 'Remember Last Selected',
    desc: 'Preserve the most recent valid date manually inspected in session',
  },
]

const REGION_OPTIONS = [
  { value: 'all', label: 'All India (National Grid)' },
  { value: 'North India', label: 'North India (Himalayan / Gangetic Plains)' },
  { value: 'South India', label: 'South India (Peninsular / Coastal)' },
  { value: 'East India', label: 'East India (Bengal / Odisha Basin)' },
  { value: 'West India', label: 'West India (Arid & Konkan Coast)' },
  { value: 'Central India', label: 'Central India (Plateau & Monsoon Trough)' },
  { value: 'Northeast India', label: 'Northeast India (Heavy Orographic)' },
]

const LEAD_DAY_OPTIONS = [
  { value: 'all', label: 'All Lead Horizons (Days 1–10)' },
  { value: 1, label: 'Day 1 (+24 Hours) — Immediate' },
  { value: 3, label: 'Day 3 (+72 Hours) — Short Range' },
  { value: 5, label: 'Day 5 (+120 Hours) — Medium Range' },
  { value: 7, label: 'Day 7 (+168 Hours) — Extended' },
  { value: 10, label: 'Day 10 (+240 Hours) — Outlook' },
]

export const GeneralSettingsSection: React.FC = () => {
  const { settings, updateGeneral } = useSettings()

  return (
    <Card className="bg-[#0b172a] border-[#1a2e4c]">
      <CardHeader className="border-b border-[#1a2e4c]/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-white">
              General System Preferences
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure initial landing views, default dates, geographic focus, and lead day horizons.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-[#1a2e4c]/60 pt-2">
        {/* Landing Workspace */}
        <SettingField
          title="Default Landing Workspace"
          description="Choose which workspace is loaded automatically when opening the Weather Intelligence platform."
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Navigation className="w-4 h-4 text-sky-400 hidden sm:inline" />
            <select
              aria-label="Default Landing Workspace"
              value={settings.general.defaultLandingWorkspace}
              onChange={(e) =>
                updateGeneral({
                  defaultLandingWorkspace: e.target.value as LandingWorkspace,
                })
              }
              className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[260px]"
            >
              {LANDING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </SettingField>

        {/* Default Date Behavior */}
        <SettingField
          title="Default Forecast Date Behavior"
          description="Specifies how initial date filters are determined across the Dashboard, Risk Map, and Explorer."
          layout="vertical"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {DATE_BEHAVIOR_OPTIONS.map((opt) => {
              const isSelected = settings.general.defaultDateBehavior === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateGeneral({ defaultDateBehavior: opt.value })}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-sky-300 ring-1 ring-sky-500/40'
                      : 'bg-[#060d19] border-[#1a2e4c] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {opt.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </SettingField>

        {/* Default Geographic Scope */}
        <SettingField
          title="Default Geographic Scope"
          description="Default regional focus pre-selected in multi-station tables and risk aggregates."
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Globe className="w-4 h-4 text-emerald-400 hidden sm:inline" />
            <select
              aria-label="Default Geographic Scope"
              value={settings.general.defaultRegion}
              onChange={(e) => updateGeneral({ defaultRegion: e.target.value })}
              className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[260px]"
            >
              {REGION_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </SettingField>

        {/* Default Lead Day */}
        <SettingField
          title="Default Lead Day Filter"
          description="Pre-filter tables and spatial layers to a specific lead day (1 to 10) or display all horizons."
        >
          <select
            aria-label="Default Lead Day Filter"
            value={settings.general.defaultLeadDay}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
              updateGeneral({ defaultLeadDay: val })
            }}
            className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[260px]"
          >
            {LEAD_DAY_OPTIONS.map((lead) => (
              <option key={String(lead.value)} value={lead.value}>
                {lead.label}
              </option>
            ))}
          </select>
        </SettingField>
      </CardContent>
    </Card>
  )
}
