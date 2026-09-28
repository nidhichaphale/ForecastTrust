import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { RiskLevel } from '../../types'

interface RiskBand {
  label: string
  count: number
  percentage: number
  color: string
  riskLevel: RiskLevel
}

interface RiskOverviewProps {
  data: RiskBand[]
  totalForecasts: number
  overallBustRate: number
}

const CustomTooltip: React.FC<{
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: RiskBand }>
}> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="bg-[#10213d] border border-[#1a2e4c] rounded-lg p-3 text-xs shadow-xl">
        <div className="font-semibold text-white mb-1">{d.label}</div>
        <div className="text-slate-300">{d.count.toLocaleString()} forecasts</div>
        <div className="text-slate-400">{d.percentage.toFixed(1)}% of total</div>
      </div>
    )
  }
  return null
}

const CustomLegend: React.FC<{ data: RiskBand[] }> = ({ data }) => (
  <div className="space-y-1.5 pt-1">
    {data.map((d) => (
      <div key={d.riskLevel} className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: d.color }}
          />
          <span className="text-slate-300 capitalize">{d.label}</span>
        </div>
        <div className="flex items-center gap-2 text-right">
          <span className="text-slate-400 font-mono">{d.count.toLocaleString()}</span>
          <span className="text-slate-500 w-8 text-right font-mono">{d.percentage.toFixed(0)}%</span>
        </div>
      </div>
    ))}
  </div>
)

export const RiskOverview: React.FC<RiskOverviewProps> = ({
  data,
  totalForecasts,
  overallBustRate,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm">Risk Distribution</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalForecasts.toLocaleString()} total forecasts analyzed
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-400">Overall Bust Rate</div>
            <div className="text-lg font-bold text-amber-400 font-mono leading-tight">
              {overallBustRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Donut Chart */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="52%"
                  outerRadius="78%"
                  paddingAngle={2}
                  dataKey="count"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.riskLevel} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend + Level Badges */}
          <div className="space-y-3">
            <CustomLegend data={data} />
            <div className="pt-2 border-t border-[#1a2e4c] space-y-1">
              {data
                .filter((d) => d.riskLevel === 'high' || d.riskLevel === 'severe')
                .map((d) => (
                  <div key={d.riskLevel} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {d.label} alerts:
                    </span>
                    <Badge variant={d.riskLevel as RiskLevel} size="sm">
                      {d.count} locations
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Inline Risk Bars */}
        <div className="mt-4 space-y-1.5">
          {data.map((d) => (
            <div key={d.riskLevel} className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400 w-16 shrink-0 capitalize">{d.riskLevel}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#10213d] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                />
              </div>
              <span className="text-slate-400 font-mono w-8 text-right">{d.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
