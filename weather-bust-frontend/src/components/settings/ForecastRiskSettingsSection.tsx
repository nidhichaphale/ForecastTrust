import React from 'react'
import { SettingField } from './SettingField'
import { useSettings } from '../../context/SettingsContext'
import { type RiskDisplayPreference } from '../../types/settings'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { ALERT_THRESHOLDS } from '../../config/alertThresholds'
import { FORECAST_THRESHOLDS } from '../../config/forecastThresholds'
import { ShieldAlert, List, Map, Info, Lock } from 'lucide-react'

const RISK_METRIC_OPTIONS: { value: RiskDisplayPreference; label: string; desc: string }[] = [
  {
    value: 'riskLevel',
    label: 'Categorical Risk Level',
    desc: 'Displays Low, Moderate, High, or Severe colored badges based on ensemble-derived risk bounds',
  },
  {
    value: 'bustProbability',
    label: 'Raw Bust Probability (%)',
    desc: 'Shows the quantitative ML-derived probability of forecast verification failure (0%–100%)',
  },
  {
    value: 'ensembleSpread',
    label: 'Ensemble Spread (Std Dev mm)',
    desc: 'Prioritizes raw numerical spread indicating atmospheric predictability and member agreement',
  },
]

export const ForecastRiskSettingsSection: React.FC = () => {
  const { settings, updateForecastRisk } = useSettings()

  return (
    <div className="space-y-6">
      {/* Risk Display Preferences */}
      <Card className="bg-[#0b172a] border-[#1a2e4c]">
        <CardHeader className="border-b border-[#1a2e4c]/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white">
                Forecast &amp; Risk Display Preferences
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure primary risk metrics, default spatial view, and visual emphasis for high-uncertainty scenarios.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="divide-y divide-[#1a2e4c]/60 pt-2">
          {/* Default Forecast Explorer View */}
          <SettingField
            title="Default Forecast Presentation Mode"
            description="Select whether the Forecast workspace opens in Tabular List mode or Geospatial Map mode."
          >
            <div className="inline-flex p-1 rounded-lg bg-[#060d19] border border-[#1a2e4c]">
              <button
                type="button"
                onClick={() => updateForecastRisk({ defaultForecastView: 'list' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  settings.forecastRisk.defaultForecastView === 'list'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Station List</span>
              </button>
              <button
                type="button"
                onClick={() => updateForecastRisk({ defaultForecastView: 'map' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  settings.forecastRisk.defaultForecastView === 'map'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Spatial Map</span>
              </button>
            </div>
          </SettingField>

          {/* Primary Risk Metric */}
          <SettingField
            title="Primary Risk Metric Indicator"
            description="Choose which metric is prioritized in summary tables, cards, and compact map tooltips."
            layout="vertical"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {RISK_METRIC_OPTIONS.map((opt) => {
                const isSelected = settings.forecastRisk.defaultRiskMetric === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateForecastRisk({ defaultRiskMetric: opt.value })}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500 text-rose-300 ring-1 ring-rose-500/40'
                        : 'bg-[#060d19] border-[#1a2e4c] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 text-white">
                      {opt.label}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {opt.desc}
                    </p>
                  </button>
                )
              })}
            </div>
          </SettingField>

          {/* Auto Highlight High Risk */}
          <SettingField
            title="Auto-Highlight High &amp; Severe Risk Scenarios"
            description="Automatically apply pulsing visual accents to stations exceeding critical bust probability thresholds."
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.forecastRisk.autoHighlightHighRisk}
                onChange={(e) =>
                  updateForecastRisk({ autoHighlightHighRisk: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </SettingField>

          {/* Show Ensemble Mini Distributions */}
          <SettingField
            title="Render Mini Ensemble Distribution Histograms"
            description="Display 50-member probability density sparklines directly within station table rows."
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.forecastRisk.showEnsembleMiniDistributions}
                onChange={(e) =>
                  updateForecastRisk({
                    showEnsembleMiniDistributions: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </SettingField>
        </CardContent>
      </Card>

      {/* Centralized Calibrated Thresholds Reference View */}
      <Card className="bg-[#0b172a] border-[#1a2e4c]">
        <CardHeader className="border-b border-[#1a2e4c]/60 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">
                  Calibrated Operational Meteorological Thresholds (Read-Only)
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized from domain config modules (<code className="text-sky-300">alertThresholds.ts</code> &amp; <code className="text-sky-300">forecastThresholds.ts</code>).
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
              IMD Calibrated
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Scientific Context Notice */}
          <div className="p-3.5 rounded-xl bg-[#060d19] border border-[#1a2e4c] flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              These scientific cutoffs are locked to preserve meteorological verification rigor across all forecasting workspaces. Threshold definitions adhere to India Meteorological Department (IMD) standards for rainy day classifications, ensemble dispersion, and convective bust bounds.
            </div>
          </div>

          {/* Operational Alert Thresholds Grid */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Alert Trigger Thresholds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">High Risk Bust Prob</div>
                <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">
                  {(ALERT_THRESHOLDS.HIGH_RISK_BUST_PROBABILITY * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Triggers advance warning</div>
              </div>

              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">Critical Bust Prob</div>
                <div className="text-lg font-bold font-mono text-red-500 mt-0.5">
                  {(ALERT_THRESHOLDS.CRITICAL_BUST_PROBABILITY * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Emergency operational status</div>
              </div>

              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">Severe Bust Error</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  {ALERT_THRESHOLDS.SEVERE_BUST_ERROR_MM.toFixed(1)} mm
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Observed minus forecast</div>
              </div>

              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">Critical Bust Error</div>
                <div className="text-lg font-bold font-mono text-red-400 mt-0.5">
                  {ALERT_THRESHOLDS.CRITICAL_BUST_ERROR_MM.toFixed(1)} mm
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Extreme convective failure</div>
              </div>
            </div>
          </div>

          {/* Meteorological & Hidden-Risk Thresholds Grid */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Hidden Risk &amp; Ensemble Thresholds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">Zero-Spread Max Bound</div>
                <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                  {ALERT_THRESHOLDS.HIDDEN_RISK_MAX_SPREAD_MM.toFixed(1)} mm
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Near-zero member std dev</div>
              </div>

              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">Hidden Risk Realized Min</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  {ALERT_THRESHOLDS.HIDDEN_RISK_MIN_REALIZED_MM.toFixed(1)} mm
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Significant surprise rain</div>
              </div>

              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">Extreme Ens Divergence</div>
                <div className="text-lg font-bold font-mono text-purple-400 mt-0.5">
                  {ALERT_THRESHOLDS.EXTREME_DIVERGENCE_SPREAD_MM.toFixed(1)} mm
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Member split uncertainty</div>
              </div>

              <div className="p-3 rounded-lg bg-[#07111f] border border-[#1a2e4c]">
                <div className="text-[11px] text-slate-400">IMD Rainy Day Standard</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  &ge; {FORECAST_THRESHOLDS.MEANINGFUL_RAIN_THRESHOLD.toFixed(1)} mm
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Official IMD rain threshold</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
