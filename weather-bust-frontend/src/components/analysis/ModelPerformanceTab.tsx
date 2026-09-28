import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Cpu, AlertTriangle, Award, Info } from 'lucide-react'
import type { ModelMetric } from '../../types'

interface ModelPerformanceTabProps {
  models: ModelMetric[]
}

const MODEL_COLORS: Record<string, string> = {
  'ecmwf-ifs': '#06b6d4',      // Cyan
  'gfs-fv3': '#3b82f6',        // Blue
  'ncum-imda': '#a855f7',      // Purple
}

export const ModelPerformanceTab: React.FC<ModelPerformanceTabProps> = ({ models }) => {
  const [selectedMetric, setSelectedMetric] = useState<'rocAuc' | 'brierScore' | 'f1Score'>('rocAuc')

  // Transform degradation data for multi-line comparison chart
  const leadDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const degradationChartData = leadDays.map((ld) => {
    const point: Record<string, number | string> = {
      leadDayLabel: `D+${ld}`,
      leadDay: ld,
    }
    models.forEach((model) => {
      const match = model.leadDayDegradation.find((d) => d.leadDay === ld)
      if (match) {
        point[model.modelName] = match[selectedMetric]
      }
    })
    return point
  })

  return (
    <div className="space-y-6">
      {/* Required Disclaimer Banner */}
      <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-amber-300 uppercase tracking-wide mr-2">
            Demo / Mock Model Data
          </span>
          <span className="text-slate-300">
            The comparative model performance metrics below (ECMWF IFS, GFS FV3, NCUM IMDA) represent calibrated benchmark
            simulations for UI workflow validation. In production, these are populated via live verification pipelines.
          </span>
        </div>
      </div>

      {/* Model Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model, idx) => {
          const isBestRoc = idx === 0
          return (
            <div
              key={model.modelId}
              className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 relative overflow-hidden"
            >
              {isBestRoc && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                  <Award className="w-3 h-3" /> Benchmark Leader
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-slate-100">{model.modelName}</h4>
              </div>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{model.description}</p>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-navy-800/80 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 font-sans">ROC-AUC</div>
                  <div className="text-sm font-bold text-cyan-400">{model.rocAuc.toFixed(3)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-sans">Brier</div>
                  <div className="text-sm font-bold text-emerald-400">{model.brierScore.toFixed(3)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-sans">F1 Score</div>
                  <div className="text-sm font-bold text-indigo-400">{model.f1Score.toFixed(3)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lead-Day Model Skill Degradation Chart */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Model Skill Degradation Across Lead Days (D+1 to D+10)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks how prediction accuracy diminishes as forecast horizon expands
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-navy-800/80 p-1 rounded-lg border border-navy-700/60">
            <button
              onClick={() => setSelectedMetric('rocAuc')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                selectedMetric === 'rocAuc'
                  ? 'bg-cyan-500 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ROC-AUC
            </button>
            <button
              onClick={() => setSelectedMetric('brierScore')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                selectedMetric === 'brierScore'
                  ? 'bg-cyan-500 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Brier Score
            </button>
            <button
              onClick={() => setSelectedMetric('f1Score')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                selectedMetric === 'f1Score'
                  ? 'bg-cyan-500 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              F1 Score
            </button>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={degradationChartData} margin={{ top: 10, right: 30, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="leadDayLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={selectedMetric === 'brierScore' ? [0, 0.4] : [0.5, 1.0]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              {models.map((model) => (
                <Line
                  key={model.modelId}
                  type="monotone"
                  dataKey={model.modelName}
                  stroke={MODEL_COLORS[model.modelId] || '#94a3b8'}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Model Metrics Table */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-navy-700/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Deterministic & Probabilistic Verification Scorecard</h4>
            <p className="text-xs text-slate-400 mt-0.5">Rigorous comparison across classification and probabilistic skill dimensions</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Higher is better except Brier & Calibration</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Model</th>
                <th className="px-4 py-3 font-semibold text-right">ROC-AUC</th>
                <th className="px-4 py-3 font-semibold text-right">PR-AUC</th>
                <th className="px-4 py-3 font-semibold text-right">Brier Score</th>
                <th className="px-4 py-3 font-semibold text-right">BSS</th>
                <th className="px-4 py-3 font-semibold text-right">Precision</th>
                <th className="px-4 py-3 font-semibold text-right">Recall</th>
                <th className="px-4 py-3 font-semibold text-right">F1 Score</th>
                <th className="px-4 py-3 font-semibold text-right">Cal. Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {models.map((model) => (
                <tr key={model.modelId} className="hover:bg-navy-800/40 transition-colors">
                  <td className="px-5 py-3 font-sans">
                    <div className="font-semibold text-slate-200">{model.modelName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{model.modelId}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-cyan-400">
                    {model.rocAuc.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right text-sky-400">
                    {model.prAuc.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    {model.brierScore.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right text-teal-400">
                    {model.brierSkillScore.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">
                    {(model.precision * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">
                    {(model.recall * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-indigo-400">
                    {model.f1Score.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right text-amber-400">
                    {model.calibrationError.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
