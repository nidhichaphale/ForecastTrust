import React from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  EyeOff,
  BarChart3,
  TrendingDown,
} from 'lucide-react'
import type { RiskWorkspaceSummaryMetrics } from '../../utils/riskContextAnalysis'

interface RiskContextBarProps {
  summary?: RiskWorkspaceSummaryMetrics
  metrics?: RiskWorkspaceSummaryMetrics
  scopeDescription?: string
}

export const RiskContextBar: React.FC<RiskContextBarProps> = ({
  summary: propSummary,
  metrics: propMetrics,
  scopeDescription,
}) => {
  const summary = propSummary || propMetrics || {
    totalForecasts: 0,
    highOrSevereRiskCount: 0,
    bustCount: 0,
    bustRate: 0,
    avgBustProbability: 0,
    avgEnsembleSpread: 0,
    hiddenRiskBustCount: 0,
    zeroSpreadCount: 0,
    zeroForecastCount: 0,
  }

  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3.5 space-y-2.5 shadow-xs">
      {/* Top Scope and Distinction Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Risk Scope:
          </span>
          <span className="text-slate-200 font-medium font-mono text-[11px]">
            {scopeDescription || `${summary.totalForecasts.toLocaleString()} Forecasts Monitored`}
          </span>
        </div>

        {/* Clear Conceptual Distinction Tooltip / Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span
            className="inline-flex items-center gap-1 text-slate-400 bg-navy-950/70 border border-navy-800 px-2 py-0.5 rounded cursor-help"
            title="Risk: A forecast's predicted probability or likelihood of failure before observation"
          >
            <ShieldAlert className="w-3 h-3 text-orange-400" />
            <span className="text-slate-300">Predicted Risk</span>
          </span>
          <span className="text-slate-600">&ne;</span>
          <span
            className="inline-flex items-center gap-1 text-slate-400 bg-navy-950/70 border border-navy-800 px-2 py-0.5 rounded cursor-help"
            title="Bust: Realized outcome where forecast error exceeded verification thresholds"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span className="text-slate-300">Realized Bust</span>
          </span>
          <span className="text-slate-600">&ne;</span>
          <span
            className="inline-flex items-center gap-1 text-slate-400 bg-navy-950/70 border border-navy-800 px-2 py-0.5 rounded cursor-help"
            title="Hidden Risk: Overconfident zero or near-zero spread forecast concealing unpredicted rainfall"
          >
            <EyeOff className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-300">Hidden Risk</span>
          </span>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-[#1a2e4c]/70 text-xs">
        {/* Analyzed */}
        <div className="bg-[#07111f] border border-[#1a2e4c] p-2 rounded-lg">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-slate-500" /> Total Forecasts
          </div>
          <div className="text-base font-bold font-mono text-slate-100 mt-0.5">
            {summary.totalForecasts.toLocaleString()}
          </div>
        </div>

        {/* High/Severe Risk */}
        <div className="bg-[#07111f] border border-[#1a2e4c] p-2 rounded-lg">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-orange-400" /> High / Severe Risk
          </div>
          <div className="text-base font-bold font-mono text-orange-400 mt-0.5">
            {summary.highOrSevereRiskCount}
          </div>
        </div>

        {/* Actual Busts */}
        <div className="bg-[#07111f] border border-[#1a2e4c] p-2 rounded-lg">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Actual Busts
          </div>
          <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
            {summary.bustCount} <span className="text-xs font-normal text-slate-400">({summary.bustRate}%)</span>
          </div>
        </div>

        {/* Avg Spread */}
        <div className="bg-[#07111f] border border-[#1a2e4c] p-2 rounded-lg">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-cyan-400" /> Avg Spread
          </div>
          <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
            {summary.avgEnsembleSpread.toFixed(1)} mm
          </div>
        </div>

        {/* Hidden-Risk Busts */}
        <div className="bg-[#07111f] border border-[#1a2e4c] p-2 rounded-lg col-span-2 sm:col-span-1">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <EyeOff className="w-3 h-3 text-amber-400" /> Hidden-Risk Busts
          </div>
          <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
            {summary.hiddenRiskBustCount}
          </div>
        </div>
      </div>
    </div>
  )
}
