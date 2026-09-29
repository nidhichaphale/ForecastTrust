import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Sparkles, AlertTriangle, Layers } from 'lucide-react'
import type { FeatureImportance } from '../../types'

interface FeatureInsightsTabProps {
  features: FeatureImportance[]
}

const CATEGORY_COLORS: Record<string, string> = {
  ensemble: '#06b6d4',  // Cyan
  spatial: '#3b82f6',   // Blue
  temporal: '#a855f7',  // Purple
  historical: '#f59e0b', // Amber
}

const CATEGORY_LABELS: Record<string, string> = {
  ensemble: 'Ensemble Spread & Variance',
  spatial: 'Spatial Gradient & Topography',
  temporal: 'Temporal Persistence & Lag',
  historical: 'Climatology & Historical',
}

export const FeatureInsightsTab: React.FC<FeatureInsightsTabProps> = ({ features }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter((f) => f.category === selectedCategory)

  // Chart data: sorted by importance ascending so highest appears at top of vertical bar chart
  const chartData = [...filteredFeatures]
    .sort((a, b) => a.importanceScore - b.importanceScore)
    .map((f) => ({
      name: f.displayName,
      score: parseFloat(f.importanceScore.toFixed(3)),
      category: f.category,
      ratio: (f.normalizedRatio * 100).toFixed(1),
    }))

  return (
    <div className="space-y-6">
      {/* Required Disclaimer Banner */}
      <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-amber-300 uppercase tracking-wide mr-2">
            Mock / Demonstration Feature Importance
          </span>
          <span className="text-slate-300">
            Feature attributions and importance rankings displayed below represent model SHAP approximations for UI demonstration.
            These highlight the driving meteorological signals (ensemble spread, convective thresholds, spatial gradients) that govern bust likelihood.
          </span>
        </div>
      </div>

      {/* Category Filter Pills & Summary */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Feature Subsystems:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'bg-navy-800 text-slate-400 hover:text-slate-200 border border-navy-700'
            }`}
          >
            All Categories ({features.length})
          </button>
          {(['ensemble', 'spatial', 'temporal', 'historical'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-navy-800 text-slate-400 hover:text-slate-200 border border-navy-700'
              }`}
            >
              {cat} ({features.filter((f) => f.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Feature Importance Chart */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-sm">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Ranked Feature Contribution Scores
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized attribution values derived from ensemble gradient boosting feature trees
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 90, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                formatter={(val: any) => [`${val}`, 'Attribution Score']}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || '#06b6d4'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Feature Table */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-navy-700/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Feature Attribute Directory</h4>
            <p className="text-xs text-slate-400 mt-0.5">Full parameter metadata and meteorological relevance</p>
          </div>
          <span className="text-xs text-slate-400 bg-navy-800 px-3 py-1 rounded-full border border-navy-700">
            {filteredFeatures.length} Parameters Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold text-center w-12">Rank</th>
                <th className="px-4 py-3 font-semibold">Feature Name</th>
                <th className="px-4 py-3 font-semibold">Subsystem Category</th>
                <th className="px-4 py-3 font-semibold text-right">Raw Score</th>
                <th className="px-4 py-3 font-semibold text-right">Contribution %</th>
                <th className="px-6 py-3 font-semibold">Meteorological Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {filteredFeatures.map((feat) => (
                <tr key={feat.featureName} className="hover:bg-navy-800/40 transition-colors">
                  <td className="px-5 py-3 text-center font-bold text-slate-400">
                    #{feat.rank}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <div className="font-semibold text-slate-200">{feat.displayName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{feat.featureName}</div>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {(() => {
                      const catColor = CATEGORY_COLORS[feat.category] || '#94a3b8'
                      return (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border"
                          style={{
                            color: catColor,
                            borderColor: `${catColor}40`,
                            backgroundColor: `${catColor}15`,
                          }}
                        >
                          {CATEGORY_LABELS[feat.category] || feat.category}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-cyan-400">
                    {feat.importanceScore.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    {(feat.normalizedRatio * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-3 font-sans text-slate-400 text-xs max-w-md">
                    {feat.description}
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
