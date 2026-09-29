import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ShieldAlert,
  LayoutDashboard,
  Eye,
  Map,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  Database,
  Bell,
  Settings,
  X,
  Lock,
  ChevronDown,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { IconButton } from '../ui/IconButton'

interface NavItemDef {
  label: string
  path?: string
  icon: React.ComponentType<{ className?: string }>
  isAvailable?: boolean
  badge?: string
}

interface WorkspaceSection {
  id: string
  title: string
  items: NavItemDef[]
  defaultOpen?: boolean
}

const WORKSPACE_SECTIONS: WorkspaceSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    defaultOpen: true,
    items: [
      {
        label: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'forecast',
    title: 'Forecast',
    defaultOpen: true,
    items: [
      {
        label: 'Forecast Explorer',
        path: '/forecasts',
        icon: Eye,
        isAvailable: true,
      },
      {
        label: 'Risk Map',
        path: '/map',
        icon: Map,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'risk_busts',
    title: 'Risk & Busts',
    defaultOpen: true,
    items: [
      {
        label: 'Bust Detection',
        path: '/bust-detection',
        icon: AlertTriangle,
        isAvailable: true,
      },
      {
        label: 'Hidden Risk',
        path: '/hidden-risk',
        icon: HelpCircle,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'analysis',
    title: 'Analysis',
    defaultOpen: true,
    items: [
      {
        label: 'Verification & Analysis',
        path: '/analysis',
        icon: BarChart2,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    defaultOpen: true,
    items: [
      {
        label: 'Data & Quality',
        path: '/data',
        icon: Database,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'system',
    title: 'System',
    defaultOpen: true,
    items: [
      {
        label: 'Alerts',
        path: '/alerts',
        icon: Bell,
        isAvailable: true,
      },
      {
        label: 'Settings',
        path: '/settings',
        icon: Settings,
        isAvailable: true,
      },
    ],
  },
]

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()

  // Track expanded state for each workspace
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    WORKSPACE_SECTIONS.forEach((sec) => {
      initial[sec.id] = sec.defaultOpen ?? true
    })
    return initial
  })

  // Auto-expand workspace matching the active route
  useEffect(() => {
    const path = location.pathname
    WORKSPACE_SECTIONS.forEach((sec) => {
      const hasActiveChild = sec.items.some((item) => {
        if (!item.path) return false
        if (item.path === '/' && path === '/') return true
        if (item.path !== '/' && path.startsWith(item.path)) return true
        if (item.path === '/map' && path === '/risk-map') return true
        return false
      })

      if (hasActiveChild) {
        setExpandedSections((prev) => ({ ...prev, [sec.id]: true }))
      }
    })
  }, [location.pathname])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  // Close mobile sidebar on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0b172a] border-r border-[#1a2e4c]',
          'flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand & Logo Header */}
        <div className="h-16 px-4 border-b border-[#1a2e4c] flex items-center justify-between shrink-0 bg-[#0b172a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white tracking-tight truncate">
                Weather Lens
              </h1>
              <p className="text-[11px] font-medium text-sky-400/90 truncate">
                Forecast Bust Detection
              </p>
            </div>
          </div>

          <div className="lg:hidden">
            <IconButton
              icon={<X className="w-4 h-4 text-slate-300" />}
              aria-label="Close sidebar"
              size="sm"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Workspace Navigation Categories - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {WORKSPACE_SECTIONS.map((section) => {
            const isExpanded = !!expandedSections[section.id]

            // Check if section contains current active route
            const isSectionActive = section.items.some((item) => {
              if (!item.path) return false
              if (item.path === '/' && location.pathname === '/') return true
              if (item.path !== '/' && location.pathname.startsWith(item.path)) return true
              if (item.path === '/map' && location.pathname === '/risk-map') return true
              return false
            })

            return (
              <div key={section.id} className="space-y-1">
                {/* Collapsible Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-md transition-colors text-left',
                    isSectionActive
                      ? 'text-sky-400 bg-sky-950/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#10213d]/50'
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      isExpanded ? 'rotate-0 text-slate-400' : '-rotate-90 text-slate-600'
                    )}
                  />
                </button>

                {/* Section Items */}
                {isExpanded && (
                  <div className="space-y-0.5 pt-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon

                      if (item.isAvailable && item.path) {
                        return (
                          <NavLink
                            key={`${section.id}-${item.label}`}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn(
                                'group flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-150',
                                isActive
                                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-xs'
                                  : 'text-slate-300 hover:text-white hover:bg-[#10213d]'
                              )
                            }
                          >
                            <Icon className="w-4 h-4 text-sky-400 shrink-0" />
                            <span className="flex-1 truncate">{item.label}</span>
                          </NavLink>
                        )
                      }

                      // Non-available / future routes
                      return (
                        <div
                          key={item.label}
                          title={`${item.label} (${item.badge || 'Upcoming'})`}
                          className="flex items-center gap-3 px-3 py-1.5 text-xs font-normal text-slate-500 rounded-lg cursor-not-allowed select-none opacity-70 hover:bg-slate-900/30"
                        >
                          <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                          <span className="flex-1 truncate">{item.label}</span>
                          <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                            <Lock className="w-2.5 h-2.5 opacity-70" />
                            <span>{item.badge}</span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sidebar Footer System Status */}
        <div className="p-3 border-t border-[#1a2e4c] shrink-0 bg-[#070e1c]">
          <div className="p-2.5 rounded-lg bg-[#0b172a] border border-[#1a2e4c]/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Product Architecture
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-200 font-medium">Consolidated v1.0</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Stage 12</span>
          </div>
        </div>
      </aside>
    </>
  )
}
