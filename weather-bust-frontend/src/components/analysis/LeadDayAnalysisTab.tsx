import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { cn } from '../../utils/cn'
import type { LeadDayVerificationStat } from '../../utils/verificationAnalysis'

interface LeadDayAnalysisTabProps {
  leadDayStats: LeadDayVerificationStat[]
}

export const LeadDayAnalysisTab: React.FC<LeadDayAnalysisTabProps> = ({ leadDayStats }) => {
  return (
    <div className="space-y-6">
      {/* ── Lead Day Charts ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MAE and Ensemble Spread Evolution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Error Degradation vs Ensemble Spread</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing how forecast error (MAE) grows alongside ensemble uncertainty across D+1 to D+10
            </p>
          </CardHeader>
          <CardContent className="pt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={leadDayStats} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
                <XAxis dataKey="leadDay" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => `D+${v}`} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} />
                <Tooltip contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="mae" name="Mean Absolute Error (mm)" fill="#0284c7" radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Line type="monotone" dataKey="avgSpread" name="Avg Ensemble Spread (mm)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Day Bust Rate & Bias */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bust Rate &amp; Systematic Bias by Lead Day</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating failure frequency and signed over/under-forecast tendencies at extending horizons
            </p>
          </CardHeader>
          <CardContent className="pt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={leadDayStats} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
                <XAxis dataKey="leadDay" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => `D+${v}`} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
                <YAxis yAxisId="bias" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} />
                <YAxis yAxisId="rate" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar yAxisId="bias" dataKey="bias" name="Mean Signed Bias (mm)" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Line yAxisId="rate" type="monotone" dataKey="bustRate" name="Bust Rate %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Lead Day Comprehensive Table ───────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Lead-Day Verification Performance Matrix</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical metrics stratified across forecast lead times D+1 through D+10
          </p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Lead Horizon
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Forecasts
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    MAE (mm)
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Bias (mm)
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    RMSE (mm)
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Busts
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Bust Rate
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Avg Spread
                  </th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Avg Bust Prob
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {leadDayStats.map((row) => (
                  <tr key={row.leadDay} className="hover:bg-[#10213d] transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-200">
                      <span className="font-mono text-sky-400">D+{row.leadDay}</span>
                      <span className="text-slate-500 text-[10px] ml-2">
                        ({row.leadDay === 1 ? 'Next Day' : `${row.leadDay} Days Out`})
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">{row.forecastCount}</td>
                    <td className="px-3 py-3 text-right font-mono font-semibold text-sky-300">{row.mae} mm</td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-medium',
                        row.bias > 0 ? 'text-amber-300' : 'text-cyan-300'
                      )}
                    >
                      {row.bias > 0 ? `+${row.bias}` : row.bias} mm
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">{row.rmse} mm</td>
                    <td className="px-3 py-3 text-right font-mono text-red-400 font-medium">{row.bustCount}</td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-bold',
                        row.bustRate > 15 ? 'text-red-400' : row.bustRate > 5 ? 'text-orange-400' : 'text-emerald-400'
                      )}
                    >
                      {row.bustRate}%
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-cyan-300">{row.avgSpread} mm</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-300">{row.avgBustProb}%</td>
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
