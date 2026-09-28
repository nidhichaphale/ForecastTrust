import React from 'react'
import { cn } from '../../utils/cn'
import type { HiddenRiskSummaryStats } from '../../utils/hiddenRiskAnalysis'
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  CloudOff,
  Crosshair,
  MapPin,
  TrendingUp,
  Percent,
} from 'lucide-react'

interface HiddenRiskSummaryKPIsProps {
  stats: HiddenRiskSummaryStats
}

interface KPIProps {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  color?: string
  warning?: boolean
}

const KPIItem: React.FC<KPIProps> = ({ label, value, sub, icon, color = 'text-slate-100', warning }) => (
  <div
    className={cn(
      'flex flex-col gap-1.5 p-3.5 rounded-lg border',
      warning ? 'bg-red-950/20 border-red-900/40' : 'bg-[#0b172a] border-[#1a2e4c]'
    )}
  >
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-slate-600">{icon}</span>
    </div>
    <div className={cn('text-2xl font-bold font-mono tracking-tight', color)}>{value}</div>
    {sub && <div className="text-[11px] text-slate-500 leading-tight">{sub}</div>}
  </div>
)

export const HiddenRiskSummaryKPIs: React.FC<HiddenRiskSummaryKPIsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      <KPIItem
        label="Zero Spread"
        value={stats.zeroSpreadCount.toLocaleString()}
        sub="ensemble spread ≤ 0.5mm"
        icon={<Crosshair className="w-4 h-4 text-sky-400" />}
        color="text-sky-400"
      />
      <KPIItem
        label="Zero Forecast"
        value={stats.zeroForecastCount.toLocaleString()}
        sub="forecast rain ≤ 0.5mm"
        icon={<CloudOff className="w-4 h-4 text-slate-300" />}
        color="text-slate-200"
      />
      <KPIItem
        label="Zero Both"
        value={stats.zeroBothCount.toLocaleString()}
        sub="unanimous zero rain"
        icon={<Activity className="w-4 h-4 text-cyan-400" />}
        color="text-cyan-300"
      />
      <KPIItem
        label="Hidden Busts"
        value={stats.hiddenRiskBustCount.toString()}
        sub="surprise rain ≥ 2.5mm"
        icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
        color="text-red-400"
        warning={stats.hiddenRiskBustCount > 0}
      />
      <KPIItem
        label="Hidden-Risk Rate"
        value={`${stats.hiddenRiskRate}%`}
        sub="busts / zero both cases"
        icon={<Percent className="w-4 h-4 text-orange-400" />}
        color={stats.hiddenRiskRate > 20 ? 'text-red-400' : stats.hiddenRiskRate > 0 ? 'text-orange-400' : 'text-emerald-400'}
        warning={stats.hiddenRiskRate > 25}
      />
      <KPIItem
        label="Avg Hidden |Err|"
        value={`${stats.avgHiddenRiskError} mm`}
        sub="error on hidden busts"
        icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
        color="text-amber-300"
      />
      <KPIItem
        label="Max Obs in Zero"
        value={`${stats.maxObservedInZeroSpread} mm`}
        sub="peak surprise rainfall"
        icon={<TrendingUp className="w-4 h-4 text-red-400" />}
        color={stats.maxObservedInZeroSpread > 30 ? 'text-red-400' : 'text-orange-400'}
        warning={stats.maxObservedInZeroSpread > 30}
      />
      <KPIItem
        label="Affected Stations"
        value={stats.affectedLocationsCount.toString()}
        sub="locations with hidden busts"
        icon={<MapPin className="w-4 h-4 text-emerald-400" />}
        color="text-emerald-400"
      />
    </div>
  )
}
