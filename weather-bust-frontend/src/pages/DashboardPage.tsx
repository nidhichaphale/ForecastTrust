import React, { useState, useMemo } from 'react'
import {
  getOverviewSummary,
  getForecasts,
  getBustEvents,
  getRegionalStats,
  getModelMetrics,
  getDataQualityStats,
} from '../mock'
import { MOCK_FORECASTS } from '../mock'
import { MOCK_HISTORICAL_DATA } from '../mock'
import type { Forecast, BustEvent, RiskLevel } from '../types'

import { KPIGrid, type KPIItem } from '../components/dashboard/KPIGrid'
import { RiskOverview } from '../components/dashboard/RiskOverview'
import { ForecastTrend } from '../components/dashboard/ForecastTrend'
import { HighRiskLocations } from '../components/dashboard/HighRiskLocations'
import { RecentBustEvents } from '../components/dashboard/RecentBustEvents'
import { ModelPerformanceSnapshot } from '../components/dashboard/ModelPerformanceSnapshot'
import { AlertsSnapshot } from '../components/dashboard/AlertsSnapshot'
import { RegionalRiskSummary } from '../components/dashboard/RegionalRiskSummary'
import { ForecastOperationalSummary } from '../components/dashboard/ForecastOperationalSummary'
import { useAlerts } from '../context/AlertsContext'
import {
  ForecastDetailModal,
  type DetailRecord,
} from '../components/dashboard/ForecastDetailModal'

import {
  MapPin,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  Activity,
  CloudRain,
  ShieldCheck,
  TrendingUp,
  Calendar,
  ArrowRight,
  Eye,
  Database,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

// ─── Data Preparation Helpers ──────────────────────────────────────────────

function buildRiskBands() {
  const counts = { low: 0, moderate: 0, high: 0, severe: 0 }
  MOCK_FORECASTS.forEach((fc) => {
    counts[fc.riskLevel]++
  })
  const total = MOCK_FORECASTS.length
  const COLORS = {
    low: '#10b981',
    moderate: '#f59e0b',
    high: '#f97316',
    severe: '#ef4444',
  }
  return (['low', 'moderate', 'high', 'severe'] as const).map((level) => ({
    label:
      level === 'low'
        ? 'Low Risk'
        : level === 'moderate'
        ? 'Moderate Risk'
        : level === 'high'
        ? 'High Risk'
        : 'Severe Risk',
    count: counts[level],
    percentage: (counts[level] / total) * 100,
    color: COLORS[level],
    riskLevel: level as RiskLevel,
  }))
}

function buildTrendData() {
  // Aggregate by initDate across the mock historical months
  // Use mock historical data for trend — it spans multiple months
  const trendFromHistorical = MOCK_HISTORICAL_DATA.slice(-7).map((h) => ({
    date: `${h.monthName.slice(0, 3)} ${h.year}`,
    fullDate: h.period,
    avgBustProb: parseFloat((h.bustRate * 0.75).toFixed(1)),
    highRiskCount: h.severeBusts,
    avgError: parseFloat(
      (Math.abs(h.avgObservedRainfall - h.avgForecastRainfall) / 10).toFixed(1)
    ),
  }))
  return trendFromHistorical
}

// ─── Dashboard Page ────────────────────────────────────────────────────────

export const DashboardPage: React.FC = () => {
  const [detailRecord, setDetailRecord] = useState<DetailRecord | null>(null)

  // ── Data from mock layer ──────────────────────────────────────────────────
  const summary = useMemo(() => getOverviewSummary(), [])
  const regionalStats = useMemo(() => getRegionalStats(), [])
  const modelMetrics = useMemo(() => getModelMetrics(), [])
  const dqStats = useMemo(() => getDataQualityStats(), [])

  const highRiskForecasts = useMemo(
    () =>
      getForecasts({ riskLevel: 'high' })
        .concat(getForecasts({ riskLevel: 'severe' }))
        .sort((a, b) => b.bustProbability - a.bustProbability)
        .slice(0, 20),
    []
  )

  const recentBusts = useMemo(
    () =>
      getBustEvents()
        .sort((a, b) => (b.validDate > a.validDate ? 1 : -1))
        .slice(0, 12),
    []
  )

  const { alerts } = useAlerts()

  const activeAlerts = useMemo(
    () =>
      alerts
        .filter((a) => !a.isResolved && a.status !== 'resolved')
        .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
        .slice(0, 8),
    [alerts]
  )

  const riskBands = useMemo(() => buildRiskBands(), [])
  const trendData = useMemo(() => buildTrendData(), [])

  // ── KPI Items derived from mock data ─────────────────────────────────────
  const kpiItems: KPIItem[] = [
    {
      id: 'locations',
      label: 'Monitored Locations',
      value: summary.activeLocations,
      supporting: 'across 6 regions',
      icon: MapPin,
      iconColor: 'text-sky-400',
    },
    {
      id: 'high-risk',
      label: 'High-Risk Locations',
      value: highRiskForecasts.length,
      supporting: 'requiring attention',
      icon: AlertTriangle,
      iconColor: 'text-orange-400',
      riskLevel: highRiskForecasts.length > 10 ? 'high' : 'moderate',
      delta: { value: 'elevated', direction: 'up' },
    },
    {
      id: 'busts',
      label: 'Bust Events',
      value: summary.totalBusts,
      supporting: `${summary.overallBustRate}% bust rate`,
      icon: ShieldAlert,
      iconColor: 'text-red-400',
      riskLevel: summary.overallBustRate > 10 ? 'high' : 'moderate',
    },
    {
      id: 'forecasts',
      label: 'Forecasts Analyzed',
      value: summary.totalForecasts.toLocaleString(),
      supporting: `${dqStats.totalLocations} stations`,
      icon: BarChart3,
      iconColor: 'text-sky-400',
    },
    {
      id: 'avg-error',
      label: 'Avg Abs Error',
      value: summary.averageError,
      unit: 'mm',
      supporting: 'mean absolute error',
      icon: TrendingUp,
      iconColor: 'text-amber-400',
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: summary.severeAlertsCount,
      supporting: 'unresolved severe',
      icon: Activity,
      iconColor: 'text-red-400',
      riskLevel: summary.severeAlertsCount > 3 ? 'high' : 'moderate',
      delta: { value: 'new', direction: 'up' },
    },
    {
      id: 'zero-spread',
      label: 'Zero-Spread Cases',
      value: dqStats.zeroSpreadCases,
      supporting: 'hidden risk candidates',
      icon: ShieldCheck,
      iconColor: 'text-cyan-400',
    },
    {
      id: 'coverage',
      label: 'Data Completeness',
      value: `${dqStats.completenessRate.toFixed(0)}%`,
      supporting: `${dqStats.validRecords.toLocaleString()} valid records`,
      icon: CloudRain,
      iconColor: 'text-emerald-400',
    },
  ]

  // ── Operational summary row items ─────────────────────────────────────────
  const operationalItems = [
    {
      label: 'Total Records',
      value: dqStats.totalRecords.toLocaleString(),
      icon: BarChart3,
      iconClass: 'text-sky-400',
    },
    {
      label: 'Zero Forecasts',
      value: dqStats.zeroForecasts,
      icon: CloudRain,
      iconClass: 'text-slate-400',
    },
    {
      label: 'High-Risk Alerts',
      value: highRiskForecasts.length,
      icon: AlertTriangle,
      iconClass: 'text-orange-400',
    },
    {
      label: 'Bust Labels',
      value: dqStats.bustLabelsCount,
      icon: ShieldAlert,
      iconClass: 'text-red-400',
    },
    {
      label: 'Coverage',
      value: `${dqStats.dateCoverageStart} → ${dqStats.dateCoverageEnd}`,
      icon: Calendar,
      iconClass: 'text-slate-400',
    },
  ]

  const navigate = useNavigate()

  function handleForecastClick(fc: Forecast) {
    setDetailRecord({ type: 'forecast', data: fc })
  }

  function handleBustClick(ev: BustEvent) {
    setDetailRecord({ type: 'bustEvent', data: ev })
  }

  return (
    <div className="space-y-6">
      {/* ── Dashboard Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Operations Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            High-level operational overview across active forecasts, bust alerts, and uncertainty distributions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/forecasts')}
            className="text-xs gap-1.5 h-8 border-sky-800/60 text-sky-400 hover:bg-sky-950/40"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Forecasts</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/data')}
            className="text-xs gap-1.5 h-8 border-cyan-800/60 text-cyan-400 hover:bg-cyan-950/40"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data &amp; Quality</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/map')}
            className="text-xs gap-1.5 h-8"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risk &amp; Busts</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* ── Operational Summary Bar ─────────────────────────────────────── */}
      <ForecastOperationalSummary items={operationalItems} date="15 Aug 2026" />

      {/* ── KPI Grid ─────────────────────────────────────────────────────── */}
      <section>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
          Key Performance Indicators
        </div>
        <KPIGrid items={kpiItems} />
      </section>

      {/* ── Risk Overview + Forecast Trend ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <RiskOverview
            data={riskBands}
            totalForecasts={summary.totalForecasts}
            overallBustRate={summary.overallBustRate}
          />
        </div>
        <div className="lg:col-span-3">
          <ForecastTrend data={trendData} />
        </div>
      </div>

      {/* ── High-Risk Locations Table ────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              High-Risk Locations
            </span>
            <Badge variant="high" size="sm">{highRiskForecasts.length} records</Badge>
          </div>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View on Risk Map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <HighRiskLocations
          forecasts={highRiskForecasts}
          onRowClick={handleForecastClick}
        />
      </section>

      {/* ── Recent Bust Events + Alerts Snapshot ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Recent Bust Events
              </span>
              <Badge variant="severe" size="sm">{recentBusts.length} verified</Badge>
            </div>
            <button
              type="button"
              onClick={() => navigate('/bust-detection')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Investigate in Bust Detection</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <RecentBustEvents
            events={recentBusts}
            onRowClick={handleBustClick}
          />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            Active Alerts
          </div>
          <AlertsSnapshot
            alerts={activeAlerts}
            onViewAll={() => navigate('/alerts')}
          />
        </div>
      </div>

      {/* ── Regional Risk + Model Performance ───────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            Regional Overview
          </div>
          <RegionalRiskSummary data={regionalStats} />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            Model Performance
          </div>
          <ModelPerformanceSnapshot models={modelMetrics} />
        </div>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <ForecastDetailModal
        record={detailRecord}
        isOpen={detailRecord !== null}
        onClose={() => setDetailRecord(null)}
      />
    </div>
  )
}
