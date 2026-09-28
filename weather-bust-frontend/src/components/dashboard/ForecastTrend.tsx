import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'

interface TrendPoint {
  date: string        // display label e.g. "Aug 01"
  fullDate: string    // for tooltip YYYY-MM-DD
  avgBustProb: number // 0–100 %
  highRiskCount: number
  avgError: number    // mm
}

interface ForecastTrendProps {
  data: TrendPoint[]
}

const CustomTooltip: React.FC<{
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#10213d] border border-[#1a2e4c] rounded-lg p-3 text-xs shadow-xl space-y-1.5 min-w-[180px]">
        <div className="font-semibold text-slate-200 border-b border-[#1a2e4c] pb-1 mb-1">
          {label}
        </div>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-slate-400">{p.name}</span>
            </div>
            <span className="font-mono text-slate-100 font-medium">
              {p.name === 'Avg Bust Prob (%)' ? `${p.value.toFixed(1)}%` : 
               p.name === 'High-Risk Count' ? p.value :
               `${p.value.toFixed(1)} mm`}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const ForecastTrend: React.FC<ForecastTrendProps> = ({ data }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm">Forecast Risk Monitoring — Recent Trend</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Average bust probability and high-risk count per initialization date
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="bustProbGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1a2e4c"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#1a2e4c' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="prob"
                orientation="left"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, 30]}
              />
              <YAxis
                yAxisId="error"
                orientation="right"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}mm`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8, color: '#94a3b8' }}
                iconSize={8}
                iconType="circle"
              />
              <Area
                yAxisId="prob"
                type="monotone"
                dataKey="avgBustProb"
                name="Avg Bust Prob (%)"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#bustProbGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
              />
              <Area
                yAxisId="error"
                type="monotone"
                dataKey="avgError"
                name="Avg Abs Error (mm)"
                stroke="#f97316"
                strokeWidth={1.5}
                fill="url(#errorGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
