import React from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { HiddenRiskTrendPoint } from '../../utils/hiddenRiskAnalysis'

interface HiddenRiskTrendChartProps {
  data: HiddenRiskTrendPoint[]
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="font-semibold text-slate-200 mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between gap-5 text-slate-400">
          <span style={{ color: p.color }}>{p.name}:</span>
          <span className="font-mono font-medium text-slate-100">
            {p.name === 'Hidden-Risk Rate' ? `${p.value}%` : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export const HiddenRiskTrendChart: React.FC<HiddenRiskTrendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Hidden Risk Temporal Evolution</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Daily count of zero-spread consensus forecasts versus realized hidden-risk bust occurrences
        </p>
      </CardHeader>
      <CardContent className="pt-2 h-60">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs">
            No temporal records for selected filter.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#1a2e4c' }}
                tickLine={false}
                tickFormatter={(d: string) => d.slice(5)}
              />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Bar yAxisId="left" dataKey="zeroSpreadCount" name="Zero-Spread Forecasts" fill="#1e3a5f" radius={[3, 3, 0, 0]} maxBarSize={36} />
              <Bar yAxisId="left" dataKey="hiddenRiskBustCount" name="Hidden Busts" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={36} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="hiddenRiskRate"
                name="Hidden-Risk Rate"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f59e0b' }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
