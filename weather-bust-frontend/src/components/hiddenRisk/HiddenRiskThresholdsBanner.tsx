import React from 'react'
import { FORECAST_THRESHOLDS } from '../../config/forecastThresholds'
import { ShieldCheck, Info } from 'lucide-react'

export const HiddenRiskThresholdsBanner: React.FC = () => {
  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
        <Info className="w-4 h-4 text-sky-400" />
        <span>Detection Logic & Operational Thresholds</span>
      </div>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
        High ensemble certainty does not guarantee forecast accuracy. The monitoring engine flags cases where
        models present unanimous agreement (zero or near-zero spread) but fail to capture realized rainfall.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-[#07111f] border border-[#1a2e4c]/70">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">1. Zero Forecast</div>
          <div className="font-mono text-slate-200 font-semibold">Rainfall ≤ {FORECAST_THRESHOLDS.NEAR_ZERO_RAIN_THRESHOLD} mm</div>
          <div className="text-[11px] text-slate-500 mt-1">Trace / dry condition; models predict no accumulation.</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111f] border border-[#1a2e4c]/70">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">2. Zero Ensemble Spread</div>
          <div className="font-mono text-slate-200 font-semibold">Spread ≤ {FORECAST_THRESHOLDS.ZERO_SPREAD_THRESHOLD} mm</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero member variance; unanimous dry consensus.</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#07111f] border border-[#1a2e4c]/70">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">3. Meaningful Rainfall</div>
          <div className="font-mono text-amber-300 font-semibold">Observed ≥ {FORECAST_THRESHOLDS.MEANINGFUL_RAIN_THRESHOLD} mm</div>
          <div className="text-[11px] text-slate-500 mt-1">IMD operational rainy-day standard (non-trace).</div>
        </div>

        <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40">
          <div className="text-[10px] uppercase font-bold text-red-400 mb-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-red-400" />
            4. Hidden-Risk Bust
          </div>
          <div className="font-mono text-red-300 font-semibold">Zero Fcst + Spread + Rain ≥ 2.5mm</div>
          <div className="text-[11px] text-slate-400 mt-1">Unanimous dry consensus failing into an active bust.</div>
        </div>
      </div>
    </div>
  )
}
