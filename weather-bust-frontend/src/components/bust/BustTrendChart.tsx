import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { BustTrendPoint } from '../../utils/bustAnalysis'

interface BustTrendChartProps {
  data: BustTrendPoint[]
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-300 font-semibold mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="flex justify-between gap-6">
          <span>{p.name}</span>
          <span className="font-mono font-medium">
            {p.name === 'Bust Rate' ? `${p.value}%` : p.value}
          </span>
        </p>
      ))}
    </div>
  )
}

export const BustTrendChart: React.FC<BustTrendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Bust Detection Trend</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Daily bust counts, total forecasts, and bust rate over the analysis period
        </p>
      </CardHeader>
      <CardContent className="pt-2 h-60">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No data for the selected filters.
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
                tickFormatter={(d: string) => d.slice(5)} // MM-DD
              />
              <YAxis
                yAxisId="count"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="rate"
                orientation="right"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
              />
              <Bar yAxisId="count" dataKey="total" name="Total Forecasts" fill="#1e3a5f" radius={[3,3,0,0]} maxBarSize={40} />
              <Bar yAxisId="count" dataKey="busts" name="Busts" fill="#ef4444" radius={[3,3,0,0]} maxBarSize={40} />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="bustRate"
                name="Bust Rate"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f97316' }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
