import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { cn } from '../../utils/cn'
import { ChevronRight } from 'lucide-react'
import type { Forecast } from '../../types'
import type { BustVsNonBustStats } from '../../utils/bustAnalysis'

interface BustVsNonBustComparisonProps {
  stats: BustVsNonBustStats
  largestErrors: Forecast[]
}

export const BustVsNonBustComparison: React.FC<BustVsNonBustComparisonProps> = ({ stats, largestErrors }) => {
  const navigate = useNavigate()

  const rows = [
    { label: 'Count', bust: stats.busts.count, nonBust: stats.nonBusts.count, unit: '', isBold: true },
    { label: 'Avg Forecast (mm)', bust: stats.busts.avgForecast, nonBust: stats.nonBusts.avgForecast, unit: 'mm' },
    { label: 'Avg Observed (mm)', bust: stats.busts.avgObserved, nonBust: stats.nonBusts.avgObserved, unit: 'mm' },
    { label: 'Avg |Error| (mm)', bust: stats.busts.avgAbsError, nonBust: stats.nonBusts.avgAbsError, unit: 'mm', highlight: true },
    { label: 'Avg Ensemble Spread', bust: stats.busts.avgSpread, nonBust: stats.nonBusts.avgSpread, unit: 'mm' },
    { label: 'Avg Bust Probability', bust: stats.busts.avgBustProb, nonBust: stats.nonBusts.avgBustProb, unit: '%', highlight: true },
    { label: 'Avg Confidence', bust: stats.busts.avgConfidence, nonBust: stats.nonBusts.avgConfidence, unit: '%' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Comparison Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bust vs Non-Bust Comparison</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Descriptive statistics from the filtered dataset</p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Metric</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-red-500">Busts</th>
                <th className="text-right px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-sky-500">Non-Busts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/60">
              {rows.map((row) => (
                <tr key={row.label} className={cn('hover:bg-[#10213d] transition-colors', row.highlight && 'bg-[#0b172a]/40')}>
                  <td className={cn('px-5 py-2.5 text-slate-400', row.isBold && 'font-semibold text-slate-300')}>{row.label}</td>
                  <td className={cn('px-3 py-2.5 text-right font-mono', row.highlight ? 'text-red-400 font-semibold' : 'text-slate-200')}>
                    {row.bust}{row.unit === '%' ? '%' : ''}
                  </td>
                  <td className={cn('px-5 py-2.5 text-right font-mono', row.highlight ? 'text-sky-400 font-semibold' : 'text-slate-400')}>
                    {row.nonBust}{row.unit === '%' ? '%' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Largest Errors */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Largest Forecast Errors</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Top records by absolute error — click to open Forecast Detail</p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</th>
                  <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Date</th>
                  <th className="text-right px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">|Error|</th>
                  <th className="text-right px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Bust Prob</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {largestErrors.slice(0, 10).map((fc) => (
                  <tr
                    key={fc.id}
                    className="hover:bg-[#10213d] cursor-pointer transition-colors group"
                    onClick={() => navigate(`/forecasts/${fc.id}`)}
                  >
                    <td className="px-5 py-2.5">
                      <div className="font-medium text-slate-100">{fc.locationName}</div>
                      <div className="text-[10px] text-slate-500">D+{fc.leadDay}</div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-400 hidden sm:table-cell">{fc.validDate}</td>
                    <td className={cn(
                      'px-3 py-2.5 text-right font-mono font-bold',
                      Math.abs(fc.forecastError) > 40 ? 'text-red-400' :
                      Math.abs(fc.forecastError) > 20 ? 'text-orange-400' : 'text-yellow-400'
                    )}>
                      {Math.abs(fc.forecastError).toFixed(0)} mm
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-amber-300 hidden md:table-cell">
                      {(fc.bustProbability * 100).toFixed(0)}%
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 group-hover:text-sky-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
