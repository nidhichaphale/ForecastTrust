import React from 'react'
import {
  Bell,
  AlertTriangle,
  EyeOff,
  Database,
  ShieldAlert,
  Layers,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export type AlertQuickViewKey =
  | 'all'
  | 'unacknowledged'
  | 'high_critical'
  | 'busts'
  | 'hidden_risk'
  | 'data_quality'

interface AlertQuickViewsProps {
  activeView: AlertQuickViewKey
  onSelectView: (view: AlertQuickViewKey) => void
  counts: {
    total: number
    unacknowledged: number
    highCritical: number
    busts: number
    hiddenRisk: number
    dataQuality: number
  }
}

export const AlertQuickViews: React.FC<AlertQuickViewsProps> = ({
  activeView,
  onSelectView,
  counts,
}) => {
  const tabs = [
    {
      id: 'all' as AlertQuickViewKey,
      label: 'All Alerts',
      icon: Layers,
      count: counts.total,
    },
    {
      id: 'unacknowledged' as AlertQuickViewKey,
      label: 'Unacknowledged',
      icon: Bell,
      count: counts.unacknowledged,
      alertColor: counts.unacknowledged > 0 ? 'text-red-400 bg-red-950/40 border-red-800/50' : undefined,
    },
    {
      id: 'high_critical' as AlertQuickViewKey,
      label: 'High & Severe',
      icon: ShieldAlert,
      count: counts.highCritical,
      alertColor: counts.highCritical > 0 ? 'text-rose-400 bg-rose-950/40 border-rose-800/50' : undefined,
    },
    {
      id: 'busts' as AlertQuickViewKey,
      label: 'Bust Alerts',
      icon: AlertTriangle,
      count: counts.busts,
    },
    {
      id: 'hidden_risk' as AlertQuickViewKey,
      label: 'Hidden Risk',
      icon: EyeOff,
      count: counts.hiddenRisk,
    },
    {
      id: 'data_quality' as AlertQuickViewKey,
      label: 'Data Quality',
      icon: Database,
      count: counts.dataQuality,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#1a2e4c] pb-3">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
        Quick Views:
      </span>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeView === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectView(tab.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border',
              isActive
                ? 'bg-sky-950/70 border-sky-500/60 text-sky-200 shadow-xs'
                : 'bg-[#0b172a] border-[#1a2e4c] text-slate-400 hover:text-slate-200 hover:bg-[#10213d]'
            )}
          >
            <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-sky-400' : 'text-slate-500')} />
            <span>{tab.label}</span>
            <span
              className={cn(
                'ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono border',
                tab.alertColor
                  ? tab.alertColor
                  : isActive
                  ? 'bg-sky-900/60 text-sky-300 border-sky-700/50'
                  : 'bg-[#10213d] text-slate-400 border-[#1a2e4c]'
              )}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
