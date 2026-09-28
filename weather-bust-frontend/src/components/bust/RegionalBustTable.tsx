import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { cn } from '../../utils/cn'
import type { RegionBustStats, RiskOutcomeStat } from '../../utils/bustAnalysis'

interface RegionalBustTableProps {
  regions: RegionBustStats[]
  riskOutcomes: RiskOutcomeStat[]
}

const RISK_COLOR: Record<string, string> = {
  low: 'text-emerald-400',
  moderate: 'text-yellow-400',
  high: 'text-orange-400',
  severe: 'text-red-400',
}

const BUST_RATE_COLOR = (rate: number) =>
  rate > 15 ? 'text-red-400' : rate > 8 ? 'text-orange-400' : rate > 3 ? 'text-yellow-400' : 'text-emerald-400'

export const RegionalBustTable: React.FC<RegionalBustTableProps> = ({ regions, riskOutcomes }) => {
  const sorted = [...regions].sort((a, b) => b.bustRate - a.bustRate)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Regional stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bust Distribution by Region</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Sorted by bust rate (descending)</p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Region</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fcsts</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Busts</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Rate</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Avg |Err|</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {sorted.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-500">No data.</td></tr>
                ) : sorted.map((r) => (
                  <tr key={r.region} className="hover:bg-[#10213d] transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-200">{r.region}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400">{r.total}</td>
                    <td className="px-3 py-3 text-right font-mono text-red-400">{r.busts}</td>
                    <td className={cn('px-3 py-3 text-right font-mono font-semibold', BUST_RATE_COLOR(r.bustRate))}>
                      {r.bustRate}%
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400">{r.avgAbsError} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk vs Outcome */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bust Outcomes by Risk Level</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Actual bust rate within each risk classification</p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Risk Level</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Forecasts</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Busts</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bust Rate</th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {riskOutcomes.map((r) => (
                  <tr key={r.riskLevel} className="hover:bg-[#10213d] transition-colors">
                    <td className={cn('px-5 py-3 font-semibold capitalize', RISK_COLOR[r.riskLevel])}>
                      {r.riskLevel}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400">{r.total}</td>
                    <td className="px-3 py-3 text-right font-mono text-red-400">{r.busts}</td>
                    <td className={cn('px-3 py-3 text-right font-mono font-semibold', BUST_RATE_COLOR(r.bustRate))}>
                      {r.bustRate}%
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end">
                        <div
                          className="h-1.5 rounded-full bg-slate-700 w-20 overflow-hidden"
                          title={`${r.bustRate}% bust rate`}
                        >
                          <div
                            className={cn('h-full rounded-full', r.bustRate > 15 ? 'bg-red-500' : r.bustRate > 8 ? 'bg-orange-400' : r.bustRate > 3 ? 'bg-yellow-400' : 'bg-emerald-400')}
                            style={{ width: `${Math.min(r.bustRate * 4, 100)}%` }}
                          />
                        </div>
                      </div>
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
