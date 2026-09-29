import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import { ExternalLink, X, AlertCircle, Map as MapIcon, AlertTriangle, Search, ArrowUpRight } from 'lucide-react'
import type { Forecast } from '../../types'
import {
  isZeroSpread,
  isZeroForecast,
  isHiddenRiskBust,
  getHiddenRiskClassification,
} from '../../utils/hiddenRiskAnalysis'
import { getHiddenRiskSeverity } from '../../config/forecastThresholds'
import { buildCrossWorkspaceQuery } from '../../utils/riskContextAnalysis'

interface HiddenRiskCasesTableProps {
  cases: Forecast[]
  onSelectForecast?: (forecast: Forecast) => void
}

const SEVERITY_BADGE_CLASS: Record<string, string> = {
  severe: 'bg-red-500/20 text-red-300 border-red-500/50',
  high: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
  moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
}

const CaseInvestigationDetail: React.FC<{
  fc: Forecast
  onClose: () => void
  onSelectForecast?: (forecast: Forecast) => void
}> = ({ fc, onClose, onSelectForecast }) => {
  const navigate = useNavigate()
  const absError = Math.abs(fc.forecastError)
  const severity = getHiddenRiskSeverity(absError)
  const zeroS = isZeroSpread(fc)
  const zeroF = isZeroForecast(fc)
  const isBust = isHiddenRiskBust(fc)
  const classification = getHiddenRiskClassification(fc)

  const mapCrossUrl = `/map${buildCrossWorkspaceQuery({
    locationId: fc.locationId,
    state: fc.state,
    region: fc.region,
    leadDay: fc.leadDay,
    date: fc.validDate,
  })}`

  const bustCrossUrl = `/bust-detection${buildCrossWorkspaceQuery({
    locationId: fc.locationId,
    state: fc.state,
    region: fc.region,
    leadDay: fc.leadDay,
    date: fc.validDate,
  })}`

  return (
    <div className="border-t border-[#1a2e4c] bg-[#07111f] p-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamic Investigation Explanation */}
        <div className="space-y-2.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-sky-400" />
            Why This Case Is Flagged
          </div>
          <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c] space-y-1.5 leading-relaxed text-slate-300">
            <div>
              &bull; <strong className="text-slate-100">Forecast Rainfall:</strong> {fc.forecastRainfall} mm{' '}
              <span className="text-slate-500">({zeroF ? 'Zero / Trace Consensus' : 'Accumulation'})</span>
            </div>
            <div>
              &bull; <strong className="text-slate-100">Ensemble Spread:</strong> {fc.ensembleSpread} mm{' '}
              <span className="text-slate-500">({zeroS ? 'Zero Variance / Unanimous' : 'Member Disagreement'})</span>
            </div>
            <div>
              &bull; <strong className="text-slate-100">Realized Observed Rain:</strong>{' '}
              <span className="font-mono font-bold text-amber-300">{fc.observedRainfall} mm</span>
            </div>
            <div>
              &bull; <strong className="text-slate-100">Forecast Error:</strong>{' '}
              <span className={cn('font-mono font-bold', fc.forecastError > 0 ? 'text-red-400' : 'text-sky-400')}>
                {fc.forecastError > 0 ? '+' : ''}{fc.forecastError} mm
              </span>
            </div>
            <div className="pt-1.5 border-t border-[#1a2e4c] flex items-center justify-between">
              <span className="font-semibold text-slate-400">Diagnosis:</span>
              <span className={cn('font-bold', isBust ? 'text-red-400' : 'text-slate-200')}>
                {classification}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {isBust
              ? 'Extreme false certainty failure: models had zero dispersion yet missed significant localized precipitation.'
              : 'Consistent consensus: models anticipated dry conditions with verified ground reality.'}
          </p>
        </div>

        {/* Ensemble Metrics */}
        <div className="space-y-2.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Ensemble &amp; Verification Context
          </div>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-[#1a2e4c] pb-1.5">
              <span className="text-slate-500">Ensemble Mean</span>
              <span className="font-mono text-slate-200">{fc.ensembleMean} mm</span>
            </div>
            <div className="flex justify-between border-b border-[#1a2e4c] pb-1.5">
              <span className="text-slate-500">Ensemble Range (Min–Max)</span>
              <span className="font-mono text-slate-200">
                {fc.ensembleMin} – {fc.ensembleMax} mm
              </span>
            </div>
            <div className="flex justify-between border-b border-[#1a2e4c] pb-1.5">
              <span className="text-slate-500">Model Bust Probability</span>
              <span className="font-mono text-orange-400">{(fc.bustProbability * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between border-b border-[#1a2e4c] pb-1.5">
              <span className="text-slate-500">Model Detection Conf.</span>
              <span className="font-mono text-emerald-400">{(fc.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hidden-Risk Severity</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase border',
                  SEVERITY_BADGE_CLASS[severity]
                )}
              >
                {severity}
              </span>
            </div>
          </div>
        </div>

        {/* Station Metadata and Navigation Action */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Station &amp; Cross-Workspace</div>
          <div className="space-y-1.5 text-slate-400">
            <div className="flex justify-between"><span>Forecast ID:</span> <span className="font-mono text-slate-200">{fc.id}</span></div>
            <div className="flex justify-between"><span>Station:</span> <span className="text-slate-200 font-semibold">{fc.locationName}</span></div>
            <div className="flex justify-between"><span>Geography:</span> <span>{fc.state} · {fc.region}</span></div>
            <div className="flex justify-between"><span>Valid Date:</span> <span className="font-mono text-slate-200">{fc.validDate} (D+{fc.leadDay})</span></div>
          </div>

          <div className="pt-1 space-y-1.5">
            {onSelectForecast && (
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center gap-1.5 bg-sky-600 hover:bg-sky-500"
                onClick={() => onSelectForecast(fc)}
              >
                <Search className="w-3.5 h-3.5" />
                Inspect in Risk Drawer
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center gap-1.5 text-xs text-slate-300 hover:text-white"
              onClick={() => navigate(`/forecasts/${fc.id}`)}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Forecast Detail
            </Button>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1 text-[11px] text-slate-400 hover:text-sky-300"
                onClick={() => navigate(mapCrossUrl)}
              >
                <MapIcon className="w-3 h-3 text-sky-400" />
                View on Map
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1 text-[11px] text-slate-400 hover:text-red-300"
                onClick={() => navigate(bustCrossUrl)}
              >
                <AlertTriangle className="w-3 h-3 text-red-400" />
                Bust Analysis
              </Button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-[11px] text-slate-500 hover:text-slate-300 transition-colors py-1"
            >
              <X className="w-3 h-3 inline mr-1" />
              Close Investigation Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const HiddenRiskCasesTable: React.FC<HiddenRiskCasesTableProps> = ({ cases, onSelectForecast }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const shown = cases.slice(0, 20)


  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm">Zero-Spread & Hidden-Risk Investigation Registry</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {shown.length} of {cases.length} candidates — click any row to inspect why it was flagged
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1a2e4c]">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Location
                </th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                  Date
                </th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                  Lead
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Fcst (mm)
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Obs (mm)
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Spread
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Error
                </th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Diagnosis
                </th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">
                  Severity
                </th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center">
                    <p className="text-slate-300 font-semibold mb-1">No hidden-risk candidates match the current filters</p>
                    <p className="text-xs text-slate-500">All zero-spread and trace-forecast scenarios within this range verified accurately.</p>
                  </td>
                </tr>
              ) : (
                shown.map((fc) => {
                  const isExpanded = expandedId === fc.id
                  const isBust = isHiddenRiskBust(fc)
                  const classification = getHiddenRiskClassification(fc)
                  const severity = getHiddenRiskSeverity(Math.abs(fc.forecastError))

                  return (
                    <React.Fragment key={fc.id}>
                      <tr
                        className={cn(
                          'border-b border-[#1a2e4c]/60 cursor-pointer transition-colors',
                          isExpanded ? 'bg-sky-950/25' : 'hover:bg-[#10213d]'
                        )}
                        onClick={() => setExpandedId(isExpanded ? null : fc.id)}
                      >
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            {fc.locationName}
                            {isBust && (
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {fc.state} · {fc.region}
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-300 hidden sm:table-cell">
                          {fc.validDate}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-slate-400 hidden md:table-cell">
                          D+{fc.leadDay}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-slate-200">
                          {fc.forecastRainfall}
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-amber-300">
                          {fc.observedRainfall}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-cyan-400 font-semibold">
                          {fc.ensembleSpread}
                        </td>
                        <td
                          className={cn(
                            'px-3 py-3 text-right font-mono font-bold',
                            fc.forecastError > 0 ? 'text-red-400' : 'text-sky-400'
                          )}
                        >
                          {fc.forecastError > 0 ? '+' : ''}
                          {fc.forecastError}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-semibold',
                              isBust
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : fc.observedRainfall > 0
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            )}
                          >
                            {classification}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center hidden lg:table-cell">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-bold uppercase border',
                              SEVERITY_BADGE_CLASS[severity]
                            )}
                          >
                            {severity}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right text-slate-500">
                          <ArrowUpRight
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isExpanded ? 'rotate-90 text-sky-400' : ''
                            )}
                          />
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={10} className="p-0">
                            <CaseInvestigationDetail
                              fc={fc}
                              onClose={() => setExpandedId(null)}
                              onSelectForecast={onSelectForecast}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
