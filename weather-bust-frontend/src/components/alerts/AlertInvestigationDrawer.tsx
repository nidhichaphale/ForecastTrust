import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { Alert, RiskLevel } from '../../types'
import { ALERT_TYPE_CONFIG, type AlertCategory } from '../../config/alertThresholds'
import { buildCrossWorkspaceQuery } from '../../utils/riskContextAnalysis'
import {
  X,
  ExternalLink,
  MapPin,
  AlertTriangle,
  EyeOff,
  Database,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Map as MapIcon,
  RotateCcw,
  Check,
} from 'lucide-react'

interface AlertInvestigationDrawerProps {
  alert: Alert | null
  isOpen: boolean
  onClose: () => void
  onAcknowledge: (alertId: string) => void
  onResolve: (alertId: string) => void
  onReopen: (alertId: string) => void
}

function formatDetailTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

export const AlertInvestigationDrawer: React.FC<AlertInvestigationDrawerProps> = ({
  alert,
  isOpen,
  onClose,
  onAcknowledge,
  onResolve,
  onReopen,
}) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !alert) return null

  const config = ALERT_TYPE_CONFIG[alert.alertType as AlertCategory] || {
    label: alert.alertType,
    shortLabel: 'Alert',
    description: alert.message,
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    iconColor: 'text-slate-400',
    defaultSeverity: alert.severity,
  }

  const isBust =
    alert.alertType === 'severe_forecast_bust' ||
    alert.alertType === 'flash_convective_discrepancy' ||
    Boolean(alert.relatedBustEventId)

  const isHiddenRisk = alert.alertType === 'hidden_risk_zero_spread'
  const isDataQuality = alert.alertType === 'data_quality_missing_observation'

  const mapCrossUrl = `/map${buildCrossWorkspaceQuery({
    locationId: alert.locationId,
    state: alert.state,
    region: alert.region,
    leadDay: alert.leadDay,
    date: alert.validDate,
  })}`

  const bustCrossUrl = `/bust-detection${buildCrossWorkspaceQuery({
    locationId: alert.locationId,
    state: alert.state,
    region: alert.region,
    leadDay: alert.leadDay,
    date: alert.validDate,
  })}`

  const hiddenRiskCrossUrl = `/hidden-risk${buildCrossWorkspaceQuery({
    locationId: alert.locationId,
    state: alert.state,
    region: alert.region,
    leadDay: alert.leadDay,
  })}`

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Sheet */}
      <div
        className="relative z-10 w-full max-w-lg bg-[#0b172a] border-l border-[#1a2e4c] shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-drawer-title"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#1a2e4c] bg-[#07111f] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs text-sky-400 font-bold bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
                {alert.id}
              </span>
              <Badge variant={alert.severity as RiskLevel} size="sm">
                {alert.severity.toUpperCase()} SEVERITY
              </Badge>
              {alert.status === 'resolved' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 uppercase">
                  Resolved
                </span>
              ) : alert.status === 'acknowledged' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/60 uppercase">
                  Acknowledged
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800/60 uppercase animate-pulse">
                  New (Unread)
                </span>
              )}
            </div>

            <h2 id="alert-drawer-title" className="text-base font-bold text-white leading-snug">
              {config.label}
            </h2>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Generated: <span className="font-mono text-slate-300">{formatDetailTime(alert.timestamp)}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#10213d] transition-colors"
            aria-label="Close alert drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Operational Status Control Strip */}
          <div className="bg-[#10213d]/60 border border-[#1a2e4c] rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Operational Alert Lifecycle
            </span>
            <div className="flex items-center gap-2">
              {alert.status !== 'acknowledged' && alert.status !== 'resolved' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-1.5 text-xs text-amber-300 border-amber-800/60 hover:bg-amber-950/40"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  Acknowledge Alert
                </Button>
              )}

              {alert.status !== 'resolved' && (
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 justify-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-xs"
                  onClick={() => onResolve(alert.id)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Resolved
                </Button>
              )}

              {alert.status === 'resolved' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-1.5 text-xs text-slate-300 hover:text-white"
                  onClick={() => onReopen(alert.id)}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  Reopen Alert
                </Button>
              )}
            </div>

            {(alert.acknowledgedAt || alert.resolvedAt) && (
              <div className="text-[10px] text-slate-500 pt-1 space-y-0.5 border-t border-[#1a2e4c]/60">
                {alert.acknowledgedAt && (
                  <p>
                    Acknowledged at: <span className="font-mono text-slate-400">{formatDetailTime(alert.acknowledgedAt)}</span>
                  </p>
                )}
                {alert.resolvedAt && (
                  <p>
                    Resolved at: <span className="font-mono text-slate-400">{formatDetailTime(alert.resolvedAt)}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Meteorological Trigger Explanation */}
          <div className="bg-[#10213d]/60 border border-[#1a2e4c] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Trigger Explanation &amp; Thresholds
              </h3>
            </div>

            <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c] text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed font-medium">{alert.message}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{config.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Trigger Condition</span>
                <span className="font-mono text-slate-200 text-xs font-bold mt-0.5 block">
                  {alert.triggerMetric || 'Threshold Breach'}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Recorded Value</span>
                <span className="font-mono text-amber-300 text-xs font-bold mt-0.5 block">
                  {alert.triggerValue || 'Flagged by Inference'}
                </span>
              </div>
            </div>

            {alert.threshold && (
              <div className="text-[11px] text-slate-400 bg-[#07111f]/60 px-3 py-1.5 rounded border border-[#1a2e4c] flex items-center justify-between">
                <span>Operational Calibrated Rule:</span>
                <span className="font-mono text-sky-300 font-medium">{alert.threshold}</span>
              </div>
            )}
          </div>

          {/* Geographical & Forecast Context */}
          <div className="bg-[#10213d]/60 border border-[#1a2e4c] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Geographic &amp; Temporal Context
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1a2e4c]/70">
                <span className="text-slate-400">Monitoring Station:</span>
                <span className="font-semibold text-slate-100">{alert.locationName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1a2e4c]/70">
                <span className="text-slate-400">Administrative State:</span>
                <span className="text-slate-200">{alert.state || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1a2e4c]/70">
                <span className="text-slate-400">Meteorological Region:</span>
                <span className="text-slate-200">{alert.region}</span>
              </div>
              {alert.validDate && (
                <div className="flex justify-between py-1 border-b border-[#1a2e4c]/70">
                  <span className="text-slate-400">Target Valid Date:</span>
                  <span className="font-mono text-slate-200">{alert.validDate}</span>
                </div>
              )}
              {alert.leadDay !== undefined && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Lead Horizon:</span>
                  <span className="font-mono text-slate-200">D+{alert.leadDay}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer & Cross-Workspace Navigation */}
        <div className="p-4 border-t border-[#1a2e4c] bg-[#07111f] space-y-2">
          {alert.relatedForecastId && (
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 font-semibold shadow-md shadow-sky-950/50"
              onClick={() => {
                onClose()
                navigate(`/forecasts/${alert.relatedForecastId}`)
              }}
            >
              Open Complete Forecast Detail
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="justify-center gap-1.5 text-xs text-slate-300 hover:text-white"
              onClick={() => {
                onClose()
                navigate(mapCrossUrl)
              }}
            >
              <MapIcon className="w-3.5 h-3.5 text-sky-400" />
              View on Map
            </Button>

            {isBust && (
              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1.5 text-xs text-rose-300 border-rose-900/50 hover:bg-rose-950/30"
                onClick={() => {
                  onClose()
                  navigate(bustCrossUrl)
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Bust Analysis
              </Button>
            )}

            {isHiddenRisk && (
              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1.5 text-xs text-cyan-300 border-cyan-900/50 hover:bg-cyan-950/30"
                onClick={() => {
                  onClose()
                  navigate(hiddenRiskCrossUrl)
                }}
              >
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                Hidden Risk
              </Button>
            )}

            {isDataQuality && (
              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1.5 text-xs text-yellow-300 border-yellow-900/50 hover:bg-yellow-950/30"
                onClick={() => {
                  onClose()
                  navigate('/data')
                }}
              >
                <Database className="w-3.5 h-3.5 text-yellow-400" />
                Data Quality
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
