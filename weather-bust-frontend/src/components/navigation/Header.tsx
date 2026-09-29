import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Search,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  Activity,
  Settings as SettingsIcon,
} from 'lucide-react'
import { IconButton } from '../ui/IconButton'
import { StatusIndicator } from '../ui/StatusIndicator'
import { useTheme } from '../../hooks/useTheme'
import { NotificationMenu } from './NotificationMenu'
import { GlobalSearchDialog } from './GlobalSearchDialog'

export interface HeaderProps {
  onOpenMobileMenu: () => void
  pageTitle?: string
  breadcrumb?: string
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  pageTitle = 'Dashboard',
  breadcrumb = 'Overview',
}) => {
  const { theme, toggleTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Listen to Ctrl+K / Cmd+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-[#1a2e4c] bg-[#0b172a]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs / Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="lg:hidden shrink-0">
          <IconButton
            icon={<Menu className="w-5 h-5 text-slate-300" />}
            aria-label="Open navigation menu"
            onClick={onOpenMobileMenu}
          />
        </div>

        <div className="min-w-0">
          {/* Breadcrumb Context */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Weather Lens</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span>{breadcrumb}</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-sky-400 font-medium">{pageTitle}</span>
          </nav>

          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsSearchOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsSearchOpen(true)
            }
          }}
          className="relative w-full cursor-pointer group"
          aria-label="Search forecasts, stations, models (Ctrl+K)"
        >
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-sky-400 transition-colors pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search stations, forecasts, alerts... (Ctrl+K)"
            aria-label="Search stations, forecasts, alerts"
            className="w-full h-9 pl-9 pr-12 rounded-lg bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/60 cursor-pointer group-hover:border-slate-600 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/60 pointer-events-none font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Notifications, Theme Toggle & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile Search Button */}
        <div className="md:hidden">
          <IconButton
            icon={<Search className="w-4 h-4 text-slate-300" />}
            aria-label="Search platform"
            onClick={() => setIsSearchOpen(true)}
          />
        </div>

        {/* System Health Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#10213d] border border-[#1a2e4c] text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <StatusIndicator status="operational" label="Inference Engine Ready" pulse={true} />
        </div>

        {/* Theme Toggle */}
        <IconButton
          icon={
            theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-sky-400" />
            )
          }
          aria-label="Toggle visual theme"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        />

        {/* Live Operational Alerts Notification Menu */}
        <NotificationMenu />

        {/* Settings Workspace Quick Access */}
        <Link
          to="/settings"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#10213d] transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          title="Open Settings & System Preferences"
          aria-label="Open Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </Link>

        <div className="h-6 w-px bg-[#1a2e4c] hidden sm:block" />

        {/* User / Analyst Profile Area */}
        <Link
          to="/settings"
          title="Analyst Profile & System Preferences"
          className="flex items-center gap-2.5 pl-1 rounded-lg hover:opacity-90 transition-opacity focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            WA
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-medium text-white flex items-center gap-1">
              <span>Met Analyst</span>
              <Shield className="w-3 h-3 text-sky-400 inline" />
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">National Center</div>
          </div>
        </Link>
      </div>

      {/* Global Command Palette Search Modal */}
      <GlobalSearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
