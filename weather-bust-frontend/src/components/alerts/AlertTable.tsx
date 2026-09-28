import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import type { Alert, RiskLevel } from '../../types'
import { ALERT_TYPE_CONFIG, type AlertCategory } from '../../config/alertThresholds'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Check,
  CheckCircle2,
} from 'lucide-react'

interface AlertTableProps {
  alerts: Alert[]
  onSelectAlert: (alert: Alert) => void
  onAcknowledge: (alertId: string) => void
  onResolve: (alertId: string) => void
  onReopen: (alertId: string) => void
  onClearFilters?: () => void
}

function formatTableTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return iso.slice(0, 10)
  }
}

export const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  onSelectAlert,
  onAcknowledge,
  onResolve,
  onReopen,
  onClearFilters,
}) => {
  const [page, setPage] = useState(1)
  const pageSize = 15

  const totalPages = Math.max(1, Math.ceil(alerts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * pageSize
  const pagedAlerts = alerts.slice(startIdx, startIdx + pageSize)

  return (
    <Card className="border-[#1a2e4c] bg-[#0b172a]">
      <CardHeader className="pb-3 border-b border-[#1a2e4c]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm">Alert Registry &amp; Operational Warnings</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {pagedAlerts.length} of {alerts.length} matching alerts &mdash; click row for deep investigation
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1a2e4c] bg-[#07111f]/60">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Severity
                </th>
                <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Alert Category
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Location &amp; Region
                </th>
                <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Operational Trigger
                </th>
                <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                  Valid / Horizon
                </th>
                <th className="text-right px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                  Timestamp
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Triage Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <p className="text-sm font-medium text-slate-400 mb-1">No alerts match the active filters.</p>
                    <p className="text-xs text-slate-500 mb-3">Try adjusting severity, category, or search parameters.</p>
                    {onClearFilters && (
                      <Button variant="outline" size="sm" onClick={onClearFilters}>
                        Clear All Filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                pagedAlerts.map((alt) => {
                  const config = ALERT_TYPE_CONFIG[alt.alertType as AlertCategory] || {
                    shortLabel: alt.alertType,
                    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
                  }
                  const isNew = alt.status === 'new'
                  const isAck = alt.status === 'acknowledged'
                  const isResolved = alt.status === 'resolved'

                  return (
                    <tr
                      key={alt.id}
                      onClick={() => onSelectAlert(alt)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelectAlert(alt)
                        }
                      }}
                      className={cn(
                        'border-b border-[#1a2e4c]/50 cursor-pointer transition-colors duration-150 focus:outline-none focus:bg-sky-950/30',
                        isNew ? 'bg-red-950/15 hover:bg-red-950/25' : 'hover:bg-[#10213d]'
                      )}
                    >
                      {/* Severity */}
                      <td className="px-4 py-3">
                        <Badge variant={alt.severity as RiskLevel} size="sm">
                          {alt.severity.toUpperCase()}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        {isNew && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800/60 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            New
                          </span>
                        )}
                        {isAck && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/50 uppercase">
                            <Check className="w-3 h-3 text-amber-400" />
                            Ack
                          </span>
                        )}
                        {isResolved && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 uppercase">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Resolved
                          </span>
                        )}
                      </td>

                      {/* Alert Category */}
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded border uppercase',
                            config.badgeColor
                          )}
                        >
                          {config.shortLabel}
                        </span>
                      </td>

                      {/* Location & Region */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100">{alt.locationName}</div>
                        <div className="text-[10px] text-slate-500">
                          {alt.state ? `${alt.state} · ` : ''}
                          {alt.region}
                        </div>
                      </td>

                      {/* Operational Trigger */}
                      <td className="px-3 py-3 max-w-xs truncate">
                        <span className="text-slate-300 font-medium block truncate">{alt.message}</span>
                        {alt.triggerValue && (
                          <span className="text-[10px] font-mono text-amber-400/90 block">
                            {alt.triggerMetric ? `${alt.triggerMetric}: ` : ''}
                            {alt.triggerValue}
                          </span>
                        )}
                      </td>

                      {/* Valid Date / Lead Horizon */}
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <div className="font-mono text-slate-300 text-[11px]">{alt.validDate || 'N/A'}</div>
                        {alt.leadDay !== undefined && (
                          <div className="text-[10px] font-mono text-slate-500">D+{alt.leadDay}</div>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="px-3 py-3 text-right font-mono text-slate-400 text-[11px] hidden lg:table-cell">
                        {formatTableTime(alt.timestamp)}
                      </td>

                      {/* Triage Actions */}
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking button
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {isNew && (
                            <button
                              type="button"
                              onClick={() => onAcknowledge(alt.id)}
                              className="px-2 py-1 rounded bg-[#10213d] hover:bg-[#183158] text-amber-300 border border-amber-800/40 text-[10px] font-medium transition-colors"
                              title="Acknowledge alert"
                            >
                              Acknowledge
                            </button>
                          )}

                          {!isResolved && (
                            <button
                              type="button"
                              onClick={() => onResolve(alt.id)}
                              className="px-2 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-[10px] font-medium transition-colors"
                              title="Mark as resolved"
                            >
                              Resolve
                            </button>
                          )}

                          {isResolved && (
                            <button
                              type="button"
                              onClick={() => onReopen(alt.id)}
                              className="px-2 py-1 rounded bg-[#10213d] hover:bg-[#183158] text-slate-400 hover:text-slate-200 border border-[#1a2e4c] text-[10px] font-medium transition-colors"
                              title="Reopen alert"
                            >
                              Reopen
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onSelectAlert(alt)}
                            className="p-1 text-slate-400 hover:text-sky-300 transition-colors"
                            title="Inspect alert details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#1a2e4c] bg-[#07111f]/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing {startIdx + 1}&ndash;{Math.min(startIdx + pageSize, alerts.length)} of {alerts.length} alerts
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 h-7 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Prev
              </Button>
              <span className="text-xs font-mono text-slate-300 px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 h-7 text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
