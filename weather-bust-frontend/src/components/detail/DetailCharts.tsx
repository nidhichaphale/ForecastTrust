import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import type { Forecast } from '../../types'

interface DetailChartsProps {
  forecast: Forecast
}

export const DetailCharts: React.FC<DetailChartsProps> = ({ forecast }) => {
  // We mock a tiny distribution for the chart based on the forecast's ensemble stats
  const distData = [
    { name: 'Min', value: forecast.ensembleMin },
    { name: 'Mean', value: forecast.ensembleMean },
    { name: 'Fcst', value: forecast.forecastRainfall },
    { name: 'Max', value: forecast.ensembleMax },
    ...(forecast.observedRainfall !== null ? [{ name: 'Obs', value: forecast.observedRainfall }] : []),
  ]

  const err = forecast.forecastError ?? 0
  const errorData = [
    { name: 'Overpredict', value: err < 0 ? Math.abs(err) : 0, fill: '#38bdf8' },
    { name: 'Underpredict', value: err > 0 ? err : 0, fill: '#f97316' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Forecast vs Observed / Ensemble Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Forecast vs Observed & Ensemble</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparison of deterministic forecast against observation and ensemble spread
          </p>
        </CardHeader>
        <CardContent className="pt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {distData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Obs' ? '#fcd34d' : entry.name === 'Fcst' ? '#38bdf8' : '#64748b'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Forecast Error Magnitude */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Forecast Error Magnitude</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Absolute difference between forecast and observation
          </p>
        </CardHeader>
        <CardContent className="pt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={errorData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e4c" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1a2e4c' }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b172a', borderColor: '#1a2e4c', fontSize: '12px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {errorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
