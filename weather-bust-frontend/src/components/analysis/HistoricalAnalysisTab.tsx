import React from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { Calendar, History, TrendingUp, AlertCircle, CloudRain } from 'lucide-react'
import type { HistoricalStatistic } from '../../types'

interface HistoricalAnalysisTabProps {
  historicalData: HistoricalStatistic[]
}

export const HistoricalAnalysisTab: React.FC<HistoricalAnalysisTabProps> = ({ historicalData }) => {
  const totalForecasts = historicalData.reduce((acc, h) => acc + h.totalForecasts, 0)
  const totalBusts = historicalData.reduce((acc, h) => acc + h.totalBusts, 0)
  const avgBustRate = historicalData.length > 0
    ? (historicalData.reduce((acc, h) => acc + h.bustRate, 0) / historicalData.length).toFixed(1)
    : '0.0'
  const totalSevere = historicalData.reduce((acc, h) => acc + h.severeBusts, 0)

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Multi-Season Historical Verification
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Long-term verification trends spanning monsoon seasons and inter-seasonal transitions.
            Identifies systemic seasonal bust anomalies, climatological shifts, and annual forecast verification stability.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-navy-800/80 px-4 py-2.5 rounded-lg border border-navy-700/60 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Evaluation Horizon</div>
            <div className="text-xs font-semibold text-slate-200">
              {historicalData[0]?.period ?? 'N/A'} — {historicalData[historicalData.length - 1]?.period ?? 'N/A'}
            </div>
          </div>
          <Calendar className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            Historical Forecasts
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{totalForecasts.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across {historicalData.length} observation months</div>
        </div>

        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Historical Busts
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{totalBusts.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">{totalSevere} classified as severe busts</div>
        </div>

        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            Mean Bust Rate
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{avgBustRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Monthly average frequency</div>
        </div>

        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-indigo-400" />
            Monsoon Seasons
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400">
            {new Set(historicalData.map((h) => h.year)).size} Years
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Long-term climatology baseline</div>
        </div>
      </div>

      {/* Historical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Volume & Bust Rate Timeline */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200">Historical Volume & Bust Rate Progression</h4>
            <p className="text-xs text-slate-400 mt-0.5">Sample volume (bars) overlaid with monthly bust rate percentage (line)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historicalData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={40} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} unit="%" domain={[0, 40]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="totalForecasts" name="Total Forecasts" fill="#3b82f6" opacity={0.6} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="bustRate" name="Bust Rate (%)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Rainfall vs Anomaly */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200">Observed Rainfall vs Precipitation Anomaly</h4>
            <p className="text-xs text-slate-400 mt-0.5">Mean rainfall (mm) and deviation from seasonal climatology benchmark</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historicalData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={40} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 11 }} unit="mm" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <ReferenceLine yAxisId="right" y={0} stroke="#475569" strokeDasharray="3 3" />
                <Bar yAxisId="left" dataKey="avgObservedRainfall" name="Avg Observed (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="precipitationAnomaly" name="Precip Anomaly (mm)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Statistics Table */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-navy-700/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Monthly Historical Verification Log</h4>
            <p className="text-xs text-slate-400 mt-0.5">Complete record of monthly verification runs and precipitation deviations</p>
          </div>
          <span className="text-xs text-slate-400 bg-navy-800 px-3 py-1 rounded-full border border-navy-700">
            {historicalData.length} Periods Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Period</th>
                <th className="px-4 py-3 font-semibold text-right">Forecasts</th>
                <th className="px-4 py-3 font-semibold text-right">Busts</th>
                <th className="px-4 py-3 font-semibold text-right">Severe Busts</th>
                <th className="px-4 py-3 font-semibold text-right">Bust Rate</th>
                <th className="px-4 py-3 font-semibold text-right">Avg Fcst Rain</th>
                <th className="px-4 py-3 font-semibold text-right">Avg Obs Rain</th>
                <th className="px-4 py-3 font-semibold text-right">Anomaly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {historicalData.map((item) => {
                const isAnomalyPositive = item.precipitationAnomaly > 0

                return (
                  <tr key={item.period} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3 font-sans">
                      <div className="font-medium text-slate-200">{item.period}</div>
                      <div className="text-[10px] text-slate-500">{item.monthName} {item.year}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300 font-sans">
                      {item.totalForecasts.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-400">
                      {item.totalBusts}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-400">
                      {item.severeBusts}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-slate-200">
                        {item.bustRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-cyan-400">
                      {item.avgForecastRainfall.toFixed(1)} mm
                    </td>
                    <td className="px-4 py-3 text-right text-blue-400">
                      {item.avgObservedRainfall.toFixed(1)} mm
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      isAnomalyPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isAnomalyPositive ? `+${item.precipitationAnomaly.toFixed(1)}` : item.precipitationAnomaly.toFixed(1)} mm
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
