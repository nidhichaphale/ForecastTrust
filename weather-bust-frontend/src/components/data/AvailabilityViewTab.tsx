import React, { useState, useMemo } from 'react'
import { Grid, MapPin } from 'lucide-react'
import type { LocationAvailabilityRow } from '../../types/dataQuality'
import { getRegions } from '../../mock'

interface AvailabilityViewTabProps {
  availabilityGrid: LocationAvailabilityRow[]
}

const ALL_HORIZONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const AvailabilityViewTab: React.FC<AvailabilityViewTabProps> = ({ availabilityGrid }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const regions = useMemo(() => getRegions(), [])

  // Filter stations by region
  const filteredGrid = useMemo(() => {
    if (selectedRegion === 'all') return availabilityGrid
    return availabilityGrid.filter((row) => row.region === selectedRegion)
  }, [availabilityGrid, selectedRegion])

  // Count availability health
  const continuousStations = availabilityGrid.filter((r) => r.completenessRate === 100).length
  const lagStations = availabilityGrid.filter((r) => r.completenessRate < 100).length

  return (
    <div className="space-y-6">
      {/* ── Top Summary & Health Banner ───────────────────────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Grid className="w-4 h-4 text-cyan-400" />
              Dataset Availability &amp; Ingestion Continuity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Inspect forecast and ground-truth availability across all 36 meteorological stations and 10 lead horizons.
              Quickly verify whether specific stations have complete temporal records or pending observations.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-navy-950/80 border border-navy-700/80 px-4 py-2 rounded-lg shrink-0 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Full Continuity</div>
              <div className="text-emerald-400 font-bold font-mono">{continuousStations} Stations (100%)</div>
            </div>
            <div className="border-l border-navy-800 pl-4">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Telemetry Lag</div>
              <div className="text-amber-400 font-bold font-mono">{lagStations} Stations</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Region Filter & Legend Strip ─────────────────────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-300 mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Filter Region:
          </span>
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              selectedRegion === 'all'
                ? 'bg-cyan-500 text-white font-semibold shadow-xs'
                : 'bg-navy-800 text-slate-400 hover:text-slate-200 border border-navy-700'
            }`}
          >
            All Regions ({availabilityGrid.length})
          </button>
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedRegion === reg.id
                  ? 'bg-cyan-500 text-white font-semibold shadow-xs'
                  : 'bg-navy-800 text-slate-400 hover:text-slate-200 border border-navy-700'
              }`}
            >
              {reg.name.replace(' India', '')}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-[11px]">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[11px]">Pending Obs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-700" />
            <span className="text-[11px]">Not Scheduled</span>
          </div>
        </div>
      </div>

      {/* ── Availability Heatmap Grid ────────────────────────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-navy-700/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Station &times; Lead Day Availability Grid</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Displays ground-truth availability across D+1 to D+10 for each observation station
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-navy-800 px-3 py-1 rounded-full border border-navy-700">
            {filteredGrid.length} Stations Displayed
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold w-48">Station / Location</th>
                <th className="px-3 py-3 font-semibold w-32">Region</th>
                {ALL_HORIZONS.map((ld) => (
                  <th key={ld} className="px-2 py-3 font-semibold text-center w-12">
                    D+{ld}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-right">Completeness</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
              {filteredGrid.map((row) => {
                const isHealthy = row.completenessRate === 100

                return (
                  <tr key={row.locationId} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-2.5 font-sans">
                      <div className="font-semibold text-slate-200">{row.locationName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{row.state}</div>
                    </td>
                    <td className="px-3 py-2.5 font-sans text-slate-400 text-xs">
                      {row.region.replace(' India', '')}
                    </td>

                    {/* Lead Day Horizon Cells */}
                    {ALL_HORIZONS.map((ld) => {
                      const cell = row.leadDays[ld]
                      if (!cell || !cell.available) {
                        return (
                          <td key={ld} className="px-2 py-2.5 text-center">
                            <span
                              className="inline-block w-4 h-4 rounded bg-navy-950/80 border border-navy-800 text-slate-700 text-[10px] leading-4 select-none"
                              title={`D+${ld}: Horizon omitted from model schedule`}
                            >
                              &bull;
                            </span>
                          </td>
                        )
                      }

                      if (!cell.hasObservation) {
                        return (
                          <td key={ld} className="px-2 py-2.5 text-center">
                            <span
                              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-950/80 border border-amber-500 text-amber-400 text-[9px] font-bold"
                              title={`D+${ld}: Ground truth observation pending ingest`}
                            >
                              !
                            </span>
                          </td>
                        )
                      }

                      return (
                        <td key={ld} className="px-2 py-2.5 text-center">
                          <span
                            className="inline-block w-3.5 h-3.5 rounded-full bg-emerald-500/80 border border-emerald-400"
                            title={`D+${ld}: Forecast and Observation Available`}
                          />
                        </td>
                      )
                    })}

                    <td className="px-4 py-2.5 text-right font-sans">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isHealthy
                          ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                          : 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                      }`}>
                        {row.completenessRate}%
                      </span>
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
