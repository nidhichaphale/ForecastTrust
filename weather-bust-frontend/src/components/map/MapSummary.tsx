import React from 'react'
import { MapPin, ShieldAlert, Activity, BarChart3 } from 'lucide-react'

interface MapSummaryProps {
  locationsCount: number
  highRiskCount: number
  bustCount: number
  avgBustProb: number
}

export const MapSummary: React.FC<MapSummaryProps> = ({
  locationsCount,
  highRiskCount,
  bustCount,
  avgBustProb,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-[#0b172a] px-4 py-2.5 rounded-lg border border-[#1a2e4c] text-xs">
      <div className="flex items-center gap-2 text-slate-400">
        <MapPin className="w-3.5 h-3.5 text-sky-400" />
        <span>Locations:</span>
        <span className="font-mono font-medium text-slate-100">{locationsCount}</span>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <Activity className="w-3.5 h-3.5 text-orange-400" />
        <span>High/Severe Risk:</span>
        <span className="font-mono font-medium text-slate-100">{highRiskCount}</span>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
        <span>Bust Cases:</span>
        <span className="font-mono font-medium text-slate-100">{bustCount}</span>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Avg Bust Prob:</span>
        <span className="font-mono font-medium text-slate-100">{avgBustProb.toFixed(1)}%</span>
      </div>
    </div>
  )
}
