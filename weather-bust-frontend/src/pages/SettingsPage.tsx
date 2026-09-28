import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import {
  SettingsNav,
  type SettingsTabId,
  GeneralSettingsSection,
  AppearanceSettingsSection,
  ForecastRiskSettingsSection,
  DataAnalysisSettingsSection,
  NotificationSettingsSection,
  SystemInfoSection,
} from '../components/settings'
import {
  RotateCcw,
  CheckCircle2,
  Sliders,
  AlertCircle,
} from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { resetSettings, isModifiedFromDefaults, lastSaved } = useSettings()

  // Support URL param ?section= or ?tab= for deep-linking
  const paramTab = (searchParams.get('tab') || searchParams.get('section')) as SettingsTabId | null
  const activeTab: SettingsTabId =
    paramTab &&
    ['general', 'appearance', 'forecast-risk', 'data-analysis', 'notifications', 'system-info'].includes(
      paramTab
    )
      ? paramTab
      : 'general'

  const handleSelectTab = (tab: SettingsTabId) => {
    setSearchParams({ tab })
  }

  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetSuccessBanner, setResetSuccessBanner] = useState(false)

  const handleConfirmReset = () => {
    resetSettings()
    setShowResetConfirm(false)
    setResetSuccessBanner(true)
    setTimeout(() => {
      setResetSuccessBanner(false)
    }, 4000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b172a] border border-[#1a2e4c] p-5 rounded-2xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Workspace &bull; System Configuration
            </span>
            <span className="text-slate-500 text-xs">&bull;</span>
            <span className="text-xs text-slate-400">Stage 15</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-sky-400" />
            <span>Settings &amp; System Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Customize your meteorological analysis environment, visual appearance, risk metrics, observation data defaults, and notification triggers.
          </p>
        </div>

        {/* Global Save Indicator & Reset Action */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060d19] border border-[#1a2e4c] text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {lastSaved ? 'Saved locally' : 'Using active settings'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isModifiedFromDefaults
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-[#060d19] border-[#1a2e4c] text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog / Banner */}
      {showResetConfirm && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-amber-200 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Are you sure you want to revert all workspace settings to their initial default parameters?
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1 rounded-md text-xs text-slate-300 hover:text-white bg-[#060d19] border border-slate-700 hover:border-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-3 py-1 rounded-md text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      )}

      {/* Reset Success Banner */}
      {resetSuccessBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-2.5 text-emerald-200 text-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All system preferences have been restored to default values.</span>
        </div>
      )}

      {/* Two-Column Responsive Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Vertical Section Navigation */}
        <div className="lg:col-span-1 bg-[#0b172a] border border-[#1a2e4c] p-3 rounded-2xl sticky top-20">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#1a2e4c]/60 mb-2">
            Settings Workspace
          </div>
          <SettingsNav activeTab={activeTab} onSelectTab={handleSelectTab} />
        </div>

        {/* Right Column: Active View Content */}
        <div className="lg:col-span-3 min-w-0">
          {activeTab === 'general' && <GeneralSettingsSection />}
          {activeTab === 'appearance' && <AppearanceSettingsSection />}
          {activeTab === 'forecast-risk' && <ForecastRiskSettingsSection />}
          {activeTab === 'data-analysis' && <DataAnalysisSettingsSection />}
          {activeTab === 'notifications' && <NotificationSettingsSection />}
          {activeTab === 'system-info' && <SystemInfoSection />}
        </div>
      </div>
    </div>
  )
}
