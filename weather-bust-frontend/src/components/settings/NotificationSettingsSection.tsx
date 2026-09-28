import React from 'react'
import { SettingField } from './SettingField'
import { useSettings } from '../../context/SettingsContext'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Bell, Volume2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { ALERT_TYPE_CONFIG, type AlertCategory } from '../../config/alertThresholds'

const HEADER_MAX_ITEMS_OPTIONS = [3, 5, 10]

export const NotificationSettingsSection: React.FC = () => {
  const { settings, updateNotifications } = useSettings()

  const handleToggleCategory = (categoryKey: AlertCategory) => {
    updateNotifications({
      enabledCategories: {
        ...settings.notifications.enabledCategories,
        [categoryKey]: !settings.notifications.enabledCategories[categoryKey],
      },
    })
  }

  const handleToggleAllCategories = (enable: boolean) => {
    const updated: Record<AlertCategory, boolean> = {
      severe_forecast_bust: enable,
      hidden_risk_zero_spread: enable,
      extreme_ensemble_divergence: enable,
      flash_convective_discrepancy: enable,
      high_bust_risk: enable,
      data_quality_missing_observation: enable,
    }
    updateNotifications({ enabledCategories: updated })
  }

  const categoryKeys = Object.keys(ALERT_TYPE_CONFIG) as AlertCategory[]
  const enabledCount = categoryKeys.filter(
    (k) => settings.notifications.enabledCategories[k]
  ).length

  return (
    <div className="space-y-6">
      {/* General Notification Controls */}
      <Card className="bg-[#0b172a] border-[#1a2e4c]">
        <CardHeader className="border-b border-[#1a2e4c]/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white">
                Notification &amp; Alert Delivery Preferences
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure global notification badges, dropdown preview capacity, and acoustic warning signals.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="divide-y divide-[#1a2e4c]/60 pt-2">
          {/* Header Notification Badge */}
          <SettingField
            title="Display Unread Notification Counter Badge"
            description="Show red numeric counter badge on the top header bell icon when unresolved operational alerts exist."
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.showNotificationBadge}
                onChange={(e) =>
                  updateNotifications({ showNotificationBadge: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </SettingField>

          {/* Header Quick Menu Limit */}
          <SettingField
            title="Header Popover Maximum Alert Limit"
            description="Number of priority operational notifications shown in the top navigation quick-access dropdown."
          >
            <select
              aria-label="Header Popover Maximum Alert Limit"
              value={settings.notifications.headerMaxItems}
              onChange={(e) =>
                updateNotifications({
                  headerMaxItems: parseInt(e.target.value, 10),
                })
              }
              className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[200px]"
            >
              {HEADER_MAX_ITEMS_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count} Recent Priority Alerts
                </option>
              ))}
            </select>
          </SettingField>

          {/* Acoustic Warning Tone */}
          <SettingField
            title="Audible Alert Chime on Severe Events"
            description="Play synthesized high-priority chime when critical or severe forecast busts are detected."
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.alertSoundEnabled}
                  onChange={(e) =>
                    updateNotifications({ alertSoundEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>
          </SettingField>
        </CardContent>
      </Card>

      {/* Alert Category Subscriptions */}
      <Card className="bg-[#0b172a] border-[#1a2e4c]">
        <CardHeader className="border-b border-[#1a2e4c]/60 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">
                  Active Operational Alert Subscriptions
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select which meteorological failure modes and data quality incidents trigger active notifications ({enabledCount} of {categoryKeys.length} enabled).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleAllCategories(true)}
                className="px-2.5 py-1 text-xs text-sky-400 hover:text-sky-300 rounded border border-sky-500/30 hover:bg-sky-500/10 transition-colors"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => handleToggleAllCategories(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-300 rounded border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Mute All
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 divide-y divide-[#1a2e4c]/60">
          {categoryKeys.map((key) => {
            const config = ALERT_TYPE_CONFIG[key]
            const isEnabled = settings.notifications.enabledCategories[key]

            return (
              <div
                key={key}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {config.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${config.badgeColor}`}
                    >
                      {config.defaultSeverity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {config.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    {isEnabled ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Subscribed
                      </span>
                    ) : (
                      'Muted'
                    )}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggleCategory(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
