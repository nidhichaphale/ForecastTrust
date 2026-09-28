import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

export interface WorkspaceTab {
  label: string
  path: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

interface WorkspaceSubNavProps {
  workspaceTitle: string
  workspaceDescription?: string
  tabs: WorkspaceTab[]
  className?: string
}

export const WorkspaceSubNav: React.FC<WorkspaceSubNavProps> = ({
  workspaceTitle,
  workspaceDescription,
  tabs,
  className,
}) => {
  const location = useLocation()

  return (
    <div className={cn('bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3 sm:p-4 mb-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
            Workspace
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            {workspaceTitle}
          </h2>
          {workspaceDescription && (
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              {workspaceDescription}
            </p>
          )}
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#07111f] p-1 rounded-lg border border-[#1a2e4c]/80 self-start sm:self-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = location.pathname === tab.path || (tab.path === '/map' && location.pathname === '/risk-map')

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-sky-500 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#10213d]'
                )}
              >
                {Icon && <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-sky-400')} />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      'text-[9px] px-1.5 py-0.2 rounded font-mono',
                      isActive ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
