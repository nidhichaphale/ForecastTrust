import React, { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Map, AlertTriangle, EyeOff, ShieldAlert } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { Forecast } from '../../types'
import { calculateRiskWorkspaceSummary } from '../../utils/riskContextAnalysis'

interface RiskWorkspaceNavProps {
  allForecasts?: Forecast[]
  bustCount?: number
  hiddenRiskCount?: number
  highRiskCount?: number
}

export const RiskWorkspaceNav: React.FC<RiskWorkspaceNavProps> = ({
  allForecasts,
  bustCount: propBustCount,
  hiddenRiskCount: propHiddenCount,
  highRiskCount: propHighRiskCount,
}) => {
  const derived = useMemo(() => {
    if (allForecasts && allForecasts.length > 0) {
      return calculateRiskWorkspaceSummary(allForecasts)
    }
    return null
  }, [allForecasts])

  const bustCount = propBustCount ?? derived?.bustCount
  const hiddenRiskCount = propHiddenCount ?? derived?.hiddenRiskBustCount
  const highRiskCount = propHighRiskCount ?? derived?.highOrSevereRiskCount
  const location = useLocation()
  const pathname = location.pathname

  const isMapActive = pathname === '/map' || pathname === '/risk-map' || pathname === '/risk-overview'
  const isBustActive = pathname === '/bust-detection'
  const isHiddenActive = pathname === '/hidden-risk'

  const views = [
    {
      label: 'Spatial Risk Map',
      path: '/map',
      icon: Map,
      isActive: isMapActive,
      badge: highRiskCount !== undefined ? `${highRiskCount} High Risk` : undefined,
      badgeColor: 'bg-orange-950/60 text-orange-400 border-orange-800/50',
    },
    {
      label: 'Bust Detection & Verification',
      path: '/bust-detection',
      icon: AlertTriangle,
      isActive: isBustActive,
      badge: bustCount !== undefined ? `${bustCount} Busts` : undefined,
      badgeColor: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
    },
    {
      label: 'Hidden Risk & Zero-Spread',
      path: '/hidden-risk',
      icon: EyeOff,
      isActive: isHiddenActive,
      badge: hiddenRiskCount !== undefined ? `${hiddenRiskCount} Cases` : undefined,
      badgeColor: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50',
    },
  ]

  return (
    <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-3.5 mb-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Workspace Identity */}
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Risk &amp; Busts Investigation Workspace
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Connected investigation flow: discover spatial risk on the map, verify realized busts, and detect false-certainty hidden failures.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#07111f] p-1 rounded-lg border border-[#1a2e4c]/80 self-start md:self-center">
          {views.map((v) => {
            const Icon = v.icon
            return (
              <NavLink
                key={v.path}
                to={v.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                  v.isActive
                    ? 'bg-cyan-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#10213d]'
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{v.label}</span>
                {v.badge && (
                  <span className={cn('text-[10px] font-mono px-1.5 py-0.2 rounded border hidden sm:inline-block', v.badgeColor)}>
                    {v.badge}
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
