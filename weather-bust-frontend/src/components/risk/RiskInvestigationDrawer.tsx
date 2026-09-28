import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import type { Forecast, RiskLevel } from '../../types'
import {
  buildCrossWorkspaceQuery,
  isEligibleForHiddenRisk,
  isEligibleForBustInvestigation,
} from '../../utils/riskContextAnalysis'
import {
  X,
  ExternalLink,
  MapPin,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Map as MapIcon,
  ShieldAlert,
  Activity,
  BarChart3,
  Clock,
} from 'lucide-react'

interface RiskInvestigationDrawerProps {
  forecast: Forecast | null
  isOpen: boolean
  onClose: () => void
  sourceWorkspace?: 'map' | 'bust-detection' | 'hidden-risk'
}

export const RiskInvestigationDrawer: React.FC<RiskInvestigationDrawerProps> = ({
  forecast,
  isOpen,
  onClose,
  sourceWorkspace = 'map',
}) => {
  const navigate = useNavigate()

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !forecast) return null

  // Check missing observation
  const isObsMissing = forecast.hasObservation === false || forecast.observedRainfall < 0
  const error = isObsMissing ? null : forecast.observedRainfall - forecast.forecastRainfall
  const eligibleHiddenRisk = isEligibleForHiddenRisk(forecast)
  const eligibleBust = isEligibleForBustInvestigation(forecast)

  // Cross workspace links
  const mapUrl = `/map${buildCrossWorkspaceQuery({
    locationId: forecast.locationId,
    startDate: forecast.validDate,
    leadDay: forecast.leadDay,
    region: forecast.region,
  })}`

  const bustUrl = `/bust-detection${buildCrossWorkspaceQuery({
    locationId: forecast.locationId,
    leadDay: forecast.leadDay,
    region: forecast.region,
    startDate: forecast.validDate,
  })}`

  const hiddenRiskUrl = `/hidden-risk${buildCrossWorkspaceQuery({
    locationId: forecast.locationId,
    leadDay: forecast.leadDay,
    region: forecast.region,
  })}`

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className="relative z-10 w-full max-w-lg bg-[#0b172a] border-l border-[#1a2e4c] shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1a2e4c] bg-[#07111f] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 bg-sky-950/40 border border-sky-800/50 px-2 py-0.5 rounded">
                Risk &amp; Busts Investigation
              </span>
              <span className="font-mono text-xs text-slate-400">ID: {forecast.id}</span>
            </div>
            <h2 id="drawer-title" className="text-lg font-bold text-white leading-snug">
              {forecast.locationName}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {forecast.state} &middot; {forecast.region} &middot;{' '}
              <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1" />
              Valid: <span className="font-mono text-slate-300">{forecast.validDate}</span> (D+{forecast.leadDay})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#10213d] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Realized Ground Truth Outcome */}
          <div className="bg-[#10213d]/60 border border-[#1a2e4c] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                Realized Ground Truth Outcome
              </span>
              <div className="flex items-center gap-1.5">
                {forecast.bustStatus === 'bust' && (
                  <Badge variant="severe" size="sm">
                    Verified Bust
                  </Badge>
                )}
                {forecast.bustStatus === 'borderline' && (
                  <Badge variant="high" size="sm">
                    Borderline
                  </Badge>
                )}
                {forecast.bustStatus === 'normal' && (
                  <Badge variant="low" size="sm">
                    Normal Verification
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center bg-[#07111f] p-3 rounded-lg border border-[#1a2e4c]/70">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Forecast Rain</div>
                <div className="text-base font-mono font-bold text-slate-100">{forecast.forecastRainfall}</div>
                <div className="text-[10px] text-slate-500">mm</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Observed Rain</div>
                {isObsMissing ? (
                  <div className="text-xs font-mono font-semibold text-amber-400 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Pending
                  </div>
                ) : (
                  <div className="text-base font-mono font-bold text-amber-300">{forecast.observedRainfall}</div>
                )}
                <div className="text-[10px] text-slate-500">{isObsMissing ? 'No ingest' : 'mm'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Signed Error</div>
                {error === null ? (
                  <div className="text-xs font-mono text-slate-500">N/A</div>
                ) : (
                  <div
                    className={cn(
                      'text-base font-mono font-bold',
                      error > 0 ? 'text-red-400' : error < 0 ? 'text-sky-400' : 'text-slate-300'
                    )}
                  >
                    {error > 0 ? `+${error.toFixed(1)}` : error.toFixed(1)}
                  </div>
                )}
                <div className="text-[10px] text-slate-500">{error !== null ? (error > 0 ? 'Under-fc' : 'Over-fc') : 'Awaiting obs'}</div>
              </div>
            </div>

            {isObsMissing && (
              <div className="text-[11px] text-amber-300/80 bg-amber-950/20 border border-amber-900/40 px-3 py-1.5 rounded flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Observation ground truth has not yet been ingested for this timestamp.
              </div>
            )}
          </div>

          {/* Risk Scorecard & Probability */}
          <div className="bg-[#10213d]/60 border border-[#1a2e4c] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Risk Scorecard &amp; Model Probability
              </span>
              <Badge variant={forecast.riskLevel as RiskLevel} size="sm">
                {forecast.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Model Bust Probability:</span>
                <span className="font-mono font-bold text-amber-400">
                  {(forecast.bustProbability * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-[#0b172a] h-2 rounded-full overflow-hidden border border-[#1a2e4c]">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    forecast.bustProbability >= 0.6
                      ? 'bg-red-500'
                      : forecast.bustProbability >= 0.4
                      ? 'bg-amber-500'
                      : forecast.bustProbability >= 0.2
                      ? 'bg-yellow-500'
                      : 'bg-emerald-500'
                  )}
                  style={{ width: `${Math.min(100, Math.max(5, forecast.bustProbability * 100))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-slate-400 pt-1">
                <span>Model Prediction Confidence:</span>
                <span className="font-mono text-emerald-400">
                  {(forecast.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Ensemble Metrics & Dispersion */}
          <div className="bg-[#10213d]/60 border border-[#1a2e4c] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                Ensemble Metrics &amp; Dispersion
              </span>
              {forecast.zeroSpread && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
                  Zero Spread
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-slate-500 block text-[10px] uppercase">Ensemble Mean</span>
                <span className="font-mono font-bold text-slate-200 text-sm">{forecast.ensembleMean} mm</span>
              </div>
              <div className="p-2.5 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-slate-500 block text-[10px] uppercase">Ensemble Spread (Std Dev)</span>
                <span
                  className={cn(
                    'font-mono font-bold text-sm',
                    forecast.ensembleSpread === 0 ? 'text-amber-400' : 'text-slate-200'
                  )}
                >
                  {forecast.ensembleSpread} mm
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-slate-500 block text-[10px] uppercase">Ensemble Min / Max</span>
                <span className="font-mono font-semibold text-slate-300">
                  {forecast.ensembleMin} – {forecast.ensembleMax} mm
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-slate-500 block text-[10px] uppercase">Range (Max - Min)</span>
                <span className="font-mono font-semibold text-slate-300">{forecast.ensembleRange} mm</span>
              </div>
            </div>
          </div>

          {/* Hidden Risk & False Certainty Diagnostic */}
          <div className="bg-[#10213d]/60 border border-[#1a2e4c] rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Hidden Risk / False Certainty Diagnostic
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-slate-300">Zero Rainfall Prediction:</span>
                <span
                  className={cn(
                    'font-mono font-semibold px-2 py-0.5 rounded text-[11px]',
                    forecast.forecastRainfall === 0
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-900/50'
                      : 'bg-slate-800 text-slate-300'
                  )}
                >
                  {forecast.forecastRainfall === 0 ? 'Yes (0.0 mm)' : `${forecast.forecastRainfall} mm`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#07111f] border border-[#1a2e4c]">
                <span className="text-slate-300">Ensemble Variance Condition:</span>
                <span
                  className={cn(
                    'font-mono font-semibold px-2 py-0.5 rounded text-[11px]',
                    forecast.ensembleSpread === 0 || forecast.zeroSpread
                      ? 'bg-red-950/40 text-red-300 border border-red-900/50'
                      : 'bg-slate-800 text-slate-300'
                  )}
                >
                  {forecast.ensembleSpread === 0 || forecast.zeroSpread
                    ? 'Unanimous 0.0 spread'
                    : `${forecast.ensembleSpread} mm`}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {forecast.zeroSpread && forecast.observedRainfall >= 15.0 ? (
                  <span className="text-red-400 font-semibold">
                    &bull; Severe False-Certainty Bust: Ensemble showed complete consensus on dry weather, yet heavy precipitation was observed.
                  </span>
                ) : eligibleHiddenRisk ? (
                  <span className="text-amber-300">
                    &bull; Hidden Risk Candidate: Overconfident dry signal or ultra-narrow ensemble agreement.
                  </span>
                ) : (
                  <span className="text-slate-400">
                    &bull; Normal Ensemble Spread: Dispersion reflects ordinary atmospheric uncertainty.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Cross-Workspace Actions */}
        <div className="p-4 border-t border-[#1a2e4c] bg-[#07111f] space-y-2">
          {/* Primary Action */}
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center gap-2 font-semibold shadow-lg shadow-sky-950/50"
            onClick={() => {
              onClose()
              navigate(`/forecasts/${forecast.id}`)
            }}
          >
            Open Complete Forecast Detail
            <ExternalLink className="w-4 h-4" />
          </Button>

          {/* Quick Cross-Workspace Jump Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {sourceWorkspace !== 'map' && (
              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1.5 text-xs text-slate-300 hover:text-white"
                onClick={() => {
                  onClose()
                  navigate(mapUrl)
                }}
              >
                <MapIcon className="w-3.5 h-3.5 text-sky-400" />
                View on Map
              </Button>
            )}

            {sourceWorkspace !== 'bust-detection' && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'justify-center gap-1.5 text-xs',
                  eligibleBust
                    ? 'text-red-300 border-red-900/50 hover:bg-red-950/30'
                    : 'text-slate-300 hover:text-white'
                )}
                onClick={() => {
                  onClose()
                  navigate(bustUrl)
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Bust Analysis
              </Button>
            )}

            {sourceWorkspace !== 'hidden-risk' && eligibleHiddenRisk && (
              <Button
                variant="outline"
                size="sm"
                className="justify-center gap-1.5 text-xs text-amber-300 border-amber-900/50 hover:bg-amber-950/30 col-span-2 sm:col-span-1"
                onClick={() => {
                  onClose()
                  navigate(hiddenRiskUrl)
                }}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Hidden Risk
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
