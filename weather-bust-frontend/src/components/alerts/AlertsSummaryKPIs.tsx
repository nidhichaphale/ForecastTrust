import React from 'react'
import { Card } from '../ui/Card'
import {
  Bell,
  AlertTriangle,
  EyeOff,
  Database,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react'
import type { Alert } from '../../types'

interface AlertsSummaryKPIsProps {
  alerts: Alert[]
}

export const AlertsSummaryKPIs: React.FC<AlertsSummaryKPIsProps> = ({ alerts }) => {
  const total = alerts.length
  const unacknowledged = alerts.filter((a) => a.status === 'new').length
  const active = alerts.filter((a) => !a.isResolved && a.status !== 'resolved').length
  const resolved = alerts.filter((a) => a.isResolved || a.status === 'resolved').length
  const highSevere = alerts.filter((a) => a.severity === 'high' || a.severity === 'severe').length
  const bustAlerts = alerts.filter(
    (a) => a.alertType === 'severe_forecast_bust' || a.alertType === 'flash_convective_discrepancy'
  ).length
  const hiddenRiskAlerts = alerts.filter((a) => a.alertType === 'hidden_risk_zero_spread').length
  const dataQualityAlerts = alerts.filter((a) => a.alertType === 'data_quality_missing_observation').length

  const cards = [
    {
      label: 'Active Alerts',
      value: active,
      sublabel: `${unacknowledged} unacknowledged`,
      icon: Bell,
      color: active > 0 ? 'text-amber-400' : 'text-slate-400',
      bgColor: 'bg-amber-950/20 border-amber-900/40',
      badge: unacknowledged > 0 ? `${unacknowledged} New` : undefined,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    },
    {
      label: 'High & Severe',
      value: highSevere,
      sublabel: 'Urgent operational priority',
      icon: ShieldAlert,
      color: 'text-red-400',
      bgColor: 'bg-red-950/20 border-red-900/40',
    },
    {
      label: 'Bust Alerts',
      value: bustAlerts,
      sublabel: 'Verified forecast failures',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/20 border-rose-900/40',
    },
    {
      label: 'Hidden Risk',
      value: hiddenRiskAlerts,
      sublabel: 'Zero-spread dry surprises',
      icon: EyeOff,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/20 border-cyan-900/40',
    },
    {
      label: 'Data Quality',
      value: dataQualityAlerts,
      sublabel: 'Ingest gaps & latency SLAs',
      icon: Database,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-950/20 border-yellow-900/40',
    },
    {
      label: 'Resolved',
      value: resolved,
      sublabel: `${total} total alerts tracked`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20 border-emerald-900/40',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card key={idx} className="p-3.5 flex flex-col justify-between border-[#1a2e4c] bg-[#0b172a]">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <Icon className={`w-4 h-4 ${card.color} shrink-0`} />
            </div>

            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {card.value}
              </span>
              {card.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              )}
            </div>

            <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-slate-600 shrink-0" />
              <span>{card.sublabel}</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
