import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { SpreadConditionComparison, ForecastConditionComparison } from '../../utils/hiddenRiskAnalysis'
import { cn } from '../../utils/cn'

interface SpreadAndForecastComparisonsProps {
  spreadComparison: SpreadConditionComparison[]
  forecastComparison: ForecastConditionComparison[]
}

export const SpreadAndForecastComparisons: React.FC<SpreadAndForecastComparisonsProps> = ({
  spreadComparison,
  forecastComparison,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Spread Condition Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bust Performance by Spread Condition</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Testing hypothesis: does zero ensemble spread reliably correspond to fewer bust events?
          </p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Spread Condition
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Forecasts
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Busts
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Bust Rate
                  </th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Avg |Error|
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {spreadComparison.map((row) => (
                  <tr key={row.condition} className="hover:bg-[#10213d] transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-200">{row.condition}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400">{row.forecasts}</td>
                    <td className="px-3 py-3 text-right font-mono text-red-400 font-medium">{row.busts}</td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-bold',
                        row.bustRate > 15 ? 'text-red-400' : row.bustRate > 5 ? 'text-orange-400' : 'text-emerald-400'
                      )}
                    >
                      {row.bustRate}%
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-slate-300">{row.avgAbsError} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Condition Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bust Performance by Forecast Condition</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparing failure rates when predicting zero rainfall versus accumulating rain
          </p>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Forecast Condition
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Forecasts
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Busts
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Bust Rate
                  </th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Max Realized Rain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {forecastComparison.map((row) => (
                  <tr key={row.condition} className="hover:bg-[#10213d] transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-200">{row.condition}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400">{row.forecasts}</td>
                    <td className="px-3 py-3 text-right font-mono text-red-400 font-medium">{row.busts}</td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-bold',
                        row.bustRate > 15 ? 'text-red-400' : row.bustRate > 5 ? 'text-orange-400' : 'text-emerald-400'
                      )}
                    >
                      {row.bustRate}%
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-amber-300 font-medium">
                      {row.maxObservedRainfall} mm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
