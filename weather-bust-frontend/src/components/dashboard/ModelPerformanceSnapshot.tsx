import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { ModelMetric } from '../../types'

interface ModelPerformanceSnapshotProps {
  models: ModelMetric[]
}

function metricColor(value: number, metric: string): string {
  if (metric === 'brierScore' || metric === 'calibrationError') {
    // Lower is better
    if (value < 0.1) return 'text-emerald-400'
    if (value < 0.16) return 'text-amber-400'
    return 'text-orange-400'
  }
  // Higher is better
  if (value >= 0.85) return 'text-emerald-400'
  if (value >= 0.7) return 'text-sky-400'
  if (value >= 0.55) return 'text-amber-400'
  return 'text-orange-400'
}

const MetricBar: React.FC<{ value: number; max: number; color: string }> = ({
  value,
  max,
  color,
}) => (
  <div className="flex-1 h-1 rounded-full bg-[#10213d] overflow-hidden">
    <div
      className="h-full rounded-full"
      style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
    />
  </div>
)

export const ModelPerformanceSnapshot: React.FC<ModelPerformanceSnapshotProps> = ({ models }) => {
  const bestModel = models.reduce((best, m) => (m.rocAuc > best.rocAuc ? m : best), models[0])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm">Model Performance Snapshot</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative evaluation across 4 bust-prediction models
            </p>
          </div>
          <Badge variant="outline" size="sm" className="shrink-0 text-[10px] text-slate-400 border-slate-700">
            Demo Metrics
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        {/* Best Model Highlight */}
        <div className="p-3 rounded-lg bg-[#10213d] border border-sky-500/20">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Best Model</span>
              <span className="text-sky-300 font-semibold mt-0.5 block">{bestModel.modelName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">ROC-AUC</span>
              <span className="text-emerald-400 font-bold font-mono text-lg">{bestModel.rocAuc.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Comparative Metrics Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left py-2 text-slate-500 font-semibold uppercase tracking-wider pr-3">Model</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider px-2">AUC</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider px-2 hidden sm:table-cell">PR-AUC</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider px-2 hidden md:table-cell">Brier</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider px-2">F1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/40">
              {models.map((m) => (
                <tr key={m.modelId} className={m.modelId === bestModel.modelId ? 'bg-sky-500/5' : ''}>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      {m.modelId === bestModel.modelId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      )}
                      <span className="text-slate-300 leading-tight">{m.modelName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right px-2">
                    <span className={`font-mono font-semibold ${metricColor(m.rocAuc, 'rocAuc')}`}>
                      {m.rocAuc.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right px-2 hidden sm:table-cell">
                    <span className={`font-mono ${metricColor(m.prAuc, 'prAuc')}`}>
                      {m.prAuc.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right px-2 hidden md:table-cell">
                    <span className={`font-mono ${metricColor(m.brierScore, 'brierScore')}`}>
                      {m.brierScore.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right px-2">
                    <div className="flex items-center gap-2 justify-end">
                      <MetricBar value={m.f1Score} max={1} color={m.modelId === bestModel.modelId ? '#38bdf8' : '#475569'} />
                      <span className={`font-mono ${metricColor(m.f1Score, 'f1')}`}>
                        {m.f1Score.toFixed(3)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-600 leading-relaxed">
          * These are demonstration metrics for frontend validation only. Performance figures do not represent production model outputs.
        </p>
      </CardContent>
    </Card>
  )
}
