import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { CloudRain, Target, ShieldAlert, Activity, BarChart3, ShieldCheck } from 'lucide-react'
import type { Forecast } from '../../types'
import { cn } from '../../utils/cn'

interface DetailSummaryProps {
  forecast: Forecast
}

export const DetailSummary: React.FC<DetailSummaryProps> = ({ forecast }) => {
  return (
    <Card className="bg-[#0b172a] border-[#1a2e4c]">
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Rainfall Stats */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <CloudRain className="w-3 h-3" /> Forecast
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-slate-100">{forecast.forecastRainfall}</span>
                <span className="text-xs text-slate-500">mm</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <Target className="w-3 h-3" /> Observed
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-amber-300">
                  {forecast.observedRainfall !== null ? forecast.observedRainfall : <span className="text-slate-500 text-sm font-normal italic">Pending</span>}
                </span>
                <span className="text-xs text-slate-500">mm</span>
              </div>
            </div>
          </div>

          {/* Error & Bust Prob */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Abs Error
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn('text-2xl font-bold font-mono',
                  forecast.forecastError === null ? 'text-slate-500' :
                  Math.abs(forecast.forecastError) > 20 ? 'text-orange-400' : 'text-sky-400'
                )}>
                  {forecast.forecastError !== null ? Math.abs(forecast.forecastError).toFixed(1) : '—'}
                </span>
                <span className="text-xs text-slate-500">mm</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3" /> Bust Prob
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn('text-2xl font-bold font-mono', forecast.bustProbability > 0.5 ? 'text-red-400' : 'text-emerald-400')}>
                  {(forecast.bustProbability * 100).toFixed(0)}
                </span>
                <span className="text-xs text-slate-500">%</span>
              </div>
            </div>
          </div>

          {/* Ensemble Info */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Ens Mean
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-slate-200">{forecast.ensembleMean}</span>
                <span className="text-xs text-slate-500">mm</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Ens Spread
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn('text-2xl font-bold font-mono', forecast.ensembleSpread === 0 ? 'text-cyan-400' : 'text-slate-300')}>
                  {forecast.ensembleSpread}
                </span>
                <span className="text-xs text-slate-500">mm</span>
              </div>
            </div>
          </div>

          {/* Additional Context */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Detection Conf
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {(forecast.confidence * 100).toFixed(0)}
                </span>
                <span className="text-xs text-slate-500">%</span>
              </div>
            </div>
            {forecast.zeroSpread && (
              <div>
                 <div className="inline-flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800 text-cyan-400 text-xs px-2 py-1 rounded">
                   <ShieldAlert className="w-3.5 h-3.5" />
                   Zero-Spread Case
                 </div>
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
