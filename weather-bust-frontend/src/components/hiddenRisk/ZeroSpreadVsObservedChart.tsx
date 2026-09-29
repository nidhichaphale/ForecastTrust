import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import type { HiddenRiskScatterPoint } from '../../utils/hiddenRiskAnalysis'

interface ZeroSpreadVsObservedChartProps {
  scatterData: HiddenRiskScatterPoint[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: HiddenRiskScatterPoint }>
}

const CustomBarTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl min-w-[200px]">
      <div className="font-semibold text-slate-100 mb-1">{d.locationName}</div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Valid Date:</span> <span className="font-mono text-slate-200">{d.validDate} (D+{d.leadDay})</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Fcst Rain:</span> <span className="font-mono text-slate-200">{d.forecastRainfall} mm</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Observed Rain:</span>{' '}
        <span className="font-mono font-bold text-amber-300">{d.observedRainfall} mm</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Ens Spread:</span> <span className="font-mono text-cyan-400">{d.ensembleSpread} mm</span>
      </div>
      <div className="border-t border-[#1a2e4c] mt-1.5 pt-1.5 flex justify-between gap-4">
        <span className="font-semibold">Classification:</span>
        <span
          className={
            d.isHiddenRiskBust
              ? 'font-bold text-red-400'
              : d.observedRainfall > 0
              ? 'text-yellow-400'
              : 'text-emerald-400'
          }
        >
          {d.classification}
        </span>
      </div>
    </div>
  )
}

const CustomScatterTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-2 text-xs shadow-xl min-w-[190px]">
      <div className="font-semibold text-slate-100">{d.locationName}</div>
      <div className="text-slate-400 flex justify-between gap-4 mt-1">
        <span>Ensemble Spread:</span> <span className="font-mono text-sky-400">{d.ensembleSpread} mm</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Absolute Error:</span>{' '}
        <span className="font-mono font-bold text-red-400">{Math.abs(d.forecastError).toFixed(1)} mm</span>
      </div>
      <div className="text-slate-400 flex justify-between gap-4">
        <span>Observed:</span> <span className="font-mono text-amber-300">{d.observedRainfall} mm</span>
      </div>
      <div className="mt-1 text-[11px] font-semibold text-slate-300">{d.classification}</div>
    </div>
  )
}

export const ZeroSpreadVsObservedChart: React.FC<ZeroSpreadVsObservedChartProps> = ({ scatterData }) => {
  const [viewMode, setViewMode] = useState<'chronological' | 'spread_vs_error'>('chronological')

  // Filter only zero-spread cases for chronological inspection
  const zeroSpreadPoints = scatterData.filter((p) => p.isZeroSpread)


  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm">
              {viewMode === 'chronological'
                ? 'Zero-Spread Forecasts vs Realized Observed Rainfall'
                : 'Ensemble Spread vs Forecast Error (Hidden Risk Scatter)'}
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              {viewMode === 'chronological'
                ? 'Visualizing realized precipitation when ensemble models indicated 0 spread consensus'
                : 'Inspecting whether low ensemble spread is always accompanied by low forecast error'}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#07111f] p-0.5 rounded-lg border border-[#1a2e4c] shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('chronological')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'chronological' ? 'bg-sky-500 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Zero-Spread Cases
            </button>
            <button
              type="button"
              onClick={() => setViewMode('spread_vs_error')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'spread_vs_error' ? 'bg-sky-500 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Spread vs Error Scatter
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 h-64">
        {viewMode === 'chronological' ? (
          zeroSpreadPoints.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No zero-spread forecasts match the active filters.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zeroSpreadPoints} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
                <XAxis
                  dataKey="locationName"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={{ stroke: '#1a2e4c' }}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}mm`}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="observedRainfall" name="Observed Rainfall (mm)" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {zeroSpreadPoints.map((entry, index) => {
                    let fill = '#22c55e' // accurate dry
                    if (entry.isHiddenRiskBust) fill = '#ef4444' // severe bust
                    else if (entry.observedRainfall > 0) fill = '#f59e0b' // marginal drizzle
                    return <Cell key={index} fill={fill} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" />
              <XAxis
                type="number"
                dataKey="ensembleSpread"
                name="Ensemble Spread"
                unit="mm"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#1a2e4c' }}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="forecastError"
                name="Forecast Error"
                unit="mm"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <ZAxis range={[25, 120]} />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Forecasts"
                data={scatterData}
                fill="#38bdf8"
              >
                {scatterData.map((entry, index) => {
                  let fill = '#38bdf8'
                  if (entry.isHiddenRiskBust) fill = '#ef4444'
                  else if (entry.isZeroSpread) fill = '#22c55e'
                  return <Cell key={index} fill={fill} opacity={entry.isZeroSpread ? 0.95 : 0.45} />
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
