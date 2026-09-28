import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { ErrorBin } from '../../utils/bustAnalysis'

interface ErrorDistributionChartProps {
  data: ErrorBin[]
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const bustCount = payload.find((p: any) => p.dataKey === 'bustCount')?.value ?? 0
  const nonBustCount = payload.find((p: any) => p.dataKey === 'nonBustCount')?.value ?? 0
  const total = bustCount + nonBustCount
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-300 font-semibold mb-1.5">Error |{label}| mm</p>
      <p className="text-red-400 flex justify-between gap-6"><span>Busts</span><span className="font-mono">{bustCount}</span></p>
      <p className="text-sky-400 flex justify-between gap-6"><span>Non-Busts</span><span className="font-mono">{nonBustCount}</span></p>
      <p className="text-slate-400 flex justify-between gap-6"><span>Total</span><span className="font-mono">{total}</span></p>
      {total > 0 && (
        <p className="text-orange-400 flex justify-between gap-6 border-t border-[#1a2e4c] pt-1.5 mt-1.5">
          <span>Bust %</span>
          <span className="font-mono">{((bustCount / total) * 100).toFixed(0)}%</span>
        </p>
      )}
    </div>
  )
}

export const ErrorDistributionChart: React.FC<ErrorDistributionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Forecast Error Distribution</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Absolute error (mm) bins — busts vs non-busts
        </p>
      </CardHeader>
      <CardContent className="pt-2 h-60">
        {data.every((b) => b.bustCount + b.nonBustCount === 0) ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No data for the selected filters.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#1a2e4c' }}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="nonBustCount" name="Non-Busts" stackId="a" fill="#1e3a5f" radius={[0,0,0,0]} maxBarSize={50} />
              <Bar dataKey="bustCount" name="Busts" stackId="a" fill="#ef4444" radius={[3,3,0,0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
