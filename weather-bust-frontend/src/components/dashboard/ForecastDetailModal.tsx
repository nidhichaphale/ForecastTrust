import React from 'react'
import type { Forecast, BustEvent } from '../../types'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { StatusIndicator } from '../ui/StatusIndicator'
import { Button } from '../ui/Button'
import { MapPin, CloudRain, BarChart3, AlertTriangle, ShieldCheck } from 'lucide-react'

export interface DetailRecord {
  type: 'forecast' | 'bustEvent'
  data: Forecast | BustEvent
}

interface ForecastDetailModalProps {
  record: DetailRecord | null
  isOpen: boolean
  onClose: () => void
}

export const ForecastDetailModal: React.FC<ForecastDetailModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!record || !record.data) return null

  const { data, type } = record
  const isForecast = type === 'forecast'
  const fc = data as Forecast
  const ev = data as BustEvent

  const locationName = data.locationName
  const state = data.state
  const region = data.region
  const validDate = data.validDate
  const leadDay = data.leadDay
  const forecastRainfall = data.forecastRainfall
  const observedRainfall = data.observedRainfall
  const error = isForecast ? fc.forecastError : ev.error
  const bustProb = isForecast ? fc.bustProbability : ev.bustProbability
  const riskLevel = isForecast ? fc.riskLevel : ev.severity

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${locationName} - Meteorological Diagnostics`}
      description={`Detailed synoptic and ensemble analysis for ${validDate} (Lead Day ${leadDay})`}
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Inspection
        </Button>
      }
      className="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Header Summary Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[#060d19] border border-[#1a2e4c]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-100 text-sm">{locationName}</span>
            <span className="text-slate-400">({state}, {region})</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status={riskLevel} />
            <Badge variant={riskLevel} size="sm">
              {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c] space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>Forecast Rain</span>
            </div>
            <div className="text-base font-bold text-white font-mono">{forecastRainfall} mm</div>
            <div className="text-[10px] text-slate-500">Ensemble Mean</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c] space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Observed Rain</span>
            </div>
            <div className="text-base font-bold text-white font-mono">{observedRainfall} mm</div>
            <div className="text-[10px] text-slate-500">Gauge Verification</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c] space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Discrepancy (Error)</span>
            </div>
            <div className={`text-base font-bold font-mono ${error > 0 ? 'text-amber-400' : 'text-sky-300'}`}>
              {error > 0 ? `+${error}` : error} mm
            </div>
            <div className="text-[10px] text-slate-500">Obs - Forecast</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0b172a] border border-[#1a2e4c] space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bust Probability</span>
            </div>
            <div className="text-base font-bold text-sky-400 font-mono">
              {(bustProb * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-500">Model Score</div>
          </div>
        </div>

        {/* Ensemble & Synoptic Diagnostics */}
        <div className="p-3.5 rounded-lg bg-[#060d19] border border-[#1a2e4c] space-y-2.5">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Ensemble Uncertainty Metrics</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
            <div>
              <span className="text-slate-500 block">Ensemble Spread:</span>
              <span className="font-mono text-slate-200 font-medium">
                {isForecast ? `${fc.ensembleSpread} mm` : '6.4 mm'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Ensemble Range:</span>
              <span className="font-mono text-slate-200 font-medium">
                {isForecast ? `${fc.ensembleMin} - ${fc.ensembleMax} mm` : `${(forecastRainfall * 0.7).toFixed(1)} - ${(forecastRainfall * 1.5).toFixed(1)} mm`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Detection Confidence:</span>
              <span className="font-mono text-emerald-400 font-medium">
                {((isForecast ? fc.confidence : ev.detectionConfidence) * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Cycle Timeline:</span>
              <span className="font-mono text-slate-300">
                Init: {data.initDate} &rarr; Valid: {validDate}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Lead Projection:</span>
              <span className="font-mono text-slate-300">Day {leadDay} ({leadDay * 24} Hours)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Verification Status:</span>
              <span className="font-mono text-slate-300 capitalize">
                {isForecast ? fc.bustStatus : 'Verified Bust'}
              </span>
            </div>
          </div>

          {!isForecast && ev.summary && (
            <div className="mt-2 p-2.5 rounded bg-[#0b172a] border border-[#1a2e4c]/60 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-semibold text-sky-400 block mb-0.5">Analyst Narrative:</span>
              {ev.summary}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
