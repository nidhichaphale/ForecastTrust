import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { RegionalStatistic } from '../../types'

interface RegionalRiskSummaryProps {
  data: RegionalStatistic[]
}

const REGION_SHORT: Record<string, string> = {
  'North India': 'North',
  'South India': 'South',
  'East India': 'East',
  'West India': 'West',
  'Central India': 'Central',
  'Northeast India': 'Northeast',
}

function bustRateColor(rate: number): string {
  if (rate >= 20) return '#ef4444'
  if (rate >= 14) return '#f97316'
  if (rate >= 8) return '#f59e0b'
  return '#10b981'
}

const CustomTooltip: React.FC<{
  active?: boolean
  payload?: Array<{ value: number; payload: RegionalStatistic }>
  label?: string
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="bg-[#10213d] border border-[#1a2e4c] rounded-lg p-3 text-xs shadow-xl space-y-1.5 min-w-[180px]">
        <div className="font-semibold text-white border-b border-[#1a2e4c] pb-1 mb-1">{label}</div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Bust Rate:</span>
          <span className="font-mono text-amber-400 font-semibold">{d.bustRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Total Forecasts:</span>
          <span className="font-mono text-slate-200">{d.forecastCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Bust Events:</span>
          <span className="font-mono text-orange-400">{d.bustCount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Avg MAE:</span>
          <span className="font-mono text-sky-400">{d.avgError} mm</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">High-Risk:</span>
          <span className="font-mono text-red-400">{d.highRiskCount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Top State:</span>
          <span className="text-slate-200">{d.topAffectedState}</span>
        </div>
      </div>
    )
  }
  return null
}

export const RegionalRiskSummary: React.FC<RegionalRiskSummaryProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    name: REGION_SHORT[d.region] ?? d.region,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-sm">Regional Bust Rate Overview</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Forecast bust frequency across meteorological regions
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#1a2e4c' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, 25]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56,189,248,0.05)' }} />
              <Bar dataKey="bustRate" name="Bust Rate (%)" radius={[3, 3, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.region} fill={bustRateColor(entry.bustRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compact Data Table Below Chart */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left py-2 text-slate-500 font-semibold uppercase tracking-wider">Region</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider">Forecasts</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider">Busts</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider">Bust Rate</th>
                <th className="text-right py-2 text-slate-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Avg MAE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/40">
              {data.map((d) => (
                <tr key={d.region}>
                  <td className="py-2 text-slate-300">{d.region}</td>
                  <td className="py-2 text-right font-mono text-slate-400">{d.forecastCount.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono text-orange-400">{d.bustCount}</td>
                  <td className="py-2 text-right font-mono font-semibold" style={{ color: bustRateColor(d.bustRate) }}>
                    {d.bustRate.toFixed(1)}%
                  </td>
                  <td className="py-2 text-right font-mono text-sky-400 hidden sm:table-cell">{d.avgError} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
