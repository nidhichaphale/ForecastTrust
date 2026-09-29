import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  LayoutDashboard,
  Eye,
  Map,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  Database,
  Bell,
  Settings,
  MapPin,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { MOCK_LOCATIONS, MOCK_ALERTS } from '../../mock'
import { cn } from '../../utils/cn'

interface GlobalSearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'Workspace' | 'Station' | 'Alert'
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const WORKSPACE_ITEMS: SearchItem[] = [
  {
    id: 'ws-dashboard',
    title: 'Dashboard',
    subtitle: 'Executive overview, key metrics & bust risk summary',
    category: 'Workspace',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'ws-explorer',
    title: 'Forecast Explorer',
    subtitle: 'Search & filter multi-lead forecasts across Indian stations',
    category: 'Workspace',
    path: '/forecasts',
    icon: Eye,
  },
  {
    id: 'ws-map',
    title: 'Risk Overview / Spatial Map',
    subtitle: 'Geospatial risk heatmaps, station clusters & lead days',
    category: 'Workspace',
    path: '/map',
    icon: Map,
  },
  {
    id: 'ws-bust',
    title: 'Bust Detection',
    subtitle: 'Forecast verification failures & large discrepancy events',
    category: 'Workspace',
    path: '/bust-detection',
    icon: AlertTriangle,
  },
  {
    id: 'ws-hidden',
    title: 'Hidden Risk / Zero-Spread',
    subtitle: 'False certainty monitoring and surprise precipitation cases',
    category: 'Workspace',
    path: '/hidden-risk',
    icon: HelpCircle,
  },
  {
    id: 'ws-analysis',
    title: 'Verification & Analysis',
    subtitle: 'Model verification metrics, feature importance & error analysis',
    category: 'Workspace',
    path: '/analysis',
    icon: BarChart2,
  },
  {
    id: 'ws-data',
    title: 'Data & Quality',
    subtitle: 'Station inventory, observation latency & audit records',
    category: 'Workspace',
    path: '/data',
    icon: Database,
  },
  {
    id: 'ws-alerts',
    title: 'Operational Alerts',
    subtitle: 'Meteorological warnings, triage and active alerts registry',
    category: 'Workspace',
    path: '/alerts',
    icon: Bell,
  },
  {
    id: 'ws-settings',
    title: 'Settings & System Preferences',
    subtitle: 'Appearance, calibrated thresholds, units & notifications',
    category: 'Workspace',
    path: '/settings',
    icon: Settings,
  },
]

export const GlobalSearchDialog: React.FC<GlobalSearchDialogProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Focus input when dialog opens & clear query
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery('')
        setSelectedIndex(0)
        inputRef.current?.focus()
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Filter items matching query
  const searchResults = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Return all workspaces as quick jump suggestions
      return WORKSPACE_ITEMS
    }

    const matches: SearchItem[] = []

    // 1. Search Workspaces
    WORKSPACE_ITEMS.forEach((ws) => {
      if (ws.title.toLowerCase().includes(q) || ws.subtitle.toLowerCase().includes(q)) {
        matches.push(ws)
      }
    })

    // 2. Search Stations / Locations
    MOCK_LOCATIONS.forEach((loc) => {
      if (
        loc.name.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q)
      ) {
        matches.push({
          id: `station-${loc.id}`,
          title: loc.name,
          subtitle: `${loc.state} (${loc.region}) • ${loc.elevationMeters}m elev`,
          category: 'Station',
          path: `/forecasts?searchQuery=${encodeURIComponent(loc.name)}`,
          icon: MapPin,
          badge: loc.region,
        })
      }
    })

    // 3. Search Active Alerts
    MOCK_ALERTS.slice(0, 15).forEach((alt) => {
      if (
        alt.locationName.toLowerCase().includes(q) ||
        alt.message.toLowerCase().includes(q) ||
        alt.alertType.toLowerCase().includes(q)
      ) {
        matches.push({
          id: `alert-${alt.id}`,
          title: `${alt.locationName}: ${alt.message.slice(0, 48)}...`,
          subtitle: `Severity: ${alt.severity.toUpperCase()} • Valid Date: ${alt.validDate}`,
          category: 'Alert',
          path: `/alerts?alertId=${alt.id}`,
          icon: ShieldAlert,
          badge: alt.severity,
        })
      }
    })

    return matches.slice(0, 12)
  }, [query])

  // Keyboard navigation within list
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = searchResults[selectedIndex]
        if (selected) {
          navigate(selected.path)
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, searchResults, selectedIndex, navigate, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global search and quick navigation"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0b172a] border border-[#1a2e4c] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1a2e4c] bg-[#07111f]">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search workspaces, stations, alerts, regions..."
            aria-label="Search across the application"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#10213d] transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/60 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="overflow-y-auto p-2 divide-y divide-[#1a2e4c]/40 scrollbar-none"
        >
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <div className="text-sm font-medium text-slate-300">No matching results found</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Try searching for a station name like &quot;Mumbai&quot; or &quot;Cherrapunji&quot;, or a workspace like &quot;Bust&quot;.
              </p>
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex

              return (
                <div
                  key={item.id}
                  data-selected={isSelected}
                  onClick={() => {
                    navigate(item.path)
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-sky-500/15 border border-sky-500/40 text-white'
                      : 'hover:bg-[#10213d]/60 text-slate-300 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? 'bg-sky-500/25 text-sky-300'
                          : 'bg-[#10213d] text-slate-400 group-hover:text-slate-200'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate text-white">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#10213d] text-sky-400 border border-sky-500/30 shrink-0 font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 rounded bg-[#060d19] border border-[#1a2e4c]">
                      {item.category}
                    </span>
                    <ArrowRight
                      className={cn(
                        'w-3.5 h-3.5 transition-transform',
                        isSelected ? 'text-sky-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                      )}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2 border-t border-[#1a2e4c] bg-[#07111f] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono text-[9px] mr-1">↑</kbd>
              <kbd className="bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono text-[9px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono text-[9px]">↵</kbd> to select
            </span>
          </div>
          <span>Weather Intelligence Quick Jump</span>
        </div>
      </div>
    </div>
  )
}
