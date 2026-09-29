import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, ExternalLink, CheckCheck } from 'lucide-react'
import { useAlerts, useSettings } from '../../hooks'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import type { RiskLevel } from '../../types'
import { ALERT_TYPE_CONFIG, type AlertCategory } from '../../config/alertThresholds'

export const NotificationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { alerts, unacknowledgedCount, acknowledgeAlert, markAllAsRead } = useAlerts()
  const { settings } = useSettings()

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Filter by enabled alert categories and limit by settings
  const filteredAlerts = alerts.filter(
    (a) => settings.notifications.enabledCategories[a.alertType as AlertCategory] !== false
  )

  // Top N unacknowledged or recent alerts
  const maxItems = settings.notifications.headerMaxItems || 5
  const recentAlerts = filteredAlerts
    .slice()
    .sort((a, b) => {
      if (a.status === 'new' && b.status !== 'new') return -1
      if (a.status !== 'new' && b.status === 'new') return 1
      return b.timestamp.localeCompare(a.timestamp)
    })
    .slice(0, maxItems)

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'relative p-2 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500/50',
          isOpen ? 'bg-[#10213d] text-white' : 'text-slate-300 hover:text-white hover:bg-[#10213d]'
        )}
        aria-label="Open notifications menu"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {settings.notifications.showNotificationBadge && unacknowledgedCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold font-mono flex items-center justify-center ring-2 ring-[#0b172a] animate-pulse">
            {unacknowledgedCount > 99 ? '99+' : unacknowledgedCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0b172a] border border-[#1a2e4c] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#1a2e4c] bg-[#07111f] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Operational Alerts
              </span>
              {unacknowledgedCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-950/60 text-red-300 border border-red-800/60">
                  {unacknowledgedCount} New
                </span>
              )}
            </div>

            {unacknowledgedCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
                title="Acknowledge all alerts"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List of Alerts */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#1a2e4c]/50">
            {recentAlerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No active alerts in system.
              </div>
            ) : (
              recentAlerts.map((alt) => {
                const config = ALERT_TYPE_CONFIG[alt.alertType as AlertCategory]
                const isNew = alt.status === 'new'

                return (
                  <div
                    key={alt.id}
                    onClick={() => {
                      setIsOpen(false)
                      navigate(`/alerts?alertId=${alt.id}`)
                    }}
                    className={cn(
                      'p-3 hover:bg-[#10213d] transition-colors cursor-pointer space-y-1.5',
                      isNew ? 'bg-red-950/15' : 'bg-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={alt.severity as RiskLevel} size="sm">
                          {alt.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-200">
                          {alt.locationName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {alt.validDate || alt.timestamp.slice(5, 10)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {alt.message}
                    </p>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] text-slate-400">
                        {config?.shortLabel || alt.alertType}
                      </span>
                      {isNew && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            acknowledgeAlert(alt.id)
                          }}
                          className="text-[10px] text-amber-300 hover:text-amber-200 bg-[#10213d] hover:bg-[#183158] border border-amber-800/40 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                        >
                          <Check className="w-2.5 h-2.5" />
                          Ack
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Action */}
          <div className="p-2.5 border-t border-[#1a2e4c] bg-[#07111f] text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                navigate('/alerts')
              }}
              className="w-full text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors py-1 flex items-center justify-center gap-1.5"
            >
              <span>View All Alerts in Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
