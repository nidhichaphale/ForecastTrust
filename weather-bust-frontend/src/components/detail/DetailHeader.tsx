import React from 'react'
import { ChevronRight, ArrowLeft, Map, AlertTriangle, HelpCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { StatusIndicator } from '../ui/StatusIndicator'
import type { Forecast, RiskLevel } from '../../types'

interface DetailHeaderProps {
  forecast: Forecast
}

const RISK_LABEL: Record<RiskLevel, string> = {
  severe: 'Severe',
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({ forecast }) => {
  const navigate = useNavigate()
  const isBust = forecast.bustStatus === 'bust'
  const isZeroSpread = forecast.zeroSpread || forecast.ensembleSpread <= 0.5

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Cross-Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1a2e4c]/80 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Link to="/forecasts" className="hover:text-slate-200 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Forecast Explorer
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span>{forecast.locationName}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-sky-400 font-medium">D+{forecast.leadDay} Detail</span>
        </nav>

        {/* Contextual Workspace Cross-Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => navigate(`/map?locationId=${forecast.locationId}`)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10213d] hover:bg-[#1a2e4c] text-slate-300 hover:text-white border border-[#1a2e4c] transition-colors text-[11px]"
          >
            <Map className="w-3 h-3 text-sky-400" />
            <span>View on Risk Map</span>
          </button>

          {isBust && (
            <button
              type="button"
              onClick={() => navigate(`/bust-detection?locationId=${forecast.locationId}&state=${encodeURIComponent(forecast.state)}`)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/30 hover:bg-red-900/40 text-red-300 border border-red-900/50 transition-colors text-[11px]"
            >
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span>Bust Analysis</span>
            </button>
          )}

          {isZeroSpread && (
            <button
              type="button"
              onClick={() => navigate(`/hidden-risk?locationId=${forecast.locationId}&state=${encodeURIComponent(forecast.state)}`)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border border-amber-900/50 transition-colors text-[11px]"
            >
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span>Hidden Risk</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {forecast.locationName}, {forecast.state}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-500">Date:</span>
              <span className="font-mono text-slate-200">{forecast.validDate}</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-500">Lead:</span>
              <span className="font-mono text-slate-200">D+{forecast.leadDay}</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-500">ID:</span>
              <span className="font-mono text-slate-500">{forecast.id}</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-500">Region:</span>
              <span className="text-slate-300">{forecast.region}</span>
            </span>
          </div>
        </div>

        {/* Badges / Status */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-1.5">
            <StatusIndicator status={forecast.riskLevel} />
            <span className="text-xs text-slate-300 font-medium">Risk:</span>
            <Badge variant={forecast.riskLevel as RiskLevel} size="sm">
              {RISK_LABEL[forecast.riskLevel]}
            </Badge>
          </div>

          <div className="flex items-center gap-2 bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-300 font-medium">Status:</span>
            <Badge variant={forecast.bustStatus === 'bust' ? 'severe' : 'outline'} size="sm">
              {forecast.bustStatus === 'bust' ? 'Bust' : 'Normal'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 bg-[#0b172a] border border-[#1a2e4c] rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-300 font-medium">Conf:</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {(forecast.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
