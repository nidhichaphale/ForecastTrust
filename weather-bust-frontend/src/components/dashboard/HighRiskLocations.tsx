import React from 'react'
import { cn } from '../../utils/cn'
import { Badge } from '../ui/Badge'
import { StatusIndicator } from '../ui/StatusIndicator'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { ChevronRight } from 'lucide-react'
import type { Forecast, RiskLevel } from '../../types'

interface HighRiskLocationsProps {
  forecasts: Forecast[]
  onRowClick?: (fc: Forecast) => void
}

const RISK_ORDER: Record<RiskLevel, number> = {
  severe: 0,
  high: 1,
  moderate: 2,
  low: 3,
}

const RISK_LABEL: Record<RiskLevel, string> = {
  severe: 'Severe',
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
}

export const HighRiskLocations: React.FC<HighRiskLocationsProps> = ({
  forecasts,
  onRowClick,
}) => {
  const sorted = [...forecasts].sort(
    (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">High-Risk Locations</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Forecast records with elevated or severe bust probability
            </p>
          </div>
          <Badge variant="high" size="sm">{sorted.length} locations</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        {/* Table wrapper — horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Region</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Valid Date</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Lead Day</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Fc Rain</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Obs Rain</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bust Prob</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Risk</th>
                <th className="px-3 py-2.5 hidden sm:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/60">
              {sorted.map((fc) => (
                <tr
                  key={fc.id}
                  onClick={() => onRowClick?.(fc)}
                  className={cn(
                    'transition-colors duration-100',
                    onRowClick
                      ? 'cursor-pointer hover:bg-[#10213d] group'
                      : ''
                  )}
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-100">{fc.locationName}</div>
                    <div className="text-[10px] text-slate-500">{fc.state}</div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className="text-slate-400">{fc.region}</span>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="font-mono text-slate-300">{fc.validDate}</span>
                  </td>
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    <span className="font-mono text-slate-300">D+{fc.leadDay}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-slate-200">{fc.forecastRainfall} mm</span>
                  </td>
                  <td className="px-3 py-3 text-right hidden lg:table-cell">
                    <span className={cn(
                      'font-mono',
                      fc.observedRainfall > fc.forecastRainfall ? 'text-amber-400' : 'text-slate-300'
                    )}>
                      {fc.observedRainfall} mm
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={cn(
                      'font-mono font-semibold',
                      fc.bustProbability >= 0.75 ? 'text-red-400' :
                      fc.bustProbability >= 0.55 ? 'text-orange-400' :
                      fc.bustProbability >= 0.35 ? 'text-amber-400' : 'text-emerald-400'
                    )}>
                      {(fc.bustProbability * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <StatusIndicator status={fc.riskLevel} pulse={false} />
                      <Badge variant={fc.riskLevel as RiskLevel} size="sm">
                        {RISK_LABEL[fc.riskLevel]}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600 group-hover:text-slate-300 transition-colors hidden sm:table-cell">
                    <ChevronRight className="w-4 h-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
