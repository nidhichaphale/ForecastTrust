import React, { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import type { Alert } from '../../types'

interface AlertTimelineChartProps {
  alerts: Alert[]
}

interface TimelineBucket {
  date: string
  severe: number
  high: number
  moderate: number
  low: number
  total: number
}

export const AlertTimelineChart: React.FC<AlertTimelineChartProps> = ({ alerts }) => {
  const chartData = useMemo(() => {
    const buckets: Record<string, TimelineBucket> = {}

    alerts.forEach((alt) => {
      const d = alt.validDate || alt.timestamp.slice(0, 10)
      if (!buckets[d]) {
        buckets[d] = {
          date: d,
          severe: 0,
          high: 0,
          moderate: 0,
          low: 0,
          total: 0,
        }
      }
      buckets[d].total++
      if (alt.severity === 'severe') buckets[d].severe++
      else if (alt.severity === 'high') buckets[d].high++
      else if (alt.severity === 'moderate') buckets[d].moderate++
      else buckets[d].low++
    })

    return Object.values(buckets)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14) // Recent 14 dates
  }, [alerts])

  if (chartData.length === 0) return null

  return (
    <Card className="border-[#1a2e4c] bg-[#0b172a]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Alert Frequency &amp; Severity Timeline</CardTitle>
          <span className="text-[11px] text-slate-500 font-mono">Daily Volume</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={10}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b172a',
                  borderColor: '#1a2e4c',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#f8fafc',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="severe" name="Severe" fill="#ef4444" stackId="a" />
              <Bar dataKey="high" name="High" fill="#f97316" stackId="a" />
              <Bar dataKey="moderate" name="Moderate" fill="#f59e0b" stackId="a" />
              <Bar dataKey="low" name="Low" fill="#10b981" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
