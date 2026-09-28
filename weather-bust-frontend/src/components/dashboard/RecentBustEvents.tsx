import React from 'react'
import { cn } from '../../utils/cn'
import { Badge } from '../ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { ChevronRight, TrendingUp } from 'lucide-react'
import type { BustEvent, RiskLevel } from '../../types'

interface RecentBustEventsProps {
  events: BustEvent[]
  onRowClick?: (ev: BustEvent) => void
}

const BUST_TYPE_LABEL: Record<BustEvent['bustType'], string> = {
  excess_underforecast: 'Under-forecast',
  deficit_overforecast: 'Over-forecast',
  unpredicted_convective: 'Convective',
}

export const RecentBustEvents: React.FC<RecentBustEventsProps> = ({
  events,
  onRowClick,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Recent Bust Events</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified precipitation forecast busts with model diagnostics
            </p>
          </div>
          <Badge variant="severe" size="sm">{events.length} events</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Date</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Lead</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fc</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Obs</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Error</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Type</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Severity</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Conf.</th>
                <th className="px-3 py-2.5 hidden sm:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/60">
              {events.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => onRowClick?.(ev)}
                  className={cn(
                    'transition-colors duration-100',
                    onRowClick ? 'cursor-pointer hover:bg-[#10213d] group' : ''
                  )}
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-100">{ev.locationName}</div>
                    <div className="text-[10px] text-slate-500">{ev.state}</div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className="font-mono text-slate-300">{ev.validDate}</span>
                  </td>
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    <span className="font-mono text-slate-400">D+{ev.leadDay}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-slate-300">{ev.forecastRainfall} mm</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-amber-300 font-medium">{ev.observedRainfall} mm</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className={cn('w-3 h-3', ev.error > 0 ? 'text-red-400' : 'text-sky-400')} />
                      <span className={cn(
                        'font-mono font-semibold',
                        ev.error > 0 ? 'text-red-400' : 'text-sky-400'
                      )}>
                        {ev.error > 0 ? `+${ev.error}` : ev.error} mm
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span className="text-slate-400">{BUST_TYPE_LABEL[ev.bustType]}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant={ev.severity as RiskLevel} size="sm">
                      {ev.severity.charAt(0).toUpperCase() + ev.severity.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-right font-mono hidden sm:table-cell">
                    <span className="text-emerald-400">{(ev.detectionConfidence * 100).toFixed(0)}%</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 group-hover:text-slate-300 transition-colors hidden sm:table-cell">
                    <ChevronRight className="w-4 h-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
