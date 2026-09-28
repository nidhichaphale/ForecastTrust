import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Globe2, Calendar, Layers, MapPin, ChevronDown, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import type {
  GeographicCoverageStat,
  StateCoverageStat,
  LeadDayCoverageStat,
  TemporalCoverageStat,
} from '../../types/dataQuality'

interface CoverageViewTabProps {
  geographicStats: GeographicCoverageStat[]
  stateStats: StateCoverageStat[]
  leadDayStats: LeadDayCoverageStat[]
  temporalStats: TemporalCoverageStat[]
}

export const CoverageViewTab: React.FC<CoverageViewTabProps> = ({
  geographicStats,
  stateStats,
  leadDayStats,
  temporalStats,
}) => {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null)

  const toggleRegion = (regId: string) => {
    setExpandedRegion(expandedRegion === regId ? null : regId)
  }

  // Format temporal chart data
  const temporalChartData = temporalStats.map((t) => ({
    date: t.date.slice(5), // MM-DD
    fullDate: t.date,
    forecasts: t.forecastCount,
    observed: t.observedCount,
    missing: t.missingCount,
  }))

  // Format lead-day chart data
  const leadDayChartData = leadDayStats.map((ld) => ({
    leadDay: ld.label,
    forecasts: ld.forecastCount,
    observed: ld.observedCount,
    missing: ld.missingObsCount,
    isScheduled: ld.isScheduled,
  }))

  const totalLocations = geographicStats.reduce((acc, g) => acc + g.locationsCount, 0)
  const totalForecasts = geographicStats.reduce((acc, g) => acc + g.forecastRecordsCount, 0)
  const totalObserved = geographicStats.reduce((acc, g) => acc + g.observedCount, 0)
  const totalMissing = geographicStats.reduce((acc, g) => acc + g.missingObsCount, 0)

  return (
    <div className="space-y-6">
      {/* ── Section 1: Geographic Coverage Breakdown ──────────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-navy-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              Geographic Coverage by Meteorological Subdivision
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Available monitoring stations, forecast counts, and ground-truth observation density across India
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-navy-800 px-3 py-1 rounded-full border border-navy-700 self-start sm:self-center font-mono">
            {totalLocations} Stations &bull; {geographicStats.length} Regions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Subdivision / Region</th>
                <th className="px-4 py-3 font-semibold text-right">Stations</th>
                <th className="px-4 py-3 font-semibold text-right">Forecasts</th>
                <th className="px-4 py-3 font-semibold text-right">Ground Observations</th>
                <th className="px-4 py-3 font-semibold text-right">Missing / Delayed</th>
                <th className="px-4 py-3 font-semibold text-right">Usable Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {geographicStats.map((geo) => {
                const isExpanded = expandedRegion === geo.region
                const statesInRegion = stateStats.filter((s) => s.region === geo.region)
                const isCoverageHealthy = geo.coveragePercentage >= 95

                return (
                  <React.Fragment key={geo.region}>
                    <tr
                      onClick={() => toggleRegion(geo.region)}
                      className="hover:bg-navy-800/40 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 font-sans flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-200">{geo.regionName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {geo.statesCount} States ({geo.states.slice(0, 3).join(', ')}{geo.states.length > 3 ? '...' : ''})
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-slate-300">
                        {geo.locationsCount}
                      </td>
                      <td className="px-4 py-3 text-right text-cyan-400 font-semibold">
                        {geo.forecastRecordsCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400">
                        {geo.observedCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={geo.missingObsCount > 0 ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                          {geo.missingObsCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                          isCoverageHealthy
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                        }`}>
                          {isCoverageHealthy ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                          {geo.coveragePercentage}%
                        </span>
                      </td>
                    </tr>

                    {/* Expandable State Breakdown Sub-Rows */}
                    {isExpanded &&
                      statesInRegion.map((st) => (
                        <tr key={st.state} className="bg-navy-950/50 text-[11px]">
                          <td className="pl-12 pr-4 py-2 font-sans text-slate-400 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{st.state}</span>
                          </td>
                          <td className="px-4 py-2 text-right text-slate-400 font-sans">
                            {st.locationsCount}
                          </td>
                          <td className="px-4 py-2 text-right text-slate-300">
                            {st.forecastRecordsCount}
                          </td>
                          <td className="px-4 py-2 text-right text-emerald-400/90">
                            {st.observedCount}
                          </td>
                          <td className="px-4 py-2 text-right text-amber-400/90">
                            {st.missingObsCount > 0 ? st.missingObsCount : '—'}
                          </td>
                          <td className="px-4 py-2 text-right font-sans text-slate-400">
                            {st.coveragePercentage}%
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                )
              })}

              {/* Total Aggregate Row */}
              <tr className="bg-navy-950/80 font-bold border-t border-navy-700">
                <td className="px-5 py-3 font-sans text-slate-200">Domain Total</td>
                <td className="px-4 py-3 text-right text-slate-200 font-sans">{totalLocations}</td>
                <td className="px-4 py-3 text-right text-cyan-400">{totalForecasts.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-emerald-400">{totalObserved.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-amber-400">{totalMissing}</td>
                <td className="px-4 py-3 text-right text-cyan-400">
                  {totalForecasts > 0 ? ((totalObserved / totalForecasts) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 2: Temporal Coverage & Timeline ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temporal Daily Volume Chart */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-xs">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Daily Forecast Volume vs Observation Ingest
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks daily observation availability and telemetry latency across active monsoon valid dates
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={temporalChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={35} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="forecasts" name="Forecasts Generated" fill="#06b6d4" opacity={0.7} radius={[3, 3, 0, 0]} />
                <Bar dataKey="observed" name="Observed Ground Truth" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="missing" name="Missing / Pending AWS" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead-Day Coverage Progression Chart */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-xs">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Lead-Day Coverage Horizon (D+1 to D+10)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies which lead horizons have active forecasts vs model run omissions (D+6, D+8, D+9)
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadDayChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="leadDay" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="forecasts" name="Forecast Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="observed" name="Observed Count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Section 3: Lead-Day Usability Matrix Table ─────────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-navy-700/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Lead-Day Usability &amp; Availability Matrix</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Full verification of record counts, missing observation counts, and model operational scheduling
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active Horizon</span>
            <span className="w-2 h-2 rounded-full bg-slate-600 ml-2"></span>
            <span>Not Scheduled</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Lead Horizon</th>
                <th className="px-4 py-3 font-semibold text-right">Forecasts</th>
                <th className="px-4 py-3 font-semibold text-right">Ground Observations</th>
                <th className="px-4 py-3 font-semibold text-right">Missing Telemetry</th>
                <th className="px-4 py-3 font-semibold text-right">Completeness</th>
                <th className="px-6 py-3 font-semibold">Operational Status &amp; Usability Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {leadDayStats.map((ld) => {
                return (
                  <tr key={ld.leadDay} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ld.isScheduled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span className="font-bold text-slate-200">{ld.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ld.forecastCount > 0 ? (
                        <span className="text-cyan-400 font-semibold">{ld.forecastCount}</span>
                      ) : (
                        <span className="text-slate-600 font-sans">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ld.observedCount > 0 ? (
                        <span className="text-emerald-400">{ld.observedCount}</span>
                      ) : (
                        <span className="text-slate-600 font-sans">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ld.missingObsCount > 0 ? (
                        <span className="text-amber-400 font-semibold">{ld.missingObsCount}</span>
                      ) : (
                        <span className="text-slate-600 font-sans">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ld.isScheduled ? (
                        <span className="text-slate-200 font-semibold">{ld.coveragePercentage}%</span>
                      ) : (
                        <span className="text-slate-600 font-sans">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3 font-sans text-xs">
                      {ld.isScheduled ? (
                        <span className="text-slate-300">{ld.statusNote}</span>
                      ) : (
                        <span className="text-amber-400/80 font-medium">
                          Omitted from Operational Model Run Cycle (ECMWF / GFS interleaved cadence)
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
