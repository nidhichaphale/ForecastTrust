import React from 'react'
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  Activity,
  CloudRain,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import type { RiskLevel } from '../../types'

export interface KPIItem {
  id: string
  label: string
  value: string | number
  unit?: string
  supporting?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  riskLevel?: RiskLevel
  delta?: { value: string; direction: 'up' | 'down' | 'neutral' }
}

const RISK_ACCENT: Record<RiskLevel, string> = {
  low: 'text-emerald-400',
  moderate: 'text-amber-400',
  high: 'text-orange-400',
  severe: 'text-red-400',
}

export const KPIGrid: React.FC<{ items: KPIItem[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        const valueColor = item.riskLevel ? RISK_ACCENT[item.riskLevel] : 'text-white'

        return (
          <div
            key={item.id}
            className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {item.label}
              </div>
              <div
                className={cn(
                  'w-7 h-7 rounded-md bg-[#10213d] flex items-center justify-center',
                  item.iconColor ?? 'text-sky-400'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className={cn('text-2xl font-bold tracking-tight font-mono', valueColor)}>
                {item.value}
              </span>
              {item.unit && (
                <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
              )}
            </div>

            {(item.supporting || item.delta) && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                {item.delta && (
                  <span
                    className={cn(
                      'font-medium',
                      item.delta.direction === 'up'
                        ? 'text-orange-400'
                        : item.delta.direction === 'down'
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    )}
                  >
                    {item.delta.direction === 'up' ? '↑' : item.delta.direction === 'down' ? '↓' : '→'}{' '}
                    {item.delta.value}
                  </span>
                )}
                {item.supporting && <span>{item.supporting}</span>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Pre-defined icon mappings for export
export { MapPin, TrendingUp, AlertTriangle, BarChart3, ShieldAlert, Activity, CloudRain, ShieldCheck }
