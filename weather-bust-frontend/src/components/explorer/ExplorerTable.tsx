import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { StatusIndicator } from '../ui/StatusIndicator'
import { cn } from '../../utils/cn'
import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react'
import type { Forecast, RiskLevel } from '../../types'

export type SortField = 'validDate' | 'leadDay' | 'forecastRainfall' | 'observedRainfall' | 'forecastError' | 'ensembleSpread' | 'bustProbability' | 'confidence'

interface ExplorerTableProps {
  forecasts: Forecast[]
  sortField: SortField
  sortDesc: boolean
  onSort: (field: SortField) => void
  onRowClick: (forecast: Forecast) => void
}

const RISK_LABEL: Record<RiskLevel, string> = {
  severe: 'Severe',
  high: 'High',
  moderate: 'Mod',
  low: 'Low',
}

const SortIcon: React.FC<{ active: boolean; desc: boolean }> = ({ active, desc }) => {
  if (!active) return <span className="w-3 h-3 inline-block opacity-0 group-hover:opacity-30 transition-opacity"><ArrowDown className="w-3 h-3" /></span>
  return desc ? <ArrowDown className="w-3 h-3 text-sky-400" /> : <ArrowUp className="w-3 h-3 text-sky-400" />
}

export const ExplorerTable: React.FC<ExplorerTableProps> = ({
  forecasts,
  sortField,
  sortDesc,
  onSort,
  onRowClick,
}) => {
  const handleHeaderClick = (field: SortField) => {
    onSort(field)
  }

  const thClass = "px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300 cursor-pointer group transition-colors select-none"

  return (
    <Card className="overflow-hidden border-[#1a2e4c]">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1a2e4c] bg-[#0b172a]/50">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</th>
                
                <th className={`text-left ${thClass}`} onClick={() => handleHeaderClick('validDate')}>
                  <div className="flex items-center gap-1">Date <SortIcon active={sortField === 'validDate'} desc={sortDesc} /></div>
                </th>
                
                <th className={`text-center hidden sm:table-cell ${thClass}`} onClick={() => handleHeaderClick('leadDay')}>
                  <div className="flex items-center justify-center gap-1">Lead <SortIcon active={sortField === 'leadDay'} desc={sortDesc} /></div>
                </th>
                
                <th className={`text-right ${thClass}`} onClick={() => handleHeaderClick('forecastRainfall')}>
                  <div className="flex items-center justify-end gap-1">Fc (mm) <SortIcon active={sortField === 'forecastRainfall'} desc={sortDesc} /></div>
                </th>
                
                <th className={`text-right ${thClass}`} onClick={() => handleHeaderClick('observedRainfall')}>
                  <div className="flex items-center justify-end gap-1">Obs (mm) <SortIcon active={sortField === 'observedRainfall'} desc={sortDesc} /></div>
                </th>
                
                <th className={`text-right hidden md:table-cell ${thClass}`} onClick={() => handleHeaderClick('forecastError')}>
                  <div className="flex items-center justify-end gap-1">Error <SortIcon active={sortField === 'forecastError'} desc={sortDesc} /></div>
                </th>

                <th className={`text-right hidden lg:table-cell ${thClass}`} onClick={() => handleHeaderClick('ensembleSpread')}>
                  <div className="flex items-center justify-end gap-1">Spread <SortIcon active={sortField === 'ensembleSpread'} desc={sortDesc} /></div>
                </th>
                
                <th className={`text-right ${thClass}`} onClick={() => handleHeaderClick('bustProbability')}>
                  <div className="flex items-center justify-end gap-1">Bust Prob <SortIcon active={sortField === 'bustProbability'} desc={sortDesc} /></div>
                </th>
                
                <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Risk</th>
                <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Status</th>
                <th className={`text-right hidden xl:table-cell ${thClass}`} onClick={() => handleHeaderClick('confidence')}>
                  <div className="flex items-center justify-end gap-1">Conf <SortIcon active={sortField === 'confidence'} desc={sortDesc} /></div>
                </th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/60">
              {forecasts.length > 0 ? (
                forecasts.map((fc) => (
                  <tr
                    key={fc.id}
                    onClick={() => onRowClick(fc)}
                    className="cursor-pointer hover:bg-[#10213d] transition-colors duration-150 group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-100">{fc.locationName}</div>
                      <div className="text-[10px] text-slate-500">{fc.state}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-slate-300">{fc.validDate}</span>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className="font-mono text-slate-400">D+{fc.leadDay}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-mono text-slate-200">{fc.forecastRainfall}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-mono text-amber-300">
                        {fc.observedRainfall !== null ? fc.observedRainfall : <span className="text-slate-500 text-xs italic">Pending</span>}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right hidden md:table-cell">
                      <span className={cn('font-mono font-medium',
                        fc.forecastError === null ? 'text-slate-500' :
                        fc.forecastError > 0 ? 'text-red-400' :
                        fc.forecastError < 0 ? 'text-sky-400' : 'text-slate-400'
                      )}>
                        {fc.forecastError === null ? '—' : `${fc.forecastError > 0 ? '+' : ''}${fc.forecastError}`}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right hidden lg:table-cell">
                      <span className={cn('font-mono', fc.ensembleSpread === 0 ? 'text-cyan-400 font-bold' : 'text-slate-400')}>
                        {fc.ensembleSpread}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={cn(
                        'font-mono font-semibold',
                        fc.bustProbability >= 0.75 ? 'text-red-400' :
                        fc.bustProbability >= 0.55 ? 'text-orange-400' :
                        fc.bustProbability >= 0.35 ? 'text-amber-400' : 'text-emerald-400'
                      )}>
                        {(fc.bustProbability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <StatusIndicator status={fc.riskLevel} pulse={false} />
                        <Badge variant={fc.riskLevel as RiskLevel} size="sm">
                          {RISK_LABEL[fc.riskLevel]}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <Badge variant={fc.bustStatus === 'bust' ? 'severe' : 'outline'} size="sm">
                        {fc.bustStatus === 'bust' ? 'Bust' : 'Normal'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-right font-mono hidden xl:table-cell">
                      <span className="text-slate-400">{(fc.confidence * 100).toFixed(0)}%</span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 group-hover:text-sky-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center">
                    <p className="text-slate-400 font-medium mb-1">No forecasts match the selected filters.</p>
                    <p className="text-xs text-slate-500">Try adjusting the date, location, risk, or lead-day filters.</p>
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
