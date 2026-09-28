import React from 'react'
import { useNavigate } from 'react-router-dom'
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
import { ExternalLink, ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { Forecast } from '../../types'
import type {
  VerificationSummaryMetrics,
  ErrorTrendPoint,
  ErrorDistributionBin,
} from '../../utils/verificationAnalysis'

interface ErrorAnalysisTabProps {
  summary: VerificationSummaryMetrics
  errorTrend: ErrorTrendPoint[]
  errorBins: ErrorDistributionBin[]
  topErrorForecasts: Forecast[]
}

export const ErrorAnalysisTab: React.FC<ErrorAnalysisTabProps> = ({
  summary,
  errorTrend,
  errorBins,
  topErrorForecasts,
}) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* ── Error Metrics Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Mean Absolute Error (MAE)</div>
          <div className="text-2xl font-bold font-mono text-sky-400">{summary.mae} mm</div>
          <div className="text-xs text-slate-400 mt-1">Average magnitude of discrepancy across all forecasts</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Mean Forecast Bias</div>
          <div className={cn('text-2xl font-bold font-mono', summary.bias > 0 ? 'text-amber-300' : 'text-cyan-300')}>
            {summary.bias > 0 ? `+${summary.bias}` : summary.bias} mm
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {summary.bias > 0 ? 'Net over-prediction bias' : 'Net under-prediction bias'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Root Mean Square Error</div>
          <div className="text-2xl font-bold font-mono text-slate-100">{summary.rmse} mm</div>
          <div className="text-xs text-slate-400 mt-1">Quadratic scoring giving heavier penalty to extreme misses</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b172a] border border-[#1a2e4c]">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Maximum Absolute Error</div>
          <div className="text-2xl font-bold font-mono text-red-400">{summary.maxAbsError} mm</div>
          <div className="text-xs text-slate-400 mt-1">Single worst verified deviation in current filter scope</div>
        </div>
      </div>

      {/* ── Daily Error Trend Chart ────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Forecast Error Over Time (Daily MAE &amp; Signed Bias)</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracking temporal volatility: evaluates whether forecast quality degraded during specific weather events
          </p>
        </CardHeader>
        <CardContent className="pt-2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={errorTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} tickFormatter={(d: string) => d.slice(5)} />
              <YAxis yAxisId="error" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} />
              <YAxis yAxisId="rate" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Bar yAxisId="error" dataKey="mae" name="Mean Absolute Error (MAE)" fill="#0284c7" radius={[3, 3, 0, 0]} maxBarSize={30} />
              <Line yAxisId="error" type="monotone" dataKey="bias" name="Mean Signed Bias" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="rate" type="monotone" dataKey="bustRate" name="Daily Bust Rate %" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Error Distribution (Histogram) ─────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Forecast Error Magnitude Distribution</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Binned absolute error partitioning normal forecasts versus verified bust outcomes
          </p>
        </CardHeader>
        <CardContent className="pt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={errorBins} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis dataKey="bin" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Bar dataKey="normalCount" name="Normal Forecasts" stackId="a" fill="#1e3a5f" radius={[0, 0, 0, 0]} maxBarSize={45} />
              <Bar dataKey="bustCount" name="Verified Busts" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Largest Error Forecasts Table ──────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Largest Forecast Error Outliers</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Top forecasts sorted by absolute error &mdash; click row to inspect complete meteorological detail
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/bust-detection')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Investigate in Bust Detection</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Station
                  </th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Valid Date
                  </th>
                  <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Lead
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Fcst (mm)
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Obs (mm)
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Signed Error
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Abs Error
                  </th>
                  <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Bust Status
                  </th>
                  <th className="px-5 py-2.5"></th>
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
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-bold',
                        fc.forecastError > 0 ? 'text-red-400' : 'text-sky-400'
                      )}
                    >
                      {fc.forecastError > 0 ? '+' : ''}{fc.forecastError} mm
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-red-400">
                      {Math.abs(fc.forecastError).toFixed(1)} mm
                    </td>
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
