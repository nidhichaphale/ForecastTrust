import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileQuestion,
  AlertTriangle,
} from 'lucide-react'
import type { Forecast, RiskLevel } from '../../types'

interface DataExplorerViewTabProps {
  forecasts: Forecast[]
}

type SortField =
  | 'id'
  | 'locationName'
  | 'validDate'
  | 'leadDay'
  | 'forecastRainfall'
  | 'observedRainfall'
  | 'forecastError'
  | 'ensembleSpread'
  | 'bustProbability'
  | 'riskLevel'
  | 'dataStatus'

const RISK_BADGES: Record<RiskLevel, string> = {
  low: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
  moderate: 'bg-amber-950/40 text-amber-400 border-amber-800/40',
  high: 'bg-orange-950/40 text-orange-400 border-orange-800/40',
  severe: 'bg-rose-950/40 text-rose-400 border-rose-800/40',
}

const PAGE_SIZE = 20

export const DataExplorerViewTab: React.FC<DataExplorerViewTabProps> = ({ forecasts }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('validDate')
  const [sortAsc, setSortAsc] = useState<boolean>(false)

  // Handle header sorting toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  // Sorted records
  const sortedForecasts = useMemo(() => {
    return [...forecasts].sort((a, b) => {
      let valA: any = a[sortField]
      let valB: any = b[sortField]

      if (valA === undefined) valA = ''
      if (valB === undefined) valB = ''

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      return sortAsc ? valA - valB : valB - valA
    })
  }, [forecasts, sortField, sortAsc])

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(sortedForecasts.length / PAGE_SIZE))
  const paginatedForecasts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedForecasts.slice(start, start + PAGE_SIZE)
  }, [sortedForecasts, currentPage])

  // Sort indicator icon
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-600 inline ml-1" />
    }
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 text-cyan-400 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 text-cyan-400 inline ml-1" />
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Table Top Bar ─────────────────────────────────────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-200">
            Filtered Forecast Catalog:
          </span>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
            {forecasts.length.toLocaleString()} Records
          </span>
        </div>

        {/* Pagination Controls Top */}
        <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-center">
          <span>
            Page <strong className="text-slate-200 font-mono">{currentPage}</strong> of{' '}
            <strong className="text-slate-200 font-mono">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:hover:bg-navy-800 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:hover:bg-navy-800 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Data Explorer Table ──────────────────────────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800 select-none">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Forecast ID {renderSortIndicator('id')}
                </th>
                <th
                  onClick={() => handleSort('locationName')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Location &amp; Region {renderSortIndicator('locationName')}
                </th>
                <th
                  onClick={() => handleSort('validDate')}
                  className="px-3 py-3 font-semibold cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Valid Date {renderSortIndicator('validDate')}
                </th>
                <th
                  onClick={() => handleSort('leadDay')}
                  className="px-3 py-3 font-semibold text-center cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Lead {renderSortIndicator('leadDay')}
                </th>
                <th
                  onClick={() => handleSort('forecastRainfall')}
                  className="px-3 py-3 font-semibold text-right cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Fcst Rain {renderSortIndicator('forecastRainfall')}
                </th>
                <th
                  onClick={() => handleSort('observedRainfall')}
                  className="px-3 py-3 font-semibold text-right cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Obs Rain {renderSortIndicator('observedRainfall')}
                </th>
                <th
                  onClick={() => handleSort('forecastError')}
                  className="px-3 py-3 font-semibold text-right cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Error {renderSortIndicator('forecastError')}
                </th>
                <th
                  onClick={() => handleSort('ensembleSpread')}
                  className="px-3 py-3 font-semibold text-right cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Spread {renderSortIndicator('ensembleSpread')}
                </th>
                <th
                  onClick={() => handleSort('bustProbability')}
                  className="px-3 py-3 font-semibold text-right cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Bust Prob {renderSortIndicator('bustProbability')}
                </th>
                <th
                  onClick={() => handleSort('riskLevel')}
                  className="px-3 py-3 font-semibold text-center cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Risk {renderSortIndicator('riskLevel')}
                </th>
                <th
                  onClick={() => handleSort('dataStatus')}
                  className="px-3 py-3 font-semibold text-center cursor-pointer hover:text-slate-200 transition-colors"
                >
                  Data Status {renderSortIndicator('dataStatus')}
                </th>
                <th className="px-3 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {paginatedForecasts.length > 0 ? (
                paginatedForecasts.map((fc) => {
                  const hasObs = fc.hasObservation !== false && fc.observedRainfall >= 0
                  const isMissingObs = !hasObs
                  const isPartial = fc.dataStatus === 'partial'

                  return (
                    <tr
                      key={fc.id}
                      className="hover:bg-navy-800/40 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/forecasts/${fc.id}`)}
                    >
                      <td className="px-4 py-3 font-bold text-cyan-400 group-hover:underline">
                        {fc.id}
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <div className="font-medium text-slate-200">{fc.locationName}</div>
                        <div className="text-[10px] text-slate-500">{fc.state} &bull; {fc.region}</div>
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {fc.validDate}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-slate-300 text-[11px]">
                          D+{fc.leadDay}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-200">
                        {fc.forecastRainfall.toFixed(1)} mm
                      </td>
                      <td className="px-3 py-3 text-right">
                        {hasObs ? (
                          <span className="text-emerald-400 font-semibold">{fc.observedRainfall.toFixed(1)} mm</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/50">
                            <FileQuestion className="w-2.5 h-2.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {hasObs ? (
                          <span
                            className={`font-semibold ${
                              fc.forecastError > 0
                                ? 'text-amber-400'
                                : fc.forecastError < 0
                                ? 'text-sky-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {fc.forecastError > 0 ? `+${fc.forecastError.toFixed(1)}` : fc.forecastError.toFixed(1)} mm
                          </span>
                        ) : (
                          <span className="text-slate-600 font-sans">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right text-slate-400">
                        {fc.ensembleSpread.toFixed(1)}
                      </td>
                      <td className="px-3 py-3 text-right text-slate-200">
                        {(fc.bustProbability * 100).toFixed(0)}%
                      </td>
                      <td className="px-3 py-3 text-center font-sans">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                            RISK_BADGES[fc.riskLevel]
                          }`}
                        >
                          {fc.riskLevel}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-sans">
                        {isMissingObs ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-amber-950/50 text-amber-400 border border-amber-800/50">
                            <FileQuestion className="w-3 h-3" /> Missing Obs
                          </span>
                        ) : isPartial ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">
                            <AlertTriangle className="w-3 h-3" /> Partial Telemetry
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3" /> Complete
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/forecasts/${fc.id}`)}
                          className="p-1 rounded hover:bg-navy-700 text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Open Forecast Detail"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center font-sans text-slate-500">
                    No forecast records match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bottom Footer */}
        <div className="px-6 py-3 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-mono text-slate-200">{Math.min(forecasts.length, (currentPage - 1) * PAGE_SIZE + 1)}</span> to{' '}
            <span className="font-mono text-slate-200">{Math.min(forecasts.length, currentPage * PAGE_SIZE)}</span> of{' '}
            <span className="font-mono text-slate-200">{forecasts.length.toLocaleString()}</span> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:hover:bg-navy-800 text-slate-300 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-slate-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:hover:bg-navy-800 text-slate-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
