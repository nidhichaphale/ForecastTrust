import React from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Button } from '../ui/Button'
import { Map, ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { RegionHiddenRiskStats, LeadDayHiddenRiskStats } from '../../utils/hiddenRiskAnalysis'

interface RegionalAndLeadDayAnalysisProps {
  regions: RegionHiddenRiskStats[]
  leadDays: LeadDayHiddenRiskStats[]
}

const CustomLeadDayTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as LeadDayHiddenRiskStats
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="font-semibold text-slate-200 mb-1">Lead Day D+{label}</div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Zero-Spread Forecasts:</span> <span className="font-mono text-cyan-300">{d.zeroSpreadCount}</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Hidden-Risk Busts:</span> <span className="font-mono text-red-400">{d.hiddenRiskBustCount}</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Failure Rate:</span> <span className="font-mono text-orange-400">{d.hiddenRiskRate}%</span>
      </div>
    </div>
  )
}

export const RegionalAndLeadDayAnalysis: React.FC<RegionalAndLeadDayAnalysisProps> = ({
  regions,
  leadDays,
}) => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Regional Analysis Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Hidden Risk by Region</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of zero-spread consensus and surprise failures across Indian meteorological zones
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs shrink-0 gap-1.5 h-8 border-sky-800/60 text-sky-400 hover:bg-sky-950/40"
              onClick={() => navigate('/map')}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Risk Map</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a2e4c]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Region
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Zero Spread
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Hidden Busts
                  </th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Failure Rate
                  </th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Max Rain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e4c]/60">
                {regions.map((r) => (
                  <tr key={r.region} className="hover:bg-[#10213d] transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-200">{r.region}</td>
                    <td className="px-3 py-3 text-right font-mono text-cyan-300">{r.zeroSpreadCases}</td>
                    <td className="px-3 py-3 text-right font-mono text-red-400 font-medium">
                      {r.hiddenRiskBusts}
                    </td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-bold',
                        r.hiddenRiskRate > 25 ? 'text-red-400' : r.hiddenRiskRate > 0 ? 'text-orange-400' : 'text-emerald-400'
                      )}
                    >
                      {r.hiddenRiskRate}%
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-amber-300 font-medium">
                      {r.maxObservedRainfall > 0 ? `${r.maxObservedRainfall} mm` : '0 mm'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead-Day Analysis Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Hidden Risk by Lead Day (D+1 to D+10)</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating whether zero-spread overconfidence is concentrated in short or extended lead times
          </p>
        </CardHeader>
        <CardContent className="pt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={leadDays} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
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
              <Tooltip content={<CustomLeadDayTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Bar yAxisId="count" dataKey="zeroSpreadCount" name="Zero Spread Cases" fill="#0284c7" radius={[3, 3, 0, 0]} maxBarSize={30} />
              <Bar yAxisId="count" dataKey="hiddenRiskBustCount" name="Hidden Busts" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={30} />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="hiddenRiskRate"
                name="Failure Rate %"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f59e0b' }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
