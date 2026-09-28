import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { LeadDayBustStats } from '../../utils/bustAnalysis'

interface LeadDayBustChartProps {
  data: LeadDayBustStats[]
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as LeadDayBustStats
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-300 font-semibold mb-1.5">D+{label}</p>
      <p className="text-slate-400 flex justify-between gap-6"><span>Forecasts</span><span className="font-mono">{d?.total ?? 0}</span></p>
      <p className="text-red-400 flex justify-between gap-6"><span>Busts</span><span className="font-mono">{d?.busts ?? 0}</span></p>
      <p className="text-orange-400 flex justify-between gap-6"><span>Bust Rate</span><span className="font-mono">{d?.bustRate ?? 0}%</span></p>
      <p className="text-sky-400 flex justify-between gap-6"><span>Avg |Error|</span><span className="font-mono">{d?.avgAbsError ?? 0} mm</span></p>
    </div>
  )
}

export const LeadDayBustChart: React.FC<LeadDayBustChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Busts by Lead Day</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Bust count and bust rate across forecast lead days D+1 through D+10
        </p>
      </CardHeader>
      <CardContent className="pt-2 h-60">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis
                dataKey="leadDay"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#1a2e4c' }}
                tickLine={false}
                tickFormatter={(v) => `D+${v}`}
              />
              <YAxis yAxisId="count" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="rate"
                orientation="right"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar yAxisId="count" dataKey="busts" name="Busts" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={40} />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="bustRate"
                name="Bust Rate %"
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
