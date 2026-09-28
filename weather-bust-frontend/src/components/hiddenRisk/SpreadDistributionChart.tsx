import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { SpreadDistributionBucket } from '../../utils/hiddenRiskAnalysis'

interface SpreadDistributionChartProps {
  data: SpreadDistributionBucket[]
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as SpreadDistributionBucket
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl min-w-[180px]">
      <div className="font-semibold text-slate-100">{d.label}</div>
      <div className="text-slate-400 text-[11px] mb-1">Spread: {d.range}</div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Total Forecasts:</span> <span className="font-mono text-slate-200">{d.count}</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Bust Cases:</span> <span className="font-mono text-red-400">{d.bustCount}</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Bust Rate:</span> <span className="font-mono text-orange-400">{d.bustRate}%</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4 border-t border-[#1a2e4c] pt-1 mt-1">
        <span>Avg Observed:</span> <span className="font-mono text-amber-300">{d.avgObserved} mm</span>
      </div>
    </div>
  )
}

export const SpreadDistributionChart: React.FC<SpreadDistributionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Ensemble Spread Distribution & Bust Rate</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Stratification across zero, low, medium, and high ensemble variance
        </p>
      </CardHeader>
      <CardContent className="pt-2 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="count" name="Forecasts" radius={[4, 4, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
