import React from 'react'
import {
  LayoutDashboard,
  Globe2,
  CheckCircle2,
  Database,
  Grid,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import type { DataTabId } from '../../types/dataQuality'

interface DataTabNavProps {
  activeTab: DataTabId
  onTabChange: (tab: DataTabId) => void
  issueCount?: number
}

const TABS: { id: DataTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'coverage', label: 'Coverage Breakdown', icon: Globe2 },
  { id: 'quality', label: 'Quality & Audit', icon: CheckCircle2 },
  { id: 'explorer', label: 'Data Explorer', icon: Database },
  { id: 'availability', label: 'Availability Matrix', icon: Grid },
]

export const DataTabNav: React.FC<DataTabNavProps> = ({ activeTab, onTabChange, issueCount = 0 }) => {
  return (
    <div className="border-b border-[#1a2e4c] overflow-x-auto">
      <nav className="flex space-x-2" aria-label="Data & Quality Workspace Views">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isQualityTab = tab.id === 'quality'

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                isActive
                  ? 'border-cyan-500 text-cyan-300 font-semibold bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-cyan-400' : 'text-slate-500')} />
              <span>{tab.label}</span>
              {isQualityTab && issueCount > 0 && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-400 font-semibold">
                  {issueCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
