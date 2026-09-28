import React from 'react'
import { Calendar, MapPin, Activity, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react'

interface DataHeaderProps {
  dateRange: string
  locationCount: number
  leadDaySummary: string
  forecastCount: number
  completenessRate: number
}

export const DataHeader: React.FC<DataHeaderProps> = ({
  dateRange,
  locationCount,
  leadDaySummary,
  forecastCount,
  completenessRate,
}) => {
  const isHealthy = completenessRate >= 95

  return (
    <div className="space-y-3">
      {/* Title & Description */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
          Operational Data Workspace
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Data &amp; Quality
        </h1>
        <p className="text-sm text-slate-400 mt-0.5 max-w-3xl">
          Coverage, completeness, quality, and forecast data availability across monitored meteorological domains.
        </p>
      </div>

      {/* Scope Context Strip */}
      <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="font-semibold text-slate-200">Scope Status:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-slate-200">{dateRange}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locationCount} Active Stations</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-200">{leadDaySummary}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#07111f] border border-[#1a2e4c] px-2.5 py-0.5 rounded font-mono text-cyan-300">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>{forecastCount.toLocaleString()} Records</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono border ${
            isHealthy
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
              : 'bg-amber-950/40 border-amber-800/50 text-amber-400'
          }`}>
            {isHealthy ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            <span>{completenessRate}% Completeness</span>
          </div>
        </div>
      </div>
    </div>
  )
}
