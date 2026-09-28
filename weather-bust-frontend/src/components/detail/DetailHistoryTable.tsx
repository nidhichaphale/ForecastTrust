import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Forecast, RiskLevel } from '../../types'

interface DetailHistoryTableProps {
  history: Forecast[]
  currentForecastId: string
}

export const DetailHistoryTable: React.FC<DetailHistoryTableProps> = ({ history, currentForecastId }) => {
  const navigate = useNavigate()

  // Sort history by date descending
  const sortedHistory = [...history].sort((a, b) => b.validDate.localeCompare(a.validDate))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Related Forecast History</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Other recent forecasts for the same location
        </p>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lead</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fcst (mm)</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Obs (mm)</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Error</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bust Prob</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Risk</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/60">
              {sortedHistory.map((fc) => {
                const isCurrent = fc.id === currentForecastId
                return (
                  <tr
                    key={fc.id}
                    onClick={() => { if (!isCurrent) navigate(`/forecasts/${fc.id}`) }}
                    className={cn(
                      'transition-colors duration-150',
                      isCurrent ? 'bg-sky-950/20' : 'cursor-pointer hover:bg-[#10213d] group'
                    )}
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-slate-300">{fc.validDate}</span>
                      {isCurrent && <span className="ml-2 text-[10px] text-sky-400 font-semibold uppercase tracking-wider">(Current)</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-mono text-slate-400">D+{fc.leadDay}</span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-200">{fc.forecastRainfall}</td>
                    <td className="px-3 py-3 text-right font-mono text-amber-300">
                      {fc.observedRainfall !== null ? fc.observedRainfall : <span className="text-slate-500 text-xs italic">Pending</span>}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      <span className={
                        fc.forecastError === null ? 'text-slate-500' :
                        fc.forecastError > 0 ? 'text-red-400' :
                        fc.forecastError < 0 ? 'text-sky-400' : 'text-slate-400'
                      }>
                        {fc.forecastError === null ? '—' : `${fc.forecastError > 0 ? '+' : ''}${fc.forecastError}`}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">
                      {(fc.bustProbability * 100).toFixed(0)}%
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={fc.riskLevel as RiskLevel} size="sm">
                        {fc.riskLevel.charAt(0).toUpperCase() + fc.riskLevel.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {!isCurrent && <ChevronRight className="w-4 h-4 group-hover:text-sky-400 transition-colors" />}
                    </td>
                  </tr>
                )
              })}
              {sortedHistory.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-6 text-center text-slate-500">
                    No related forecast history found for this location.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
