import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Input } from '../ui/Input'
import { cn } from '../../utils/cn'
import { ArrowDown, ArrowUp, Search, ChevronRight } from 'lucide-react'
import type { LocationBustStats } from '../../utils/bustAnalysis'

interface LocationBustTableProps {
  locations: LocationBustStats[]
}

type SortKey = 'bustRate' | 'busts' | 'avgAbsError' | 'avgBustProb' | 'total'

const BUST_RATE_COLOR = (rate: number) =>
  rate > 15 ? 'text-red-400' : rate > 8 ? 'text-orange-400' : rate > 3 ? 'text-yellow-400' : 'text-emerald-400'

export const LocationBustTable: React.FC<LocationBustTableProps> = ({ locations }) => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('bustRate')
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
        l.region.toLowerCase().includes(q),
    )
  }, [locations, search])

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const av = a[sortKey] as number
        const bv = b[sortKey] as number
        return sortDesc ? bv - av : av - bv
      }),
    [filtered, sortKey, sortDesc],
  )

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc)
    else { setSortKey(key); setSortDesc(true) }
    setPage(1)
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDesc ? <ArrowDown className="w-3 h-3 inline ml-0.5 text-sky-400" /> : <ArrowUp className="w-3 h-3 inline ml-0.5 text-sky-400" />
      : <ArrowDown className="w-3 h-3 inline ml-0.5 opacity-20" />

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">Location Bust Analysis</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {paged.length} of {sorted.length} locations
            </p>
          </div>
          <div className="w-full sm:w-56">
            <Input
              placeholder="Search location, state..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
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
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer" onClick={() => handleSort('total')}>
                  Fcsts <SortIcon k="total" />
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer" onClick={() => handleSort('busts')}>
                  Busts <SortIcon k="busts" />
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer" onClick={() => handleSort('bustRate')}>
                  Rate <SortIcon k="bustRate" />
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hidden md:table-cell" onClick={() => handleSort('avgAbsError')}>
                  Avg |Err| <SortIcon k="avgAbsError" />
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hidden lg:table-cell" onClick={() => handleSort('avgBustProb')}>
                  Avg Prob <SortIcon k="avgBustProb" />
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden xl:table-cell">Latest Bust</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2e4c]/60">
              {paged.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-6 text-center text-slate-500">No locations match the search.</td></tr>
              ) : paged.map((loc) => (
                <tr
                  key={loc.locationId}
                  className="hover:bg-[#10213d] transition-colors cursor-pointer group"
                  onClick={() => navigate(`/forecasts?locationId=${loc.locationId}`)}
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-100">{loc.locationName}</div>
                    <div className="text-[10px] text-slate-500">{loc.state} · {loc.region}</div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-slate-400">{loc.total}</td>
                  <td className="px-3 py-3 text-right font-mono text-red-400">{loc.busts}</td>
                  <td className={cn('px-3 py-3 text-right font-mono font-semibold', BUST_RATE_COLOR(loc.bustRate))}>
                    {loc.bustRate}%
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-slate-400 hidden md:table-cell">{loc.avgAbsError} mm</td>
                  <td className="px-3 py-3 text-right font-mono text-amber-300 hidden lg:table-cell">{loc.avgBustProb}%</td>
                  <td className="px-3 py-3 text-right font-mono text-slate-500 hidden xl:table-cell">
                    {loc.latestBustDate ?? '—'}
                  </td>
                  <td className="px-3 py-3 text-slate-600 group-hover:text-sky-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1a2e4c] text-xs text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-2 py-1 rounded border border-[#1a2e4c] hover:border-sky-700 disabled:opacity-30 transition-colors"
              >Prev</button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-2 py-1 rounded border border-[#1a2e4c] hover:border-sky-700 disabled:opacity-30 transition-colors"
              >Next</button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
