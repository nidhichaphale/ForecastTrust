import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { ZeroForecastOutcome } from '../../utils/hiddenRiskAnalysis'

interface ZeroForecastOutcomesChartProps {
  outcomes: ZeroForecastOutcome[]
}

export const ZeroForecastOutcomesChart: React.FC<ZeroForecastOutcomesChartProps> = ({ outcomes }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">What Happens When the Forecast Is Zero?</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Realized outcomes for all forecasts where predicted rainfall was ≤ 0.5 mm
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        {outcomes.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No zero-forecast records found in current filters.
          </div>
        ) : (
          <div className="space-y-3.5">
            {outcomes.map((item) => (
              <div key={item.category} className="space-y-1.5 bg-[#07111f] p-3 rounded-lg border border-[#1a2e4c]/70">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-200">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-300 font-semibold">{item.count} cases</span>
                    <span className="font-mono font-bold" style={{ color: item.color }}>
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(item.percentage, 2)}%`, backgroundColor: item.color }}
                  />
                </div>

                {/* Detail metrics */}
                <div className="flex flex-wrap items-center justify-between gap-y-1 text-[11px] text-slate-400 pt-1">
                  <span>{item.description}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span>Avg Obs: <strong className="text-amber-300">{item.avgObserved}mm</strong></span>
                    <span>Max Obs: <strong className="text-red-400">{item.maxObserved}mm</strong></span>
                    <span>Avg |Err|: <strong className="text-slate-300">{item.avgAbsError}mm</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
