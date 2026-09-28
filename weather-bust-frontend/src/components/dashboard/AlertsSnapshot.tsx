import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { StatusIndicator } from '../ui/StatusIndicator'
import { cn } from '../../utils/cn'
import type { Alert, RiskLevel } from '../../types'

interface AlertsSnapshotProps {
  alerts: Alert[]
  onViewAll?: () => void
}

const ALERT_TYPE_LABEL: Record<string, string> = {
  severe_forecast_bust: 'Severe Bust',
  hidden_risk_zero_spread: 'Hidden Risk',
  extreme_ensemble_divergence: 'Ensemble Divergence',
  flash_convective_discrepancy: 'Flash Convective',
  high_bust_risk: 'High Bust Risk',
  data_quality_missing_observation: 'Data Quality',
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts)
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return ts.slice(0, 10)
  }
}

export const AlertsSnapshot: React.FC<AlertsSnapshotProps> = ({ alerts, onViewAll }) => {
  const navigate = useNavigate()
  const unreadCount = alerts.filter((a) => !a.isRead).length

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              Active Alerts
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-bold border border-red-500/30">
                  {unreadCount}
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Most recent operational warnings and bust detections
            </p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-[11px] font-medium text-sky-400 hover:text-sky-300 transition-colors border border-[#1a2e4c] hover:border-sky-500/30 px-2.5 py-1 rounded-md"
            >
              View All →
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => navigate(`/alerts?alertId=${alert.id}`)}
            className={cn(
              'flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer',
              !alert.isRead
                ? 'bg-[#10213d] border-[#1a2e4c] hover:border-sky-500/30'
                : 'bg-[#0b172a]/60 border-[#1a2e4c]/40 opacity-75 hover:opacity-100 hover:border-slate-700'
            )}
          >
            {/* Severity dot */}
            <div className="pt-0.5 shrink-0">
              <StatusIndicator
                status={alert.severity as RiskLevel}
                pulse={!alert.isRead && !alert.isResolved}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-100">
                  {alert.locationName}
                </span>
                <Badge variant={alert.severity as RiskLevel} size="sm">
                  {ALERT_TYPE_LABEL[alert.alertType] || alert.alertType}
                </Badge>
                {alert.isResolved && (
                  <Badge variant="default" size="sm">Resolved</Badge>
                )}
                {!alert.isRead && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" title="Unread" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {alert.message}
              </p>
            </div>

            {/* Timestamp */}
            <div className="shrink-0 text-[10px] text-slate-500 font-mono text-right pt-0.5">
              {formatTimestamp(alert.timestamp)}
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">
            No active alerts at this time
          </div>
        )}
      </CardContent>
    </Card>
  )
}
