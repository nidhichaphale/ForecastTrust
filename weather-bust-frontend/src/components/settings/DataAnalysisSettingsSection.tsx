import React from 'react'
import { SettingField } from './SettingField'
import { useSettings } from '../../context/SettingsContext'
import {
  type DateFormatPreference,
  type RainfallUnit,
  type DecimalPrecision,
} from '../../types/settings'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Database, Calendar, Hash, Droplets, Rows, RefreshCw } from 'lucide-react'

const DATE_FORMAT_OPTIONS: { value: DateFormatPreference; label: string; example: string }[] = [
  { value: 'YYYY-MM-DD', label: 'ISO Standard (YYYY-MM-DD)', example: '2024-07-15' },
  { value: 'DD/MM/YYYY', label: 'Indian Standard (DD/MM/YYYY)', example: '15/07/2024' },
  { value: 'MMM DD, YYYY', label: 'Expanded (MMM DD, YYYY)', example: 'Jul 15, 2024' },
]

const RAINFALL_UNIT_OPTIONS: { value: RainfallUnit; label: string; desc: string }[] = [
  { value: 'mm', label: 'Millimeters (mm)', desc: 'Official IMD & WMO standard unit' },
  { value: 'cm', label: 'Centimeters (cm)', desc: '10 mm = 1.0 cm' },
  { value: 'inches', label: 'Inches (in)', desc: 'Imperial equivalent (25.4 mm = 1.0 in)' },
]

const PRECISION_OPTIONS: { value: DecimalPrecision; label: string; example: string }[] = [
  { value: 0, label: '0 Decimals (Whole)', example: '24 mm' },
  { value: 1, label: '1 Decimal (Standard)', example: '24.2 mm' },
  { value: 2, label: '2 Decimals (High Precision)', example: '24.25 mm' },
]

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

const REFRESH_OPTIONS = [
  { value: 0, label: 'Manual Refresh Only' },
  { value: 30, label: 'Every 30 Seconds' },
  { value: 60, label: 'Every 60 Seconds' },
  { value: 300, label: 'Every 5 Minutes' },
]

export const DataAnalysisSettingsSection: React.FC = () => {
  const { settings, updateDataAnalysis } = useSettings()

  return (
    <Card className="bg-[#0b172a] border-[#1a2e4c]">
      <CardHeader className="border-b border-[#1a2e4c]/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-white">
              Data &amp; Analysis Display Parameters
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure date formatting conventions, rainfall units, decimal precision, and table pagination.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-[#1a2e4c]/60 pt-2">
        {/* Date Format */}
        <SettingField
          title="Date Format Representation"
          description="Sets date string formatting for table timestamps, chart axes, and valid date labels."
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-emerald-400 hidden sm:inline" />
            <select
              aria-label="Date Format Representation"
              value={settings.dataAnalysis.dateFormat}
              onChange={(e) =>
                updateDataAnalysis({
                  dateFormat: e.target.value as DateFormatPreference,
                })
              }
              className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[260px]"
            >
              {DATE_FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.example})
                </option>
              ))}
            </select>
          </div>
        </SettingField>

        {/* Rainfall Units */}
        <SettingField
          title="Precipitation Measurement Units"
          description="Configure the primary unit used to calculate and report rainfall quantities across charts and station cards."
          layout="vertical"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {RAINFALL_UNIT_OPTIONS.map((opt) => {
              const isSelected = settings.dataAnalysis.rainfallUnit === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateDataAnalysis({ rainfallUnit: opt.value })}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                      : 'bg-[#060d19] border-[#1a2e4c] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">{opt.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {opt.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </SettingField>

        {/* Decimal Precision */}
        <SettingField
          title="Numerical Value Precision"
          description="Number of decimal digits displayed for rainfall amounts, ensemble spreads, and error deltas."
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Hash className="w-4 h-4 text-emerald-400 hidden sm:inline" />
            <select
              aria-label="Numerical Value Precision"
              value={settings.dataAnalysis.decimalPrecision}
              onChange={(e) =>
                updateDataAnalysis({
                  decimalPrecision: parseInt(e.target.value, 10) as DecimalPrecision,
                })
              }
              className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[260px]"
            >
              {PRECISION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — e.g. {opt.example}
                </option>
              ))}
            </select>
          </div>
        </SettingField>

        {/* Table Rows Per Page */}
        <SettingField
          title="Table Page Size (Pagination)"
          description="Default record count per page in Forecast Explorer, Bust Detection, and Verification tables."
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Rows className="w-4 h-4 text-emerald-400 hidden sm:inline" />
            <select
              aria-label="Table Page Size"
              value={settings.dataAnalysis.tableRowsPerPage}
              onChange={(e) =>
                updateDataAnalysis({
                  tableRowsPerPage: parseInt(e.target.value, 10),
                })
              }
              className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[260px]"
            >
              {ROWS_PER_PAGE_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count} rows per page
                </option>
              ))}
            </select>
          </div>
        </SettingField>

        {/* Ingest Refresh Interval */}
        <SettingField
          title="Simulated Ingest Polling Cadence"
          description="Frequency at which client checks for simulated real-time observation and model run updates."
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 text-emerald-400 hidden sm:inline" />
            <select
              aria-label="Simulated Ingest Polling Cadence"
              value={settings.dataAnalysis.autoRefreshDataIntervalSec}
              onChange={(e) =>
                updateDataAnalysis({
                  autoRefreshDataIntervalSec: parseInt(e.target.value, 10),
                })
              }
              className="bg-[#060d19] border border-[#1a2e4c] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 min-w-[260px]"
            >
              {REFRESH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </SettingField>
      </CardContent>
    </Card>
  )
}
