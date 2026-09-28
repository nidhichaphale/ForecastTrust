import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { ProbabilityBucket } from '../../utils/bustAnalysis'

interface BustProbabilityChartProps {
  data: ProbabilityBucket[]
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as ProbabilityBucket
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-300 font-semibold mb-1.5">Prob bucket {label}</p>
      <p className="text-slate-400 flex justify-between gap-6"><span>Forecasts</span><span className="font-mono">{d?.total ?? 0}</span></p>
      <p className="text-red-400 flex justify-between gap-6"><span>Actual Busts</span><span className="font-mono">{d?.busts ?? 0}</span></p>
      <p className="text-orange-400 flex justify-between gap-6"><span>Observed Bust Rate</span><span className="font-mono">{d?.bustRate ?? 0}%</span></p>
    </div>
  )
}

export const BustProbabilityChart: React.FC<BustProbabilityChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Bust Probability vs Actual Outcome</CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">
          Observed bust rate within each predicted probability band
        </p>
      </CardHeader>
      <CardContent className="pt-2 h-60">
        {data.every((b) => b.total === 0) ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data.</div>
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
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="bustRate" name="Observed Bust Rate %" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={
                    entry.min >= 0.8 ? '#dc2626' :
                    entry.min >= 0.6 ? '#ea580c' :
                    entry.min >= 0.4 ? '#eab308' :
                    entry.min >= 0.2 ? '#4ade80' : '#22c55e'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
