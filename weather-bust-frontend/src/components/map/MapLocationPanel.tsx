import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { X, ExternalLink, MapPin, ShieldAlert, Activity, CloudRain, BarChart3, Search, Clock } from 'lucide-react'
import type { MapForecast } from '../../mock/mapHelpers'
import { cn } from '../../utils/cn'
import type { RiskLevel } from '../../types'
import { buildCrossWorkspaceQuery, isEligibleForHiddenRisk } from '../../utils/riskContextAnalysis'

interface MapLocationPanelProps {
  forecast: MapForecast
  onClose: () => void
  onInspect?: (forecast: MapForecast) => void
}

export const MapLocationPanel: React.FC<MapLocationPanelProps> = ({ forecast, onClose, onInspect }) => {
  const navigate = useNavigate()
  const isObsMissing = forecast.hasObservation === false || forecast.observedRainfall < 0
  const error = isObsMissing ? null : forecast.observedRainfall - forecast.forecastRainfall
  const hasHiddenRisk = isEligibleForHiddenRisk(forecast)

  const bustCrossUrl = `/bust-detection${buildCrossWorkspaceQuery({
    locationId: forecast.locationId,
    state: forecast.state,
    region: forecast.region,
    leadDay: forecast.leadDay,
    date: forecast.validDate,
  })}`

  const hiddenRiskCrossUrl = `/hidden-risk${buildCrossWorkspaceQuery({
    locationId: forecast.locationId,
    state: forecast.state,
    region: forecast.region,
    leadDay: forecast.leadDay,
  })}`

  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl shadow-2xl w-72 overflow-hidden flex flex-col max-h-[calc(100vh-14rem)]">
      {/* Panel Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-[#1a2e4c]">
        <div>
          <h3 className="font-semibold text-slate-100 text-sm leading-tight">{forecast.locationName}</h3>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            {forecast.state} &middot; {forecast.region}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-200 transition-colors p-0.5"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Panel Body */}
      <div className="px-4 py-3 space-y-3 overflow-y-auto flex-1">
        {/* Risk status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Risk Level</span>
          <div className="flex items-center gap-1.5">
            <Badge variant={forecast.riskLevel as RiskLevel} size="sm">
              {forecast.riskLevel.charAt(0).toUpperCase() + forecast.riskLevel.slice(1)}
            </Badge>
            {forecast.bustStatus === 'bust' && (
              <Badge variant="severe" size="sm">Bust</Badge>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a2e4c]" />

        {/* Forecast / Obs / Error */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-0.5 font-semibold">Forecast</div>
            <div className="font-mono text-sm font-semibold text-slate-100">{forecast.forecastRainfall}</div>
            <div className="text-[10px] text-slate-600">mm</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-0.5 font-semibold">Observed</div>
            {isObsMissing ? (
              <div className="font-mono text-xs font-semibold text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                <Clock className="w-3 h-3" />
                Pending
              </div>
            ) : (
              <div className="font-mono text-sm font-semibold text-amber-300">{forecast.observedRainfall}</div>
            )}
            <div className="text-[10px] text-slate-600">{isObsMissing ? 'No ingest' : 'mm'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-0.5 font-semibold">Error</div>
            {error === null ? (
              <div className="font-mono text-xs text-slate-500 mt-0.5">N/A</div>
            ) : (
              <div className={cn('font-mono text-sm font-semibold', error > 0 ? 'text-red-400' : error < 0 ? 'text-sky-400' : 'text-slate-400')}>
                {error > 0 ? '+' : ''}{error.toFixed(0)}
              </div>
            )}
            <div className="text-[10px] text-slate-600">mm</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a2e4c]" />

        {/* Key metrics */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldAlert className="w-3 h-3 text-amber-400" /> Bust Probability</span>
            <span className={cn('font-mono font-semibold', forecast.bustProbability >= 0.6 ? 'text-red-400' : forecast.bustProbability >= 0.4 ? 'text-orange-400' : 'text-emerald-400')}>
              {(forecast.bustProbability * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-sky-400" /> Lead Day</span>
            <span className="font-mono text-slate-200">D+{forecast.leadDay}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span className="flex items-center gap-1.5"><BarChart3 className="w-3 h-3 text-purple-400" /> Ens Spread</span>
            <span className={cn('font-mono', forecast.zeroSpread ? 'text-amber-400 font-bold' : 'text-slate-200')}>
              {forecast.ensembleSpread} mm {forecast.zeroSpread && '(Zero)'}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span className="flex items-center gap-1.5"><CloudRain className="w-3 h-3 text-teal-400" /> Valid Date</span>
            <span className="font-mono text-slate-200">{forecast.validDate}</span>
          </div>
        </div>
      </div>

      {/* Actions & Cross-Workspace Navigation */}
      <div className="px-4 pb-4 space-y-2 border-t border-[#1a2e4c] pt-3 bg-[#07111f]">
        {onInspect && (
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center gap-2 font-medium bg-sky-600 hover:bg-sky-500 shadow-sm"
            onClick={() => onInspect(forecast)}
          >
            <Search className="w-3.5 h-3.5" />
            Inspect in Drawer
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-1.5 text-xs text-slate-300 hover:text-white"
          onClick={() => navigate(`/forecasts/${forecast.id}`)}
        >
          View Full Forecast
          <ExternalLink className="w-3 h-3" />
        </Button>

        <div className="pt-1 border-t border-[#1a2e4c]/70 space-y-1">
          <button
            type="button"
            onClick={() => navigate(bustCrossUrl)}
            className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-400 hover:text-red-300 hover:bg-[#10213d] transition-colors flex items-center justify-between"
          >
            <span>Investigate in Bust Detection</span>
            <span className="text-slate-600">&rarr;</span>
          </button>

          {hasHiddenRisk && (
            <button
              type="button"
              onClick={() => navigate(hiddenRiskCrossUrl)}
              className="w-full text-left px-2 py-1 rounded text-[11px] text-amber-400/90 hover:text-amber-300 hover:bg-[#10213d] transition-colors flex items-center justify-between"
            >
              <span>Check Station Hidden Risk</span>
              <span className="text-slate-600">&rarr;</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(`/forecasts?locationId=${forecast.locationId}`)}
            className="w-full text-left px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-[#10213d] transition-colors flex items-center justify-between"
          >
            <span>All Forecasts for {forecast.locationName}</span>
            <span className="text-slate-600">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  )
}

