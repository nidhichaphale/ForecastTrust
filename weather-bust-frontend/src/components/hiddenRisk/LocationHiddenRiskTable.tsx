import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Input } from '../ui/Input'
import { ArrowDown, ArrowUp, Search, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { LocationHiddenRiskStats } from '../../utils/hiddenRiskAnalysis'

interface LocationHiddenRiskTableProps {
  locations: LocationHiddenRiskStats[]
}

type SortKey = 'hiddenRiskBusts' | 'hiddenRiskRate' | 'zeroSpreadCases' | 'zeroForecastCases' | 'maxObservedRainfall'

export const LocationHiddenRiskTable: React.FC<LocationHiddenRiskTableProps> = ({ locations }) => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('hiddenRiskBusts')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return locations.filter(
      (l) =>
        !q ||
        l.locationName.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q)
    )
  }, [locations, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      return sortDesc ? bv - av : av - bv
    })
  }, [filtered, sortKey, sortDesc])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc)
    else {
      setSortKey(key)
      setSortDesc(true)
    }
    setPage(1)
  }

  const renderSortIcon = (k: SortKey) =>
    sortKey === k ? (
      sortDesc ? (
        <ArrowDown className="w-3 h-3 inline ml-0.5 text-sky-400" />
      ) : (
        <ArrowUp className="w-3 h-3 inline ml-0.5 text-sky-400" />
      )
    ) : (
      <ArrowDown className="w-3 h-3 inline ml-0.5 opacity-20" />
    )

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">Station-Level Hidden Risk Registry</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating false-certainty failure rates and maximum surprise rain across monitored stations
            </p>
          </div>
          <div className="w-full sm:w-56">
            <Input
              placeholder="Search station, state..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-500" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Station
                </th>
                <th
                  className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer"
                  onClick={() => handleSort('zeroSpreadCases')}
                >
                  Zero Spread {renderSortIcon('zeroSpreadCases')}
                </th>
                <th
                  className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer"
                  onClick={() => handleSort('zeroForecastCases')}
                >
                  Zero Fcst {renderSortIcon('zeroForecastCases')}
                </th>
                <th
                  className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer"
                  onClick={() => handleSort('hiddenRiskBusts')}
                >
                  Hidden Busts {renderSortIcon('hiddenRiskBusts')}
                </th>
                <th
                  className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer"
                  onClick={() => handleSort('hiddenRiskRate')}
                >
                  Failure Rate {renderSortIcon('hiddenRiskRate')}
                </th>
                <th
                  className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer"
                  onClick={() => handleSort('maxObservedRainfall')}
                >
                  Max Obs (mm) {renderSortIcon('maxObservedRainfall')}
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                  Latest Event
                </th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/60">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-6 text-center text-slate-500">
                    No stations match the search query.
                  </td>
                </tr>
              ) : (
                paged.map((loc) => (
                  <tr
                    key={loc.locationId}
                    className="hover:bg-[#10213d] transition-colors cursor-pointer group"
                    onClick={() => navigate(`/forecasts?locationId=${loc.locationId}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        {loc.locationName}
                        {loc.hiddenRiskBusts > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {loc.state} · {loc.region}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-cyan-300">
                      {loc.zeroSpreadCases}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">
                      {loc.zeroForecastCases}
                    </td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-bold',
                        loc.hiddenRiskBusts > 0 ? 'text-red-400' : 'text-slate-400'
                      )}
                    >
                      {loc.hiddenRiskBusts}
                    </td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-semibold',
                        loc.hiddenRiskRate > 25
                          ? 'text-red-400'
                          : loc.hiddenRiskRate > 0
                          ? 'text-orange-400'
                          : 'text-emerald-400'
                      )}
                    >
                      {loc.hiddenRiskRate}%
                    </td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono font-semibold',
                        loc.maxObservedRainfall > 30 ? 'text-red-400' : loc.maxObservedRainfall > 0 ? 'text-amber-300' : 'text-slate-400'
                      )}
                    >
                      {loc.maxObservedRainfall > 0 ? `${loc.maxObservedRainfall} mm` : '0 mm'}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-400 hidden md:table-cell">
                      {loc.latestDate ?? 'None'}
                    </td>
                    <td className="px-3 py-3 text-slate-600 group-hover:text-sky-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1a2e4c] text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2.5 py-1 rounded border border-[#1a2e4c] hover:border-sky-700 disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 rounded border border-[#1a2e4c] hover:border-sky-700 disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
