import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { MapPin, Globe, CalendarDays, Database, Hash } from 'lucide-react'
import type { Forecast, Location } from '../../types'

interface DetailContextPanelProps {
  forecast: Forecast
  location?: Location
}

export const DetailContextPanel: React.FC<DetailContextPanelProps> = ({ forecast, location }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Location Context */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" /> Location Context
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between border-b border-[#1a2e4c] pb-2">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-100">{forecast.locationName}</span>
            </div>
            <div className="flex justify-between border-b border-[#1a2e4c] pb-2">
              <span className="text-slate-500">State / Region</span>
              <span>{forecast.state} / {forecast.region}</span>
            </div>
            {location && (
              <>
                <div className="flex justify-between border-b border-[#1a2e4c] pb-2">
                  <span className="text-slate-500">Coordinates</span>
                  <span className="font-mono text-slate-400">
                    {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Elevation</span>
                  <span className="font-mono text-slate-400">{location.elevationMeters} m</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Forecast Metadata */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-400" /> Forecast Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between border-b border-[#1a2e4c] pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> ID</span>
              <span className="font-mono text-slate-400">{forecast.id}</span>
            </div>
            <div className="flex justify-between border-b border-[#1a2e4c] pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Init Date</span>
              <span className="font-mono text-slate-400">{forecast.initDate}</span>
            </div>
            <div className="flex justify-between border-b border-[#1a2e4c] pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Valid Date</span>
              <span className="font-mono text-slate-400">{forecast.validDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Model Source</span>
              <span className="text-slate-400">Mock Data Layer</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
