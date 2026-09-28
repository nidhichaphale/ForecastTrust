import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  TrendingDown,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import type { Forecast } from '../../types'
import type {
  VerificationSummaryMetrics,
  ErrorTrendPoint,
  LeadDayVerificationStat,
} from '../../utils/verificationAnalysis'
import type { AnalysisTabId } from './AnalysisTabNav'

interface VerificationOverviewTabProps {
  summary: VerificationSummaryMetrics
  errorTrend: ErrorTrendPoint[]
  leadDayStats: LeadDayVerificationStat[]
  topErrorForecasts: Forecast[]
  onSelectTab: (tab: AnalysisTabId) => void
}

export const VerificationOverviewTab: React.FC<VerificationOverviewTabProps> = ({
  summary,
  errorTrend,
  leadDayStats,
  topErrorForecasts,
  onSelectTab,
}) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* ── Summary KPI Strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Forecasts</div>
          <div className="text-xl font-bold font-mono text-slate-100">{summary.totalForecasts.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">sample size</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span>MAE</span>
            <TrendingDown className="w-3 h-3 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-300">{summary.mae} mm</div>
          <div className="text-[10px] text-slate-500 mt-0.5">mean absolute error</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Mean Bias</div>
          <div className={cn('text-xl font-bold font-mono', summary.bias > 0 ? 'text-amber-300' : 'text-cyan-300')}>
            {summary.bias > 0 ? `+${summary.bias}` : summary.bias} mm
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">forecast - observed</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">RMSE</div>
          <div className="text-xl font-bold font-mono text-slate-200">{summary.rmse} mm</div>
          <div className="text-[10px] text-slate-500 mt-0.5">penalizes outliers</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span>Bust Rate</span>
            <AlertTriangle className="w-3 h-3 text-red-400" />
          </div>
          <div className={cn('text-xl font-bold font-mono', summary.bustRate > 15 ? 'text-red-400' : 'text-orange-400')}>
            {summary.bustRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{summary.bustCount} total busts</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Avg Bust Prob</div>
          <div className="text-xl font-bold font-mono text-orange-300">{summary.avgBustProbability}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">model risk score</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Avg Spread</div>
          <div className="text-xl font-bold font-mono text-cyan-300">{summary.avgEnsembleSpread} mm</div>
          <div className="text-[10px] text-slate-500 mt-0.5">ensemble variance</div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center justify-between">
            <span>Confidence</span>
            <CheckCircle className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">{summary.avgConfidence}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">detection certainty</div>
        </div>
      </div>

      {/* ── Snapshot Visualizations (Error Trend & Lead Day Decay) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Error Trend Snapshot */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Verification Trend (Daily MAE &amp; Bias)</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mean absolute error and signed bias evolution over the monitoring period
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-sky-400 hover:text-sky-300 gap-1 h-7"
                onClick={() => onSelectTab('errors')}
              >
                <span>Full Error View</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorTrend} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(d: string) => d.slice(5)} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any, name: any) => [`${val} mm`, name === 'mae' ? 'MAE' : 'Bias']}
                />
                <Line type="monotone" dataKey="mae" name="mae" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="bias" name="bias" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Day Degradation Snapshot */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Lead-Time Error Degradation (D+1 to D+10)</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mean absolute error and ensemble spread expansion by forecast horizon
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-sky-400 hover:text-sky-300 gap-1 h-7"
                onClick={() => onSelectTab('lead-day')}
              >
                <span>Lead Day View</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadDayStats} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
                <XAxis dataKey="leadDay" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => `D+${v}`} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any, name: any) => [`${val} mm`, name === 'mae' ? 'MAE' : 'Ensemble Spread']}
                />
                <Bar dataKey="mae" name="mae" fill="#0284c7" radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Bar dataKey="avgSpread" name="avgSpread" fill="#0ea5e9" opacity={0.6} radius={[3, 3, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── High-Error Outlier Investigation Table ─────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm">High-Error Forecast Outliers &amp; Failure Cases</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Top forecasts exhibiting highest absolute discrepancy between predicted and realized precipitation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-red-900/50 text-red-300 hover:bg-red-950/30 gap-1.5"
                onClick={() => navigate('/bust-detection')}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Investigate Busts</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Station &middot; Location
                  </th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Valid Date
                  </th>
                  <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Lead
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Forecast (mm)
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Observed (mm)
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Absolute Error
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Spread
                  </th>
                  <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-2.5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {topErrorForecasts.map((fc) => (
                  <tr
                    key={fc.id}
                    className="hover:bg-[#10213d] transition-colors cursor-pointer group"
                    onClick={() => navigate(`/forecasts/${fc.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-100">{fc.locationName}</div>
                      <div className="text-[10px] text-slate-500">{fc.state} &middot; {fc.region}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-300">{fc.validDate}</td>
                    <td className="px-3 py-3 text-center font-mono text-slate-400">D+{fc.leadDay}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-200">{fc.forecastRainfall}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-amber-300">{fc.observedRainfall}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-red-400">
                      {Math.abs(fc.forecastError).toFixed(1)} mm
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-cyan-400">{fc.ensembleSpread}</td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
                          fc.bustStatus === 'bust'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-slate-800 text-slate-300'
                        )}
                      >
                        {fc.bustStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-500 group-hover:text-sky-400 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 inline" />
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
