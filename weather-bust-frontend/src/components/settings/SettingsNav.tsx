import React from 'react'
import {
  Sliders,
  Palette,
  ShieldAlert,
  Database,
  Bell,
  Info,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export type SettingsTabId =
  | 'general'
  | 'appearance'
  | 'forecast-risk'
  | 'data-analysis'
  | 'notifications'
  | 'system-info'

interface SettingsNavProps {
  activeTab: SettingsTabId
  onSelectTab: (tab: SettingsTabId) => void
}

interface TabDef {
  id: SettingsTabId
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const TABS: TabDef[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Landing page, default dates & geography',
    icon: Sliders,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Themes, density & display styling',
    icon: Palette,
  },
  {
    id: 'forecast-risk',
    label: 'Forecast & Risk',
    description: 'Risk metrics & calibrated thresholds',
    icon: ShieldAlert,
  },
  {
    id: 'data-analysis',
    label: 'Data & Analysis',
    description: 'Units, decimal precision & tables',
    icon: Database,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Alert categories & header badges',
    icon: Bell,
  },
  {
    id: 'system-info',
    label: 'System Information',
    description: 'Platform status, data stats & specs',
    icon: Info,
  },
]

export const SettingsNav: React.FC<SettingsNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none" aria-label="Settings sections">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all whitespace-nowrap lg:whitespace-normal shrink-0',
              isActive
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#10213d]/60 border border-transparent'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                isActive
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'bg-[#10213d] text-slate-400 group-hover:text-slate-200'
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-wide">
                {tab.label}
              </div>
              <div className="hidden lg:block text-[11px] text-slate-500 truncate group-hover:text-slate-400">
                {tab.description}
              </div>
            </div>
          </button>
        )
      })}
    </nav>
  )
}
