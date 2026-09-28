import React from 'react'
import { cn } from '../../utils/cn'
import type { BustSummaryStats } from '../../utils/bustAnalysis'
import {
  ShieldAlert, AlertTriangle, Activity, BarChart3,
  Crosshair, TrendingUp, Percent
} from 'lucide-react'

interface BustSummaryKPIsProps {
  stats: BustSummaryStats
}

interface KPIItemProps {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  color?: string
  warning?: boolean
}

const KPIItem: React.FC<KPIItemProps> = ({ label, value, sub, icon, color = 'text-slate-100', warning }) => (
  <div className={cn(
    'flex flex-col gap-2 p-4 rounded-lg border',
    warning ? 'bg-red-950/20 border-red-900/40' : 'bg-[#0b172a] border-[#1a2e4c]'
  )}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-slate-600">{icon}</span>
    </div>
    <div className={cn('text-2xl font-bold font-mono tracking-tight', color)}>{value}</div>
    {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
  </div>
)

export const BustSummaryKPIs: React.FC<BustSummaryKPIsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      <div className="sm:col-span-2">
        <KPIItem
          label="Total Forecasts"
          value={stats.totalForecasts.toLocaleString()}
          sub={`${stats.nonBustCount.toLocaleString()} normal · ${stats.bustCount} busts`}
          icon={<BarChart3 className="w-4 h-4" />}
          color="text-slate-100"
        />
      </div>
      <div className="sm:col-span-2">
        <KPIItem
          label="Bust Rate"
          value={`${stats.bustRate}%`}
          sub={`${stats.bustCount} detected busts`}
          icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
          color={stats.bustRate > 10 ? 'text-red-400' : stats.bustRate > 5 ? 'text-orange-400' : 'text-emerald-400'}
          warning={stats.bustRate > 10}
        />
      </div>
      <KPIItem
        label="Avg |Error|"
        value={`${stats.avgAbsError} mm`}
        icon={<Activity className="w-4 h-4 text-sky-400" />}
        color="text-sky-400"
      />
      <KPIItem
        label="Max |Error|"
        value={`${stats.maxAbsError} mm`}
        icon={<TrendingUp className="w-4 h-4 text-orange-400" />}
        color={stats.maxAbsError > 40 ? 'text-red-400' : 'text-orange-400'}
        warning={stats.maxAbsError > 50}
      />
      <KPIItem
        label="Avg Bust Prob"
        value={`${stats.avgBustProbability}%`}
        icon={<Percent className="w-4 h-4" />}
        color="text-amber-300"
      />
      <KPIItem
        label="High/Severe Busts"
        value={stats.highSevereBusts.toString()}
        sub="high or severe risk"
        icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}
        color={stats.highSevereBusts > 0 ? 'text-orange-400' : 'text-emerald-400'}
      />
      <KPIItem
        label="Avg Confidence"
        value={`${stats.avgConfidence}%`}
        icon={<Crosshair className="w-4 h-4 text-emerald-400" />}
        color="text-emerald-400"
      />
    </div>
  )
}
