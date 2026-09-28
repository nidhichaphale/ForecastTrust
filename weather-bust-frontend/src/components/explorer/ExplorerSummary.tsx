import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { Activity, ShieldAlert, BarChart3, AlertTriangle } from 'lucide-react'

interface ExplorerSummaryProps {
  totalCount: number
  filteredCount: number
  highRiskCount: number
  bustCount: number
  avgBustProb: number
}

export const ExplorerSummary: React.FC<ExplorerSummaryProps> = ({
  totalCount,
  filteredCount,
  highRiskCount,
  bustCount,
  avgBustProb,
}) => {
  const isFiltered = filteredCount !== totalCount

  return (
    <Card className="bg-[#0b172a] border-[#1a2e4c]">
      <CardContent className="py-3 px-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
          <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Dataset Summary</span>
          </div>
          <Divider orientation="vertical" className="h-4 hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Total Records:</span>
            <span className="font-mono font-semibold text-slate-100">
              {totalCount.toLocaleString()}
            </span>
          </div>

          <Divider orientation="vertical" className="h-3 hidden md:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Filtered:</span>
            <span className={`font-mono font-semibold ${isFiltered ? 'text-sky-400' : 'text-slate-100'}`}>
              {filteredCount.toLocaleString()}
            </span>
          </div>

          <Divider orientation="vertical" className="h-3 hidden md:block" />

          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400">High/Severe Risk:</span>
            <span className="font-mono font-semibold text-orange-400">
              {highRiskCount.toLocaleString()}
            </span>
          </div>

          <Divider orientation="vertical" className="h-3 hidden md:block" />

          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="text-slate-400">Busts:</span>
            <span className="font-mono font-semibold text-red-400">
              {bustCount.toLocaleString()}
            </span>
          </div>

          <Divider orientation="vertical" className="h-3 hidden md:block" />

          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Avg Bust Prob:</span>
            <span className="font-mono font-semibold text-slate-100">
              {avgBustProb.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
