import React from 'react'
import { Calendar, MapPin, Activity, CheckCircle2 } from 'lucide-react'

interface AnalysisHeaderProps {
  dateRange: string
  regionSummary: string
  leadDaySummary: string
  forecastCount: number
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  dateRange,
  regionSummary,
  leadDaySummary,
  forecastCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Title & Description */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
          Analytical Workspace
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Verification &amp; Analysis
        </h1>
        <p className="text-sm text-slate-400 mt-0.5 max-w-3xl">
          Evaluate forecast accuracy, error behavior, lead-time performance, and spatial patterns across the monitored domain.
        </p>
      </div>

      {/* Analysis Scope Context Strip */}
      <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="font-semibold text-slate-200">Analysis Scope:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-slate-200">{dateRange}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{regionSummary}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-200">{leadDaySummary}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#07111f] border border-[#1a2e4c] px-2.5 py-0.5 rounded font-mono text-cyan-300">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>{forecastCount.toLocaleString()} forecasts</span>
          </div>
        </div>
      </div>
    </div>
  )
}
