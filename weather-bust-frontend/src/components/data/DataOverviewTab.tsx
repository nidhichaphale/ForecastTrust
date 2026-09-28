import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Database,
  MapPin,
  Calendar,
  Layers,
  CheckCircle,
  AlertTriangle,
  FileQuestion,
  Clock,
  ArrowRight,
  ShieldCheck,
  BarChart2,
  Info,
} from 'lucide-react'
import type { DataWorkspaceKPIs, DataTabId } from '../../types/dataQuality'

interface DataOverviewTabProps {
  kpis: DataWorkspaceKPIs
  onSelectTab: (tab: DataTabId) => void
}

export const DataOverviewTab: React.FC<DataOverviewTabProps> = ({ kpis, onSelectTab }) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* ── 8 Operational Summary KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Forecast Records */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Forecast Records</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {kpis.totalForecastRecords.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Generated numerical predictions
          </div>
        </div>

        {/* KPI 2: Locations Covered */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Locations Covered</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {kpis.totalLocations}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across 6 Indian subdivisions
          </div>
        </div>

        {/* KPI 3: Forecast Dates */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Valid Forecast Dates</span>
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">
            {kpis.totalForecastDates}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {kpis.earliestForecastDate} &rarr; {kpis.latestForecastDate}
          </div>
        </div>

        {/* KPI 4: Lead Days Covered */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Lead Horizons</span>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {kpis.totalLeadDaysCovered} <span className="text-xs font-normal text-slate-500">of 10</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            D+1..D+5, D+7, D+10 (6, 8, 9 omitted)
          </div>
        </div>

        {/* KPI 5: Observed Records */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Observed Records</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {kpis.totalObservedRecords.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Verified ground truth telemetry
          </div>
        </div>

        {/* KPI 6: Missing Observations */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <FileQuestion className="w-3.5 h-3.5 text-amber-400" />
            <span>Missing Observations</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {kpis.missingObservationsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pending AWS ingest / dropped telemetry
          </div>
        </div>

        {/* KPI 7: Data Quality Issues */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Quality Issues</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {kpis.qualityIssuesCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Flagged for pipeline remediation
          </div>
        </div>

        {/* KPI 8: Data Completeness Rate */}
        <div className="bg-[#0b172a] border border-[#1a2e4c] rounded-xl p-4 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data Completeness</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {kpis.completenessRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Ground-truth observation readiness
          </div>
        </div>
      </div>

      {/* ── Transparent Completeness Definition Formula ───────────────────── */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Operational Data Completeness Formula &amp; Accounting
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Unlike generic metrics, dataset completeness is computed transparently:
              <span className="font-mono text-cyan-300 ml-1">
                Completeness = (Observed Ground Truth Records / Total Forecast Records) &times; 100
              </span>
              . Records awaiting rain-gauge transmission are tracked as <span className="font-semibold text-amber-300">Missing Observation</span> and are strictly never filled with zero, preventing false dry-agreement artifacts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Latest Ingest Batch</div>
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                {kpis.latestForecastDate}
              </div>
            </div>
            <button
              onClick={() => onSelectTab('quality')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors"
            >
              Audit Quality
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Workspace Section Navigator Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Coverage View */}
        <div
          onClick={() => onSelectTab('coverage')}
          className="bg-navy-900 border border-navy-700/80 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all duration-150 group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
              Coverage Breakdown
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
            Inspect geographic distribution across 6 regions, state aggregations, and temporal active dates.
          </p>
          <div className="text-[11px] font-mono text-cyan-400">
            {kpis.totalLocations} Stations &bull; 6 Regions
          </div>
        </div>

        {/* Card 2: Quality & Audit */}
        <div
          onClick={() => onSelectTab('quality')}
          className="bg-navy-900 border border-navy-700/80 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all duration-150 group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
              Quality Audit Log
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
            Examine individual telemetry latencies, dropped packets, and partial metadata with root-cause notes.
          </p>
          <div className="text-[11px] font-mono text-amber-400">
            {kpis.qualityIssuesCount} Flagged Records
          </div>
        </div>

        {/* Card 3: Data Explorer */}
        <div
          onClick={() => onSelectTab('explorer')}
          className="bg-navy-900 border border-navy-700/80 hover:border-sky-500/50 rounded-xl p-4 cursor-pointer transition-all duration-150 group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
              Raw Record Explorer
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
            Search, filter, and inspect the unified 1,764 forecast records with live data status pills and deep links.
          </p>
          <div className="text-[11px] font-mono text-sky-400">
            {kpis.totalForecastRecords.toLocaleString()} Forecasts Indexed
          </div>
        </div>

        {/* Card 4: Availability Matrix */}
        <div
          onClick={() => onSelectTab('availability')}
          className="bg-navy-900 border border-navy-700/80 hover:border-purple-500/50 rounded-xl p-4 cursor-pointer transition-all duration-150 group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
              Availability Matrix
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
            Heatmap-style matrix verifying lead-time continuity across D+1..D+10 for all 36 observation stations.
          </p>
          <div className="text-[11px] font-mono text-purple-400">
            36 Locations &times; 10 Lead Days
          </div>
        </div>
      </div>

      {/* ── Cross-Workspace Contextual Link Banner ────────────────────────── */}
      <div className="bg-navy-950/60 border border-navy-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Ready to evaluate systematic forecast error on verified records?
            Move to <span className="font-semibold text-slate-200">Verification &amp; Analysis</span> to inspect MAE, bias, and lead-time degradation.
          </span>
        </div>
        <button
          onClick={() => navigate('/analysis')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-lg transition-colors shrink-0"
        >
          Open Verification
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
