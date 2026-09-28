import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/navigation/Sidebar'
import { Header } from '../components/navigation/Header'

const PAGE_TITLES: Record<string, { title: string; crumb: string }> = {
  '/': { title: 'Dashboard', crumb: 'Overview' },
  '/dashboard': { title: 'Dashboard', crumb: 'Overview' },
  '/forecasts': { title: 'Forecast Explorer', crumb: 'Forecast' },
  '/map': { title: 'Risk Overview / Spatial Map', crumb: 'Risk & Busts' },
  '/risk-map': { title: 'Risk Overview / Spatial Map', crumb: 'Risk & Busts' },
  '/risk-overview': { title: 'Risk Overview / Spatial Map', crumb: 'Risk & Busts' },
  '/bust-detection': { title: 'Bust Detection', crumb: 'Risk & Busts' },
  '/hidden-risk': { title: 'Hidden Risk / Zero-Spread Monitoring', crumb: 'Risk & Busts' },
  '/analysis': { title: 'Verification & Analysis', crumb: 'Analysis' },
  '/verification': { title: 'Verification & Analysis', crumb: 'Analysis' },
  '/data': { title: 'Data & Quality', crumb: 'Data' },
  '/alerts': { title: 'Alerts & Operational Warnings', crumb: 'System' },
  '/settings': { title: 'Settings & System Preferences', crumb: 'System' },
}

export const RootLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()

  const isDetail = location.pathname.startsWith('/forecasts/')
  
  const pageInfo = PAGE_TITLES[location.pathname] ?? (
    isDetail 
      ? { title: 'Forecast Detail', crumb: 'Forecast' }
      : { title: 'Weather Intelligence', crumb: 'Workspace' }
  )

  return (
    <div className="min-h-screen bg-[#060d19] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Wrapper (Offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-200">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          pageTitle={pageInfo.title}
          breadcrumb={pageInfo.crumb}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Application Shell Footer */}
        <footer className="border-t border-[#1a2e4c] py-3.5 px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 bg-[#060d19]">
          <div>
            Weather Intelligence &mdash; Forecast Bust Detection &amp; Uncertainty Monitoring Platform
          </div>
          <div className="mt-1 sm:mt-0 flex items-center gap-4 text-[11px] text-slate-400">
            <span>Stage 15 Settings &amp; System Workspace</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-emerald-400">Production Standalone UI</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
