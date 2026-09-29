import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getForecastById, getLocationById, getForecasts } from '../mock'
import { DetailHeader } from '../components/detail/DetailHeader'
import { DetailSummary } from '../components/detail/DetailSummary'
import { DetailCharts } from '../components/detail/DetailCharts'
import { DetailHistoryTable } from '../components/detail/DetailHistoryTable'
import { DetailContextPanel } from '../components/detail/DetailContextPanel'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export const ForecastDetailPage: React.FC = () => {
  const { forecastId } = useParams<{ forecastId: string }>()

  // Fetch forecast data
  const forecast = useMemo(() => {
    if (!forecastId) return undefined
    return getForecastById(forecastId)
  }, [forecastId])

  // Fetch related context data
  const location = useMemo(() => {
    if (!forecast) return undefined
    return getLocationById(forecast.locationId)
  }, [forecast])

  const relatedForecasts = useMemo(() => {
    if (!forecast) return []
    // Get other forecasts for the exact same location
    return getForecasts({ locationId: forecast.locationId }).slice(0, 10) // Limit to recent 10
  }, [forecast])

  // Error State for Invalid ID
  if (!forecast) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-slate-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-200">Forecast Not Found</h2>
          <p className="text-slate-400 mt-1 text-sm">
            The requested forecast ID ({forecastId}) could not be located in the current database.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Link 
            to="/forecasts" 
            className="flex items-center gap-2 bg-[#10213d] hover:bg-[#1a2e4c] text-sky-400 px-4 py-2 rounded-lg transition-colors border border-sky-900/30 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Forecast Explorer
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-[#0b172a] hover:bg-[#10213d] text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors border border-[#1a2e4c] text-sm font-medium"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Detail Header */}
      <DetailHeader forecast={forecast} />

      {/* Detail Summary Grid */}
      <DetailSummary forecast={forecast} />

      {/* Visual Analytics */}
      <DetailCharts forecast={forecast} />

      {/* Metadata & Context */}
      <DetailContextPanel forecast={forecast} location={location} />

      {/* History Table */}
      <DetailHistoryTable history={relatedForecasts} currentForecastId={forecast.id} />
    </div>
  )
}
