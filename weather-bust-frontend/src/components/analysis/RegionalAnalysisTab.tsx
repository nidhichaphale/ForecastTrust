import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight, AlertTriangle, Layers } from 'lucide-react'
import type { RegionalVerificationStat } from '../../utils/verificationAnalysis'
import { getRegions } from '../../mock'

interface RegionalAnalysisTabProps {
  regionalStats: RegionalVerificationStat[]
}

const REGION_NAMES: Record<string, string> = Object.fromEntries(
  getRegions().map((r) => [r.id, r.name])
)

export const RegionalAnalysisTab: React.FC<RegionalAnalysisTabProps> = ({ regionalStats }) => {
  const navigate = useNavigate()

  // Format chart data with human-readable region labels
  const chartData = regionalStats.map((stat) => ({
    region: stat.region,
    name: REGION_NAMES[stat.region] || stat.region,
    mae: stat.mae,
    bias: stat.bias,
    rmse: stat.rmse,
    bustRate: stat.bustRate,
    avgSpread: stat.avgSpread,
    forecastCount: stat.forecastCount,
  }))

  return (
    <div className="space-y-6">
      {/* Top Banner / Callout */}
      <div className="bg-navy-900 border border-navy-700 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Regional Meteorological Performance Breakdown
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Compare systematic biases and bust concentrations across India’s meteorological subdivisions.
            Complex topographies such as the Western Ghats and Himalayan foothills typically demonstrate elevated MAE and conditional bias.
          </p>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors shrink-0"
        >
          <MapPin className="w-3.5 h-3.5" />
          Inspect on Risk Map
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: MAE and RMSE by Region */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200">Error Magnitude by Region (MAE vs RMSE)</h4>
            <p className="text-xs text-slate-400 mt-0.5">Higher RMSE relative to MAE indicates presence of extreme forecast error outliers</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={40} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="mae" name="MAE (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rmse" name="RMSE (mm)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Bias & Bust Rate */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200">Signed Bias & Bust Vulnerability Rate</h4>
            <p className="text-xs text-slate-400 mt-0.5">Mean signed bias (forecast - observed) alongside bust frequency percentage</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={40} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} unit="%" domain={[0, 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <ReferenceLine yAxisId="left" y={0} stroke="#475569" strokeDasharray="3 3" />
                <Bar yAxisId="left" dataKey="bias" name="Mean Bias (mm)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="bustRate" name="Bust Rate (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Matrix Table */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-navy-700/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Regional Verification Performance Matrix</h4>
            <p className="text-xs text-slate-400 mt-0.5">Comparative statistics across all {regionalStats.length} meteorological regions</p>
          </div>
          <span className="text-xs text-slate-400 bg-navy-800 px-3 py-1 rounded-full border border-navy-700">
            {regionalStats.reduce((acc, r) => acc + r.forecastCount, 0).toLocaleString()} Verified Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Region / Zone</th>
                <th className="px-4 py-3 font-semibold text-right">Sample Size</th>
                <th className="px-4 py-3 font-semibold text-right">MAE</th>
                <th className="px-4 py-3 font-semibold text-right">Mean Bias</th>
                <th className="px-4 py-3 font-semibold text-right">RMSE</th>
                <th className="px-4 py-3 font-semibold text-right">Max Error</th>
                <th className="px-4 py-3 font-semibold text-right">Avg Spread</th>
                <th className="px-4 py-3 font-semibold text-right">Busts</th>
                <th className="px-4 py-3 font-semibold text-right">Bust Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {regionalStats.map((stat) => {
                const isBustRateHigh = stat.bustRate > 20

                return (
                  <tr key={stat.region} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3 font-sans">
                      <div className="font-medium text-slate-200">{REGION_NAMES[stat.region] || stat.region}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{stat.region}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 font-sans">
                      {stat.forecastCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-cyan-400">
                      {stat.mae.toFixed(1)} mm
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${stat.bias > 0 ? 'text-amber-400' : stat.bias < 0 ? 'text-sky-400' : 'text-slate-400'}`}>
                      {stat.bias > 0 ? `+${stat.bias.toFixed(1)}` : stat.bias.toFixed(1)} mm
                    </td>
                    <td className="px-4 py-3 text-right text-indigo-400">
                      {stat.rmse.toFixed(1)} mm
                    </td>
                    <td className="px-4 py-3 text-right text-rose-400">
                      {stat.maxError.toFixed(1)} mm
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">
                      {stat.avgSpread.toFixed(1)} mm
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">
                      {stat.bustCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                        isBustRateHigh
                          ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                          : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                      }`}>
                        {isBustRateHigh && <AlertTriangle className="w-2.5 h-2.5" />}
                        {stat.bustRate.toFixed(1)}%
                      </span>
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
