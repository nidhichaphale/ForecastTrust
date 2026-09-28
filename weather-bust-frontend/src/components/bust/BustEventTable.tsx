import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import { X, ExternalLink, Map as MapIcon, Search, HelpCircle } from 'lucide-react'
import type { BustEvent, RiskLevel } from '../../types'
import { buildCrossWorkspaceQuery } from '../../utils/riskContextAnalysis'

interface BustEventTableProps {
  events: BustEvent[]
  onSelectForecast?: (forecastId: string) => void
}

const BUST_TYPE_LABEL: Record<string, string> = {
  excess_underforecast: 'Under-forecast',
  deficit_overforecast: 'Over-forecast',
  unpredicted_convective: 'Convective',
}

const BustEventDetail: React.FC<{
  event: BustEvent
  onClose: () => void
  onSelectForecast?: (forecastId: string) => void
}> = ({ event, onClose, onSelectForecast }) => {
  const navigate = useNavigate()

  const mapCrossUrl = `/map${buildCrossWorkspaceQuery({
    locationId: event.locationId,
    state: event.state,
    region: event.region,
    leadDay: event.leadDay,
    date: event.validDate,
  })}`

  const hiddenRiskCrossUrl = `/hidden-risk${buildCrossWorkspaceQuery({
    locationId: event.locationId,
    state: event.state,
    region: event.region,
    leadDay: event.leadDay,
  })}`

  return (
    <div className="border-t border-[#1a2e4c] bg-[#07111f]">
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location / ID */}
        <div className="space-y-3 text-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Event Details</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Event ID</span><span className="font-mono text-slate-400">{event.id}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Forecast ID</span><span className="font-mono text-slate-400">{event.forecastId}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="text-slate-200 font-medium">{event.locationName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">State</span><span className="text-slate-300">{event.state}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Region</span><span className="text-slate-300">{event.region}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Valid Date</span><span className="font-mono text-slate-300">{event.validDate}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Lead Day</span><span className="font-mono text-slate-300">D+{event.leadDay}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="text-slate-300">{BUST_TYPE_LABEL[event.bustType] ?? event.bustType}</span></div>
          </div>
        </div>
        {/* Rainfall */}
        <div className="space-y-3 text-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Rainfall & Error</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Forecast</span><span className="font-mono text-slate-100">{event.forecastRainfall} mm</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Observed</span><span className="font-mono text-amber-300">{event.observedRainfall} mm</span></div>
            <div className="flex justify-between">
              <span className="text-slate-500">Error (Obs–Fc)</span>
              <span className={cn('font-mono font-semibold', event.error > 0 ? 'text-red-400' : 'text-sky-400')}>
                {event.error > 0 ? '+' : ''}{event.error} mm
              </span>
            </div>
            <div className="flex justify-between"><span className="text-slate-500">Bust Probability</span><span className="font-mono text-orange-400">{(event.bustProbability * 100).toFixed(0)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Detection Conf.</span><span className="font-mono text-emerald-400">{(event.detectionConfidence * 100).toFixed(0)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Severity</span>
              <Badge variant={event.severity as RiskLevel} size="sm">{event.severity}</Badge>
            </div>
          </div>
        </div>
        {/* Summary + Actions */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Summary &amp; Cross-Workspace</p>
          <p className="text-xs text-slate-300 leading-relaxed">{event.summary}</p>
          
          <div className="space-y-1.5 pt-1">
            {onSelectForecast && (
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center gap-1.5 bg-sky-600 hover:bg-sky-500"
                onClick={() => onSelectForecast(event.forecastId)}
              >
                <Search className="w-3.5 h-3.5" />
                Inspect in Risk Drawer
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center gap-1.5 text-xs text-slate-300 hover:text-white"
              onClick={() => navigate(`/forecasts/${event.forecastId}`)}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Forecast Detail
            </Button>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1 text-[11px] text-slate-400 hover:text-sky-300"
                onClick={() => navigate(mapCrossUrl)}
              >
                <MapIcon className="w-3 h-3 text-sky-400" />
                View on Map
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1 text-[11px] text-slate-400 hover:text-amber-300"
                onClick={() => navigate(hiddenRiskCrossUrl)}
              >
                <HelpCircle className="w-3 h-3 text-amber-400" />
                Hidden Risk
              </Button>
            </div>
          </div>

          <button onClick={onClose} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1">
            <X className="w-3 h-3 inline mr-1" />Close
          </button>
        </div>
      </div>
    </div>
  )
}


export const BustEventTable: React.FC<BustEventTableProps> = ({ events, onSelectForecast }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sorted = [...events].sort((a, b) => b.validDate.localeCompare(a.validDate))
  const shown = sorted.slice(0, 20)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Recent Bust Events</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          {shown.length} of {events.length} events — click a row to expand details
        </p>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Date</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Lead</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fc (mm)</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Obs (mm)</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Error</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Severity</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Bust Prob</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden xl:table-cell">Type</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-6 text-center text-slate-500">No bust events match the current filters.</td></tr>
              ) : shown.map((ev) => (
                <React.Fragment key={ev.id}>
                  <tr
                    className={cn(
                      'border-b border-[#1a2e4c]/60 cursor-pointer transition-colors',
                      expandedId === ev.id ? 'bg-sky-950/20' : 'hover:bg-[#10213d]'
                    )}
                    onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-100">{ev.locationName}</div>
                      <div className="text-[10px] text-slate-500">{ev.state}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-300 hidden sm:table-cell">{ev.validDate}</td>
                    <td className="px-3 py-3 text-center font-mono text-slate-400 hidden md:table-cell">D+{ev.leadDay}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-200">{ev.forecastRainfall}</td>
                    <td className="px-3 py-3 text-right font-mono text-amber-300">{ev.observedRainfall}</td>
                    <td className={cn('px-3 py-3 text-right font-mono font-semibold', ev.error > 0 ? 'text-red-400' : 'text-sky-400')}>
                      {ev.error > 0 ? '+' : ''}{ev.error}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={ev.severity as RiskLevel} size="sm">{ev.severity}</Badge>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-orange-400 hidden lg:table-cell">
                      {(ev.bustProbability * 100).toFixed(0)}%
                    </td>
                    <td className="px-3 py-3 text-slate-400 hidden xl:table-cell">
                      {BUST_TYPE_LABEL[ev.bustType] ?? ev.bustType}
                    </td>
                  </tr>
                  {expandedId === ev.id && (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <BustEventDetail
                          event={ev}
                          onClose={() => setExpandedId(null)}
                          onSelectForecast={onSelectForecast}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
