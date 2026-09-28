import React from 'react'
import {
  LayoutDashboard,
  TrendingDown,
  CalendarClock,
  Globe2,
  History,
  Cpu,
  Sliders,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export type AnalysisTabId =
  | 'overview'
  | 'errors'
  | 'lead-day'
  | 'region'
  | 'historical'
  | 'models'
  | 'features'

interface AnalysisTabNavProps {
  activeTab: AnalysisTabId
  onTabChange: (tab: AnalysisTabId) => void
}

const TABS: { id: AnalysisTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'errors', label: 'Error Analysis', icon: TrendingDown },
  { id: 'lead-day', label: 'Lead Day', icon: CalendarClock },
  { id: 'region', label: 'Regional', icon: Globe2 },
  { id: 'historical', label: 'Historical', icon: History },
  { id: 'models', label: 'Models', icon: Cpu },
  { id: 'features', label: 'Features', icon: Sliders },
]

export const AnalysisTabNav: React.FC<AnalysisTabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-[#1a2e4c] overflow-x-auto">
      <nav className="flex space-x-2" aria-label="Verification Workspace Views">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                isActive
                  ? 'border-sky-500 text-sky-300 font-semibold bg-sky-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-sky-400' : 'text-slate-500')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
