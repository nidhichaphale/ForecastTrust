import React from 'react'
import { SettingField } from './SettingField'
import { useSettings } from '../../hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Palette, Moon, Sun, Monitor, Check } from 'lucide-react'

export const AppearanceSettingsSection: React.FC = () => {
  const { settings, updateAppearance } = useSettings()

  return (
    <Card className="bg-[#0b172a] border-[#1a2e4c]">
      <CardHeader className="border-b border-[#1a2e4c]/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-white">
              Appearance &amp; Display Styling
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize visual theme mode, layout density, and data visualization contrast.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-[#1a2e4c]/60 pt-2">
        {/* Visual Theme Selection */}
        <SettingField
          title="Color Theme Mode"
          description="Select preferred theme. Dark mode provides low-strain operational contrast designed for meteorological monitoring rooms."
          layout="vertical"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Dark Theme */}
            <button
              type="button"
              onClick={() => updateAppearance({ theme: 'dark' })}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                settings.appearance.theme === 'dark'
                  ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500/40 text-white'
                  : 'bg-[#060d19] border-[#1a2e4c] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0b172a] border border-[#1a2e4c] flex items-center justify-center text-sky-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Dark Theme</span>
                </div>
                {settings.appearance.theme === 'dark' && (
                  <Check className="w-4 h-4 text-sky-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Deep navy background (#060d19), reduced eye fatigue, optimized for 24/7 analysis.
              </p>
            </button>

            {/* Light Theme */}
            <button
              type="button"
              onClick={() => updateAppearance({ theme: 'light' })}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                settings.appearance.theme === 'light'
                  ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500/40 text-white'
                  : 'bg-[#060d19] border-[#1a2e4c] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Light Theme</span>
                </div>
                {settings.appearance.theme === 'light' && (
                  <Check className="w-4 h-4 text-sky-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                High contrast bright palette, suitable for office environments and presentation monitors.
              </p>
            </button>

            {/* System Auto Theme */}
            <button
              type="button"
              onClick={() => updateAppearance({ theme: 'system' })}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                settings.appearance.theme === 'system'
                  ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500/40 text-white'
                  : 'bg-[#060d19] border-[#1a2e4c] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#10213d] border border-[#1a2e4c] flex items-center justify-center text-indigo-400">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">System Match</span>
                </div>
                {settings.appearance.theme === 'system' && (
                  <Check className="w-4 h-4 text-sky-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Automatically adapts to your operating system or browser color mode preference.
              </p>
            </button>
          </div>
        </SettingField>

        {/* UI Density */}
        <SettingField
          title="Interface Layout Density"
          description="Choose between comfortable row padding for relaxed scanning or compact density for high information density."
        >
          <div className="inline-flex p-1 rounded-lg bg-[#060d19] border border-[#1a2e4c]">
            <button
              type="button"
              onClick={() => updateAppearance({ density: 'comfortable' })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                settings.appearance.density === 'comfortable'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => updateAppearance({ density: 'compact' })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                settings.appearance.density === 'compact'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compact
            </button>
          </div>
        </SettingField>

        {/* Confidence Metrics Visibility */}
        <SettingField
          title="Display Advanced Confidence Metrics"
          description="Show model confidence bars, calibrated uncertainty intervals, and ensemble spreads across tabular views."
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.showConfidenceMetrics}
              onChange={(e) =>
                updateAppearance({ showConfidenceMetrics: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </SettingField>

        {/* High Contrast Cards */}
        <SettingField
          title="High-Contrast Panel Borders"
          description="Emphasize card boundaries and analytical section separators with higher-contrast stroke rendering."
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.enableHighContrastCards}
              onChange={(e) =>
                updateAppearance({ enableHighContrastCards: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </SettingField>
      </CardContent>
    </Card>
  )
}
